const extensionAPI = typeof browser !== "undefined" ? browser : chrome;
const DEFAULT_SETTINGS = {
  hideShorts: true,
  hideHomeFeed: false,
  hideWatchRecommendations: false,
  hideComments: false,
  hideCommunityPosts: false,
};
let currentSettings = { ...DEFAULT_SETTINGS };
let settingsLoaded = false;

const CRITICAL_HIDE_STYLE_ID = "nyts-critical-hide-style";
const SETTINGS_HIDE_STYLE_ID = "nyts-settings-hide-style";
const NYTS_NAV_HOOK_INSTALLED = "__nytsNavHookInstalled";
const NYTS_LAST_URL = "__nytsLastUrl";
const LEGACY_HIDE_RECOMMENDATIONS_KEY = "hideRecommendations";

// Individual Shorts items (not shelves), listed outermost first so the
// document-order walk in countHiddenShortsItems() meets containers first.
const SHORTS_ITEM_SELECTOR = [
  "ytd-reel-item-renderer",
  "ytd-rich-grid-slim-media[is-short]",
  "ytd-rich-grid-slim-media[is-reel-item]",
  "ytm-reel-item-renderer",
  "ytm-rich-grid-media[is-short]",
  "ytm-shorts-lockup-view-model",
  "ytm-shorts-lockup-view-model-v2",
  "ytm-reel-lockup-view-model",
].join(",");
const STATS_FLUSH_DELAY_MS = 2000;
const countedShorts = new WeakSet();
let pendingHiddenShorts = 0;

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

function injectCriticalStyles() {
  if (document.getElementById(CRITICAL_HIDE_STYLE_ID)) {
    return;
  }

  const style = document.createElement("style");
  style.id = CRITICAL_HIDE_STYLE_ID;
  style.textContent = `
    /* Shorts entry points and trays */
    ytd-reel-shelf-renderer,
    ytm-reel-shelf-renderer,
    ytm-shorts-lockup-view-model,
    ytm-shorts-lockup-view-model-v2,
    ytm-reel-item-renderer,
    ytm-reel-lockup-view-model,
    ytd-rich-grid-slim-media[is-short],
    ytd-rich-grid-slim-media[is-reel-item],
    ytd-mini-guide-entry-renderer a[href*="/shorts"],
    ytd-guide-entry-renderer a[href*="/shorts"],
    ytm-pivot-bar-item-renderer .pivot-shorts,
    ytm-rich-grid-media[is-short],
    ytm-rich-item-renderer .rich-item-renderer[is-short] {
      display: none !important;
    }

    ytm-pivot-bar-item-renderer:has(.pivot-shorts),
    ytm-pivot-bar-item-renderer:has(a[href*="/shorts"]) {
      display: none !important;
      flex: 0 0 0 !important;
      width: 0 !important;
      min-width: 0 !important;
      max-width: 0 !important;
      padding: 0 !important;
      margin: 0 !important;
      overflow: hidden !important;
      pointer-events: none !important;
    }

    ytm-pivot-bar-item-renderer[data-nyts-hidden-shorts-pivot="true"] {
      display: none !important;
      flex: 0 0 0 !important;
      width: 0 !important;
      min-width: 0 !important;
      max-width: 0 !important;
      padding: 0 !important;
      margin: 0 !important;
      overflow: hidden !important;
      pointer-events: none !important;
    }

    ytm-pivot-bar-renderer[data-nyts-pivot-rebalanced="true"],
    [data-nyts-pivot-layout-container="true"] {
      display: flex !important;
      align-items: stretch !important;
      justify-content: space-around !important;
    }

    ytm-pivot-bar-renderer[data-nyts-pivot-rebalanced="true"] ytm-pivot-bar-item-renderer:not([data-nyts-hidden-shorts-pivot="true"]),
    [data-nyts-pivot-layout-container="true"] > ytm-pivot-bar-item-renderer:not([data-nyts-hidden-shorts-pivot="true"]) {
      flex: 1 1 0 !important;
      width: auto !important;
      min-width: 0 !important;
      max-width: none !important;
    }
  `;

  (document.head || document.documentElement).appendChild(style);
}

