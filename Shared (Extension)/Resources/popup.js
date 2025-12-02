const extensionAPI = typeof browser !== "undefined" ? browser : chrome;
const DEFAULT_SETTINGS = {
  hideShorts: true,
  hideRecommendations: false,
  hideComments: false,
};

function getStorageArea() {
  return extensionAPI?.storage?.sync || extensionAPI?.storage?.local || null;
}

function getStoredSettings() {
  return new Promise((resolve) => {
    const storageArea = getStorageArea();
    if (!storageArea) {
      resolve({ ...DEFAULT_SETTINGS });
      return;
    }

    try {
      const result = storageArea.get(DEFAULT_SETTINGS, (items) => {
        if (extensionAPI.runtime?.lastError) {
          resolve({ ...DEFAULT_SETTINGS });
          return;
        }
        resolve({ ...DEFAULT_SETTINGS, ...items });
      });

      if (result && typeof result.then === "function") {
        result
          .then((items) => resolve({ ...DEFAULT_SETTINGS, ...items }))
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
  wireToggle("hide-recommendations", "hideRecommendations", settings);
  wireToggle("hide-comments", "hideComments", settings);
});
