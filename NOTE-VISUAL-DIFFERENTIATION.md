# Visual Differentiation Issue

## Problem
When using the same appframe style (e.g., "glow") across multiple apps, the generated screenshots look nearly identical in layout and feel. This happened with:
- **Impostor Party Game** - glow style
- **Flashy Flare** - glow style

The framed screenshots came out almost indistinguishable in terms of background treatment, text placement, and overall composition.

## Visual Comparison

Reference screenshots are saved in `reference-screenshots/` for direct comparison.

### Impostor Party Game (`reference-screenshots/impostor/`)
- `screenshot-1.png` - "Trust no one" - home screen, dark bg with subtle glow
- `screenshot-2.png` - "Customize every round" - game setup, dark bg with subtle glow
- `screenshot-3.png` - "Get your secret word" - word reveal, dark bg with green accent glow
- `screenshot-4.png` - "Can you blend in?" - impostor reveal, dark bg with red accent glow
- `screenshot-5.png` - "Give one-word clues" - gameplay, dark bg with subtle glow
- `screenshot-6.png` - "Catch the impostor!" - game over, dark bg with subtle glow

### Flashy Flare (`reference-screenshots/flashy-flare/`)
- `flashy_flare_ios_iphone_6_5__default_1.png` - "No ads. Just light." - torch hero
- `flashy_flare_ios_iphone_6_5__default_2.png` - "Party strobe. Six patterns." - strobe mode
- `flashy_flare_ios_iphone_6_5__default_3.png` - "Any color. Full screen." - screen colors
- `flashy_flare_ios_iphone_6_5__default_4.png` - "SOS signal when it matters." - SOS mode
- `flashy_flare_ios_iphone_6_5__default_5.png` - "Ambient mode. 9 palettes." - lava lamp

### What looks identical between the two apps
1. **Background treatment** - both have the same dark-to-darker gradient with a subtle warm glow behind the device frame
2. **Device frame style** - identical generic phone frame, same size, same position (centered, single composition)
3. **Text layout** - headline at top in white bold Inter, subtitle below in gray, same font sizes, same vertical spacing
4. **Overall atmosphere** - both feel like the same "dark premium" look with no visual identity differentiation
5. **Glow color** - Impostor uses purple/red accents in the app itself but the appframe glow is the same warm tone; Flashy Flare has amber but the glow treatment is visually indistinguishable

### What SHOULD be different
- Impostor is a **party game** - could use playful angles, multiple devices (duo-overlap), brighter accent glows matching the purple brand
- Flashy Flare is a **utility** - could use clean/minimal style, tighter framing, amber glow that actually matches the app's accent color
- The background gradient should be meaningfully influenced by the theme's `primary` color, not just a generic warm glow
- Text positioning and sizing should vary more between styles or allow per-app overrides

## Root Cause
The 8 built-in styles (minimal, bold, glow, playful, clean, branded, editorial, fullscreen) produce a fixed visual formula per style. When two apps use the same style, the only variation comes from the screenshot content and headline text - not enough to create distinct brand identities on the App Store.

## What Needs to Change
- Per-app customization beyond just picking a style: background gradients, text positioning, accent colors, and frame treatment should be configurable enough that two apps using "glow" don't look like siblings
- Consider allowing custom background images or patterns per app
- The theme colors (primary, secondary, background, text) should have more visible effect on the output - currently the style template dominates over the color choices
- Consider a "randomize within style" option that varies composition, text alignment, and background treatment per screen
- The glow color in the "glow" style should be derived from the theme's `primary` color, not a fixed warm tone

## Affected Apps
- Impostor Party Game (com.tupungatostudios.impostor)
- Flashy Flare (com.flashylight.app)

Both need visually distinct App Store screenshot sets.
