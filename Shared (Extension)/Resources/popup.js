const extensionAPI = typeof browser !== "undefined" ? browser : chrome;
const DEFAULT_SETTINGS = {
  hideShorts: true,
  hideHomeFeed: false,
  hideWatchRecommendations: false,
  hideComments: false,
};
const LEGACY_HIDE_RECOMMENDATIONS_KEY = "hideRecommendations";

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
    hideComments:
      typeof items.hideComments === "boolean"
        ? items.hideComments
        : DEFAULT_SETTINGS.hideComments,
  };
}

function getStoredSettings() {
  return new Promise((resolve) => {
    const storageArea = getStorageArea();
    if (!storageArea) {
      resolve({ ...DEFAULT_SETTINGS });
      return;
    }

    try {
      const result = storageArea.get(null, (items) => {
        if (extensionAPI.runtime?.lastError) {
          resolve({ ...DEFAULT_SETTINGS });
          return;
        }
        resolve(normalizeStoredSettings(items));
      });

      if (result && typeof result.then === "function") {
        result
          .then((items) => resolve(normalizeStoredSettings(items)))
          .catch(() => resolve({ ...DEFAULT_SETTINGS }));
      }
    } catch (_err) {
      resolve({ ...DEFAULT_SETTINGS });
    }
  });
}

function saveSettings(update) {
  return new Promise((resolve) => {
    const storageArea = getStorageArea();
    if (!storageArea) {
      resolve();
      return;
    }

    const payload = { ...update };

    try {
      const result = storageArea.set(payload, () => resolve());
      if (result && typeof result.then === "function") {
        result.then(() => resolve()).catch(() => resolve());
      }
    } catch (_err) {
      resolve();
    }
  });
}

function wireToggle(id, key, settings) {
  const checkbox = document.getElementById(id);
  if (!checkbox) return;

  checkbox.checked = Boolean(settings[key]);

  checkbox.addEventListener("change", async (event) => {
    const { checked } = event.target;
    await saveSettings({ [key]: checked });
  });
}

document.addEventListener("DOMContentLoaded", async () => {
  const settings = await getStoredSettings();
  wireToggle("hide-shorts", "hideShorts", settings);
  wireToggle("hide-home-feed", "hideHomeFeed", settings);
  wireToggle(
    "hide-watch-recommendations",
    "hideWatchRecommendations",
    settings
  );
  wireToggle("hide-comments", "hideComments", settings);
});
