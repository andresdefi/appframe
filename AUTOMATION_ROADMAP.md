# Appframe Automation Roadmap

End-to-end pipeline: given an app's source code, automatically generate and upload professional App Store screenshots.

```
App source code
  → Analyze app (colors, features, screens)
  → Automate simulator (launch, navigate, screenshot)
  → Auto-configure appframe (template, colors, headlines)
  → Review in Web UI (human tweaks)
  → Export full-resolution PNGs
  → Upload to App Store Connect
```

---

## Phase 1: App Analysis Engine

Reads an app project and extracts branding, features, and screen inventory to inform screenshot generation.

### 1.1 Project Detection & Parsing
- [ ] Detect project type from directory (Xcode `.xcodeproj`/`.xcworkspace`, `project.yml` for XcodeGen, `Package.swift` for SPM, `build.gradle` for Android)
- [ ] Parse `project.yml` / `pbxproj` to extract: bundle ID, display name, deployment target, team ID
- [ ] Parse `Info.plist` for app display name, supported orientations, URL schemes

### 1.2 Asset Extraction
- [ ] Find and read `Assets.xcassets` — extract app icon, accent color, named colors
- [ ] Parse color assets (`.colorset`) to get the app's brand colors (primary, secondary, background)
- [ ] Detect light/dark mode color variants
- [ ] Extract any custom fonts bundled in the project (`Info.plist` UIAppFonts or font files in the bundle)

### 1.3 UI & Feature Analysis
- [ ] Scan SwiftUI views / UIKit view controllers to build a screen inventory (view names, navigation structure)
- [ ] Identify key screens: onboarding, home/main, detail, settings, any unique feature screens
- [ ] Extract user-facing strings from `Localizable.strings` / `String Catalogs` / hardcoded text for headline suggestions
- [ ] Detect the app's category/purpose from code structure, class names, and string content
- [ ] Detect supported localizations

### 1.4 Output: Analysis Report
- [ ] Generate a structured JSON report: `{ appName, bundleId, colors, fonts, screens[], features[], localizations[] }`
- [ ] CLI command: `appframe analyze --project <path>` that outputs the report
- [ ] MCP tool: `appframe_analyze_project` for AI agent access

---

## Phase 2: Simulator Automation

Automatically launches the app in a simulator, navigates through key screens, and captures screenshots.

### 2.1 Simulator Management
- [ ] Launch a specific simulator device via `xcrun simctl boot <udid>` (or detect already-booted)
- [ ] Install the app binary: `xcrun simctl install <udid> <app-path>` (from build output or `.app` bundle)
- [ ] Launch the app: `xcrun simctl launch <udid> <bundle-id>`
- [ ] Override status bar to clean state: `xcrun simctl status_bar <udid> override --time "9:41" --batteryState charged --batteryLevel 100 --cellularBars 4 --operatorName "" --dataNetwork wifi`
- [ ] Wait for app to reach idle state before capturing

### 2.2 Screen Navigation
- [ ] Deep link navigation via `xcrun simctl openurl <udid> <url-scheme>` for apps with URL scheme support
- [ ] UI automation via `XCUITest` framework — create a test target that navigates through screens programmatically
- [ ] Alternative: use Facebook's `idb` (iOS Development Bridge) for touch/swipe simulation without XCUITest
- [ ] Alternative: AppleScript + Accessibility API for basic tap-at-coordinate automation
- [ ] Define a navigation manifest (JSON/YAML) that describes the screen flow: `[ { action: "tap", target: "Start Game" }, { action: "wait", ms: 500 }, { action: "screenshot", name: "home" } ]`

### 2.3 Screenshot Capture
- [ ] Capture via `xcrun simctl io <udid> screenshot <path>` after each navigation step
- [ ] Auto-crop Dynamic Island / notch area from captured screenshots (optional, for fullscreen template)
- [ ] Name screenshots with semantic names matching the navigation manifest
- [ ] Output screenshots to a structured directory: `captures/<app-name>/<screen-name>.png`

### 2.4 Android Support (stretch goal)
- [ ] Emulator management via `emulator` and `adb` commands
- [ ] Install APK: `adb install <apk-path>`
- [ ] UI automation via `adb shell uiautomator` or Appium
- [ ] Capture via `adb exec-out screencap -p`

### 2.5 CLI & MCP Integration
- [ ] CLI command: `appframe capture --auto --project <path>` that runs the full capture flow
- [ ] MCP tool: `appframe_capture_screens` for AI agent access
- [ ] Extend existing `appframe capture` command (currently only does manual/timed capture, no navigation)

---

## Phase 3: Auto-Configuration

Takes the analysis report + captured screenshots and generates an optimized `appframe.yml`.

### 3.1 Template & Color Matching
- [ ] Select the best template based on app analysis (dark app → `glow`/`bold`, light app → `minimal`/`clean`, colorful → `playful`, brand-heavy → `branded`)
- [ ] Map extracted app colors to appframe theme colors (`primary`, `secondary`, `background`, `text`, `subtitle`)
- [ ] Handle dark/light mode: pick background color that contrasts well with the app's own UI
- [ ] Select font: match app's bundled font or pick a complementary one from `FONT_CATALOG`

