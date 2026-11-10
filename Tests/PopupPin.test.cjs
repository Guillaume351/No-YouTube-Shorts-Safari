const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const { test } = require("node:test");
const { webcrypto } = require("node:crypto");
const { JSDOM } = require("jsdom");
const resource = name => fs.readFileSync(path.join(__dirname, "../Shared (Extension)/Resources", name), "utf8");
const html = resource("popup.html");
const script = resource("popup.js");
const clone = value => JSON.parse(JSON.stringify(value));
const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

async function until(predicate) {
  for (let i = 0; i < 300; i++) {
    if (predicate()) return;
    await sleep(10);
  }
  assert.fail("popup operation timed out");
}

async function popup(t, local = {}, sync = {}, options = {}) {
  const dom = new JSDOM(html, { url: "https://extension.invalid", runScripts: "outside-only" });
  t.after(() => dom.window.close());
  Object.defineProperty(dom.window, "crypto", { value: options.cryptoUnavailable ? {} : webcrypto });
  if (options.fastTimeout) {
    const originalSetTimeout = dom.window.setTimeout.bind(dom.window);
    dom.window.setTimeout = (callback, delay, ...args) => originalSetTimeout(callback, delay === 3000 ? 30 : delay, ...args);
  }
  dom.window.TextEncoder = TextEncoder;
  const listeners = options.bus?.listeners || [];
  const writes = [];
  let failLocalGet = options.failLocalGet;
  let failLocalSet = options.failLocalSet;
  let failSyncSet = false;
  const runtime = {};
  function area(name, values) {
    return {
      get(keys, callback) {
        if ((name === "local" && options.dropLocalReads) || (name === "sync" && options.dropSyncReads)) return;
        if (name === "local" && failLocalGet) {
          runtime.lastError = { message: "read denied" };
          callback?.({});
          delete runtime.lastError;
          return;
        }
        const result = keys === null ? clone(values) : Object.fromEntries(keys.filter(k => k in values).map(k => [k, clone(values[k])]));
        if (options.promiseOnly) return Promise.resolve(result);
        callback(result);
      },
      set(update, callback) {
        if ((name === "local" && failLocalSet) || (name === "sync" && failSyncSet)) {
          runtime.lastError = { message: "write denied" };
          callback?.();
          delete runtime.lastError;
          return;
        }
        const performWrite = () => {
          const changes = Object.fromEntries(Object.entries(update).map(([key, value]) => [key, { newValue: clone(value) }]));
          Object.assign(values, clone(update));
          writes.push({ area: name, update: clone(update) });
          for (const listener of listeners) listener(changes, name);
        };
        const delay = options.delayWrite?.(name, update) || 0;
        if (delay) {
          if (options.promiseOnly) return new Promise(resolve => setTimeout(() => { performWrite(); resolve(); }, delay));
          setTimeout(() => { performWrite(); callback?.(); }, delay);
          return;
        }
        performWrite();
        if (options.promiseOnly) return Promise.resolve();
        callback?.();
      },
    };
  }
  dom.window.browser = {
    runtime,
    storage: { local: area("local", local), sync: area("sync", sync), onChanged: { addListener(callback) { listeners.push((changes, area) => { if (options.receiveChanges !== false) callback(changes, area); }); } } },
    i18n: { getMessage(key) { return options.locale ? JSON.parse(resource(`_locales/${options.locale}/messages.json`))[key]?.message || "" : ""; }, getUILanguage() { return options.locale || "en"; } },
  };
  dom.window.eval(script + "\nwindow.__pinState = () => ({ ready: pinReady, busy: pinBusy });");
  await until(() => dom.window.document.readyState !== "loading");
  await sleep(15);
  const doc = dom.window.document;
  return {
    window: dom.window, doc, local, sync, writes,
    ready: () => (dom.window.__pinState().ready && !dom.window.__pinState().busy),
    async submit(id, fields) {
      for (const [input, value] of Object.entries(fields)) doc.getElementById(input).value = value;
      doc.getElementById(id).dispatchEvent(new dom.window.Event("submit", { cancelable: true }));
      await until(() => !dom.window.__pinState().busy);
    },
    async toggle(id, checked) {
      doc.getElementById(id).checked = checked;
      doc.getElementById(id).dispatchEvent(new dom.window.Event("change"));
      await until(() => !dom.window.__pinState().busy);
    },
    failReads(value) { failLocalGet = value; },
    failPinWrites(value) { failLocalSet = value; },
    failSettingWrites(value) { failSyncSet = value; },
    changedLock(record) {
      local.settingsPinLock = record;
      for (const listener of listeners) listener({ settingsPinLock: { newValue: record } }, "local");
    },
  };
}

