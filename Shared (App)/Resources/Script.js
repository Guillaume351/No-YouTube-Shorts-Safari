function show(platform, enabled, useSettingsInsteadOfPreferences) {
  document.body.classList.add(`platform-${platform}`);

  if (useSettingsInsteadOfPreferences) {
    document.getElementsByClassName("platform-mac state-on")[0].innerText =
      "No Youtube Shorts's extension is currently on. You can turn it off in the Extensions section of Safari Settings.";
    document.getElementsByClassName("platform-mac state-off")[0].innerText =
      "No Youtube Shorts's extension is currently off. You can turn it on in the Extensions section of Safari Settings.";
    document.getElementsByClassName("platform-mac state-unknown")[0].innerText =
      "You can turn on No Youtube Shorts's extension in the Extensions section of Safari Settings.";
    document.getElementById("open-mac-preferences").innerText =
      "Quit and Open Safari Settings…";
  }

  if (typeof enabled === "boolean") {
    document.body.classList.toggle(`state-on`, enabled);
    document.body.classList.toggle(`state-off`, !enabled);
  } else {
    document.body.classList.remove(`state-on`);
    document.body.classList.remove(`state-off`);
  }
}

const macButton = document.getElementById("open-mac-preferences");
if (macButton) {
  macButton.addEventListener("click", () => {
    webkit.messageHandlers.controller.postMessage("open-preferences");
  });
}

const iosButton = document.getElementById("open-ios-settings");
if (iosButton) {
  iosButton.addEventListener("click", () => {
    webkit.messageHandlers.controller.postMessage("open-ios-settings");
  });
}
