const extensionAPI = typeof browser !== "undefined" ? browser : chrome;
const DEFAULT_SETTINGS = {
  hideShorts: true,
  hideHomeFeed: false,
  hideWatchRecommendations: false,
  hideComments: false,
  hideCommunityPosts: false,
};
const LEGACY_HIDE_RECOMMENDATIONS_KEY = "hideRecommendations";

// Ask for an App Store rating only once the extension has proven itself on
// this device: used for a few days and has hidden a meaningful number of Shorts.
const RATING_MIN_DAYS_ACTIVE = 5;
const RATING_MIN_SHORTS_HIDDEN = 30;
const RATING_SNOOZE_DAYS = 45;
const DAY_MS = 24 * 60 * 60 * 1000;

function isIPad() {
  return (
    /iPad/.test(navigator.userAgent) ||
    (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1)
  );
}

document.documentElement.classList.toggle("is-ipad", isIPad());

function getStorageArea() {
  return extensionAPI?.storage?.sync || extensionAPI?.storage?.local || null;
}

function normalizeStoredSettings(items = {}) {
  const legacyRecommendationsSetting =
    typeof items[LEGACY_HIDE_RECOMMENDATIONS_KEY] === "boolean"
      ? items[LEGACY_HIDE_RECOMMENDATIONS_KEY]
      : null;

  return {
    hideShorts:
      typeof items.hideShorts === "boolean"
        ? items.hideShorts
        : DEFAULT_SETTINGS.hideShorts,
    hideHomeFeed:
      typeof items.hideHomeFeed === "boolean"
        ? items.hideHomeFeed
        : legacyRecommendationsSetting ?? DEFAULT_SETTINGS.hideHomeFeed,
    hideWatchRecommendations:
      typeof items.hideWatchRecommendations === "boolean"
        ? items.hideWatchRecommendations
        : legacyRecommendationsSetting ?? DEFAULT_SETTINGS.hideWatchRecommendations,
    hideCommunityPosts:
      typeof items.hideCommunityPosts === "boolean"
        ? items.hideCommunityPosts
        : DEFAULT_SETTINGS.hideCommunityPosts,
    hideComments:
      typeof items.hideComments === "boolean"
        ? items.hideComments
        : DEFAULT_SETTINGS.hideComments,
  };
}

async function getStoredSettings() {
  const items = await strictStorageCall(getStorageArea(), "get", null);
  return normalizeStoredSettings(items);
}

const settingBindings = [];

function popupError(code, message) {
  const error = new Error(message);
  error.code = code;
  return error;
}

function errorMessage(error, fallbackKey) {
  const keys = {
    write_unknown: "save_unknown",
    pin_write_unknown: "pin_save_unknown",
    storage_read_error: "storage_read_error",
    pin_removed_elsewhere: "pin_removed_retry",
    storage_timeout: "storage_read_error",
    pin_invalid_record: "pin_invalid_data",
    settings_locked: "pin_locked",
    pin_changed: "pin_changed",
    crypto_unavailable: "pin_crypto_unavailable",
  };
  return getMessage(keys[error?.code] || fallbackKey) || ({
    save_unknown: "Save not yet confirmed. Wait, or reopen this popup to check the stored state.",
    pin_save_unknown: "Save not yet confirmed. Keep your PIN safe and wait, or reopen this popup to check the stored state.",
    pin_removed_retry: "The PIN was removed in another window. Your change was not saved; please try it again.",
    storage_read_error: "Stored settings could not be read. Reopen the extension and try again.",
    pin_invalid_data: "The stored PIN data could not be read. Settings remain locked. Please contact support.",
    pin_locked: "Settings are locked. Enter your PIN to make changes.",
    pin_changed: "The PIN changed in another window. Use the current PIN to unlock settings.",
    pin_crypto_unavailable: "PIN protection is unavailable in this Safari context. Please update Safari or reopen the extension.",
    pin_storage_error: "The PIN could not be checked or saved. Reopen the extension and try again.",
    settings_save_error: "Settings could not be saved. Please reopen the extension and try again.",
  })[keys[error?.code] || fallbackKey];
}

function showPersistedSettings(items) {
  const normalized = normalizeStoredSettings(items);
  for (const { checkbox, key, settings } of settingBindings) {
    settings[key] = normalized[key];
    checkbox.checked = normalized[key];
  }
}

