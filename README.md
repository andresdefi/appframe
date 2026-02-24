# appframe

Open-source tool for generating professional App Store & Play Store promotional screenshots.

Takes raw app screenshots and transforms them into polished, store-ready promotional images with device frames, headlines, styled backgrounds, and professional layouts.

## Features

- **4 template styles**: minimal, bold, dark, playful — each with distinct visual personalities
- **7 layout variants**: center, left, right, angled-left, angled-right, floating, side-by-side
- **7 device frames**: iPhone 16/15 Pro Max, iPad Pro 13"/11", Pixel 10, generic phone/tablet
- **Multi-platform**: Generates images for App Store (iOS/iPadOS) and Play Store (Android) at exact required dimensions
- **Multi-language**: Generate screenshots in any language from a single config file
- **AI-collaborative**: MCP server lets AI agents suggest copy, themes, and generate screenshots
- **Web preview**: Local browser UI for visual tweaking in real-time
- **Auto-capture**: Capture screenshots from iOS Simulator (xcrun) or Android Emulator (adb)
- **Store upload**: Push screenshots directly to App Store Connect and Google Play Console

## Quick Start

```bash
# Install
npm install -g appframe

# Initialize a config for your app
appframe init --name "My App" --platforms ios,android --style minimal

# Add your screenshots to the screenshots/ folder, then generate
appframe generate

# Preview in browser
appframe preview
```

## CLI Commands

| Command | Description |
|---------|-------------|
| `appframe init` | Create a new config file interactively |
| `appframe generate` | Generate all store screenshots from config |
| `appframe validate` | Validate a config file |
| `appframe preview` | Open web preview for visual tweaking |
| `appframe capture` | Auto-capture from simulator/emulator |
| `appframe frames list` | List available device frames |
| `appframe upload` | Upload to App Store Connect / Google Play |

## Config File

appframe uses a YAML config file (`appframe.yml`):

```yaml
app:
  name: My App
  description: A great app
  platforms: [ios, android]

theme:
  style: minimal
  colors:
    primary: "#2563EB"
    secondary: "#7C3AED"
    background: "#F8FAFC"
    text: "#0F172A"
    subtitle: "#64748B"
  font: inter
  fontWeight: 600

frames:
  ios: iphone-16-pro-max
  android: pixel-10
  style: flat

screens:
  - screenshot: screenshots/screen-1.png
    headline: Track Every Expense
    subtitle: Effortless financial clarity
    layout: center

  - screenshot: screenshots/screen-2.png
    headline: Smart Categories
    layout: angled-right

  - screenshot: screenshots/screen-3.png
    headline: Beautiful Reports
    layout: left

locales:
  es:
    screens:
      - headline: Rastrea Cada Gasto
        subtitle: Claridad financiera sin esfuerzo
      - headline: Categorías Inteligentes
      - headline: Reportes Hermosos

output:
  platforms: [ios, android]
  ios:
    sizes: [6.7, 6.5]
    format: png
  android:
    sizes: [phone]
    format: png
    featureGraphic: true
  directory: ./output
```

## Template Styles

| Style | Description | Best for |
|-------|-------------|----------|
| **minimal** | Clean, light, Apple-style with subtle shadows | Productivity, finance, health, utilities |
| **bold** | Vibrant gradients, large heavy typography | Social, entertainment, lifestyle |
| **dark** | Premium, sleek with glowing accents | Finance, pro tools, music, photography |
| **playful** | Colorful, fun shapes, tilted devices | Games, education, kids, casual |

## MCP Server

appframe includes an MCP server for AI agent integration. Add it to your MCP config:

```json
{
  "mcpServers": {
    "appframe": {
      "command": "appframe-mcp"
    }
  }
}
```

### Available MCP Tools

| Tool | Description |
|------|-------------|
| `appframe_init_config` | Create a new config file |
| `appframe_read_config` | Read config contents |
| `appframe_validate_config` | Validate config |
| `appframe_update_config` | Update config fields |
| `appframe_generate` | Generate all screenshots |
| `appframe_preview_screen` | Render a single screen preview |
| `appframe_list_frames` | List available device frames |
| `appframe_list_templates` | List available template styles |
| `appframe_suggest_copy` | AI-guided promotional copy generation |
| `appframe_suggest_theme` | AI-guided theme suggestion |
| `appframe_upload_plan` | Preview what would be uploaded |
| `appframe_upload` | Upload screenshots to stores |

## Store Upload

### App Store Connect

Set these environment variables:

```bash
export ASC_ISSUER_ID="your-issuer-id"
export ASC_KEY_ID="your-key-id"
export ASC_PRIVATE_KEY_PATH="/path/to/AuthKey.p8"
export ASC_APP_ID="your-app-apple-id"
```

### Google Play Console

```bash
export GOOGLE_PLAY_SERVICE_ACCOUNT="/path/to/service-account.json"
export GOOGLE_PLAY_PACKAGE_NAME="com.example.myapp"
```

Then run:

```bash
# Preview what would be uploaded
appframe upload --dry-run

# Upload to both stores
appframe upload

# Upload iOS only
appframe upload --platform ios

# Upload specific locale
appframe upload --locale es
```

## Output Sizes

### iOS (App Store)
| Display | Output size |
|---------|-------------|
| iPhone 6.7" | 1290 x 2796 |
| iPhone 6.5" | 1284 x 2778 |
| iPhone 5.5" | 1242 x 2208 |
| iPad 12.9" | 2048 x 2732 |
| iPad 11" | 1668 x 2388 |

### Android (Google Play)
| Display | Output size |
|---------|-------------|
| Phone | 1080 x 1920 |
| 7" Tablet | 1200 x 1920 |
| 10" Tablet | 1800 x 2560 |
| Feature Graphic | 1024 x 500 |

## Development

```bash
# Clone and install
git clone https://github.com/your-username/appframe.git
cd appframe
pnpm install

# Build all packages
pnpm build

# Run tests
pnpm test

# Watch mode
pnpm dev
```

### Project Structure

```
packages/
  core/           Config, templates, renderer, frame management
  cli/            Commander.js CLI
  mcp-server/     MCP server for AI agents
  web-preview/    Express preview server with browser UI
  store-upload/   App Store Connect + Google Play upload
frames/           SVG device frames + manifest
examples/         Example app configs
```

## Requirements

- Node.js >= 18
- Playwright (auto-installed on first run for rendering)

## License

MIT
