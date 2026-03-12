---
name: appframe-screenshots
description: Use when building App Store or Play Store screenshot pages, generating exportable marketing screenshots for iOS or Android apps, or creating professional store listing images. Triggers on app store, play store, screenshots, marketing assets, store listing, promotional images.
---

# appframe — App Store & Play Store Screenshot Generator

## Overview

Generate professional, store-ready promotional screenshots for iOS and Android apps using `appframe` — a deterministic rendering pipeline that produces consistent, high-quality output every time. Unlike one-off generated code, appframe uses a YAML config + Playwright rendering engine with 100+ device frames, 8 template styles, and multi-platform support.

## Core Principle

**Screenshots are advertisements, not documentation.** Every screenshot sells one idea. If you're showing UI, you're doing it wrong — you're selling a *feeling*, an *outcome*, or killing a *pain point*.

## Step 1: Ask the User These Questions

Before writing ANY config, ask the user all of these. Do not proceed until you have answers:

### Required

1. **App screenshots** — "Where are your app screenshots? (PNG files of actual device captures — put them in a `screenshots/` folder)"
2. **App name** — "What is your app called?"
3. **App description** — "What does your app do in one sentence?"
4. **Brand colors** — "What are your brand colors? (primary color at minimum, as hex like #2563EB)"
5. **Feature list** — "List your app's features in priority order. What's the #1 thing your app does?"
6. **Number of slides** — "How many screenshots do you want? (Apple allows up to 10, Google Play up to 8)"
7. **Platforms** — "Which platforms? iOS, Android, or both?"

### Optional

8. **Style direction** — "What style do you want? Options: minimal (clean Apple-style), bold (vibrant gradients), glow (dark premium), playful (fun shapes), clean (zero decoration), branded (strong brand color), editorial (elegant muted). Share screenshot references if you have any."
9. **Font preference** — "What font? Options: inter, space-grotesk, poppins, montserrat, dm-sans, plus-jakarta-sans, raleway, playfair-display"
10. **Additional instructions** — "Any specific requirements?"

### Derived from answers (do NOT ask — decide yourself)

Based on the user's style direction, brand colors, and app aesthetic, decide:
- **Template style**: Which of the 8 styles best matches
- **Color palette**: Primary, secondary, background, text, subtitle colors
- **Font**: If not specified, pick one that matches the style
- **Layout variation**: How to vary compositions across slides
- **Background strategy**: Whether to use per-screen background overrides for light/dark alternation

## Step 2: Install appframe (if needed)

```bash
# Check if appframe is installed
which appframe || npm install -g appframe
```

## Step 3: Write Copy FIRST

Get all headlines approved before building the config. Bad copy ruins good design.

### The Iron Rules

1. **One idea per headline.** Never join two things with "and."
2. **Short, common words.** 1-2 syllables. No jargon unless domain-specific.
3. **3-5 words per line.** Must be readable at thumbnail size in the App Store.
4. **Line breaks are intentional.** Use `\n` in YAML to control where lines break.

### Three Approaches (pick one per slide)

| Type | What it does | Example |
|------|-------------|---------|
| **Paint a moment** | You picture yourself doing it | "Check your coffee without opening the app." |
| **State an outcome** | What your life looks like after | "A home for every coffee you buy." |
| **Kill a pain** | Name a problem and destroy it | "Never waste a great bag of coffee." |

### What NEVER Works