function saveSettings(update) {
  return strictStorageCall(getStorageArea(), "set", { ...update });
}

function wireToggle(id, key, settings) {
  const checkbox = document.getElementById(id);
  if (!checkbox) return;
  checkbox.checked = Boolean(settings[key]);
  settingBindings.push({ checkbox, key, settings });
  checkbox.addEventListener("change", async () => {
    const requested = checkbox.checked;
    checkbox.checked = Boolean(settings[key]);
    if (!pinReady || pinBusy) {
      refreshPinUI();
      return;
    }
    if (!settingsUnlocked) {
      setSettingsStatus(errorMessage(popupError("settings_locked"), "settings_save_error"));
      focusPinUI();
      return;
    }
    pinBusy = true;
    refreshPinUI();
    try {
      await authorizeSettingsChange();
      await saveSettings({ [key]: requested });
      settings[key] = requested;
      checkbox.checked = requested;
      setSettingsStatus("");
    } catch (error) {
      if (!pinRecord && ["storage_failure", "storage_unavailable", "storage_timeout", "storage_read_error"].includes(error.code)) {
        settingsUnlocked = false;
        pinReady = false;
      }
      setSettingsStatus(errorMessage(error, "settings_save_error"));
    } finally {
      pinBusy = false;
      refreshPinUI();
    }
  });
}

// The PIN adds optional friction to this popup only. It is not a device
// restriction: Safari can still disable it and its local data can be removed.
const PIN_LOCK_KEY = "settingsPinLock";
const PIN_ATTEMPTS_KEY = "settingsPinAttempts";
const PIN_ITERATIONS = 210000;
let pinRecord = null;
let pinReady = false;
let pinBusy = false;
let settingsUnlocked = false;
let uncertainStorageWrite = null;

// A write timeout cannot cancel the browser's write. Keep the action pending
// and refuse further edits until a callback or a read confirms its outcome.
// This avoids reporting failure while a delayed write is actually applied.
function strictStorageCall(area, method, value) {
  return new Promise((resolve, reject) => {
    if (!area || typeof area[method] !== "function") {
      reject(popupError("storage_unavailable", "Storage unavailable"));
      return;
    }
    let settled = false;
    const operation = { area, update: value, reconciling: false, finish: null };
    const finish = (error, result) => {
      if (settled) return;
      settled = true;
      clearTimeout(timeout);
      if (uncertainStorageWrite === operation) uncertainStorageWrite = null;
      if (error) reject(error);
      else resolve(result);
    };
    operation.finish = finish;
    const timeout = setTimeout(() => {
      if (method !== "set") {
        finish(popupError("storage_timeout", "Storage read timed out"));
        return;
      }
      uncertainStorageWrite = operation;
      const code = Object.prototype.hasOwnProperty.call(value, PIN_LOCK_KEY) ? "pin_write_unknown" : "write_unknown";
      setSettingsStatus(errorMessage(popupError(code), "settings_save_error"));
      refreshPinUI();
      reconcileUncertainWrite();
    }, 3000);
    try {
      const result = area[method](value, (items) => {
        const error = extensionAPI.runtime?.lastError;
        finish(error ? popupError(method === "get" ? "storage_read_error" : "storage_failure", error.message || "Storage failed") : null, items);
      });
      if (result && typeof result.then === "function") {
        result.then(items => finish(null, items), error => finish(popupError(method === "get" ? "storage_read_error" : "storage_failure", error?.message || "Storage failed")));
      }
    } catch (error) {
      finish(popupError(method === "get" ? "storage_read_error" : "storage_failure", error?.message || "Storage failed"));
    }
  });
}

async function reconcileUncertainWrite() {
  const operation = uncertainStorageWrite;
  if (!operation || operation.reconciling) return;
  operation.reconciling = true;
  try {
    const items = await strictStorageCall(operation.area, "get", null);
    if (uncertainStorageWrite !== operation) return;
    if (operation.area === getStorageArea()) showPersistedSettings(items);
    if (operation.area === extensionAPI?.storage?.local) {
      const record = checkedPinRecord(items?.[PIN_LOCK_KEY]);
      if (!samePinRecord(record, pinRecord)) {
        pinRecord = record;
        settingsUnlocked = !record;
      }
    }
    const confirmed = Object.entries(operation.update).every(([key, expected]) => (
      JSON.stringify(items?.[key]) === JSON.stringify(expected)
    ));
    if (confirmed) operation.finish(null);
  } catch (_err) {
    // Still unknown. The callback can arrive later; never turn this into a
    // definite failure or unlock controls using unverified data.
  } finally {
    operation.reconciling = false;
    refreshPinUI();
  }
}