async function setPin(app, pin = "123456") {
  await app.submit("pin-set-form", { "pin-new": pin, "pin-confirm": pin });
}

test("PIN setup stores only a salted PBKDF2 hash; locked popup changes nothing; correct PIN unlocks only this opening", async t => {
  const local = {};
  const sync = { hideShorts: true };
  const app = await popup(t, local, sync);
  assert.equal(app.ready(), true);
  await setPin(app);
  assert.equal(app.doc.getElementById("settings-controls").disabled, true);
  assert.match(local.settingsPinLock.salt, /^[a-f0-9]{32}$/);
  assert.match(local.settingsPinLock.hash, /^[a-f0-9]{64}$/);
  assert.equal(JSON.stringify(local).includes("123456"), false);
  assert.equal(app.doc.getElementById("pin-new").value, "");
  await app.toggle("hide-shorts", false);
  assert.equal(sync.hideShorts, true);
  await app.submit("pin-unlock-form", { "pin-unlock": "9999" });
  assert.equal(app.doc.getElementById("settings-controls").disabled, true);
  await app.submit("pin-unlock-form", { "pin-unlock": "123456" });
  assert.equal(app.doc.getElementById("settings-controls").disabled, false);
  await app.toggle("hide-shorts", false);
  await app.toggle("hide-community-posts", true);
  assert.equal(sync.hideShorts, false);
  assert.equal(sync.hideCommunityPosts, true);
  const reopened = await popup(t, local, sync);
  assert.equal(reopened.doc.getElementById("settings-controls").disabled, true);
  assert.equal(reopened.doc.getElementById("hide-shorts").checked, false);
});

test("confirmation, retry delay, relock, PIN change and removal require the active PIN", async t => {
  const app = await popup(t);
  await app.submit("pin-set-form", { "pin-new": "1234", "pin-confirm": "5678" });
  assert.equal(app.local.settingsPinLock, undefined);
  await setPin(app);
  for (let i = 0; i < 5; i++) await app.submit("pin-unlock-form", { "pin-unlock": "9999" });
  assert.ok(app.local.settingsPinAttempts.retryAt > Date.now());
  await app.submit("pin-unlock-form", { "pin-unlock": "123456" });
  assert.equal(app.doc.getElementById("settings-controls").disabled, true);
  app.local.settingsPinAttempts.retryAt = 0;
  await app.submit("pin-unlock-form", { "pin-unlock": "123456" });
  const oldHash = app.local.settingsPinLock.hash;
  await setPin(app, "567890");
  assert.notEqual(app.local.settingsPinLock.hash, oldHash);
  await app.submit("pin-unlock-form", { "pin-unlock": "123456" });
  assert.equal(app.doc.getElementById("settings-controls").disabled, true);
  await app.submit("pin-unlock-form", { "pin-unlock": "567890" });
  app.doc.getElementById("pin-lock-now").click();
  assert.equal(app.doc.getElementById("settings-controls").disabled, true);
  app.doc.getElementById("pin-remove").click();
  await until(() => !app.window.__pinState().busy);
  assert.ok(app.local.settingsPinLock, "programmatically clicking a hidden remove button cannot bypass the lock");
  await app.submit("pin-unlock-form", { "pin-unlock": "567890" });
  app.doc.getElementById("pin-remove").click();
  await until(() => !app.window.__pinState().busy);
  assert.equal(app.local.settingsPinLock, null);
  assert.equal(app.doc.getElementById("settings-controls").disabled, false);
});