- Feature lists as headlines: "Log every item with tags, categories, and notes"
- Two ideas joined by "and": "Track X and never miss Y"
- Vague aspirational: "Every item, tracked"
- Marketing buzzwords: "AI-powered tips" (unless it's actually AI)

### Slide Framework (Narrative Arc)

Adapt this to the user's slide count:

| Slot | Purpose | Notes |
|------|---------|-------|
| #1 | **Hero / Main Benefit** | App icon + tagline + home screen |
| #2 | **Differentiator** | What makes this app unique |
| #3 | **Ecosystem** | Widgets, watch, extensions (skip if N/A) |
| #4+ | **Core Features** | One feature per slide, most important first |
| 2nd to last | **Trust Signal** | Identity/craft — "made for people who [X]" |
| Last | **More Features** | Summary of extras |

### Copy Process

1. Write 2-3 options per slide using the three approaches above
2. Present options to the user with your reasoning
3. Check: does each headline have 3-5 words? If not, adjust
4. Get approval before proceeding to config

## Step 4: Generate 2-3 Variant Configs

**IMPORTANT:** Always generate multiple variant configs so the user can choose their preferred style. Create 2-3 complete `appframe.yml` files with different design strategies:

### Variant A: Clean & Safe
- Style: `minimal` or `clean`
- All `center` layouts
- Light background
- Consistent look across all slides

### Variant B: Dynamic & Varied
- Style: `bold` or `glow`
- Mixed compositions: `center`, `peek-right`, `peek-left`, `angled-right`
- Per-screen background overrides for light/dark alternation
- More dramatic device placement

### Variant C: Elegant & Editorial
- Style: `editorial` or `branded`
- Subtle angled layouts
- Warm or brand-heavy color palette
- Refined typography

Write each variant to a separate file:
- `appframe-variant-a.yml`
- `appframe-variant-b.yml`
- `appframe-variant-c.yml`

### Config Structure

```yaml
# appframe config — [App Name] (Variant [A/B/C])

app:
  name: "[App Name]"
  description: "[One sentence description]"
  platforms: [ios, android]
  features:
    - "[Feature 1]"
    - "[Feature 2]"

theme:
  style: minimal  # minimal | bold | glow | playful | clean | branded | editorial
  colors:
    primary: "#2563EB"
    secondary: "#7C3AED"
    background: "#F8FAFC"
    text: "#0F172A"
    subtitle: "#64748B"
  font: inter
  fontWeight: 600

frames:
  ios: iphone-17-pro       # or: generic-phone, iphone-17, iphone-air, ipad-pro-13, etc.
  android: generic-phone
  style: flat               # flat | none (frameless)

screens:
  - screenshot: screenshots/screen-1.png
    headline: "Your headline\nhere."
    subtitle: "Optional supporting line"
    layout: center            # center | angled-left | angled-right
    composition: single       # single | peek-right | peek-left | tilt-left | tilt-right

  - screenshot: screenshots/screen-2.png
    headline: "Second slide"
    layout: angled-right
    composition: peek-right
    background: "#1E1B4B"     # Per-screen background override

output:
  platforms: [ios, android]
  ios:
    sizes: [6.7, 6.5]        # iPhone display sizes
    format: png
  android:
    sizes: ["phone"]
    format: png
    featureGraphic: true      # Generate 1024x500 feature graphic
  directory: ./output
```

### Available Template Styles

| Style | Best for | Visual character |
|-------|----------|-----------------|
| `minimal` | Productivity, finance, health, utilities | Clean, light, Apple-style, subtle shadows |
| `bold` | Social, entertainment, lifestyle | Vibrant gradients, large text, uppercase headings |
| `glow` | Finance, pro tools, music, photography | Dark premium, glowing color accents |
| `playful` | Games, education, kids, casual | Colorful shapes, fun decorations |
| `clean` | Any app wanting modern no-frills | Zero decoration, just text + device |
| `branded` | Apps with strong brand identity | Brand color as background, strong presence |
| `editorial` | Lifestyle, wellness, premium | Elegant, muted tones, italic headings |

### Available Composition Presets

| Preset | Devices | Effect |
|--------|---------|--------|
| `single` | 1 | Default centered device |
| `peek-right` | 1 | Device bleeds off right edge |
| `peek-left` | 1 | Device bleeds off left edge |
| `tilt-left` | 1 | Dramatic tilt overflowing left |
| `tilt-right` | 1 | Dramatic tilt overflowing right |
| `duo-overlap` | 2 | Two overlapping devices |
| `duo-split` | 2 | Two devices on opposite edges |
| `hero-tilt` | 2 | Large hero + smaller background device |
| `fanned-cards` | 3 | Three devices fanned out |

For multi-device presets, add `extraDevices`:
```yaml
  - screenshot: screenshots/main.png
    headline: "Two screens, one view"
    composition: duo-overlap
    extraDevices:
      - screenshot: screenshots/detail.png
```

### Available Fonts

inter, space-grotesk, poppins, montserrat, dm-sans, plus-jakarta-sans, raleway, playfair-display

### Available Device Frames

**iPhone:** iphone-17-pro-max, iphone-17-pro, iphone-17, iphone-air, generic-phone
**iPad:** ipad-pro-13, ipad-pro-11
**Android:** generic-phone, generic-tablet

## Step 5: Generate & Preview

```bash
# Generate screenshots for a specific variant
appframe generate -c appframe-variant-a.yml

# Or preview in browser for visual tweaking
appframe preview -c appframe-variant-a.yml
```

Present the generated screenshots to the user. Let them pick their favorite variant.

## Step 6: Refine

Once the user picks a variant:

```bash
# Rename to the standard config name
cp appframe-variant-b.yml appframe.yml

# Clean up other variants
rm appframe-variant-a.yml appframe-variant-c.yml
```

Then refine based on feedback:
- Adjust colors, font weights, headline text
- Try different compositions for specific slides
- Add per-screen backgrounds for contrast
- Use `appframe preview` for real-time visual tweaking

## Step 7: Export for All Sizes

```bash
# Generate final screenshots for all platforms and sizes
appframe generate

# Or for a specific platform
appframe generate --platform ios
appframe generate --platform android
```

Output structure:
```
output/
  ios/
    6.7/
      AppName_default_1.png
      AppName_default_2.png
    6.5/
      ...
  android/
    phone/
      AppName_default_1.png
    feature-graphic/
      AppName_feature-graphic.png
```

## Step 8: Upload (Optional)

```bash
# Preview upload plan
appframe upload --dry-run

# Upload to App Store Connect
appframe upload --platform ios

# Upload to Google Play Console
appframe upload --platform android
```

Requires API credentials — see appframe docs for setup.

## Layout Variation Rules

**CRITICAL:** Never use the same layout for all slides. Vary across these patterns:

- Slide 1: `center` + `single` (hero, clean)
- Slide 2: `angled-right` or `peek-right` (movement)
- Slide 3: `center` + different background (contrast)
- Slide 4: `peek-left` or `angled-left` (mirror slide 2)
- Slide 5: `center` + `single` (return to calm)

For the Dynamic variant, use more aggressive compositions:
- `peek-right` / `peek-left` pairs create cross-screen effects in the App Store
- `tilt-left` / `tilt-right` for dramatic impact
- `duo-overlap` to show two screens at once

## Common Mistakes

| Mistake | Fix |
|---------|-----|
| All slides look the same | Vary composition and layout across slides |
| Copy is too long | "One second at arm's length" — 3-5 words per line |
| No visual contrast | Alternate per-screen backgrounds (light/dark) |
| Headlines use "and" | Split into two slides or pick one idea |
| All centered layouts | Mix in peek-right, angled-left, etc. |
| Generic placeholder text | Write benefit-driven copy before anything else |
| Only generating one style | Always generate 2-3 variants for the user to choose |

## Requirements

- Node.js 18+
- `appframe` CLI installed globally (`npm install -g appframe`)