### 3.2 Headline Generation
- [ ] Generate compelling App Store headlines for each screen based on: the screen's content/purpose, extracted strings, app features
- [ ] Keep headlines short (2-5 words) and action-oriented
- [ ] Generate subtitles where appropriate (feature detail screens, onboarding)
- [ ] Support multiple localizations if the app has them

### 3.3 Layout & Composition Selection
- [ ] Decide per-screen layout: use `center` for hero screens, `angled-left`/`angled-right` for variety
- [ ] Select frame style based on app aesthetic (`flat` for clean apps, `floating` for premium feel, `none` for fullscreen)
- [ ] Choose device frame matching the target device (iPhone 16 Pro Max for iOS 6.7")
- [ ] Optionally select composition presets for cross-screen effects

### 3.4 Config Generation
- [ ] Generate complete `appframe.yml` with all fields populated
- [ ] Wire captured screenshot paths to `screens[].screenshot`
- [ ] Set output sizes based on detected platforms
- [ ] CLI command: `appframe auto-config --project <path> --screenshots <dir>`
- [ ] MCP tool: `appframe_auto_configure` for AI agent access

---

## Phase 4: Review & Refinement Loop

The human reviews generated screenshots in the Web UI and makes adjustments.

### 4.1 Web UI Improvements
- [ ] Auto-launch web preview after auto-config: `appframe preview` opens browser automatically
- [ ] Add "Regenerate Headlines" button that asks AI for alternative copy
- [ ] Add "Switch Template" quick-toggle that re-renders all screens instantly
- [ ] Show export size preview (actual App Store dimensions) alongside the preview
- [ ] Add a "Looks Good — Export All" button that triggers full-resolution export from the UI

### 4.2 AI-Assisted Refinement (via MCP)
- [ ] MCP tool: `appframe_suggest_improvements` — analyzes current config + screenshots and suggests changes
- [ ] Agent can read the preview screenshots and suggest color/layout/headline tweaks
- [ ] Agent can apply changes via `appframe_update_config` and regenerate

---

## Phase 5: Export & Upload

Full-resolution export and automated upload to App Store Connect / Google Play.

### 5.1 Export (already built)
- [x] `appframe generate` exports all screens at all required sizes
- [x] iOS: 6.7" (1290x2796) and 6.5" (1284x2778)
- [x] Android: phone, tablet sizes
- [x] PNG format at 2x device scale factor via Playwright

### 5.2 App Store Connect Upload (already built, needs credentials)
- [x] `appframe upload` command with dry-run and confirmation
- [x] JWT-based authentication with App Store Connect API (ES256)
- [x] Finds or creates app version, resolves localization, creates screenshot sets
- [x] Clears existing screenshots and uploads new ones in order
- [ ] Document credential setup in a clear guide (ASC_ISSUER_ID, ASC_KEY_ID, ASC_PRIVATE_KEY_PATH, ASC_APP_ID)
- [ ] Add credential setup wizard: `appframe auth setup --platform ios` that walks through the steps interactively
- [ ] Store credentials securely (keychain on macOS, encrypted file, or `.env` in project)

### 5.3 Google Play Upload (already built, needs credentials)
- [x] Google Play service account JSON key authentication
- [x] Edit-based upload flow with atomic commit
- [ ] Document credential setup (GOOGLE_PLAY_SERVICE_ACCOUNT, GOOGLE_PLAY_PACKAGE_NAME)
- [ ] Add to credential setup wizard

---

## Phase 6: End-to-End Orchestration

Single command that runs the entire pipeline.

### 6.1 Pipeline Orchestrator
- [ ] CLI command: `appframe autopilot --project <path>` that runs: analyze → capture → auto-config → preview → (wait for approval) → export → upload
- [ ] Each step reports progress and can be individually re-run
- [ ] Pipeline state saved to disk so it can resume after interruptions
- [ ] `--skip-upload` flag to stop before uploading (default for safety)

### 6.2 MCP Agent Flow
- [ ] MCP tool: `appframe_run_pipeline` that orchestrates the full flow
- [ ] Agent can be instructed: "Generate App Store screenshots for the app at /path/to/project"
- [ ] Agent uses analysis output to make informed decisions about template/colors/copy
- [ ] Agent presents preview to user and iterates based on feedback

### 6.3 CI/CD Integration (stretch goal)
- [ ] GitHub Action that runs the pipeline on release/tag
- [ ] Fastlane lane integration
- [ ] Output artifacts as downloadable zip

---

## Priority Order

1. **Phase 2** (Simulator Automation) — highest impact, unblocks everything
2. **Phase 1** (App Analysis) — enables smart auto-configuration
3. **Phase 3** (Auto-Configuration) — ties analysis + screenshots together
4. **Phase 5.2** (Credential Setup) — low effort, unblocks automated upload
5. **Phase 6** (Orchestration) — ties the full pipeline together
6. **Phase 4** (Review UI improvements) — polish