function injectSettingsStyles() {
  if (document.getElementById(SETTINGS_HIDE_STYLE_ID)) {
    return;
  }

  const style = document.createElement("style");
  style.id = SETTINGS_HIDE_STYLE_ID;
  style.textContent = `
    /* Reduce initial flash of home feed when recommendations are disabled */
    body[data-nyts-hide-home="true"] ytd-two-column-browse-results-renderer[page-subtype="home"] ytd-rich-grid-renderer,
    body[data-nyts-hide-home="true"] ytd-two-column-browse-results-renderer[page-subtype="home"] ytd-rich-section-renderer,
    body[data-nyts-hide-home="true"] ytd-two-column-browse-results-renderer[page-subtype="home"] ytd-rich-grid-slim-media,
    body[data-nyts-hide-home="true"] ytd-two-column-browse-results-renderer[page-subtype="home"] ytd-rich-item-renderer,
    body[data-nyts-hide-home="true"] ytd-two-column-browse-results-renderer[page-subtype="home"] ytd-ghost-grid-renderer,
    body[data-nyts-hide-home="true"] ytd-two-column-browse-results-renderer[page-subtype="home"] ytd-continuation-item-renderer,
    body[data-nyts-hide-home="true"] ytd-browse[page-subtype="home"]:not([hidden]) ytd-rich-grid-renderer,
    body[data-nyts-hide-home="true"] ytd-browse[page-subtype="home"]:not([hidden]) ytd-rich-section-renderer,
    body[data-nyts-hide-home="true"] ytd-browse[page-subtype="home"]:not([hidden]) ytd-ghost-grid-renderer,
    body[data-nyts-hide-home="true"] ytd-browse[page-subtype="home"]:not([hidden]) ytd-continuation-item-renderer,
    body[data-nyts-hide-home="true"] ytm-rich-grid-renderer,
    body[data-nyts-hide-home="true"] ytm-single-column-browse-results-renderer,
    body[data-nyts-hide-home="true"] ytm-rich-section-renderer,
    body[data-nyts-hide-home="true"] ytm-rich-item-renderer,
    body[data-nyts-hide-home="true"] ytm-video-with-context-renderer,
    body[data-nyts-hide-home="true"] grid-shelf-view-model {
      display: none !important;
    }

    body[data-nyts-hide-community-posts="true"] [data-nyts-community-post="true"] {
      display: none !important;
    }

    /* Expand watch layout when sidebar is collapsed */
    body[data-nyts-collapse-watch-sidebar="true"] ytd-watch-flexy #secondary,
    body[data-nyts-collapse-watch-sidebar="true"] ytd-watch-grid #secondary {
      display: none !important;
    }

    body[data-nyts-collapse-watch-sidebar="true"] ytd-watch-flexy #primary,
    body[data-nyts-collapse-watch-sidebar="true"] ytd-watch-grid #primary {
      flex: 1 1 auto !important;
      width: 100% !important;
      max-width: none !important;
      margin-right: 0 !important;
    }

    body[data-nyts-collapse-watch-sidebar="true"] ytd-watch-flexy #primary-inner,
    body[data-nyts-collapse-watch-sidebar="true"] ytd-watch-grid #primary-inner,
    body[data-nyts-collapse-watch-sidebar="true"] ytd-watch-flexy #columns,
    body[data-nyts-collapse-watch-sidebar="true"] ytd-watch-grid #columns {
      max-width: none !important;
      width: 100% !important;
    }

    body[data-nyts-hide-comments="true"] ytd-comments,
    body[data-nyts-hide-comments="true"] #comments,
    body[data-nyts-hide-comments="true"] ytd-item-section-renderer#sections,
    body[data-nyts-hide-comments="true"] ytm-comment-section-renderer,
    body[data-nyts-hide-comments="true"] ytm-comment-input-box-carousel-item-view-model,
    body[data-nyts-hide-comments="true"] yt-comment-input-box-carousel-item-view-model,
    body[data-nyts-hide-comments="true"] ytm-item-section-renderer[section-identifier="comments"] {
      display: none !important;
    }

    body[data-nyts-hide-comments="true"] ytm-item-section-renderer.scwnr-content:has(yt-comment-input-box-carousel-item-view-model),
    body[data-nyts-hide-comments="true"] ytm-item-section-renderer.scwnr-content:has(ytm-comment-input-box-carousel-item-view-model),
    body[data-nyts-hide-comments="true"] yt-video-metadata-carousel-view-model:has(yt-comment-input-box-carousel-item-view-model),
    body[data-nyts-hide-comments="true"] ytm-video-metadata-carousel-view-model:has(ytm-comment-input-box-carousel-item-view-model) {
      display: none !important;
    }
  `;

  (document.head || document.documentElement).appendChild(style);
}

function removeCriticalStyles() {
  const style = document.getElementById(CRITICAL_HIDE_STYLE_ID);
  if (style) {
    style.remove();
  }
}