function checkedPinRecord(record) {
  if (record === undefined || record === null) return null;
  if (record.version !== 1 || !/^[a-f0-9]{32}$/.test(record.salt) || !/^[a-f0-9]{64}$/.test(record.hash)) {
    throw popupError("pin_invalid_record", "Invalid PIN data");
  }
  return { version: 1, salt: record.salt, hash: record.hash };
}

function samePinRecord(a, b) {
  return (!a && !b) || Boolean(a && b && a.salt === b.salt && a.hash === b.hash);
}

async function readPinState() {
  const items = await strictStorageCall(extensionAPI?.storage?.local, "get", [PIN_LOCK_KEY, PIN_ATTEMPTS_KEY]);
  return { record: checkedPinRecord(items?.[PIN_LOCK_KEY]), attempts: items?.[PIN_ATTEMPTS_KEY] || {} };
}

async function authorizeSettingsChange() {
  let record;
  try {
    record = (await readPinState()).record;
  } catch (error) {
    settingsUnlocked = false;
    if (!pinRecord) pinReady = false;
    throw error;
  }
  if (!samePinRecord(record, pinRecord)) {
    pinRecord = record;
    settingsUnlocked = !record;
    throw popupError(record ? "pin_changed" : "pin_removed_elsewhere", "PIN changed in another popup");
  }
  if (!settingsUnlocked) throw popupError("settings_locked", "Settings locked");
}

function setSettingsStatus(message) {
  const element = document.getElementById("settings-status");
  if (element) element.textContent = message;
}

function focusPinUI(targetId) {
  let target = document.getElementById(targetId || (
    !pinReady ? "settings-status" : pinRecord && !settingsUnlocked ? "pin-unlock" : "hide-shorts"
  ));
  if (!target || target.disabled || target.closest("[hidden], fieldset[disabled]")) {
    target = document.getElementById("settings-status");
  }
  target?.focus();
}

function refreshPinUI() {
  const active = document.activeElement;
  const controls = document.getElementById("settings-controls");
  if (controls) {
    // Busy operations are guarded in handlers, with aria-busy instead of
    // disabling the focused control (which loses focus in WebKit).
    controls.disabled = !pinReady || !settingsUnlocked;
    controls.setAttribute("aria-busy", String(pinBusy));
    controls.setAttribute("aria-disabled", String(!pinReady || pinBusy || !settingsUnlocked));
  }
  for (const { checkbox, key } of settingBindings) {
    checkbox.indeterminate = Boolean(uncertainStorageWrite?.area === getStorageArea()
      && Object.prototype.hasOwnProperty.call(uncertainStorageWrite.update, key));
  }
  const unlock = document.getElementById("pin-unlock-form");
  const setup = document.getElementById("pin-set-form");
  const actions = document.getElementById("pin-lock-actions");
  if (unlock) unlock.hidden = !pinReady || !pinRecord || settingsUnlocked;
  if (setup) setup.hidden = !pinReady || Boolean(pinRecord && !settingsUnlocked);
  if (actions) actions.hidden = !pinReady || !pinRecord || !settingsUnlocked;
  const card = document.querySelector(".pin-card");
  card?.setAttribute("aria-busy", String(pinBusy));
  document.querySelectorAll(".pin-card input, .pin-card button").forEach(element => {
    element.disabled = !pinReady;
    element.setAttribute("aria-disabled", String(!pinReady || pinBusy));
  });
  if (active && active !== document.body && (
    active.disabled || active.closest("[hidden], fieldset[disabled]")
  )) focusPinUI();
}

function bytesToHex(bytes) {
  return Array.from(bytes, value => value.toString(16).padStart(2, "0")).join("");
}