test("storage failures and malformed lock records never silently unlock or save settings", async t => {
  for (const options of [{ failLocalGet: true }, {}]) {
    const local = options.failLocalGet ? {} : { settingsPinLock: { hash: "broken" } };
    const app = await popup(t, local, { hideShorts: true }, options);
    assert.equal(app.doc.getElementById("settings-controls").disabled, true);
    await app.toggle("hide-shorts", false);
    assert.equal(app.sync.hideShorts, true);
  }
  const app = await popup(t);
  app.failPinWrites(true);
  await setPin(app);
  assert.equal(app.local.settingsPinLock, undefined);
  assert.equal(app.doc.getElementById("settings-controls").disabled, true);
  const other = await popup(t, {}, { hideShorts: true });
  other.failSettingWrites(true);
  await other.toggle("hide-shorts", false);
  assert.equal(other.sync.hideShorts, true);
  assert.equal(other.doc.getElementById("hide-shorts").checked, true);
});

test("two popups share storage and revoke an unlock when either popup changes the PIN", async t => {
  const bus = { local: {}, sync: {}, listeners: [] };
  const first = await popup(t, bus.local, bus.sync, { bus, promiseOnly: true });
  await setPin(first);
  await first.submit("pin-unlock-form", { "pin-unlock": "123456" });
  const second = await popup(t, bus.local, bus.sync, { bus, promiseOnly: true });
  await second.submit("pin-unlock-form", { "pin-unlock": "123456" });
  await setPin(second, "876543");
  assert.equal(first.doc.getElementById("settings-controls").disabled, true);
  await first.toggle("hide-community-posts", true);
  assert.notEqual(bus.sync.hideCommunityPosts, true);
  assert.match(first.doc.getElementById("settings-status").textContent, /locked/i);
  await first.submit("pin-unlock-form", { "pin-unlock": "876543" });
  assert.equal(first.doc.getElementById("settings-controls").disabled, false);
});

test("re-reading shared storage refuses the old unlock even if the change event never arrives", async t => {
  const bus = { local: {}, sync: { hideShorts: true }, listeners: [] };
  const first = await popup(t, bus.local, bus.sync, { bus, receiveChanges: false });
  await setPin(first);
  await first.submit("pin-unlock-form", { "pin-unlock": "123456" });
  const second = await popup(t, bus.local, bus.sync, { bus });
  await second.submit("pin-unlock-form", { "pin-unlock": "123456" });
  await setPin(second, "876543");
  assert.equal(first.doc.getElementById("settings-controls").disabled, false, "no change event delivered");
  first.doc.getElementById("hide-shorts").focus();
  await first.toggle("hide-shorts", false);
  assert.equal(bus.sync.hideShorts, true, "the old unlock cannot save after a PIN change");
  assert.equal(first.doc.getElementById("settings-controls").disabled, true);
  assert.match(first.doc.getElementById("settings-status").textContent, /PIN changed in another window/);
  assert.equal(first.doc.activeElement.id, "pin-unlock");
});

test("focus moves to usable controls after PIN setup, unlock and removal, and stays on a saving toggle", async t => {
  const app = await popup(t, {}, { hideShorts: true }, { delayWrite: name => name === "sync" ? 40 : 0 });
  app.doc.querySelector('#pin-set-form button').focus();
  await setPin(app);
  assert.equal(app.doc.activeElement.id, "pin-unlock");
  app.doc.querySelector('#pin-unlock-form button').focus();
  await app.submit("pin-unlock-form", { "pin-unlock": "123456" });
  assert.equal(app.doc.activeElement.id, "hide-shorts");
  const saving = app.toggle("hide-shorts", false);
  assert.equal(app.doc.getElementById("settings-controls").getAttribute("aria-busy"), "true");
  assert.equal(app.doc.getElementById("settings-controls").disabled, false, "busy does not disable the focused fieldset");
  assert.equal(app.doc.activeElement.id, "hide-shorts");
  await saving;
  assert.equal(app.doc.activeElement.id, "hide-shorts");
  assert.equal(app.doc.getElementById("settings-controls").getAttribute("aria-busy"), "false");
  app.doc.getElementById("pin-remove").focus();
  app.doc.getElementById("pin-remove").click();
  await until(() => !app.window.__pinState().busy);
  assert.equal(app.doc.activeElement.id, "hide-shorts");
});

