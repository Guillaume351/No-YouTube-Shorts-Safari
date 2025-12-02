const extensionAPI = typeof browser !== "undefined" ? browser : chrome;
const DEFAULT_SETTINGS = {
  hideShorts: true,
  hideRecommendations: false,
  hideComments: false,
};
let currentSettings = { ...DEFAULT_SETTINGS };

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
        changes.hideRecommendations.newValue ?? DEFAULT_SETTINGS.hideRecommendations;
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
  document.querySelectorAll(`${selector}[data-nyts-hidden="${reason}"]`).forEach((el) => {
    el.style.display = "";
    delete el.dataset.nytsHidden;
  });
}

function injectHomePlaceholder() {
  const container =
    document.querySelector("ytd-two-column-browse-results-renderer #primary") ||
    document.querySelector("ytd-browse");

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
  placeholder.style.color = "#606060";
  placeholder.style.fontFamily = "Arial, sans-serif";
  placeholder.style.textAlign = "center";

  placeholder.innerHTML = `
    <svg width="72" height="72" viewBox="0 0 72 72" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <rect x="6" y="14" width="60" height="44" rx="8" stroke="#1976d2" stroke-width="4" fill="rgba(25,118,210,0.04)"/>
      <path d="M30 28L46 36L30 44V28Z" fill="#1976d2"/>
      <path d="M12 20L60 20" stroke="#1976d2" stroke-width="3" stroke-linecap="round"/>
    </svg>
    <div style="max-width: 520px;">
      <div style="font-weight: 600; font-size: 18px; color: #202020;">Recommandations masquées</div>
      <div style="margin-top: 6px; font-size: 14px; line-height: 1.5;">
        Cette page est épurée par No YouTube Shorts. Désactivez “Hide recommendations” dans l’extension pour les revoir.
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

function removeShortsMenuItem() {
  document.querySelectorAll("ytd-guide-entry-renderer").forEach((entry) => {
    const link = entry.querySelector("a.yt-simple-endpoint");
    if (!link) {
      return;
    }

    const href = link.getAttribute("href") || "";
    const linkTitle = (link.getAttribute("title") || "").trim().toLowerCase();
    const labelText =
      (entry.querySelector(".title")?.textContent || "").trim().toLowerCase();

    const isShorts =
      href.includes("/shorts") || linkTitle === "shorts" || labelText === "shorts";

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
      'ytd-thumbnail-overlay-time-status-renderer[overlay-style="SHORTS"]',
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
      "ytm-video-with-context-renderer:not([data-processed-mobile-search])",
    )
    .forEach((item) => {
      const isShortByBadge = item.querySelector(
        'ytm-thumbnail-overlay-time-status-renderer[data-style="SHORTS"]',
      );
      const isShortByClass = item.querySelector(
        "ytm-media-item.big-shorts-singleton",
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
    const ariaLabel = (chip.getAttribute("aria-label") || "").trim().toLowerCase();

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
      "ytm-pivot-bar-item-renderer:not([data-processed-menu-item])",
    )
    .forEach((item) => {
      const titleElement = item.querySelector(
        ".pivot-bar-item-title.pivot-shorts",
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
      "ytm-reel-shelf-renderer:not([data-processed-reel-shelf])",
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
      "ytm-rich-section-renderer:not([data-processed-rich-section])",
    )
    .forEach((section) => {
      const shortsHeader = section.querySelector(
        'yt-shelf-header-layout .shelf-header-layout-wiz__title [role="text"]',
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
        'span.yt-core-attributed-string[role="text"]',
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
      "yt-section-header-view-model:not([data-processed-section-header])",
    )
    .forEach((header) => {
      const shortsTitle = header.querySelector(
        'yt-shelf-header-layout .shelf-header-layout-wiz__title [role="text"]',
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
      "ytm-shorts-lockup-view-model:not([data-processed-lockup])",
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
    const labelText =
      (entry.querySelector(".title")?.textContent || "").trim().toLowerCase();

    if (href.includes("/shorts") || linkTitle === "shorts" || labelText === "shorts") {
      entry.remove();
      console.log("Removed Shorts from sidebar");
    }
  });

  // Hide Shorts videos in the feed
  document
    .querySelectorAll(
      "ytd-rich-grid-slim-media[is-short]:not([data-processed])",
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
    "rich-shelf-header-container",
  );
  if (shortsHeaderContainer) {
    shortsHeaderContainer.parentElement.remove();
    console.log("Removed Shorts header container");
  }
}

function isHomePage() {
  const browseHome = document.querySelector('ytd-browse[page-subtype="home"]');
  return (
    browseHome ||
    window.location.pathname === "/" ||
    window.location.pathname === "" ||
    window.location.pathname === "/feed"
  );
}

function hideHomeRecommendations() {
  if (!isHomePage()) {
    return;
  }

  const homeContainer = document.querySelector("ytd-browse") || document;

  [
    "ytd-rich-grid-renderer",
    "ytd-rich-section-renderer",
    "ytd-rich-grid-slim-media",
    "ytd-rich-item-renderer",
    "ytd-rich-grid-renderer #contents",
    "ytd-two-column-browse-results-renderer #primary",
    "ytd-ghost-grid-renderer",
    "ytd-continuation-item-renderer",
  ].forEach((selector) => {
    homeContainer.querySelectorAll(selector).forEach((node) => {
      hideElement(node, "home-recommendations");
    });
  });

  injectHomePlaceholder();
}

function restoreHomeRecommendations() {
  [
    "ytd-rich-grid-renderer",
    "ytd-rich-section-renderer",
    "ytd-rich-grid-slim-media",
    "ytd-rich-item-renderer",
    "ytd-rich-grid-renderer #contents",
    "ytd-two-column-browse-results-renderer #primary",
    "ytd-ghost-grid-renderer",
    "ytd-continuation-item-renderer",
  ].forEach((selector) => restoreElements(selector, "home-recommendations"));

  removeHomePlaceholder();
}

function isWatchPage() {
  return (
    window.location.pathname === "/watch" ||
    document.querySelector("ytd-watch-flexy") ||
    document.querySelector("ytd-watch-grid")
  );
}

function hideWatchRecommendations() {
  if (!isWatchPage()) {
    return;
  }

  const selectors = [
    "#secondary",
    "ytd-watch-next-secondary-results-renderer",
    "#related",
    "ytd-compact-autoplay-renderer",
  ];

  selectors.forEach((selector) => {
    document.querySelectorAll(selector).forEach((node) => {
      hideElement(node, "watch-recommendations");
    });
  });
}

function restoreWatchRecommendations() {
  ["#secondary", "ytd-watch-next-secondary-results-renderer", "#related", "ytd-compact-autoplay-renderer"].forEach(
    (selector) => restoreElements(selector, "watch-recommendations"),
  );
}

function hideCommentsSection() {
  const selectors = [
    "ytd-comments",
    "#comments",
    "ytd-item-section-renderer#sections",
    "ytm-comment-section-renderer",
    "ytd-continuation-item-renderer #ghost-comment-section",
  ];

  selectors.forEach((selector) => {
    document.querySelectorAll(selector).forEach((node) => {
      hideElement(node, "comments");
    });
  });
}

function restoreComments() {
  ["ytd-comments", "#comments", "ytd-item-section-renderer#sections", "ytm-comment-section-renderer"].forEach(
    (selector) => restoreElements(selector, "comments"),
  );
}

function debounce(func, wait) {
  let timeout;
  return function (...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

function processPage() {
  hideYouTubeShortsElements();
  if (currentSettings.hideShorts) {
    removeShortsHeader();
  }

  if (currentSettings.hideRecommendations) {
    hideHomeRecommendations();
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

const observer = new MutationObserver((mutations) => {
  for (let mutation of mutations) {
    if (mutation.addedNodes.length) {
      processPageDebounced();
      break; // No need to continue looping if we already found a mutation
    }
  }
});

observer.observe(document.body, {
  childList: true,
  subtree: true,
});

// Initial execution to handle already loaded elements
getStoredSettings().then((settings) => {
  currentSettings = { ...DEFAULT_SETTINGS, ...settings };
  processPage();
});

registerSettingsListener();
