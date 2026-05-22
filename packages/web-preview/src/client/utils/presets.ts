// Background presets — moved to ../../backgroundPresets so the server
// can serve them on /api/background-presets without crossing the
// src/client/ build boundary. This file re-exports the catalog for
// existing client call sites, plus keeps the client-only koubou device
// hex map below.

export type {
  GradientPreset,
  SolidCategory,
  GradientCategory,
} from '../../backgroundPresets';

export {
  SOLID_CATEGORIES,
  GRADIENT_CATEGORIES,
  SOLID_PRESETS,
  GRADIENT_PRESETS,
} from '../../backgroundPresets';

// --- Koubou device color hex map (client-only) -------------------------------

export const KOUBOU_COLOR_HEX: Record<string, string> = {
  'Natural Titanium': 'color(display-p3 0.5959 0.5585 0.5011)', 'Black Titanium': 'color(display-p3 0.2353 0.2353 0.2353)', 'White Titanium': 'color(display-p3 0.9077 0.8984 0.8804)',
  'Desert Titanium': 'color(display-p3 0.7506 0.6629 0.5282)', 'Blue Titanium': 'color(display-p3 0.2406 0.3036 0.3662)',
  'Black': 'color(display-p3 0.1098 0.1098 0.1170)', 'White': 'color(display-p3 0.9608 0.9608 0.9679)', 'Pink': 'color(display-p3 0.9488 0.8104 0.8286)', 'Teal': 'color(display-p3 0.4542 0.7017 0.7057)',
  'Ultramarine': 'color(display-p3 0.2945 0.3130 0.7529)', 'Blue': 'color(display-p3 0.4028 0.5555 0.7107)', 'Green': 'color(display-p3 0.2904 0.4268 0.3162)', 'Yellow': 'color(display-p3 0.9296 0.8356 0.3990)',
  'Red': 'color(display-p3 0.7100 0.2794 0.2705)', 'Purple': 'color(display-p3 0.4675 0.3696 0.6516)',
  'Midnight': 'color(display-p3 0.1725 0.1725 0.2231)', 'Starlight': 'color(display-p3 0.9357 0.9109 0.8535)', 'Product Red': 'color(display-p3 0.7100 0.2794 0.2705)',
  'Space Black': 'color(display-p3 0.1647 0.1647 0.1719)', 'Space Gray': 'color(display-p3 0.3882 0.3882 0.3990)', 'Silver': 'color(display-p3 0.8392 0.8392 0.8392)', 'Gold': 'color(display-p3 0.8738 0.7957 0.6640)',
  'Deep Purple': 'color(display-p3 0.3536 0.2745 0.4876)', 'Graphite': 'color(display-p3 0.3098 0.3098 0.3098)', 'Pacific Blue': 'color(display-p3 0.1887 0.3557 0.4969)',
  'Sierra Blue': 'color(display-p3 0.6424 0.7186 0.8029)', 'Alpine Green': 'color(display-p3 0.2649 0.3651 0.2889)', 'Rose Gold': 'color(display-p3 0.8779 0.7585 0.6783)',
};
