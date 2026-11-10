#!/usr/bin/env bash

set -euo pipefail

DOWNLOADS="${HOME}/Downloads"
OUTPUT_ROOT="$(pwd)/design/app-store/exports-1.2.3/en-US"
MAC_OUTPUT="${OUTPUT_ROOT}/APP_DESKTOP"
IPAD_OUTPUT="${OUTPUT_ROOT}/APP_IPAD_PRO_3GEN_129"
WORK="${TMPDIR:-/tmp}/noshorts-app-store-1.2.3"

MAC_BEFORE_HOME="${DOWNLOADS}/Capture d’écran 2025-12-18 à 09.44.26.png"
MAC_AFTER_HOME="${DOWNLOADS}/Capture d’écran 2025-12-18 à 09.45.24.png"
MAC_BEFORE_VIDEO="${DOWNLOADS}/Capture d’écran 2025-12-18 à 09.46.17.png"
MAC_AFTER_VIDEO="${DOWNLOADS}/Capture d’écran 2025-12-18 à 09.46.52.png"
MAC_POPUP="${DOWNLOADS}/Capture d’écran 2025-12-18 à 09.56.14.png"
IPAD_BEFORE="${DOWNLOADS}/Simulator Screenshot - iPad Air 13-inch (M3) - 2025-06-11 at 10.17.45.png"

mkdir -p "${MAC_OUTPUT}" "${IPAD_OUTPUT}" "${WORK}"

rounded_crop() {
  local source="$1"
  local width="$2"
  local height="$3"
  local gravity="$4"
  local output="$5"
  local stem
  stem="$(basename "${output}" .png)"

  magick "${source}" -resize "${width}x${height}^" -gravity "${gravity}" \
    -extent "${width}x${height}" "${WORK}/${stem}-crop.png"
  magick -size "${width}x${height}" xc:none -fill white \
    -draw "roundrectangle 0,0,$((width - 1)),$((height - 1)),34,34" \
    "${WORK}/${stem}-mask.png"
  magick "${WORK}/${stem}-crop.png" "${WORK}/${stem}-mask.png" \
    -alpha off -compose CopyOpacity -composite "${output}"
}

mac_canvas() {
  local title="$1"
  local subtitle="$2"
  local output="$3"

  magick -size 2880x1800 gradient:'#090505-#3A0B08' \
    -gravity northwest \
    -font Avenir-Next-Bold -pointsize 124 -fill '#FFF8F5' \
    -annotate +160+118 "${title}" \
    -font Avenir-Next-Regular -pointsize 48 -fill '#D9C8C4' \
    -annotate +164+292 "${subtitle}" \
    "${output}"
}

place_mac_single() {
  local source="$1"
  local title="$2"
  local subtitle="$3"
  local output="$4"
  local name
  name="$(basename "${output}" .png)"

  mac_canvas "${title}" "${subtitle}" "${WORK}/${name}-canvas.png"
  rounded_crop "${source}" 2560 1120 north "${WORK}/${name}-shot.png"
  magick "${WORK}/${name}-canvas.png" \
    \( "${WORK}/${name}-shot.png" -background '#00000080' -shadow 55x18+0+24 \) \
    -geometry +160+450 -compose over -composite \
    "${WORK}/${name}-shot.png" -geometry +160+430 -compose over -composite \
    "${output}"
}

# Mac 01 — the highest-value before/after proof.
mac_canvas "Block YouTube Shorts in Safari" \
  "The same page, before and after." \
  "${WORK}/mac-01-canvas.png"
rounded_crop "${MAC_BEFORE_HOME}" 1228 1040 north "${WORK}/mac-01-before.png"
rounded_crop "${MAC_AFTER_HOME}" 1228 1040 north "${WORK}/mac-01-after.png"
magick "${WORK}/mac-01-canvas.png" \
  -font Avenir-Next-Demi-Bold -pointsize 34 -fill '#FF8B74' \
  -gravity northwest -annotate +174+410 'BEFORE' -annotate +1478+410 'AFTER' \
  \( "${WORK}/mac-01-before.png" -background '#00000080' -shadow 45x14+0+20 \) \
  -geometry +160+488 -compose over -composite \
  "${WORK}/mac-01-before.png" -geometry +160+470 -compose over -composite \
  \( "${WORK}/mac-01-after.png" -background '#00000080' -shadow 45x14+0+20 \) \
  -geometry +1452+488 -compose over -composite \
  "${WORK}/mac-01-after.png" -geometry +1452+470 -compose over -composite \
  "${MAC_OUTPUT}/01_block_youtube_shorts_in_safari.png"

place_mac_single "${MAC_AFTER_HOME}" \
  "A cleaner YouTube, everywhere" \
  "Home and subscriptions stay focused on real videos." \
  "${MAC_OUTPUT}/02_cleaner_youtube_everywhere.png"

place_mac_single "${MAC_AFTER_VIDEO}" \
  "Hide recommendations and comments" \
  "Keep the video. Remove the rabbit holes around it." \
  "${MAC_OUTPUT}/03_hide_recommendations_and_comments.png"

place_mac_single "${MAC_POPUP}" \
  "Choose what stays" \
  "Control Shorts, Home, recommendations, and comments." \
  "${MAC_OUTPUT}/04_choose_what_stays.png"

place_mac_single "${MAC_POPUP}" \
  "Pay once. No subscription." \
  "One purchase across your Apple devices." \
  "${MAC_OUTPUT}/05_pay_once_no_subscription.png"

# iPad — only one historical iPad source exists, so keep one honest proof image.
magick -size 2048x2732 gradient:'#090505-#3A0B08' \
  -gravity northwest \
  -font Avenir-Next-Bold -pointsize 140 -fill '#FFF8F5' \
  -annotate +128+132 'Block YouTube Shorts\nin Safari' \
  -font Avenir-Next-Regular -pointsize 52 -fill '#D9C8C4' \
  -annotate +132+470 'See exactly what disappears from your feed.' \
  "${WORK}/ipad-canvas.png"
magick "${IPAD_BEFORE}" -resize 1420x1880 \
  "${WORK}/ipad-source.png"
magick "${WORK}/ipad-canvas.png" \
  \( "${WORK}/ipad-source.png" -background '#00000080' -shadow 55x18+0+24 \) \
  -gravity north -geometry +0+738 -compose over -composite \
  "${WORK}/ipad-source.png" -gravity north -geometry +0+714 -compose over -composite \
  "${IPAD_OUTPUT}/01_block_youtube_shorts_in_safari.png"

echo "Draft screenshots generated in: ${OUTPUT_ROOT}"