function whenBodyReady(callback) {
  if (document.body) {
    callback();
    return;
  }

  const observer = new MutationObserver(() => {
    if (document.body) {
      observer.disconnect();
      callback();
    }
  });

  observer.observe(document.documentElement || document, {
    childList: true,
    subtree: true,
  });
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

function registerSettingsListener() {
  if (!extensionAPI?.storage?.onChanged?.addListener) {
    return;
  }

  extensionAPI.storage.onChanged.addListener((changes, area) => {
    if (area && area !== "sync" && area !== "local") return;

    let shouldReprocess = false;
    const hasHomeFeedChange = Object.prototype.hasOwnProperty.call(
      changes,
      "hideHomeFeed"
    );
    const hasWatchRecommendationsChange = Object.prototype.hasOwnProperty.call(
      changes,
      "hideWatchRecommendations"
    );
    const hasLegacyRecommendationsChange = Object.prototype.hasOwnProperty.call(
      changes,
      LEGACY_HIDE_RECOMMENDATIONS_KEY
    );

    if (Object.prototype.hasOwnProperty.call(changes, "hideShorts")) {
      currentSettings.hideShorts =
        changes.hideShorts.newValue ?? DEFAULT_SETTINGS.hideShorts;
      shouldReprocess = true;
    }

    if (hasHomeFeedChange) {
      currentSettings.hideHomeFeed =
        changes.hideHomeFeed.newValue ?? DEFAULT_SETTINGS.hideHomeFeed;
      shouldReprocess = true;
    }

    if (hasWatchRecommendationsChange) {
      currentSettings.hideWatchRecommendations =
        changes.hideWatchRecommendations.newValue ??
        DEFAULT_SETTINGS.hideWatchRecommendations;
      shouldReprocess = true;
    }

    if (hasLegacyRecommendationsChange) {
      const legacyValue =
        changes[LEGACY_HIDE_RECOMMENDATIONS_KEY].newValue ??
        DEFAULT_SETTINGS.hideHomeFeed;

      if (!hasHomeFeedChange) {
        currentSettings.hideHomeFeed = legacyValue;
      }

      if (!hasWatchRecommendationsChange) {
        currentSettings.hideWatchRecommendations = legacyValue;
      }

      shouldReprocess = true;
    }

    if (Object.prototype.hasOwnProperty.call(changes, "hideComments")) {
      currentSettings.hideComments =
        changes.hideComments.newValue ?? DEFAULT_SETTINGS.hideComments;
      shouldReprocess = true;
    }

    if (Object.prototype.hasOwnProperty.call(changes, "hideCommunityPosts")) {
      currentSettings.hideCommunityPosts =
        changes.hideCommunityPosts.newValue ?? DEFAULT_SETTINGS.hideCommunityPosts;
      shouldReprocess = true;
    }

    if (shouldReprocess) {
      processPage();
    }
  });
}

function hideElement(element, reason) {
  if (!element || element.dataset?.nytsHidden === reason) {
    return;
  }
  element.dataset.nytsHidden = reason;
  element.style.display = "none";
}

function restoreElements(selector, reason) {
  document
    .querySelectorAll(`${selector}[data-nyts-hidden="${reason}"]`)
    .forEach((el) => {
      el.style.display = "";
      delete el.dataset.nytsHidden;
    });
}

// Local, on-device counter shown in the popup ("Shorts hidden on this device").
// Nothing leaves the device; it only feeds the popup and the rating prompt.
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

function flushHiddenShortsCount() {
  const count = pendingHiddenShorts;
  const storageArea = extensionAPI?.storage?.local;
  if (!count || !storageArea) return;

  pendingHiddenShorts = 0;
  getLocalItems(["shortsHiddenCount", "firstActiveAt"]).then((items) => {
    const payload = {
      shortsHiddenCount: (Number(items.shortsHiddenCount) || 0) + count,
    };
    if (typeof items.firstActiveAt !== "number") {
      payload.firstActiveAt = Date.now();
    }

    try {
      const result = storageArea.set(payload, () => {});
      if (result && typeof result.catch === "function") {
        result.catch(() => {});
      }
    } catch (_err) {
      // Counting is best effort.
    }
  });
}

function recordHiddenShorts(count) {
  if (count <= 0) return;
  pendingHiddenShorts += count;
  flushHiddenShortsCountDebounced();
}

function isCountedOrInsideCounted(element) {
  for (let node = element; node; node = node.parentElement) {
    if (countedShorts.has(node)) return true;
  }
  return false;
}

// Call before removing a subtree from the DOM.
function countShortsInRemovedSubtree(root) {
  let count = 0;
  root?.querySelectorAll?.(SHORTS_ITEM_SELECTOR).forEach((item) => {
    if (isCountedOrInsideCounted(item)) return;
    countedShorts.add(item);
    count += 1;
  });
  recordHiddenShorts(count);
}

// Counts Shorts items that are still in the DOM but no longer rendered
// (hidden by the critical styles or by an ancestor this script hid).
function countHiddenShortsItems() {
  let count = 0;
  document.querySelectorAll(SHORTS_ITEM_SELECTOR).forEach((item) => {
    if (isCountedOrInsideCounted(item) || item.getClientRects().length > 0) {
      return;
    }
    countedShorts.add(item);
    count += 1;
  });
  recordHiddenShorts(count);
}

// Lets the background script tell the containing app that the extension
// really runs on YouTube, so the iOS app can confirm setup is complete.
function reportYouTubeVisit() {
  try {
    const result = extensionAPI?.runtime?.sendMessage?.({ type: "nyts-youtube-visit" });
    if (result && typeof result.catch === "function") {
      result.catch(() => {});
    }
  } catch (_err) {
    // The background script may be unavailable; the report is best effort.
  }
}

function restoreElementsByReason(reason) {
  document.querySelectorAll(`[data-nyts-hidden="${reason}"]`).forEach((el) => {
    el.style.display = "";
    delete el.dataset.nytsHidden;
  });
}

function getPlaceholderPalette() {
  const isDark =
    window.matchMedia &&
    window.matchMedia("(prefers-color-scheme: dark)").matches;

  return isDark
    ? {
        text: "#f0f0f0",
        heading: "#ffffff",
        surface: "#181a1f",
        border: "#2a2c31",
      }
    : {
        text: "#1f1f1f",
        heading: "#0f0f0f",
        surface: "#fafafa",
        border: "#e0e0e0",
      };
}

function injectWatchPlaceholder() {
  if (!isWatchPage()) return;
  const palette = getPlaceholderPalette();
  const container =
    document.querySelector("ytd-watch-flexy #secondary") ||
    document.querySelector("ytd-watch-grid #secondary") ||
    document.querySelector(
      "ytm-item-section-renderer[section-identifier='related-items']"
    ) ||
    document.querySelector("ytm-single-column-watch-next-results-renderer");

  if (!container || container.querySelector("#nyts-watch-placeholder")) {
    return;
  }

  const placeholder = document.createElement("div");
  placeholder.id = "nyts-watch-placeholder";
  placeholder.style.display = "flex";
  placeholder.style.flexDirection = "column";
  placeholder.style.alignItems = "center";
  placeholder.style.justifyContent = "center";
  placeholder.style.padding = "32px 12px";
  placeholder.style.gap = "8px";
  placeholder.style.color = palette.text;
  placeholder.style.fontFamily = "Arial, sans-serif";
  placeholder.style.textAlign = "center";
  placeholder.style.border = `1px solid ${palette.border}`;
  placeholder.style.borderRadius = "12px";
  placeholder.style.background = palette.surface;

  placeholder.innerHTML = `
    <div style="font-weight: 700; font-size: 16px; color: ${palette.heading};">No distractions · Pas de distractions</div>
    <div style="margin-top: 4px; font-size: 13px; line-height: 1.5; color: ${palette.text};">
      Sidebar recommendations are hidden. / Les recommandations de droite sont masquées.
    </div>
  `;

  container.prepend(placeholder);
}

function removeWatchPlaceholder() {
  const placeholder = document.getElementById("nyts-watch-placeholder");
  if (placeholder) {
    placeholder.remove();
  }
}

function injectCommentsPlaceholder() {
  if (!isWatchPage()) return;
  const existing = document.getElementById("nyts-comments-placeholder");
  if (existing) return;

  const palette = getPlaceholderPalette();
  const anchor =
    document.querySelector("ytd-comments") ||
    document.querySelector("#comments") ||
    document.querySelector(
      "ytm-item-section-renderer[section-identifier='comments']"
    ) ||
    document.querySelector("ytm-video-metadata-carousel-view-model");

  const targetContainer =
    anchor?.parentElement ||
    document.querySelector("ytm-watch") ||
    document.querySelector("ytd-watch-flexy #primary") ||
    document.body;

  const placeholder = document.createElement("div");
  placeholder.id = "nyts-comments-placeholder";
  placeholder.style.display = "flex";
  placeholder.style.flexDirection = "column";
  placeholder.style.alignItems = "flex-start";
  placeholder.style.justifyContent = "center";
  placeholder.style.padding = "20px 14px";
  placeholder.style.gap = "6px";
  placeholder.style.marginTop = "12px";
  placeholder.style.border = `1px solid ${palette.border}`;
  placeholder.style.borderRadius = "12px";
  placeholder.style.background = palette.surface;
  placeholder.style.color = palette.text;
  placeholder.style.fontFamily = "Arial, sans-serif";

  placeholder.innerHTML = `
    <div style="font-weight: 700; font-size: 15px; color: ${palette.heading};">Comments hidden · Commentaires masqués</div>
    <div style="font-size: 13px; line-height: 1.4; color: ${palette.text};">
      No spoilers, no toxicity. / Pas de spoilers, pas de toxicité.
    </div>
  `;

  targetContainer.insertBefore(
    placeholder,
    anchor || targetContainer.firstChild
  );
}

function removeCommentsPlaceholder() {
  const placeholder = document.getElementById("nyts-comments-placeholder");
  if (placeholder) {
    placeholder.remove();
  }
}

function removeShortsMenuItem() {
  document.querySelectorAll("ytd-guide-entry-renderer").forEach((entry) => {
    const link = entry.querySelector("a.yt-simple-endpoint");
    if (!link) {
      return;
    }

    const href = link.getAttribute("href") || "";
    const linkTitle = (link.getAttribute("title") || "").trim().toLowerCase();
    const labelText = (entry.querySelector(".title")?.textContent || "")
      .trim()
      .toLowerCase();

    const isShorts =
      href.includes("/shorts") ||
      linkTitle === "shorts" ||
      labelText === "shorts";

    if (isShorts) {
      entry.remove();
      console.log("Removed Shorts menu item");
    }
  });
}

function removeShortsMiniMenuItem() {
  document
    .querySelectorAll("ytd-mini-guide-entry-renderer")
    .forEach((entry) => {
      if (entry.dataset.processedMiniShort === "true") {
        return;
      }

      const shortsLink = entry.querySelector('a[href*="/shorts"]');

      if (shortsLink) {
        entry.remove();
        console.log("Removed Shorts mini menu item");
      } else {
        entry.dataset.processedMiniShort = "true";
      }
    });
}

function removeShortsReelShelf() {
  document.querySelectorAll("ytd-reel-shelf-renderer").forEach((item) => {
    countShortsInRemovedSubtree(item);
    item.remove();
    console.log("Removed Shorts reel shelf");
  });
}

function removeShortsFromSearchResults() {
  document.querySelectorAll("ytd-video-renderer").forEach((video) => {
    const badge = video.querySelector(
      'ytd-thumbnail-overlay-time-status-renderer[overlay-style="SHORTS"]'
    );
    if (badge) {
      video.remove();
      recordHiddenShorts(1);
      console.log("Removed a Shorts video from search results");
    }
  });
}

function removeMobileShortsFromSearchResults() {
  // Hide Shorts results on m.youtube.com search results
  document
    .querySelectorAll(
      "ytm-video-with-context-renderer:not([data-processed-mobile-search])"
    )
    .forEach((item) => {
      const isShortByBadge = item.querySelector(
        'ytm-thumbnail-overlay-time-status-renderer[data-style="SHORTS"]'
      );
      const isShortByClass = item.querySelector(
        "ytm-media-item.big-shorts-singleton"
      );
      const isShortByLink = !!item.querySelector('a[href^="/shorts/"]');

      if (isShortByBadge || isShortByClass || isShortByLink) {
        item.style.display = "none";
        item.setAttribute("data-processed-mobile-search", "true");
        recordHiddenShorts(1);
        console.log("Hid mobile Shorts result from search");
      }
    });
}

function removeShortsSearchFilter() {
  document.querySelectorAll("yt-chip-cloud-chip-renderer").forEach((chip) => {
    if (chip.dataset.processedShortsFilter === "true") {
      return;
    }

    const textElement = chip.querySelector("#text");
    const chipContent = chip.querySelector(".ytChipShapeChip");

    const textLabel = (textElement?.title || textElement?.textContent || "")
      .trim()
      .toLowerCase();
    const chipLabel = (chipContent?.textContent || "").trim().toLowerCase();
    const ariaLabel = (chip.getAttribute("aria-label") || "")
      .trim()
      .toLowerCase();

    if (
      textLabel.includes("shorts") ||
      chipLabel.includes("shorts") ||
      ariaLabel.includes("shorts")
    ) {
      chip.remove();
      console.log("Removed Shorts search filter");
    } else {
      chip.dataset.processedShortsFilter = "true";
    }
  });
}

function isMobileShortsPivotItem(item) {
  const titleElement = item.querySelector(".pivot-bar-item-title");
  const titleText = (titleElement?.textContent || "").trim().toLowerCase();
  const ariaLabel = (
    item.getAttribute("aria-label") ||
    item.querySelector("[aria-label]")?.getAttribute("aria-label") ||
    ""
  )
    .trim()
    .toLowerCase();
  const shortsLink = item.querySelector('a[href*="/shorts"]');
  const shortsClass = item.querySelector(".pivot-shorts");

  return (
    !!shortsLink ||
    !!shortsClass ||
    titleText === "shorts" ||
    ariaLabel === "shorts"
  );
}

function findMobilePivotLayoutContainer(item) {
  let node = item.parentElement;

  while (node && node !== document.body) {
    const directPivotItems = Array.from(node.children).filter((child) =>
      child.matches?.("ytm-pivot-bar-item-renderer")
    );

    if (directPivotItems.length > 1) {
      return node;
    }

    node = node.parentElement;
  }

  return item.closest("ytm-pivot-bar-renderer") || item.parentElement;
}

function rebalanceMobilePivotContainer(container) {
  if (!container) {
    return;
  }

  const pivotItems = Array.from(container.children).filter((child) =>
    child.matches?.("ytm-pivot-bar-item-renderer")
  );
  const visibleItems = pivotItems.filter(
    (child) => child.dataset.nytsHiddenShortsPivot !== "true"
  );

  if (visibleItems.length < 2) {
    return;
  }

  container.dataset.nytsPivotLayoutContainer = "true";
  container.style.setProperty("display", "flex", "important");
  container.style.setProperty("align-items", "stretch", "important");
  container.style.setProperty("justify-content", "space-around", "important");

  visibleItems.forEach((visibleItem) => {
    visibleItem.style.setProperty("flex", "1 1 0", "important");
    visibleItem.style.setProperty("width", "auto", "important");
    visibleItem.style.setProperty("min-width", "0", "important");
    visibleItem.style.setProperty("max-width", "none", "important");
  });
}

function collapseMobileShortsPivotItem(item) {
  if (!item || item.dataset.nytsHiddenShortsPivot === "true") {
    return;
  }

  item.dataset.nytsHiddenShortsPivot = "true";
  item.setAttribute("data-processed-menu-item", "true");
  item.setAttribute("aria-hidden", "true");
  item.setAttribute("hidden", "");
  item.style.setProperty("display", "none", "important");
  item.style.setProperty("flex", "0 0 0", "important");
  item.style.setProperty("width", "0", "important");
  item.style.setProperty("min-width", "0", "important");
  item.style.setProperty("max-width", "0", "important");
  item.style.setProperty("padding", "0", "important");
  item.style.setProperty("margin", "0", "important");
  item.style.setProperty("overflow", "hidden", "important");
  item.style.setProperty("pointer-events", "none", "important");

  const layoutContainer = findMobilePivotLayoutContainer(item);
  const pivotRenderer = item.closest("ytm-pivot-bar-renderer");

  if (pivotRenderer) {
    pivotRenderer.dataset.nytsPivotRebalanced = "true";
  }

  rebalanceMobilePivotContainer(layoutContainer);
}

function removeMobileShortsMenuItem() {
  document
    .querySelectorAll(
      "ytm-pivot-bar-item-renderer:not([data-processed-menu-item])"
    )
    .forEach((item) => {
      if (isMobileShortsPivotItem(item)) {
        collapseMobileShortsPivotItem(item);
        console.log("Hid Shorts menu item from mobile");
      }
    });
}

function removeMobileReelShelf() {
  document
    .querySelectorAll(
      "ytm-reel-shelf-renderer:not([data-processed-reel-shelf])"
    )
    .forEach((item) => {
      item.style.display = "none";
      item.setAttribute("data-processed-reel-shelf", "true");
      console.log("Hid Shorts reel shelf from mobile");
    });
}

function removeMobileRichSectionShorts() {
  // Hide ytm-rich-section-renderer that contains Shorts
  document
    .querySelectorAll(
      "ytm-rich-section-renderer:not([data-processed-rich-section])"
    )
    .forEach((section) => {
      const shortsHeader = section.querySelector(
        'yt-shelf-header-layout .shelf-header-layout-wiz__title [role="text"]'
      );
      if (shortsHeader && shortsHeader.textContent.trim() === "Shorts") {
        section.style.display = "none";
        section.setAttribute("data-processed-rich-section", "true");
        console.log("Hid mobile rich section Shorts");
      }
    });
}

function removeGridShelfShorts() {
  const shortsCardSelector =
    "ytm-shorts-lockup-view-model, ytm-shorts-lockup-view-model-v2";

  document
    .querySelectorAll("grid-shelf-view-model:not([data-processed-grid-shelf])")
    .forEach((shelf) => {
      // Desktop and mobile share these shelves. Titles can be "Shorts", a
      // topic, or absent, and YouTube changes the heading markup independently.
      const shortsCard = shelf.querySelector(shortsCardSelector);
      const ordinaryResult = shelf.querySelector(
        'ytd-video-renderer, ytm-video-with-context-renderer, yt-lockup-view-model, a[href*="/watch?"], a[href*="/playlist?"]'
      );
      const hasOtherItems = Array.from(
        shelf.querySelectorAll(".ytGridShelfViewModelGridShelfItem")
      ).some((item) => !item.querySelector(shortsCardSelector));

      if (shortsCard && !ordinaryResult && !hasOtherItems) {
        // Hide the container so its heading, spacing and Show more button go too.
        shelf.style.display = "none";
        shelf.setAttribute("data-processed-grid-shelf", "true");
        console.log("Hid grid shelf with Shorts");
      }
    });
}

function removeMobileSectionHeaderShorts() {
  // Hide standalone yt-section-header-view-model with Shorts title
  document
    .querySelectorAll(
      "yt-section-header-view-model:not([data-processed-section-header])"
    )
    .forEach((header) => {
      const shortsTitle = header.querySelector(
        'yt-shelf-header-layout .shelf-header-layout-wiz__title [role="text"]'
      );
      if (shortsTitle && shortsTitle.textContent.trim() === "Shorts") {
        header.style.display = "none";
        header.setAttribute("data-processed-section-header", "true");
        console.log("Hid mobile section header Shorts");
      }
    });
}

function removeMobileShortsLockups() {
  // Hide individual Shorts lockups, including the newer outer container.
  document
    .querySelectorAll(
      "ytm-shorts-lockup-view-model:not([data-processed-lockup]), ytm-shorts-lockup-view-model-v2:not([data-processed-lockup])"
    )
    .forEach((lockup) => {
      lockup.style.display = "none";
      lockup.setAttribute("data-processed-lockup", "true");
      console.log("Hid mobile shorts lockup");
    });
}

function hideYouTubeShortsElements() {
  if (!currentSettings.hideShorts) {
    return;
  }

  console.log("Hiding");

  // Hide the Shorts menu in the sidebar
  document.querySelectorAll("ytd-guide-entry-renderer").forEach((entry) => {
    const link = entry.querySelector("a.yt-simple-endpoint");
    if (!link) {
      return;
    }

    const href = link.getAttribute("href") || "";
    const linkTitle = (link.getAttribute("title") || "").trim().toLowerCase();
    const labelText = (entry.querySelector(".title")?.textContent || "")
      .trim()
      .toLowerCase();

    if (
      href.includes("/shorts") ||
      linkTitle === "shorts" ||
      labelText === "shorts"
    ) {
      entry.remove();
      console.log("Removed Shorts from sidebar");
    }
  });

  // Hide Shorts videos in the feed
  document
    .querySelectorAll(
      "ytd-rich-grid-slim-media[is-short]:not([data-processed])"
    )
    .forEach((video) => {
      video.style.display = "none";
      video.setAttribute("data-processed", "true");
      console.log("Removed a Shorts video");
    });

  // Hide Shorts from search results
  removeShortsFromSearchResults();
  removeMobileShortsFromSearchResults();

  // Hide Shorts search filter
  removeShortsSearchFilter();

  // Attempt to remove the Shorts menu item
  removeShortsMenuItem();
  removeShortsMiniMenuItem();
  removeShortsReelShelf();

  // iOS (m.youtube.com)
  removeMobileShortsMenuItem();
  removeMobileReelShelf();

  // New mobile Shorts structures
  removeMobileRichSectionShorts();
  removeGridShelfShorts();
  removeMobileSectionHeaderShorts();
  removeMobileShortsLockups();
}

function removeShortsHeader() {
  const shortsHeaderContainer = document.getElementById(
    "rich-shelf-header-container"
  );
  if (shortsHeaderContainer) {
    countShortsInRemovedSubtree(shortsHeaderContainer.parentElement);
    shortsHeaderContainer.parentElement.remove();
    console.log("Removed Shorts header container");
  }
}

function isHomePage() {
  // YouTube is an SPA and keeps other <ytd-browse> nodes (often hidden) in the
  // DOM; rely on URL to avoid mis-detecting other pages (Subscriptions, etc.)
  // as Home.
  return (
    window.location.pathname === "/" ||
    window.location.pathname === "" ||
    window.location.pathname === "/feed" ||
    window.location.pathname === "/feed/home"
  );
}

function hideHomeRecommendations() {
  if (!isHomePage()) {
    delete document.body.dataset.nytsHideHome;
    return;
  }

  document.body.dataset.nytsHideHome = "true";

  const homeContainer =
    document.querySelector('ytd-browse[page-subtype="home"]:not([hidden])') ||
    document.querySelector('ytd-browse[page-subtype="home"]') ||
    document;

  [
    "ytd-rich-grid-renderer",
    "ytd-rich-section-renderer",
    "ytd-rich-grid-slim-media",
    "ytd-rich-item-renderer",
    "ytd-rich-grid-renderer #contents",
    "ytd-ghost-grid-renderer",
    "ytd-continuation-item-renderer",
    // Mobile structures
    "ytm-rich-grid-renderer",
    "ytm-single-column-browse-results-renderer",
    "ytm-single-column-browse-results-renderer.modern-tabs",
    "ytm-rich-item-renderer",
    "ytm-rich-section-renderer",
    "ytm-rich-grid-renderer.rich-grid-single-column",
    "ytm-browse",
    "ytm-video-with-context-renderer",
    "ytm-continuation-item-renderer",
    "grid-shelf-view-model",
  ].forEach((selector) => {
    homeContainer.querySelectorAll(selector).forEach((node) => {
      hideElement(node, "home-recommendations");
    });
  });
}

function restoreHomeRecommendations() {
  delete document.body.dataset.nytsHideHome;

  [
    "ytd-rich-grid-renderer",
    "ytd-rich-section-renderer",
    "ytd-rich-grid-slim-media",
    "ytd-rich-item-renderer",
    "ytd-rich-grid-renderer #contents",
    "ytd-ghost-grid-renderer",
    "ytd-continuation-item-renderer",
    // Mobile structures
    "ytm-rich-grid-renderer",
    "ytm-single-column-browse-results-renderer",
    "ytm-single-column-browse-results-renderer.modern-tabs",
    "ytm-rich-item-renderer",
    "ytm-rich-section-renderer",
    "ytm-rich-grid-renderer.rich-grid-single-column",
    "ytm-browse",
    "ytm-video-with-context-renderer",
    "ytm-continuation-item-renderer",
    "grid-shelf-view-model",
  ].forEach((selector) => restoreElements(selector, "home-recommendations"));
}

function isWatchPage() {
  // YouTube is an SPA and may keep old nodes around; rely on URL to avoid
  // mis-detecting other pages (Home/Subscriptions) as watch pages.
  return window.location.pathname === "/watch";
}

function hasPlaylistContext() {
  return new URL(window.location.href).searchParams.has("list");
}

function hideWatchRecommendations() {
  if (!isWatchPage()) {
    // The Home feed is managed by home-page logic; only clean up watch UI.
    restoreWatchRecommendations();
    return;
  }

  document.body.dataset.nytsHideWatch = "true";

  const selectors = [
    "ytd-watch-next-secondary-results-renderer",
    "#related",
    "ytd-compact-autoplay-renderer",
    // Mobile watch page
    "ytm-item-section-renderer[section-identifier='related-items']",
    "ytm-video-with-context-renderer.item.adaptive-feed-item",
    "ytm-related-chip-cloud-renderer",
  ];

  const protectedSidebarSelector = [
    "#chat",
    "ytd-live-chat-frame",
    "ytd-live-chat-renderer",
    "ytd-playlist-panel-renderer",
  ].join(", ");

  selectors.forEach((selector) => {
    document.querySelectorAll(selector).forEach((node) => {
      if (
        !node.matches(protectedSidebarSelector) &&
        !node.querySelector(protectedSidebarSelector)
      ) {
        hideElement(node, "watch-recommendations");
      }
    });
  });

  // Keep the layout clean: no sidebar placeholder box.
  removeWatchPlaceholder();

  const secondary =
    document.querySelector("ytd-watch-flexy #secondary") ||
    document.querySelector("ytd-watch-grid #secondary");

  const canDisplaySidebarContent = (node) => {
    if (!node) return false;

    let current = node;
    while (current && current !== secondary) {
      if (current.hasAttribute?.("hidden")) return false;
      if (current.getAttribute?.("aria-hidden") === "true") return false;
      if (current.style?.display === "none") return false;
      if (current.style?.visibility === "hidden") return false;
      current = current.parentElement;
    }

    return true;
  };

  const chatOrPlaylistNodes =
    secondary?.querySelectorAll(
      "#chat, ytd-live-chat-frame, ytd-live-chat-renderer, ytd-playlist-panel-renderer"
    ) || [];

  // A collapsed parent gives its children no client rects, so rendered
  // visibility cannot be used here: it creates a self-locking hidden sidebar.
  // The URL preserves playlist navigation while YouTube is still rendering it.
  const shouldPreserveSidebar =
    hasPlaylistContext() ||
    Array.from(chatOrPlaylistNodes).some(canDisplaySidebarContent);

  if (shouldPreserveSidebar) {
    delete document.body.dataset.nytsCollapseWatchSidebar;
  } else {
    document.body.dataset.nytsCollapseWatchSidebar = "true";
  }
}

function restoreWatchRecommendations() {
  delete document.body.dataset.nytsHideWatch;
  delete document.body.dataset.nytsCollapseWatchSidebar;

  [
    "ytd-watch-next-secondary-results-renderer",
    "#related",
    "ytd-compact-autoplay-renderer",
    // Mobile watch page
    "ytm-item-section-renderer[section-identifier='related-items']",
    "ytm-video-with-context-renderer.item.adaptive-feed-item",
    "ytm-related-chip-cloud-renderer",
  ].forEach((selector) => restoreElements(selector, "watch-recommendations"));

  removeWatchPlaceholder();
}

const MOBILE_COMMENT_MARKERS = [
  "ytm-comment-section-renderer",
  "ytm-comment-input-box-carousel-item-view-model",
  "yt-comment-input-box-carousel-item-view-model",
  "ytm-comments-entry-point-header-renderer",
  "ytm-comment-renderer",
  "ytm-comment-thread-renderer",
  "ytm-comment-replies-renderer",
  "comments-entry-point-teaser-view-model",
  "yt-comment-teaser-carousel-item-view-model",
  "ytm-comment-teaser-carousel-item-view-model",
  ".ytCommentsEntryPointTeaserViewModelTeaser",
];

const MOBILE_COMMENT_TITLES = new Set([
  "comments",
  "commentaires",
  "comentarios",
  "commenti",
  "kommentare",
]);

function hasMobileCommentMarker(node) {
  return MOBILE_COMMENT_MARKERS.some(
    (selector) => node.matches?.(selector) || node.querySelector(selector)
  );
}

function hasMobileCommentsTitle(node) {
  const title = (
    node.querySelector(".ytCarouselTitleViewModelTitle")?.textContent || ""
  )
    .trim()
    .toLowerCase();

  return MOBILE_COMMENT_TITLES.has(title);
}

function isMobileCommentsContainer(node) {
  const sectionIdentifier = (node.getAttribute("section-identifier") || "")
    .trim()
    .toLowerCase();

  if (sectionIdentifier === "comments") {
    return true;
  }

  return hasMobileCommentMarker(node) || hasMobileCommentsTitle(node);
}

function hideMobileCommentsSection() {
  document
    .querySelectorAll(
      "ytm-item-section-renderer.scwnr-content, ytm-item-section-renderer[section-identifier='comments']"
    )
    .forEach((section) => {
      if (isMobileCommentsContainer(section)) {
        hideElement(section, "comments");
      }
    });

  document
    .querySelectorAll(
      [
        "ytm-comment-section-renderer",
        "ytm-comment-input-box-carousel-item-view-model",
        "yt-comment-input-box-carousel-item-view-model",
        "ytm-video-metadata-carousel-view-model",
        "yt-video-metadata-carousel-view-model",
      ].join(", ")
    )
    .forEach((node) => {
      if (!isMobileCommentsContainer(node)) {
        return;
      }

      const mobileSection = node.closest(
        "ytm-item-section-renderer.scwnr-content, ytm-item-section-renderer[section-identifier='comments']"
      );

      hideElement(mobileSection || node, "comments");
    });
}

function hideCommentsSection() {
  document.body.dataset.nytsHideComments = "true";

  const selectors = [
    "ytd-comments",
    "#comments",
    "ytd-item-section-renderer#sections",
    "ytm-comment-section-renderer",
    "ytd-continuation-item-renderer #ghost-comment-section",
    // Mobile watch comments
    "ytm-comment-input-box-carousel-item-view-model",
    "yt-comment-input-box-carousel-item-view-model",
    "ytm-item-section-renderer[section-identifier='comments']",
  ];

  selectors.forEach((selector) => {
    document.querySelectorAll(selector).forEach((node) => {
      hideElement(node, "comments");
    });
  });

  hideMobileCommentsSection();
}

function restoreComments() {
  delete document.body.dataset.nytsHideComments;
  restoreElementsByReason("comments");
}

function debounce(func, wait) {
  let timeout;
  return function (...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

function getCurrentUrl() {
  return window.location.href;
}

function handleNavigation(force = false) {
  const currentUrl = getCurrentUrl();
  const lastUrl = window[NYTS_LAST_URL];
  if (!force && lastUrl === currentUrl) return;

  window[NYTS_LAST_URL] = currentUrl;
  processPageDebounced();
}

function installNavigationHooks() {
  if (window[NYTS_NAV_HOOK_INSTALLED]) return;
  window[NYTS_NAV_HOOK_INSTALLED] = true;

  const wrapHistoryMethod = (methodName) => {
    const original = history[methodName];
    if (typeof original !== "function") return;

    history[methodName] = function (...args) {
      const result = original.apply(this, args);
      queueMicrotask(() => handleNavigation());
      return result;
    };
  };

  wrapHistoryMethod("pushState");
  wrapHistoryMethod("replaceState");

  window.addEventListener("popstate", () => handleNavigation(true));

  // YouTube (desktop) fires custom navigation events on SPA route changes.
  window.addEventListener("yt-navigate-finish", () => handleNavigation(true));
  window.addEventListener("yt-page-data-updated", () => handleNavigation(true));
  document.addEventListener("yt-navigate-finish", () => handleNavigation(true));
  document.addEventListener("yt-page-data-updated", () =>
    handleNavigation(true)
  );
}

// A deliberately opened shared Short can play in the regular video player,
// without entering YouTube's swipeable Shorts feed. replace() avoids adding a
// Shorts page to history that would trap Back in another redirect.
function regularWatchUrlForShorts(href) {
  try {
    const url = new URL(href);
    const match = url.pathname.match(/^\/shorts\/([A-Za-z0-9_-]{11})\/?$/);
    if (!match || !/(^|\.)youtube\.com$/i.test(url.hostname)) return null;
    const target = new URL("/watch", url.origin);
    target.searchParams.set("v", match[1]);
    for (const key of ["t", "start", "end"]) {
      if (url.searchParams.has(key)) target.searchParams.set(key, url.searchParams.get(key));
    }
    return target.href;
  } catch (_err) {
    return null;
  }
}

let redirectingShortsUrl = null;

function navigateToRegularPlayer(url) {
  window.location.replace(url);
}

function redirectShortsToRegularPlayer() {
  const target = currentSettings.hideShorts && regularWatchUrlForShorts(window.location.href);
  if (!target) {
    redirectingShortsUrl = null;
    return false;
  }
  if (redirectingShortsUrl !== window.location.href) {
    redirectingShortsUrl = window.location.href;
    try {
      navigateToRegularPlayer(target);
    } catch (_err) {
      redirectingShortsUrl = null;
      return false;
    }
  }
  return true;
}

function updateCommunityPostFilter() {
  document.querySelectorAll("[data-nyts-community-post]").forEach(card => {
    delete card.dataset.nytsCommunityPost;
  });
  if (!currentSettings.hideCommunityPosts || !isHomePage()) {
    delete document.body.dataset.nytsHideCommunityPosts;
    return;
  }
  document.body.dataset.nytsHideCommunityPosts = "true";
  document.querySelectorAll([
    "ytd-post-renderer", "ytd-backstage-post-renderer", "ytd-backstage-post-thread-renderer",
    "ytm-post-renderer", "ytm-backstage-post-renderer", "ytm-backstage-post-thread-renderer",
    "yt-post-view-model",
  ].join(",")).forEach((post) => {
    const card = post.closest("ytd-rich-item-renderer, ytm-rich-item-renderer") || post;
    card.dataset.nytsCommunityPost = "true";
  });
}

function processPage() {
  // Inline hiding cannot be undone by removing CSS, so honor the saved choice
  // before processing the initial page or any early navigation/mutation events.
  if (!document.body || !settingsLoaded) return;

  injectSettingsStyles();
  if (redirectShortsToRegularPlayer()) return;
  updateCommunityPostFilter();

  if (currentSettings.hideShorts) {
    injectCriticalStyles();
    hideYouTubeShortsElements();
    removeShortsHeader();
    countHiddenShortsItems();
  } else {
    removeCriticalStyles();
  }

  if (currentSettings.hideHomeFeed) {
    if (isHomePage()) {
      hideHomeRecommendations();
    } else {
      restoreHomeRecommendations();
    }
  } else {
    restoreHomeRecommendations();
  }

  if (currentSettings.hideWatchRecommendations) {
    hideWatchRecommendations();
  } else {
    restoreWatchRecommendations();
  }

  if (currentSettings.hideComments) {
    hideCommentsSection();
  } else {
    restoreComments();
  }
}

const processPageDebounced = debounce(processPage, 150);
const flushHiddenShortsCountDebounced = debounce(
  flushHiddenShortsCount,
  STATS_FLUSH_DELAY_MS
);

installNavigationHooks();

const observer = new MutationObserver((mutations) => {
  for (let mutation of mutations) {
    if (mutation.addedNodes.length) {
      processPageDebounced();
      break; // No need to continue looping if we already found a mutation
    }
  }
});

injectSettingsStyles();

whenBodyReady(() => {
  handleNavigation(true);
  processPage();
  observer.observe(document.body, {
    childList: true,
    subtree: true,
  });
});

// Initial execution to handle already loaded elements
getStoredSettings().then((settings) => {
  currentSettings = { ...settings };
  settingsLoaded = true;
  processPage();
});

registerSettingsListener();
reportYouTubeVisit();
window.addEventListener("pagehide", flushHiddenShortsCount);