test("slow toggle saves remain explicitly unknown and guarded until delayed success is reconciled", async t => {
  const app = await popup(t, {}, { hideShorts: true }, {
    fastTimeout: true, delayWrite: name => name === "sync" ? 120 : 0,
  });
  app.doc.getElementById("hide-shorts").focus();
  const saving = app.toggle("hide-shorts", false);
  await until(() => /Save not yet confirmed/.test(app.doc.getElementById("settings-status").textContent));
  assert.equal(app.doc.getElementById("settings-controls").getAttribute("aria-busy"), "true");
  assert.equal(app.doc.getElementById("hide-shorts").indeterminate, true);
  assert.doesNotMatch(app.doc.getElementById("settings-status").textContent, /PIN/);
  assert.equal(app.sync.hideShorts, true, "storage has not applied the delayed write yet");
  app.doc.getElementById("hide-community-posts").checked = true;
  app.doc.getElementById("hide-community-posts").dispatchEvent(new app.window.Event("change"));
  assert.notEqual(app.sync.hideCommunityPosts, true, "further edits are refused while outcome is unknown");
  await saving;
  assert.equal(app.sync.hideShorts, false);
  assert.equal(app.doc.getElementById("hide-shorts").checked, false, "popup matches the applied value");
  assert.equal(app.doc.getElementById("hide-shorts").indeterminate, false);
  assert.equal(app.doc.getElementById("settings-status").textContent, "");
  assert.equal(app.doc.activeElement.id, "hide-shorts");
});

test("slow PIN saves never claim failure before the delayed PIN is actually stored", async t => {
  const app = await popup(t, {}, {}, {
    fastTimeout: true, delayWrite: (name, update) => name === "local" && update.settingsPinLock ? 120 : 0,
  });
  const saving = setPin(app);
  await until(() => /Save not yet confirmed/.test(app.doc.getElementById("settings-status").textContent));
  assert.equal(app.local.settingsPinLock, undefined);
  assert.match(app.doc.getElementById("settings-status").textContent, /Keep your PIN safe/);
  assert.equal(app.doc.querySelector(".pin-card").getAttribute("aria-busy"), "true");
  await saving;
  assert.match(app.local.settingsPinLock.hash, /^[a-f0-9]{64}$/);
  assert.match(app.doc.getElementById("settings-status").textContent, /PIN saved/);
  assert.equal(app.doc.getElementById("settings-controls").disabled, true);
  assert.equal(app.doc.activeElement.id, "pin-unlock");
});

test("crypto unsupported and storage-read timeout have distinct truthful messages", async t => {
  const unsupported = await popup(t, {}, {}, { cryptoUnavailable: true });
  await setPin(unsupported);
  assert.match(unsupported.doc.getElementById("settings-status").textContent, /PIN protection is unavailable/);
  assert.equal(unsupported.local.settingsPinLock, undefined);
  const unreadable = await popup(t, {}, {}, { fastTimeout: true, dropLocalReads: true });
  await until(() => /Stored settings could not be read/.test(unreadable.doc.getElementById("settings-status").textContent));
  assert.equal(unreadable.doc.getElementById("settings-controls").disabled, true);
});

test("all shipped locales translate every new visible, accessible and error message", async t => {
  const keys = ['toggle_community_title', 'toggle_community_description', 'pin_title', 'pin_note', 'pin_label', 'pin_new', 'pin_confirm', 'pin_unlock', 'pin_save', 'pin_lock_now', 'pin_remove', 'pin_invalid', 'pin_saved', 'pin_incorrect', 'pin_wait', 'pin_unlocked', 'pin_removed', 'pin_storage_error', 'settings_save_error', 'settings_filters_label', 'save_unknown', 'storage_read_error', 'pin_invalid_data', 'pin_locked', 'pin_changed', 'pin_crypto_unavailable', 'pin_removed_elsewhere', 'pin_removed_retry', 'pin_save_unknown'];
  for (const locale of ['en', 'fr', 'de', 'es', 'it', 'ru', 'ar']) {
    const messages = JSON.parse(resource(`_locales/${locale}/messages.json`));
    for (const key of keys) assert.ok(messages[key]?.message, `${locale}: ${key}`);
    const app = await popup(t, {}, {}, { locale });
    assert.equal(app.doc.querySelector('#settings-controls legend').textContent, messages.settings_filters_label.message);
    assert.equal(app.doc.querySelector('[data-i18n="pin_note"]').textContent, messages.pin_note.message);
    assert.equal(app.doc.documentElement.dir, locale === 'ar' ? 'rtl' : 'ltr');
  }
});

