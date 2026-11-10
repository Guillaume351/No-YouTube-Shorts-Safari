# No YouTube Shorts - Safari Extension


**Watch the YouTube videos you choose, without Shorts — in Safari.**

[Download No Shorts on the App Store](https://apps.apple.com/app/apple-store/id6502996298?pt=118619543&ct=no-shorts-github-202609&mt=8) · **One purchase, no subscription** · iPhone, iPad, Mac and Apple Vision Pro

This extension filters **youtube.com in Safari**. It does not modify the official YouTube app or include YouTube Premium. After installation, enable the extension and allow access to youtube.com.

**En français :** masquez les Shorts dans Safari, tout en gardant les vidéos choisies. Achat unique, sans abonnement. L’extension ne modifie pas l’app YouTube.

## Overview

**No YouTube Shorts** is a Safari extension that hides YouTube Shorts from appearing on YouTube.com. This extension provides a cleaner browsing experience by removing the Shorts section from the homepage and other pages on YouTube.

**Now available for macOS, iOS, iPadOS, and visionOS!**

## Features

- Hides YouTube Shorts from the homepage.
- Removes Shorts from the sidebar and other sections.
- Hides entire Shorts search shelves, including headings and Show more controls, on desktop and mobile YouTube.
- Opens deliberately shared Shorts links in the regular video player, avoiding the swipeable Shorts feed when Hide Shorts is enabled.
- Optional toggle to hide community text/image posts from the Home feed.
- Optional local PIN for changing popup settings. The PIN is stored as a salted PBKDF2 hash and the popup locks again when closed. This adds friction; Safari can still disable or remove the extension. Keep the PIN safe.
- Optional toggle to leave the Home page blank without redirecting.
- Optional toggle to hide related recommendations while preserving playlists and live chat.
- Shows how many Shorts have been hidden on your device (counted locally, never sent anywhere).
- On iPhone and iPad, the app confirms when the extension is active on YouTube.
- Lightweight extension with local filtering.
- Works seamlessly across Mac, iPhone, iPad, and Apple Vision devices.

## Installation Options

### App Store

Support the development by getting the extension from the App Store for macOS, iOS, iPadOS, and visionOS:

[![Download on the App Store](https://developer.apple.com/assets/elements/badges/download-on-the-app-store.svg)](https://apps.apple.com/app/apple-store/id6502996298?pt=118619543&ct=no-shorts-github-202609&mt=8)

### Build it yourself

You can also build and run the project for free using Xcode:

1. Clone this repository
2. Open the project in Xcode 26 or newer (Icon Composer icons). The current release is built with Xcode 27; deployment targets are iOS/iPadOS 15 and macOS 12.
3. Build and run the extension on macOS, iOS, iPadOS, or visionOS

## App icons

`Shared (App)/AppIcon.icon` is the primary Icon Composer icon for iOS and macOS.
`Shared (App)/AppIconTeal.icon` is included only in the iOS app as the alternate
icon `AppIconTeal` for App Store Product Page Optimization. Xcode generates the
older-system icon images at build time. The previous catalog is preserved in
`design/legacy-icon/`; monochrome Safari toolbar icons are maintained separately.
See [the icon A/B test instructions](design/app-store/ICON_AB_TEST.md).

## Usage

After enabling the extension and granting website access on each device, open YouTube in Safari. Use the extension menu to choose your filters, then reload the page.

To enable the extension:

- **On iOS/iPadOS/visionOS:** Find Safari in Settings (under Apps on recent OS versions), open Extensions and enable "No Shorts: Blocker for YouTube". Allow access to youtube.com.
- **On macOS:** Open Safari → Settings (or Preferences) → Extensions and enable "No Shorts: Blocker for YouTube".

## Use Instagram or X in Safari too?

[Explore the three-extension bundle](https://apps.apple.com/app-bundle/id1878643524): No Shorts for YouTube, No Reel For Instagram and No Algorithm For X. Check each app’s device compatibility and your price on the App Store. BrowseKind Plus is a separate product, not included in this bundle.

## Contributing

Contributions are welcome! If you have suggestions for improvements or find any issues, please open an issue or submit a pull request.

## Contact

For any questions or support, please open an issue on the [GitHub repository](https://github.com/Guillaume351/No-YouTube-Shorts-Safari/issues).

## License

This project is licensed under the PolyForm Noncommercial License 1.0.0 (non-commercial use only). See `LICENSE`.

In particular, redistributing/publishing this app (or a substantially similar fork) on the Apple App Store (or any other app marketplace) is not permitted.

The name and branding are also protected—see `TRADEMARKS.md`.
