# UI Simplification Direction

## Research Sources
- ScreenFrame (iOS app) — simple device mockup tool
- SnaPOP (iOS app) — screenshot enhancement tool  
- Figma templates: Mito, Median (500+), ASO.Dev

## Key Changes Needed

### Rename "Template" → "Background" + Make It Customizable
- Templates primarily change the background style (solid, gradient, glow, bold colors)
- The current "Template" dropdown bundles background + font changes together
- Background should be a standalone concept: just the visual backdrop

#### Background must support direct customization (not just presets):
- **Solid**: ~7 preset color swatches + full color picker with 3 modes:
  - Grid (color grid like SnaPOP/ScreenFrame)
  - Spectrum (continuous color wheel/area)
  - Sliders (RGB sliders with hex input)
- **Gradient**: ~20 preset gradient backgrounds to pick from + custom gradient builder
  (ScreenFrame has preset gradient dots, SnaPOP has "Linear" tab with presets)
- **Image**: ~20 preset background images/textures + upload custom image
  (SnaPOP and ScreenFrame both have preset image backgrounds like marble, nature, abstract)
- **Presets**: Existing templates (minimal, bold, glow, etc.) become quick-start presets
  that set background + suggested colors, but user can customize freely after

#### Architecture change needed:
- Current: background is baked into Nunjucks HTML templates (each template has its own CSS)
- Target: background is a parameter (type + color/gradient/imageUrl) passed to a single 
  flexible base template. Templates become presets that populate these parameters.
- The rendering engine needs to accept: `backgroundType: 'solid' | 'gradient' | 'image'`,
  `backgroundColor`, `backgroundGradient: { colors, direction }`, `backgroundImageUrl`

### Font Must Be Independent
- Font selection should NOT be coupled to background/template choice
- Font is its own control that persists when you change backgrounds
- Current templates override font — this needs to be decoupled

### Remove Zoom Callouts
- Feature doesn't add meaningful value
- Remove from UI and rendering pipeline

### Remove Unnecessary Complexity
- Both reference apps use isolated, single-concern controls
- ScreenFrame: Background, Device, Aspect Ratio, Scale, Position, Shadow — each is one tab
- SnaPOP: BG, Crop, Ratio, Pad, Corner, Border, Focus, Arrow, Text — each is one tab
- appframe has too many compound concepts (template changes bg + font + layout)

### What the Best Templates Have in Common
From Figma research:
- Clean backgrounds (solid colors, gradients, mesh gradients)
- Simple text placement (headline + subtitle above device)
- Device shown flat and centered
- Consistent visual language across all screens in a set
- No complex 3D transforms or multi-composition modes
- First screenshot often has app icon + name as an intro slide

### appframe's Unique Advantages to Keep
- AI agent workflow (MCP, CLI)
- Config-as-code (YAML)
- Open source
- Localization support
- Multi-platform (iOS, Android, Mac, Watch)
- Store upload integration
