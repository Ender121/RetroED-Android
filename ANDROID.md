# Building RetroED for Android

Target: **Qt 5.15.x for Android (armeabi-v7a + arm64-v8a)**, OpenGL ES 3.0, Android 7.0+ (API 24).

Tested target device: **Motorola Moto C** (MT6737M, 32-bit ARMv7, Mali-T720, Android 7.0, 1 GB RAM).
That phone is 32-bit, so the **armeabi-v7a** build is the one it needs.

## Requirements
- Qt 5.15.2 with the *Android* kits installed (Qt Online Installer): **armeabi-v7a** (needed for
  the Moto C) and arm64-v8a
- Android SDK + NDK **r21e** (the NDK Qt 5.15 expects), JDK 8 or 11
- Qt Creator (easiest) or `qmake` + `androiddeployqt`

## Steps
```
git clone https://github.com/RSDKModding/RetroED
cd RetroED
git submodule update --init --recursive
```
Open `RetroEDv2/RetroEDv2.pro` in Qt Creator, pick the **Android Qt 5.15.x Clang armeabi-v7a** kit
(for the Moto C and other 32-bit phones), and build/run. Or from a shell:
```
<Qt>/android/bin/qmake RetroEDv2/RetroEDv2.pro -spec android-clang
make -j$(nproc)
make apk_install_target   # then: androiddeployqt ... (see Qt docs)
```
`version.hpp` is generated automatically if it's missing, so Python/pytz is not needed.

## What was adapted
- `main.cpp`: no forced `xcb`; OpenGL ES 3.0 surface format; storage permission request.
- Shaders: loaded with a GLSL ES 3.00 header on OpenGL ES; `sampler2DRect` replaced by
  `sampler2D` + `texelFetch`; implicit int/float conversions made explicit.
- `android/AndroidManifest.xml`: storage permissions, GLES 3.0 requirement,
  `requestLegacyExternalStorage`.

## Moto C notes
- Android 7.0 (API 24) is exactly the minimum supported; runtime storage permission works as usual.
- Only 1 GB RAM: open one scene at a time and avoid huge tilesheets/datapacks.
- 5" 480x854 screen: the desktop dialogs are cramped; the scene editor is usable with the hand tool.
- The Mali-T720 should expose OpenGL ES 3.0 or higher. RetroED logs the GL version/renderer on
  start (`SceneViewer OpenGL Details`); if it reports ES 2.0 the scene viewer won't work.

## Known limitations
- Storage: the file dialogs browse real paths, so the app targets API 29 with legacy storage.
  On Android 11+ you may need to grant "All files access" to RetroED in system settings.
- Loading RSDKv5 `Game` libraries (GameLink) and launching external game executables are
  desktop-only features.
- Several editor features depend on keyboard modifiers / right click (grid snap, context menus).
