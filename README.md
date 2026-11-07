# V8 Engine Project
[![V8_Engine](![Uploading image.png…]()
)](https://raw.github.com/darklegend91/v8-engine/blob/main/V8%20Engine%20Tour.mp4)


A bundle of the interactive V8 engine project and its Mac/Brave versions.

## Contents

- **Interactive Engine** — standalone interactive engine page.
- **Brave New Tab** — unpacked Manifest V3 extension and installable ZIP. It adds the engine, quick links, search, and editable shortcut placeholders.
- **Mac Wallpaper** — 3840 × 2400 still wallpaper and preview.
- **Mac Screen Saver** — screen saver bundle, HTML source, Objective-C host source, portable build script, and clock-free preview.
- **V8 Engine Tour.mp4** — rendered engine explainer video.

## Screen saver status

The `.saver` bundle was copied to `~/Library/Screen Savers/` on this Mac, but macOS 27.0.1 did not list it in the Screen Saver picker, so it is not active. See `Mac Screen Saver/README.md` for details.

## Brave extension

Unzip `Brave New Tab/v8-engine-brave-extension.zip`, open `brave://extensions`, enable Developer mode, then choose **Load unpacked** and select the extracted `v8-engine-newtab` folder.
