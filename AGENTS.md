# Repository Guidelines

## Project Structure

- `No Youtube Shorts.xcodeproj`: Xcode project (multi‑platform Safari Web Extension + container apps).
- `Shared (Extension)/`: native extension entry point (`SafariWebExtensionHandler.swift`) and web extension assets.
  - `Shared (Extension)/Resources/`: `manifest.json`, `content.js`, `background.js`, `popup.html|css|js`, images.
- `Shared (App)/`: shared UI used by the container apps (`ViewController.swift`) plus `Base.lproj/Main.html` and assets.
- Platform folders: `iOS (App)/`, `iOS (Extension)/`, `macOS (App)/`, `macOS (Extension)/` contain platform-specific plists and glue code.
- No dedicated automated test target/folder is currently present.

## Build, Run, and Local Development

- Xcode (recommended): open `No Youtube Shorts.xcodeproj`, pick a scheme, then **Run**.
  - Schemes: `No Youtube Shorts (iOS)` and `No Youtube Shorts (macOS)`.
- CLI build (optional):
  - `xcodebuild -project "No Youtube Shorts.xcodeproj" -scheme "No Youtube Shorts (macOS)" build`
  - `xcodebuild -project "No Youtube Shorts.xcodeproj" -scheme "No Youtube Shorts (iOS)" -destination "generic/platform=iOS" build`

## Coding Style & Naming

- Swift: follow existing 2‑space indentation and Apple naming conventions (types `UpperCamelCase`, vars/functions `lowerCamelCase`).
- Web extension assets: keep 2‑space indentation and the current file naming (`content.js`, `popup.css`, etc.).
- Avoid committing OS artifacts (e.g., `.DS_Store`).

## Testing Guidelines

- Primary validation is manual:
  - Verify `content.js` behavior on `youtube.com` and `m.youtube.com`.
  - Smoke test the popup UI (`Shared (Extension)/Resources/popup.*`) and confirm settings persist via `storage`.
  - On macOS, confirm the container app can open Safari extension preferences.

## Commit & Pull Request Guidelines

- Commit messages generally follow Conventional Commits: `feat: …`, `fix: …`, `refactor: …`, `docs: …`, `chore: …`.
- PRs should include:
  - Clear description of user-visible behavior changes and rationale.
  - Manual test notes (platform(s), Safari version if relevant) and screenshots for popup/UI changes.
  - Updates to `README.md` when installation/build steps or features change.

## Security, Configuration, and Legal Notes

- Keep `Shared (Extension)/Resources/manifest.json` permissions minimal (currently only `storage`).
- Bundle identifiers are referenced in code (`Shared (App)/ViewController.swift`); coordinate any changes with project settings.
- License/trademark terms apply; see `LICENSE` and `TRADEMARKS.md` before redistributing.
