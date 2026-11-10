# App Store screenshot handoff

Figma master: [No Shorts — App Store Screenshot Kit](https://www.figma.com/design/6ffFZ7jvY5vP03aP6gb1X2)

## Source captures to provide

Capture Safari and YouTube in English, with the same window size, zoom, theme,
account, and scroll position for every before/after pair.

1. YouTube Home with Shorts visible.
2. The same Home view after Shorts are removed.
3. A video page with recommendations and comments visible.
4. The same video page after recommendations and comments are removed.
5. The Safari extension popup with all four controls visible.
6. The Safari extension activation state, if it remains legible.

Avoid personal avatars, account names, notifications, bookmarks, debug UI,
cursor highlights, and red annotations.

## iPad master

Export each frame at **2048 x 2732 px**, portrait, PNG, 1x, sRGB, with an opaque
background.

| Frame | Capture slot | Title | Subtitle |
| --- | --- | --- | --- |
| iPad 01 — Before After | `SCREENSHOT_BEFORE`, `SCREENSHOT_AFTER` | Block YouTube Shorts in Safari | See your feed before and after. |
| iPad 02 — Single Capture | `SCREENSHOT_CLEAN` | Shorts disappear everywhere | Home, search, sidebars, and tabs stay clean. |
| iPad 03 — One Time Purchase | `SCREENSHOT_POPUP` or clean result | Pay once. No subscription. | One purchase. No account required. |
| iPad 04 — Four Controls | `SCREENSHOT_POPUP` | Choose what stays | Hide Home, recommendations, comments, and Shorts. |
| iPad 05 — Enable Once | activation or clean Safari result | Enable once. Browse normally. | A native Safari extension that works in the background. |
| iPad 06 — Focus Proof | `SCREENSHOT_CLEAN` | Stay focused on what matters | Keep long-form videos without the Shorts loop. |

## Mac master

Export each frame at **2880 x 1800 px**, PNG, 1x, sRGB, with an opaque
background. Use a clean Safari window, not a MacBook mockup.

| Frame | Capture slot | Title | Subtitle |
| --- | --- | --- | --- |
| Mac 01 — Before After | `SCREENSHOT_BEFORE`, `SCREENSHOT_AFTER` | Block YouTube Shorts in Safari | See the same page before and after. |
| Mac 02 — Single Window | `SCREENSHOT_CLEAN` | A cleaner YouTube, everywhere | Home, search, and video pages stay focused. |
| Mac 03 — Clean Video Page | cleaned video page | Hide recommendations and comments | Keep the video, remove the noise around it. |
| Mac 04 — Four Controls | `SCREENSHOT_POPUP` | Choose what stays | Control Shorts, Home, recommendations, and comments. |
| Mac 05 — One Time Purchase | `SCREENSHOT_POPUP` or clean result | Pay once. No subscription. | One purchase across your Apple devices. |

## Localization workflow

Keep the English frames as masters. Duplicate the six iPad and five Mac frames
for each locale, then edit only the `TITLE` and `SUBTITLE` text layers. Never
flatten localized text into the screenshot.

- Keep titles to two lines and subtitles to two lines.
- Check every language at 25% zoom before export.
- Allow roughly 40% text expansion for German, French, Spanish, and Italian.
- Use Inter when the script is supported; otherwise use Noto Sans Arabic,
  Noto Sans SC/TC, or Noto Sans KR.
- Hide every `HIDE AFTER DROP` helper before export.

## Icon decision

Keep the current icon for this release. A later micro-evolution can enlarge the
central symbol by about 6%, enlarge the sparkle by about 15%, and reduce the
inset card effect. Treat the Safari toolbar glyph separately: it should be a
true monochrome circle/play mark without the app background, shadow, or sparkle.