test("changing the PIN while another popup clears attempts cannot finish unlocking with the old PIN", async t => {
  const bus = { local: {}, sync: { hideShorts: true }, listeners: [] };
  let delayClear = false;
  let clearStarted = false;
  const first = await popup(t, bus.local, bus.sync, {
    bus,
    delayWrite(name, update) {
      if (delayClear && name === "local" && Object.keys(update).length === 1 && update.settingsPinAttempts === null) {
        clearStarted = true;
        return 300;
      }
      return 0;
    },
  });
  await setPin(first);
  const second = await popup(t, bus.local, bus.sync, { bus });
  await second.submit("pin-unlock-form", { "pin-unlock": "123456" });
  delayClear = true;
  const unlocking = first.submit("pin-unlock-form", { "pin-unlock": "123456" });
  await until(() => clearStarted);
  await setPin(second, "876543");
  await unlocking;
  delayClear = false;
  assert.equal(first.doc.getElementById("settings-controls").disabled, true, "old authentication must not unlock the new PIN");
  assert.match(first.doc.getElementById("settings-status").textContent, /PIN changed in another window/);
  assert.equal(first.doc.activeElement.id, "pin-unlock");
  await first.toggle("hide-shorts", false);
  assert.equal(bus.sync.hideShorts, true);
  await first.submit("pin-unlock-form", { "pin-unlock": "876543" });
  assert.equal(first.doc.getElementById("settings-controls").disabled, false);
});

test("no-PIN storage failures hide the unusable PIN forms and focus the reopen instruction", async t => {
  for (const failure of ["read", "toggle-write", "pin-write"]) {
    const app = await popup(t, {}, { hideShorts: true });
    app.doc.getElementById("hide-shorts").focus();
    if (failure === "read") app.failReads(true);
    if (failure === "toggle-write") app.failSettingWrites(true);
    if (failure === "pin-write") {
      app.failPinWrites(true);
      await setPin(app);
    } else {
      await app.toggle("hide-shorts", false);
    }
    assert.equal(app.ready(), false, failure);
    assert.equal(app.doc.getElementById("pin-set-form").hidden, true, failure);
    assert.equal(app.doc.getElementById("pin-unlock-form").hidden, true, failure);
    assert.equal(app.doc.activeElement.id, "settings-status", failure);
    assert.match(app.doc.getElementById("settings-status").textContent, /reopen/i, failure);
    assert.doesNotMatch(app.doc.getElementById("settings-status").textContent, /Enter your PIN/i, failure);
    await app.submit("pin-set-form", { "pin-new": "1234", "pin-confirm": "1234" });
    assert.equal(app.local.settingsPinLock, undefined, failure);
  }
});

test("remote PIN removal unlocks settings and a missed event explains that a refused toggle must be retried", async t => {
  for (const receiveChanges of [true, false]) {
    const bus = { local: {}, sync: { hideShorts: true }, listeners: [] };
    const first = await popup(t, bus.local, bus.sync, { bus, receiveChanges });
    await setPin(first);
    await first.submit("pin-unlock-form", { "pin-unlock": "123456" });
    const second = await popup(t, bus.local, bus.sync, { bus });
    await second.submit("pin-unlock-form", { "pin-unlock": "123456" });
    second.doc.getElementById("pin-remove").click();
    await until(() => !second.window.__pinState().busy);
    if (receiveChanges) {
      assert.match(first.doc.getElementById("settings-status").textContent, /PIN was removed in another window/);
      assert.doesNotMatch(first.doc.getElementById("settings-status").textContent, /current PIN/);
      assert.equal(first.doc.getElementById("settings-controls").disabled, false);
    } else {
      await first.toggle("hide-shorts", false);
      assert.equal(bus.sync.hideShorts, true, "the first request is refused after a missed PIN removal event");
      assert.match(first.doc.getElementById("settings-status").textContent, /change was not saved; please try it again/);
      assert.equal(first.doc.getElementById("settings-controls").disabled, false);
    }
    await first.toggle("hide-shorts", false);
    assert.equal(bus.sync.hideShorts, false, "retry succeeds without a nonexistent PIN");
  }
});

