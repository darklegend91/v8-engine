# V8 Engine macOS Screen Saver

The included `V8 Engine.saver` is a locally built ScreenSaver plug-in with the interactive V8 simulation. Its page hides the on-page clock, controls, and shortcut rail. Source and a rebuild script are included.

## Install

Copy `V8 Engine.saver` to `~/Library/Screen Savers/`, then open **System Settings → Wallpaper → Screen Saver** and select V8 Engine if macOS lists it. To remove it, choose another screen saver and delete the bundle from that folder.

## Current Mac status

This copy was installed in `~/Library/Screen Savers/`, but macOS 27.0.1 did not show it in the Screen Saver picker during this session. The built-in Tahoe screen saver remained selected, so the V8 saver was not active. The Mac's separate large clock preference was set to **Never**.

## Rebuild

From this folder run `python3 build-v8-screensaver.py`. It requires Xcode Command Line Tools (`clang`, `codesign`) and builds an arm64/x86_64 bundle.
