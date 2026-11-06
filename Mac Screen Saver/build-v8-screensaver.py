#!/usr/bin/env python3
"""Build the V8 Engine macOS screen saver bundle in this directory."""
from pathlib import Path
import plistlib
import shutil
import subprocess

ROOT = Path(__file__).resolve().parent
SOURCE_HTML = ROOT / "v8-interactive-wallpaper.html"
SAVER = ROOT / "V8 Engine.saver"
CONTENTS = SAVER / "Contents"
RESOURCES = CONTENTS / "Resources"
MACOS = CONTENTS / "MacOS"

if SAVER.exists():
    shutil.rmtree(SAVER)
RESOURCES.mkdir(parents=True)
MACOS.mkdir(parents=True)

html = SOURCE_HTML.read_text()
html = html.replace("<title>V8 · Interactive Wallpaper</title>", "<title>V8 Engine Screen Saver</title>", 1)
html = html.replace("</head>", """<style>
html,body,#app{width:100%;height:100%;margin:0;overflow:hidden}
body{cursor:none;background:#ecedef}
#wallpaper-dock,#shortcut-rail,#utility-clock,#utility-panel{display:none!important}
#app .ui{opacity:0!important;visibility:hidden!important;pointer-events:none!important}
</style></head>""", 1)
html = html.replace("</body>", """<script>
(() => {
  const holdCamera = () => window.dispatchEvent(new CustomEvent('v8-wallpaper-hold', {detail:{held:true}}));
  if (window.LIVE) holdCamera();
  else addEventListener('simframe', holdCamera, {once:true});
})();
</script></body>""", 1)
(RESOURCES / "V8Engine.html").write_text(html)

plist = {
    "CFBundleDevelopmentRegion": "en",
    "CFBundleExecutable": "V8EngineSaver",
    "CFBundleIdentifier": "com.aditya.v8enginesaver",
    "CFBundleInfoDictionaryVersion": "6.0",
    "CFBundleName": "V8 Engine",
    "CFBundlePackageType": "BNDL",
    "CFBundleSignature": "????",
    "CFBundleSupportedPlatforms": ["MacOSX"],
    "CFBundleShortVersionString": "1.0",
    "CFBundleVersion": "1",
    "LSMinimumSystemVersion": "13.0",
    "NSPrincipalClass": "V8EngineSaverView",
}
with (CONTENTS / "Info.plist").open("wb") as f:
    plistlib.dump(plist, f, sort_keys=False)

source = ROOT / "V8EngineSaverView.m"
binary = MACOS / "V8EngineSaver"
subprocess.run([
    "clang", "-fobjc-arc", "-fmodules", "-bundle",
    "-arch", "arm64", "-arch", "x86_64", "-mmacosx-version-min=13.0",
    str(source), "-o", str(binary),
    "-framework", "Cocoa", "-framework", "ScreenSaver", "-framework", "WebKit",
], check=True)
subprocess.run(["codesign", "--force", "--deep", "--sign", "-", str(SAVER)], check=True)
print(SAVER)
