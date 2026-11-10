const extensionAPI = typeof browser !== "undefined" ? browser : chrome;

// The content script reports every YouTube page load. Forward it to the native
// extension handler at most this often, so the iOS app can confirm the
// extension really runs on youtube.com without waking the handler constantly.
const ACTIVITY_REPORT_INTERVAL_MS = 15 * 60 * 1000;

async function handleYouTubeVisit() {
  const storageArea = extensionAPI?.storage?.local;
  if (!storageArea) return;

  const now = Date.now();
  const items = (await storageArea.get(["firstActiveAt", "lastActivityReportAt"])) || {};
  const update = {};

  if (typeof items.firstActiveAt !== "number") {
    update.firstActiveAt = now;
  }

  const lastReportAt = Number(items.lastActivityReportAt) || 0;
  if (now - lastReportAt >= ACTIVITY_REPORT_INTERVAL_MS) {
    try {
      // Safari ignores the application identifier and routes the message to
      // SafariWebExtensionHandler in the containing app.
      await extensionAPI.runtime.sendNativeMessage("application.id", {
        type: "youtube-visit",
      });
      // A failed native message must not delay setup confirmation on the next load.
      update.lastActivityReportAt = now;
    } catch (_err) {
      // The native handler is optional; the extension keeps working without it.
    }
  }

  if (Object.keys(update).length) {
    await storageArea.set(update);
  }
}

extensionAPI.runtime.onMessage.addListener((request) => {
  if (request?.type === "nyts-youtube-visit") {
    handleYouTubeVisit().catch(() => {});
  }
});