async function pinHash(pin, salt) {
  const cryptoAPI = globalThis.crypto;
  if (!cryptoAPI?.subtle || typeof cryptoAPI.getRandomValues !== "function" || typeof TextEncoder === "undefined") {
    throw popupError("crypto_unavailable", "Cryptography unavailable");
  }
  try {
    const key = await cryptoAPI.subtle.importKey("raw", new TextEncoder().encode(pin), "PBKDF2", false, ["deriveBits"]);
    const saltBytes = Uint8Array.from(salt.match(/../g), pair => parseInt(pair, 16));
    const bits = await cryptoAPI.subtle.deriveBits({ name: "PBKDF2", salt: saltBytes, iterations: PIN_ITERATIONS, hash: "SHA-256" }, key, 256);
    return bytesToHex(new Uint8Array(bits));
  } catch (_err) {
    throw popupError("crypto_unavailable", "Cryptography unavailable");
  }
}

function validPin(pin) {
  return /^[0-9]{4,12}$/.test(pin);
}

async function runPinAction(action) {
  if (!pinReady || pinBusy) return;
  let focusTarget;
  pinBusy = true;
  refreshPinUI();
  try {
    focusTarget = await action();
  } catch (error) {
    setSettingsStatus(errorMessage(error, "pin_storage_error"));
    if (["storage_failure", "storage_unavailable", "storage_timeout", "storage_read_error", "pin_invalid_record"].includes(error.code)) {
      settingsUnlocked = false;
      if (!pinRecord) pinReady = false;
    }
    focusTarget = !pinReady ? "settings-status" : pinRecord && !settingsUnlocked ? "pin-unlock" : undefined;
  } finally {
    pinBusy = false;
    refreshPinUI();
    if (focusTarget) focusPinUI(focusTarget);
  }
}

