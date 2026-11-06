# V8 Engine New Tab for Brave

This local Manifest V3 extension replaces Brave’s regular new-tab page with the interactive V8 engine, a quick-launch icon rail, web search, an editable shortcuts panel, and a local clock. It requests no browser permissions; shortcut changes are stored locally in the extension page.

## Use

- Click ChatGPT, Chat, Linear, GitHub, or YouTube to open it in a new tab.
- The two orange icons are editable placeholders until their destinations are set.
- Use the magnifier or `/` to open search. Searches open in Bing; entering a full web address opens that site.
- Click the clock to open Quick Launch, then edit shortcut names or destinations and save them on this device.
- **Hold View** freezes the camera while the engine keeps running. **Resume Camera** resumes orbit. **Return to Wallpaper** hides the simulator panels.

## Install in Brave

1. Unzip `v8-engine-brave-extension.zip`.
2. Open `brave://extensions`.
3. Turn on **Developer mode**.
4. Choose **Load unpacked** and select the extracted `v8-engine-newtab` folder containing `manifest.json`.
5. Open a new tab to see the engine and quick links.

To remove it, use **Remove** on its extension card at `brave://extensions`. Extension new-tab overrides do not run in incognito windows by default.
