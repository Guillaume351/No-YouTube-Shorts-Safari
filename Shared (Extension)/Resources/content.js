const extensionAPI = typeof browser !== "undefined" ? browser : chrome;
const DEFAULT_SETTINGS = {
  hideShorts: true,
  hideRecommendations: false,
  hideComments: false,
};
let currentSettings = { ...DEFAULT_SETTINGS };

const CRITICAL_HIDE_STYLE_ID = "nyts-critical-hide-style";
const NYTS_NAV_HOOK_INSTALLED = "__nytsNavHookInstalled";
const NYTS_LAST_URL = "__nytsLastUrl";

function getStorageArea() {
  return extensionAPI?.storage?.sync || extensionAPI?.storage?.local || null;
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

function registerSettingsListener() {
  if (!extensionAPI?.storage?.onChanged?.addListener) {
    return;
  }

  extensionAPI.storage.onChanged.addListener((changes, area) => {
    if (area && area !== "sync" && area !== "local") return;

    let shouldReprocess = false;

    if (Object.prototype.hasOwnProperty.call(changes, "hideShorts")) {
      currentSettings.hideShorts =
        changes.hideShorts.newValue ?? DEFAULT_SETTINGS.hideShorts;
      shouldReprocess = true;
    }

    if (Object.prototype.hasOwnProperty.call(changes, "hideRecommendations")) {
      currentSettings.hideRecommendations =
        changes.hideRecommendations.newValue ??
        DEFAULT_SETTINGS.hideRecommendations;
      shouldReprocess = true;
    }

    if (Object.prototype.hasOwnProperty.call(changes, "hideComments")) {
      currentSettings.hideComments =
        changes.hideComments.newValue ?? DEFAULT_SETTINGS.hideComments;
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

function injectHomePlaceholder() {
  const palette = getPlaceholderPalette();
  const container =
    document.querySelector("ytd-two-column-browse-results-renderer #primary") ||
    document.querySelector("ytd-browse") ||
    document.querySelector("ytm-browse") ||
    document.querySelector("ytm-rich-grid-renderer");

  if (!container || container.querySelector("#nyts-placeholder")) {
    return;
  }

  const placeholder = document.createElement("div");
  placeholder.id = "nyts-placeholder";
  placeholder.style.display = "flex";
  placeholder.style.flexDirection = "column";
  placeholder.style.alignItems = "center";
  placeholder.style.justifyContent = "center";
  placeholder.style.padding = "48px 16px";
  placeholder.style.gap = "12px";
  placeholder.style.color = palette.text;
  placeholder.style.fontFamily = "Arial, sans-serif";
  placeholder.style.textAlign = "center";

  placeholder.innerHTML = `
    <svg width="72" height="72" viewBox="0 0 72 72" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <rect x="6" y="14" width="60" height="44" rx="8" stroke="${palette.accent}" stroke-width="4" fill="${palette.accentFill}"/>
      <path d="M30 28L46 36L30 44V28Z" fill="${palette.accent}"/>
      <path d="M12 20L60 20" stroke="${palette.accent}" stroke-width="3" stroke-linecap="round"/>
    </svg>
    <div style="max-width: 520px;">
      <div style="font-weight: 700; font-size: 18px; color: ${palette.heading};">Clean feed</div>
      <div style="margin-top: 6px; font-size: 14px; line-height: 1.5; color: ${palette.text};">
        No Shorts: Blocker for YouTube.
      </div>
    </div>
  `;

  container.prepend(placeholder);
}

function removeHomePlaceholder() {
  const placeholder = document.getElementById("nyts-placeholder");
  if (placeholder) {
    placeholder.remove();
  }
}

function getPlaceholderPalette() {
  const isDark =
    window.matchMedia &&
    window.matchMedia("(prefers-color-scheme: dark)").matches;

  return isDark
    ? {
        text: "#f0f0f0",
        heading: "#ffffff",
        accent: "#ff6b6b",
        accentFill: "rgba(255,107,107,0.08)",
        surface: "#181a1f",
        border: "#2a2c31",
      }
    : {
        text: "#1f1f1f",
        heading: "#0f0f0f",
        accent: "#d62828",
        accentFill: "rgba(214,40,40,0.05)",
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

function removeMobileShortsMenuItem() {
  document
    .querySelectorAll(
      "ytm-pivot-bar-item-renderer:not([data-processed-menu-item])"
    )
    .forEach((item) => {
      const titleElement = item.querySelector(
        ".pivot-bar-item-title.pivot-shorts"
      );
      if (titleElement && titleElement.textContent.trim() === "Shorts") {
        item.style.display = "none";
        item.setAttribute("data-processed-menu-item", "true");
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
  document
    .querySelectorAll("grid-shelf-view-model:not([data-processed-grid-shelf])")
    .forEach((shelf) => {
      const shortsHeader = shelf.querySelector(
        'span.yt-core-attributed-string[role="text"]'
      );
      if (shortsHeader && shortsHeader.textContent.trim() === "Shorts") {
        const headerContainer = shortsHeader.closest("yt-shelf-header-layout");
        if (headerContainer) {
          shelf.style.display = "none";
          shelf.setAttribute("data-processed-grid-shelf", "true");
          console.log("Hid grid shelf with Shorts");
        }
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
  // Hide individual ytm-shorts-lockup-view-model elements
  document
    .querySelectorAll(
      "ytm-shorts-lockup-view-model:not([data-processed-lockup])"
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
    window.location.pathname === "/feed"
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

  injectHomePlaceholder();
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

  removeHomePlaceholder();
}

function isWatchPage() {
  // YouTube is an SPA and may keep old nodes around; rely on URL to avoid
  // mis-detecting other pages (Home/Subscriptions) as watch pages.
  return window.location.pathname === "/watch";
}

function hideWatchRecommendations() {
  if (!isWatchPage()) {
    // Home placeholder is managed by home-page logic; only clean up watch UI.
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

  selectors.forEach((selector) => {
    document.querySelectorAll(selector).forEach((node) => {
      hideElement(node, "watch-recommendations");
    });
  });

  // Keep the layout clean: no sidebar placeholder box.
  removeWatchPlaceholder();

  const secondary =
    document.querySelector("ytd-watch-flexy #secondary") ||
    document.querySelector("ytd-watch-grid #secondary");

  const isElementVisible = (node) => {
    if (!node) return false;
    if (node.hasAttribute?.("hidden")) return false;
    const rects = node.getClientRects?.();
    if (!rects || rects.length === 0) return false;
    const style = window.getComputedStyle?.(node);
    if (!style) return true;
    return style.display !== "none" && style.visibility !== "hidden";
  };

  const chatOrPlaylistNodes =
    secondary?.querySelectorAll(
      "#chat, ytd-live-chat-frame, ytd-live-chat-renderer, ytd-playlist-panel-renderer"
    ) || [];

  const hasVisibleChatOrPlaylist =
    Array.from(chatOrPlaylistNodes).some(isElementVisible);

  if (hasVisibleChatOrPlaylist) {
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

function hideCommentsSection() {
  const selectors = [
    "ytd-comments",
    "#comments",
    "ytd-item-section-renderer#sections",
    "ytm-comment-section-renderer",
    "ytd-continuation-item-renderer #ghost-comment-section",
    // Mobile watch comments
    "ytm-video-metadata-carousel-view-model",
    "ytm-comment-input-box-carousel-item-view-model",
    "ytm-item-section-renderer.scwnr-content",
    "ytm-item-section-renderer[section-identifier='comments']",
  ];

  selectors.forEach((selector) => {
    document.querySelectorAll(selector).forEach((node) => {
      hideElement(node, "comments");
    });
  });
}

function restoreComments() {
  [
    "ytd-comments",
    "#comments",
    "ytd-item-section-renderer#sections",
    "ytm-comment-section-renderer",
    "ytm-video-metadata-carousel-view-model",
    "ytm-comment-input-box-carousel-item-view-model",
    "ytm-item-section-renderer.scwnr-content",
    "ytm-item-section-renderer[section-identifier='comments']",
  ].forEach((selector) => restoreElements(selector, "comments"));
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

function processPage() {
  if (!document.body) return;

  if (currentSettings.hideShorts) {
    injectCriticalStyles();
    hideYouTubeShortsElements();
    removeShortsHeader();
  } else {
    removeCriticalStyles();
  }

  if (currentSettings.hideRecommendations) {
    if (isHomePage()) {
      hideHomeRecommendations();
    } else {
      restoreHomeRecommendations();
      removeHomePlaceholder();
    }
    hideWatchRecommendations();
  } else {
    restoreHomeRecommendations();
    restoreWatchRecommendations();
  }

  if (currentSettings.hideComments) {
    hideCommentsSection();
  } else {
    restoreComments();
  }
}

const processPageDebounced = debounce(processPage, 150);

installNavigationHooks();

const observer = new MutationObserver((mutations) => {
  for (let mutation of mutations) {
    if (mutation.addedNodes.length) {
      processPageDebounced();
      break; // No need to continue looping if we already found a mutation
    }
  }
});

injectCriticalStyles();

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
  currentSettings = { ...DEFAULT_SETTINGS, ...settings };
  processPage();
});

registerSettingsListener();