async function initializePinLock() {
  try {
    pinRecord = (await readPinState()).record;
    settingsUnlocked = !pinRecord;
    pinReady = true;
  } catch (error) {
    setSettingsStatus(errorMessage(error, "pin_storage_error"));
  }
  refreshPinUI();
  if (!pinReady) focusPinUI("settings-status");

  document.getElementById("pin-unlock-form")?.addEventListener("submit", event => {
    event.preventDefault();
    runPinAction(async () => {
      const input = document.getElementById("pin-unlock");
      const pin = input.value;
      input.value = "";
      const { record, attempts } = await readPinState();
      pinRecord = record;
      if (!record) {
        settingsUnlocked = true;
        setSettingsStatus(getMessage("pin_removed_elsewhere") || "The PIN was removed in another window. Settings are unlocked.");
        return "hide-shorts";
      }
      if (Number(attempts.retryAt) > Date.now()) {
        setSettingsStatus(getMessage("pin_wait") || "Too many attempts. Please wait 30 seconds and try again.");
        return "pin-unlock";
      }
      if (!validPin(pin) || await pinHash(pin, record.salt) !== record.hash) {
        const failures = Math.max(0, Number(attempts.failures) || 0) + 1;
        await strictStorageCall(extensionAPI.storage.local, "set", {
          [PIN_ATTEMPTS_KEY]: { failures: failures >= 5 ? 0 : failures, retryAt: failures >= 5 ? Date.now() + 30000 : 0 },
        });
        setSettingsStatus(getMessage(failures >= 5 ? "pin_wait" : "pin_incorrect") || (failures >= 5 ? "Too many attempts. Please wait 30 seconds and try again." : "Incorrect PIN."));
        return "pin-unlock";
      }
      // Recheck after the async hash so an old PIN cannot unlock a changed lock.
      const latestRecord = (await readPinState()).record;
      if (!samePinRecord(record, latestRecord)) {
        pinRecord = latestRecord;
        settingsUnlocked = !latestRecord;
        if (!latestRecord) {
          setSettingsStatus(getMessage("pin_removed_elsewhere") || "The PIN was removed in another window. Settings are unlocked.");
          return "hide-shorts";
        }
        throw popupError("pin_changed", "PIN changed");
      }
      await strictStorageCall(extensionAPI.storage.local, "set", { [PIN_ATTEMPTS_KEY]: null });
      // Clearing attempts can itself be delayed. Authentication belongs to
      // the record whose hash was checked, never to a newer cached PIN that
      // another popup may have installed while that write was pending.
      const recordAfterClear = (await readPinState()).record;
      if (!samePinRecord(record, recordAfterClear) || !samePinRecord(record, pinRecord)) {
        pinRecord = recordAfterClear;
        settingsUnlocked = !recordAfterClear;
        if (!recordAfterClear) {
          setSettingsStatus(getMessage("pin_removed_elsewhere") || "The PIN was removed in another window. Settings are unlocked.");
          return "hide-shorts";
        }
        throw popupError("pin_changed", "PIN changed while unlocking");
      }
      settingsUnlocked = true;
      setSettingsStatus(getMessage("pin_unlocked") || "Settings unlocked until this popup closes.");
      return "hide-shorts";
    });
  });

  document.getElementById("pin-set-form")?.addEventListener("submit", event => {
    event.preventDefault();
    runPinAction(async () => {
      await authorizeSettingsChange();
      const input = document.getElementById("pin-new");
      const confirmation = document.getElementById("pin-confirm");
      const pin = input.value;
      const matches = pin === confirmation.value;
      input.value = "";
      confirmation.value = "";
      if (!validPin(pin) || !matches) {
        setSettingsStatus(getMessage("pin_invalid") || "Enter the same PIN twice, using 4 to 12 digits.");
        return "pin-new";
      }
      if (!globalThis.crypto?.subtle || typeof globalThis.crypto.getRandomValues !== "function") {
        throw popupError("crypto_unavailable", "Cryptography unavailable");
      }
      const salt = bytesToHex(crypto.getRandomValues(new Uint8Array(16)));
      const record = { version: 1, salt, hash: await pinHash(pin, salt) };
      await authorizeSettingsChange();
      await strictStorageCall(extensionAPI.storage.local, "set", { [PIN_LOCK_KEY]: record, [PIN_ATTEMPTS_KEY]: null });
      pinRecord = record;
      settingsUnlocked = false;
      setSettingsStatus(getMessage("pin_saved") || "PIN saved. Enter it to change your settings.");
      return "pin-unlock";
    });
  });

  document.getElementById("pin-lock-now")?.addEventListener("click", () => {
    if (!pinReady || pinBusy) return;
    settingsUnlocked = false;
    document.getElementById("pin-new").value = "";
    document.getElementById("pin-confirm").value = "";
    setSettingsStatus("");
    refreshPinUI();
    focusPinUI("pin-unlock");
  });
  document.getElementById("pin-remove")?.addEventListener("click", () => runPinAction(async () => {
    try {
      await authorizeSettingsChange();
    } catch (error) {
      if (error.code !== "pin_removed_elsewhere") throw error;
      setSettingsStatus(getMessage("pin_removed_elsewhere") || "The PIN was removed in another window. Settings are unlocked.");
      return "hide-shorts";
    }
    await strictStorageCall(extensionAPI.storage.local, "set", { [PIN_LOCK_KEY]: null, [PIN_ATTEMPTS_KEY]: null });
    pinRecord = null;
    settingsUnlocked = true;
    setSettingsStatus(getMessage("pin_removed") || "PIN removed.");
    return "hide-shorts";
  }));
  extensionAPI?.storage?.onChanged?.addListener((changes, area) => {
    const settingsAreaName = extensionAPI?.storage?.sync ? "sync" : "local";
    if (area === settingsAreaName) {
      for (const { checkbox, key, settings } of settingBindings) {
        if (Object.prototype.hasOwnProperty.call(changes, key)) {
          settings[key] = typeof changes[key].newValue === "boolean" ? changes[key].newValue : DEFAULT_SETTINGS[key];
          checkbox.checked = settings[key];
        }
      }
    }
    if (area === "local" && Object.prototype.hasOwnProperty.call(changes, PIN_LOCK_KEY)) {
      try {
        const record = checkedPinRecord(changes[PIN_LOCK_KEY].newValue);
        if (!samePinRecord(record, pinRecord)) {
          pinRecord = record;
          settingsUnlocked = !record;
          if (!pinBusy && pinReady) {
            setSettingsStatus(record
              ? errorMessage(popupError("pin_changed"), "pin_storage_error")
              : getMessage("pin_removed_elsewhere") || "The PIN was removed in another window. Settings are unlocked.");
          }
        }
      } catch (error) {
        settingsUnlocked = false;
        pinReady = false;
        setSettingsStatus(errorMessage(error, "pin_storage_error"));
      }
    }
    reconcileUncertainWrite();
    refreshPinUI();
  });
}

function getMessage(key, substitutions) {
  try {
    return extensionAPI?.i18n?.getMessage(key, substitutions) || "";
  } catch (_err) {
    return "";
  }
}

