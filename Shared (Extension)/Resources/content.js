function removeShortsMenuItem() {
  const shortsMenuItem = document.querySelector('a[title="Shorts"]');
  if (shortsMenuItem) {
    const grandParent = shortsMenuItem.closest("ytd-guide-entry-renderer");
    if (grandParent) {
      grandParent.remove();
      console.log("Removed Shorts menu item");
    }
  }
}

function removeShortsMiniMenuItem() {
  const shortsMiniMenuItem = document.querySelector(
    'ytd-mini-guide-entry-renderer[aria-label="Shorts"]'
  );
  if (shortsMiniMenuItem) {
    shortsMiniMenuItem.remove();
    console.log("Removed Shorts mini menu item");
  }
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

function removeShortsSearchFilter() {
  document.querySelectorAll("yt-chip-cloud-chip-renderer").forEach((chip) => {
    const textElement = chip.querySelector("#text");
    if (textElement && textElement.title === "Shorts") {
      chip.remove();
      console.log("Removed Shorts search filter");
    }
  });
}

function removeMobileShortsMenuItem() {
  document.querySelectorAll("ytm-pivot-bar-item-renderer").forEach((item) => {
    const titleElement = item.querySelector(
      ".pivot-bar-item-title.pivot-shorts"
    );
    if (titleElement && titleElement.textContent.trim() === "Shorts") {
      item.remove();
      console.log("Removed Shorts menu item from mobile");
    }
  });
}

function removeMobileReelShelf() {
  document.querySelectorAll("ytm-reel-shelf-renderer").forEach((item) => {
    item.remove();
    console.log("Removed Shorts reel shelf from mobile");
  });
}

function removeMobileRichSectionShorts() {
  // Remove ytm-rich-section-renderer that contains Shorts
  document.querySelectorAll("ytm-rich-section-renderer").forEach((section) => {
    const shortsHeader = section.querySelector(
      'yt-shelf-header-layout .shelf-header-layout-wiz__title [role="text"]'
    );
    if (shortsHeader && shortsHeader.textContent.trim() === "Shorts") {
      section.remove();
      console.log("Removed mobile rich section Shorts");
    }
  });
}

function removeMobileGridShelfShorts() {
  // Remove standalone grid-shelf-view-model sections with Shorts
  document.querySelectorAll("grid-shelf-view-model").forEach((shelf) => {
    const shortsHeader = shelf.querySelector(
      'yt-section-header-view-model yt-shelf-header-layout .shelf-header-layout-wiz__title [role="text"]'
    );
    if (shortsHeader && shortsHeader.textContent.trim() === "Shorts") {
      shelf.remove();
      console.log("Removed mobile grid shelf Shorts");
    }
  });
}

function removeMobileSectionHeaderShorts() {
  // Remove standalone yt-section-header-view-model with Shorts title
  document
    .querySelectorAll("yt-section-header-view-model")
    .forEach((header) => {
      const shortsTitle = header.querySelector(
        'yt-shelf-header-layout .shelf-header-layout-wiz__title [role="text"]'
      );
      if (shortsTitle && shortsTitle.textContent.trim() === "Shorts") {
        header.remove();
        console.log("Removed mobile section header Shorts");
      }
    });
}

function removeMobileShortsLockups() {
  // Remove individual ytm-shorts-lockup-view-model elements
  document
    .querySelectorAll("ytm-shorts-lockup-view-model")
    .forEach((lockup) => {
      lockup.remove();
      console.log("Removed mobile shorts lockup");
    });
}

function hideYouTubeShortsElements() {
  console.log("Hiding");

  // Hide the Shorts menu in the sidebar
  document
    .querySelectorAll("ytd-guide-renderer:not([data-processed])")
    .forEach((item) => {
      if (item.querySelector('a[title="Shorts"]')) {
        const grandParent = item.closest("ytd-guide-entry-renderer");
        if (grandParent) {
          grandParent.style.display = "none";
          grandParent.setAttribute("data-processed", "true");
          console.log("Removed Shorts from sidebar");
        }
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
  removeMobileGridShelfShorts();
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

function debounce(func, wait) {
  let timeout;
  return function (...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

const observer = new MutationObserver((mutations) => {
  for (let mutation of mutations) {
    if (mutation.addedNodes.length) {
      hideYouTubeShortsElements();
      removeShortsHeader();
      break; // No need to continue looping if we already found a mutation
    }
  }
});

observer.observe(document.body, {
  childList: true,
  subtree: true,
});

// Initial execution to handle already loaded elements
hideYouTubeShortsElements();
removeShortsHeader();