test("an initial settings read that never answers ends in a bounded, focused reopen state", async t => {
  const app = await popup(t, {}, {}, { fastTimeout: true, dropSyncReads: true });
  await until(() => /Stored settings could not be read/.test(app.doc.getElementById("settings-status").textContent));
  assert.equal(app.ready(), false);
  assert.equal(app.doc.getElementById("settings-controls").disabled, true);
  assert.equal(app.doc.activeElement.id, "settings-status");
  assert.equal(app.doc.getElementById("pin-set-form").hidden, true);
  assert.match(app.doc.getElementById("settings-status").textContent, /reopen/i);
});

test("unlocking or removing an already remotely removed PIN succeeds without a retry instruction", async t => {
  for (const action of ["unlock", "remove"]) {
    const bus = { local: {}, sync: { hideShorts: true }, listeners: [] };
    const first = await popup(t, bus.local, bus.sync, { bus, receiveChanges: false });
    await setPin(first);
    if (action === "remove") await first.submit("pin-unlock-form", { "pin-unlock": "123456" });
    const second = await popup(t, bus.local, bus.sync, { bus });
    await second.submit("pin-unlock-form", { "pin-unlock": "123456" });
    second.doc.getElementById("pin-remove").click();
    await until(() => !second.window.__pinState().busy);
    if (action === "unlock") {
      await first.submit("pin-unlock-form", { "pin-unlock": "123456" });
    } else {
      first.doc.getElementById("pin-remove").click();
      await until(() => !first.window.__pinState().busy);
    }
    assert.equal(first.doc.getElementById("settings-controls").disabled, false, action);
    assert.equal(first.doc.activeElement.id, "hide-shorts", action);
    assert.equal(first.doc.getElementById("settings-status").textContent, "The PIN was removed in another window. Settings are unlocked.", action);
    assert.doesNotMatch(first.doc.getElementById("settings-status").textContent, /not saved|try.*again/i, action);
  }
});

test("PIN removal during a delayed unlock attempt-clear is a successful unlocked state", async t => {
  const bus = { local: {}, sync: {}, listeners: [] };
  let delayClear = false;
  let clearStarted = false;
  const first = await popup(t, bus.local, bus.sync, {
    bus,
    delayWrite(name, update) {
      if (delayClear && name === "local" && Object.keys(update).length === 1 && update.settingsPinAttempts === null) {
        clearStarted = true;
        return 300;
      }
      return 0;
    },
  });
  await setPin(first);
  const second = await popup(t, bus.local, bus.sync, { bus });
  await second.submit("pin-unlock-form", { "pin-unlock": "123456" });
  delayClear = true;
  const unlocking = first.submit("pin-unlock-form", { "pin-unlock": "123456" });
  await until(() => clearStarted);
  second.doc.getElementById("pin-remove").click();
  await until(() => !second.window.__pinState().busy);
  await unlocking;
  assert.equal(first.doc.getElementById("settings-controls").disabled, false);
  assert.equal(first.doc.activeElement.id, "hide-shorts");
  assert.equal(first.doc.getElementById("settings-status").textContent, "The PIN was removed in another window. Settings are unlocked.");
});

test("remote PIN changes and removal preserve an existing focused reopen-error state", async t => {
  const bus = { local: {}, sync: { hideShorts: true }, listeners: [] };
  const first = await popup(t, bus.local, bus.sync, { bus });
  first.failReads(true);
  first.doc.getElementById("hide-shorts").focus();
  await first.toggle("hide-shorts", false);
  const originalMessage = first.doc.getElementById("settings-status").textContent;
  assert.equal(first.ready(), false);
  assert.match(originalMessage, /reopen/i);
  const second = await popup(t, bus.local, bus.sync, { bus });
  await setPin(second);
  assert.equal(first.doc.getElementById("settings-status").textContent, originalMessage);
  await second.submit("pin-unlock-form", { "pin-unlock": "123456" });
  second.doc.getElementById("pin-remove").click();
  await until(() => !second.window.__pinState().busy);
  assert.equal(first.doc.getElementById("settings-status").textContent, originalMessage);
  assert.equal(first.doc.getElementById("settings-controls").disabled, true);
  assert.equal(first.doc.getElementById("pin-unlock-form").hidden, true);
  assert.equal(first.doc.activeElement.id, "settings-status");
});