function applyTranslations() {
  const uiLanguage = extensionAPI?.i18n?.getUILanguage?.() || navigator.language || "en";
  document.documentElement.lang = uiLanguage;
  document.documentElement.dir = /^(ar|he|fa|ur)\b/i.test(uiLanguage) ? "rtl" : "ltr";

  document.querySelectorAll("[data-i18n]").forEach((element) => {
    const message = getMessage(element.dataset.i18n);
    if (message) {
      element.textContent = message;
    }
  });
}

function getLocalItems(keys) {
  return new Promise((resolve) => {
    const storageArea = extensionAPI?.storage?.local;
    if (!storageArea) {
      resolve({});
      return;
    }

    try {
      const result = storageArea.get(keys, (items) => resolve(items || {}));
      if (result && typeof result.then === "function") {
        result.then((items) => resolve(items || {})).catch(() => resolve({}));
      }
    } catch (_err) {
      resolve({});
    }
  });
}

function setLocalItems(payload) {
  try {
    const result = extensionAPI?.storage?.local?.set(payload, () => {});
    if (result && typeof result.catch === "function") {
      result.catch(() => {});
    }
  } catch (_err) {
    // Storage can be unavailable in unusual Safari contexts; nothing to persist then.
  }
}

function openInNewTab(url) {
  const fallback = () => window.open(url, "_blank", "noopener");

  try {
    const result = extensionAPI?.tabs?.create?.({ url });
    if (result && typeof result.then === "function") {
      result.then(() => window.close()).catch(fallback);
      return;
    }
    if (!extensionAPI?.tabs?.create) {
      fallback();
    }
  } catch (_err) {
    fallback();
  }
}

function wireExternalLink(link, onOpen) {
  if (!link) return;

  link.addEventListener("click", (event) => {
    event.preventDefault();
    onOpen?.();
    openInNewTab(link.href);
  });
}

function shouldAskForRating(stats, now) {
  const { firstActiveAt, shortsHiddenCount = 0, ratingPrompt = {} } = stats;

  if (ratingPrompt.rated) return false;
  if (typeof ratingPrompt.snoozedUntil === "number" && ratingPrompt.snoozedUntil > now) {
    return false;
  }
  if (typeof firstActiveAt !== "number") return false;

  return (
    now - firstActiveAt >= RATING_MIN_DAYS_ACTIVE * DAY_MS &&
    shortsHiddenCount >= RATING_MIN_SHORTS_HIDDEN
  );
}

async function renderStatsAndRating() {
  const stats = await getLocalItems(["firstActiveAt", "shortsHiddenCount", "ratingPrompt"]);
  const count = Number(stats.shortsHiddenCount) || 0;

  const statsElement = document.getElementById("stats");
  if (statsElement && count > 0) {
    const formatted = new Intl.NumberFormat(document.documentElement.lang).format(count);
    statsElement.textContent =
      getMessage("stats_shorts_hidden", [formatted]) ||
      `Shorts hidden on this device: ${formatted}`;
    statsElement.hidden = false;
  }

  const ratingCard = document.getElementById("rating-card");
  if (!ratingCard || !shouldAskForRating(stats, Date.now())) return;

  ratingCard.hidden = false;

  wireExternalLink(document.getElementById("rating-open"), () => {
    setLocalItems({ ratingPrompt: { rated: true } });
  });

  document.getElementById("rating-later")?.addEventListener("click", () => {
    setLocalItems({ ratingPrompt: { snoozedUntil: Date.now() + RATING_SNOOZE_DAYS * DAY_MS } });
    ratingCard.hidden = true;
  });
}

document.addEventListener("DOMContentLoaded", async () => {
  applyTranslations();
  wireExternalLink(document.getElementById("bundle-link"));
  renderStatsAndRating();

  let settings;
  try {
    settings = await getStoredSettings();
  } catch (error) {
    pinReady = false;
    settingsUnlocked = false;
    setSettingsStatus(errorMessage(error, "storage_read_error"));
    refreshPinUI();
    focusPinUI("settings-status");
    return;
  }
  wireToggle("hide-shorts", "hideShorts", settings);
  wireToggle("hide-home-feed", "hideHomeFeed", settings);
  wireToggle(
    "hide-watch-recommendations",
    "hideWatchRecommendations",
    settings
  );
  wireToggle("hide-comments", "hideComments", settings);
  wireToggle("hide-community-posts", "hideCommunityPosts", settings);
  await initializePinLock();
});
