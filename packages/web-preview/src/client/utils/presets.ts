// Background presets, organized into named categories so the Background tab
// can render them as collapsible rows in the shots.so style. Each category
// is rendered as a single row with the first N tiles visible and the rest
// behind an expand chevron.

export interface GradientPreset {
  name: string;
  colors: string[];
  direction: number;
  type?: 'linear' | 'radial';
  radialPosition?: string;
}

// --- Solid color catalog -----------------------------------------------------

interface SolidCategory {
  name: string;
  colors: string[];
}

export const SOLID_CATEGORIES: SolidCategory[] = [
  {
    name: 'Mono',
    colors: [
      'color(display-p3 0.0000 0.0000 0.0000)', 'color(display-p3 0.0392 0.0392 0.0392)', 'color(display-p3 0.1020 0.1020 0.1020)', 'color(display-p3 0.1490 0.1490 0.1490)', 'color(display-p3 0.2510 0.2510 0.2510)', 'color(display-p3 0.3216 0.3216 0.3216)',
      'color(display-p3 0.4510 0.4510 0.4510)', 'color(display-p3 0.6392 0.6392 0.6392)', 'color(display-p3 0.8314 0.8314 0.8314)', 'color(display-p3 0.8980 0.8980 0.8980)', 'color(display-p3 0.9608 0.9608 0.9608)', 'color(display-p3 1.0000 1.0000 1.0000)',
    ],
  },
  {
    name: 'Vibrant',
    colors: [
      'color(display-p3 0.8651 0.3219 0.2966)', 'color(display-p3 0.9111 0.4814 0.2088)', 'color(display-p3 0.9122 0.6349 0.2305)', 'color(display-p3 0.8843 0.7105 0.2450)', 'color(display-p3 0.5811 0.7926 0.2600)', 'color(display-p3 0.3692 0.7613 0.4136)',
      'color(display-p3 0.3325 0.7147 0.5221)', 'color(display-p3 0.3333 0.7109 0.6515)', 'color(display-p3 0.3219 0.7030 0.8172)', 'color(display-p3 0.2942 0.6374 0.8908)', 'color(display-p3 0.3047 0.5035 0.9338)', 'color(display-p3 0.3904 0.3996 0.9126)',
      'color(display-p3 0.5183 0.3688 0.9315)', 'color(display-p3 0.6165 0.3506 0.9358)', 'color(display-p3 0.7867 0.3176 0.9074)', 'color(display-p3 0.8551 0.3327 0.5918)',
    ],
  },
  {
    name: 'Pastel',
    colors: [
      'color(display-p3 0.9640 0.8001 0.7962)', 'color(display-p3 0.9712 0.8488 0.6888)', 'color(display-p3 0.9886 0.9544 0.7988)', 'color(display-p3 0.9926 0.9771 0.7872)', 'color(display-p3 0.9370 0.9862 0.8144)', 'color(display-p3 0.8511 0.9756 0.9031)',
      'color(display-p3 0.7820 0.9620 0.8267)', 'color(display-p3 0.7200 0.9450 0.8243)', 'color(display-p3 0.7700 0.8555 0.9834)', 'color(display-p3 0.7883 0.8221 0.9817)', 'color(display-p3 0.8619 0.8401 0.9838)', 'color(display-p3 0.9566 0.8183 0.9045)',
    ],
  },
  {
    name: 'Earth',
    colors: [
      'color(display-p3 0.4497 0.1966 0.1052)', 'color(display-p3 0.5326 0.2697 0.1156)', 'color(display-p3 0.5968 0.3958 0.1375)', 'color(display-p3 0.4913 0.3124 0.1198)', 'color(display-p3 0.2367 0.3225 0.1192)', 'color(display-p3 0.1564 0.3206 0.1907)',
      'color(display-p3 0.1468 0.3013 0.2891)', 'color(display-p3 0.1293 0.2856 0.4196)', 'color(display-p3 0.1437 0.2247 0.5217)', 'color(display-p3 0.2111 0.1892 0.6149)', 'color(display-p3 0.2637 0.0444 0.2947)', 'color(display-p3 0.4711 0.1351 0.2616)',
    ],
  },
  {
    name: 'Brand',
    colors: [
      'color(display-p3 0.1000 0.2008 0.3641)', 'color(display-p3 0.0952 0.1282 0.2351)', 'color(display-p3 0.1020 0.1020 0.1748)', 'color(display-p3 0.3080 0.2093 0.4963)', 'color(display-p3 0.1817 0.2031 0.2107)', 'color(display-p3 0.3963 0.4300 0.4450)',
      'color(display-p3 0.1872 0.2412 0.3074)', 'color(display-p3 0.2211 0.2840 0.3613)', 'color(display-p3 0.0569 0.0475 0.1540)', 'color(display-p3 0.1849 0.1693 0.3748)',
    ],
  },
];

// --- Gradient catalog --------------------------------------------------------

interface GradientCategory {
  name: string;
  presets: GradientPreset[];
}

export const GRADIENT_CATEGORIES: GradientCategory[] = [
  {
    name: 'Sunset',
    presets: [
      { name: 'Sunset', colors: ['color(display-p3 0.9302 0.4557 0.2720)', 'color(display-p3 0.9399 0.7951 0.3768)', 'color(display-p3 0.9209 0.2963 0.4044)'], direction: 135 },
      { name: 'Flamingo', colors: ['color(display-p3 0.8658 0.3919 0.2153)', 'color(display-p3 0.8904 0.5935 0.2671)', 'color(display-p3 0.9556 0.8331 0.5990)'], direction: 135 },
      { name: 'Coral Glow', colors: ['color(display-p3 0.9452 0.6226 0.6277)', 'color(display-p3 0.9667 0.8188 0.9300)'], direction: 135 },
      { name: 'Peach Sky', colors: ['color(display-p3 0.9873 0.9281 0.8349)', 'color(display-p3 0.9470 0.7251 0.6392)'], direction: 135 },
      { name: 'Dusk', colors: ['color(display-p3 0.1872 0.2412 0.3074)', 'color(display-p3 0.9255 0.4862 0.4442)'], direction: 135 },
      { name: 'Honeyed', colors: ['color(display-p3 0.8871 0.6260 0.6580)', 'color(display-p3 0.9781 0.8715 0.8834)'], direction: 135 },
      { name: 'Persimmon', colors: ['color(display-p3 0.8955 0.2867 0.1460)', 'color(display-p3 0.9528 0.8367 0.3117)'], direction: 135 },
      { name: 'Amber Wave', colors: ['color(display-p3 0.9170 0.4174 0.4732)', 'color(display-p3 0.9452 0.6226 0.3373)'], direction: 90 },
      { name: 'Tangerine', colors: ['color(display-p3 0.9422 0.8325 0.4630)', 'color(display-p3 0.9407 0.6441 0.5428)'], direction: 135 },
    ],
  },
  {
    name: 'Ocean',
    presets: [
      { name: 'Open Ocean', colors: ['color(display-p3 0.1283 0.3163 0.8010)', 'color(display-p3 0.2908 0.3887 0.9343)', 'color(display-p3 0.4943 0.6875 0.9644)'], direction: 135 },
      { name: 'Lagoon', colors: ['color(display-p3 0.1206 0.3008 0.5538)', 'color(display-p3 0.3153 0.6953 0.8423)', 'color(display-p3 0.6050 0.8390 0.7009)'], direction: 135 },
      { name: 'Sky Surface', colors: ['color(display-p3 0.2638 0.4950 0.7068)', 'color(display-p3 0.5310 0.8257 0.9645)', 'color(display-p3 1.0000 1.0000 1.0000)'], direction: 180 },
      { name: 'Deep Reef', colors: ['color(display-p3 0.1460 0.2324 0.4324)', 'color(display-p3 0.2029 0.3178 0.5770)'], direction: 135 },
      { name: 'Arctic Bay', colors: ['color(display-p3 0.1460 0.2324 0.4324)', 'color(display-p3 0.2029 0.3178 0.5770)', 'color(display-p3 0.9191 0.9591 0.9172)'], direction: 180 },
      { name: 'Aqua', colors: ['color(display-p3 0.3553 0.7765 0.9790)', 'color(display-p3 0.6744 0.9857 0.6528)'], direction: 135 },
      { name: 'Ice Lake', colors: ['color(display-p3 0.5396 0.6394 0.8154)', 'color(display-p3 0.7711 0.9769 0.9949)'], direction: 135 },
      { name: 'Marine', colors: ['color(display-p3 0.3347 0.6994 0.8610)', 'color(display-p3 0.0056 0.0303 0.3037)'], direction: 180 },
    ],
  },
  {
    name: 'Cosmic',
    presets: [
      { name: 'Midnight', colors: ['color(display-p3 0.0569 0.0475 0.1540)', 'color(display-p3 0.1849 0.1693 0.3748)', 'color(display-p3 0.1412 0.1412 0.2360)'], direction: 135 },
      { name: 'Velvet', colors: ['color(display-p3 0.3793 0.0723 0.4312)', 'color(display-p3 0.6463 0.5199 0.6245)', 'color(display-p3 0.9507 0.9040 0.8110)'], direction: 135 },
      { name: 'Berry', colors: ['color(display-p3 0.5139 0.2040 0.8538)', 'color(display-p3 0.2632 0.0294 0.8433)'], direction: 135 },
      { name: 'Indigo Night', colors: ['color(display-p3 0.4187 0.4913 0.8894)', 'color(display-p3 0.4385 0.3016 0.6157)'], direction: 135 },
      { name: 'Nebula', colors: ['color(display-p3 0.2412 0.1649 0.3417)', 'color(display-p3 0.1671 0.0387 0.2522)'], direction: 135 },
      { name: 'Galaxy', colors: ['color(display-p3 0.2438 0.1577 0.3415)', 'color(display-p3 0.4282 0.3010 0.4199)'], direction: 135 },
      { name: 'Purple Haze', colors: ['color(display-p3 0.3090 0.0989 0.6632)', 'color(display-p3 0.8554 0.8399 0.4344)'], direction: 135 },
      { name: 'Void', colors: ['color(display-p3 0.0000 0.0000 0.0000)', 'color(display-p3 0.2627 0.2627 0.2627)'], direction: 180 },
    ],
  },
  {
    name: 'Aurora',
    presets: [
      { name: 'Aurora', colors: ['color(display-p3 0.3553 0.7765 0.9790)', 'color(display-p3 0.6744 0.9857 0.6528)'], direction: 135 },
      { name: 'Emerald Glow', colors: ['color(display-p3 0.2743 0.5910 0.5559)', 'color(display-p3 0.4682 0.9240 0.5370)'], direction: 135 },
      { name: 'Mint Forest', colors: ['color(display-p3 0.3076 0.6798 0.6096)', 'color(display-p3 0.6299 0.7826 0.3318)'], direction: 135 },
      { name: 'Forest', colors: ['color(display-p3 0.1468 0.3013 0.3616)', 'color(display-p3 0.5009 0.6914 0.5185)'], direction: 135 },
      { name: 'Spring Bud', colors: ['color(display-p3 0.7045 0.8723 0.4544)', 'color(display-p3 0.4220 0.6628 0.2647)'], direction: 135 },
      { name: 'Polar', colors: ['color(display-p3 0.8856 0.9164 0.9816)', 'color(display-p3 0.8226 0.8687 0.9451)'], direction: 135 },
      { name: 'Sage', colors: ['color(display-p3 0.6768 0.7501 0.9801)', 'color(display-p3 0.2353 0.1719 0.5660)'], direction: 135 },
      { name: 'Lush Field', colors: ['color(display-p3 0.4220 0.6628 0.2647)', 'color(display-p3 0.7045 0.8723 0.4544)'], direction: 180 },
    ],
  },
  {
    name: 'Vivid',
    presets: [
      { name: 'Vapor', colors: ['color(display-p3 0.9161 0.4041 0.4968)', 'color(display-p3 0.7792 0.6308 0.9649)', 'color(display-p3 0.4343 0.5070 0.9533)'], direction: 135 },
      { name: 'Tropical', colors: ['color(display-p3 0.9162 0.6098 0.2481)', 'color(display-p3 0.9717 0.8302 0.2800)', 'color(display-p3 0.3950 0.8193 0.9742)'], direction: 135 },
      { name: 'Candy', colors: ['color(display-p3 0.9161 0.4041 0.4968)', 'color(display-p3 0.4343 0.5070 0.9533)'], direction: 135 },
      { name: 'Neon', colors: ['color(display-p3 0.4336 0.9350 0.4502)', 'color(display-p3 0.1991 0.4517 0.8721)'], direction: 135 },
      { name: 'Warm Glow', colors: ['color(display-p3 0.8904 0.5935 0.9614)', 'color(display-p3 0.8901 0.3848 0.4354)'], direction: 135 },
      { name: 'Fire', colors: ['color(display-p3 0.8955 0.2867 0.1460)', 'color(display-p3 0.9528 0.8367 0.3117)'], direction: 135 },
      { name: 'Lush Tropics', colors: ['color(display-p3 0.9121 0.3345 0.4301)', 'color(display-p3 0.2734 0.3654 0.9487)'], direction: 135 },
      { name: 'Citrus', colors: ['color(display-p3 0.9492 0.6885 0.4219)', 'color(display-p3 0.7378 0.4888 0.7965)', 'color(display-p3 0.4255 0.7432 0.7768)'], direction: 135 },
    ],
  },
  {
    name: 'Pastel',
    presets: [
      { name: 'Lavender', colors: ['color(display-p3 0.6178 0.5520 0.8011)', 'color(display-p3 0.9496 0.7696 0.9123)'], direction: 135 },
      { name: 'Rose', colors: ['color(display-p3 0.8871 0.6260 0.6580)', 'color(display-p3 0.9781 0.8715 0.8834)'], direction: 135 },
      { name: 'Mint Cream', colors: ['color(display-p3 0.8620 0.9836 0.5428)', 'color(display-p3 0.6586 0.8938 0.6553)'], direction: 135 },
      { name: 'Soft Sky', colors: ['color(display-p3 0.7908 0.9092 0.9761)', 'color(display-p3 0.6585 0.7646 0.9733)'], direction: 135 },
      { name: 'Cotton Candy', colors: ['color(display-p3 0.9528 0.7920 0.8310)', 'color(display-p3 0.5908 0.5846 0.9165)'], direction: 135 },
      { name: 'Powder', colors: ['color(display-p3 0.9908 0.9846 0.9844)', 'color(display-p3 0.9230 0.9292 0.9329)'], direction: 135 },
      { name: 'Sherbet', colors: ['color(display-p3 0.9539 0.8219 0.7764)', 'color(display-p3 0.9712 0.8264 0.9884)'], direction: 135 },
      { name: 'Mist', colors: ['color(display-p3 0.9063 0.8721 0.9719)', 'color(display-p3 0.9850 0.9881 0.8714)'], direction: 135 },
    ],
  },
  {
    name: 'Glow',
    presets: [
      { name: 'Spotlight', colors: ['color(display-p3 0.9712 0.8264 0.6121)', 'color(display-p3 0.5535 0.8721 0.9494)'], direction: 0, type: 'radial', radialPosition: 'center' },
      { name: 'Sunburst', colors: ['color(display-p3 0.9905 0.9470 0.3148)', 'color(display-p3 0.9394 0.5647 0.2075)', 'color(display-p3 0.8263 0.2538 0.4439)'], direction: 0, type: 'radial', radialPosition: 'top' },
      { name: 'Coral Pop', colors: ['color(display-p3 0.9452 0.6226 0.6277)', 'color(display-p3 0.9539 0.8219 0.7764)'], direction: 0, type: 'radial', radialPosition: 'center' },
      { name: 'Halo', colors: ['color(display-p3 0.6585 0.7646 0.9733)', 'color(display-p3 0.7908 0.9092 0.9761)', 'color(display-p3 0.0569 0.0475 0.1540)'], direction: 0, type: 'radial', radialPosition: 'center' },
      { name: 'Aurora Halo', colors: ['color(display-p3 0.2743 0.5910 0.5559)', 'color(display-p3 0.4682 0.9240 0.5370)', 'color(display-p3 0.0569 0.0475 0.1540)'], direction: 0, type: 'radial', radialPosition: 'center' },
      { name: 'Bloom', colors: ['color(display-p3 0.9718 0.8937 0.5871)', 'color(display-p3 0.8943 0.5291 0.5180)'], direction: 0, type: 'radial', radialPosition: 'top' },
      { name: 'Lift', colors: ['color(display-p3 1.0000 1.0000 1.0000)', 'color(display-p3 0.8785 0.9123 0.9920)', 'color(display-p3 0.6768 0.7501 0.9801)'], direction: 0, type: 'radial', radialPosition: 'bottom' },
      { name: 'Side Beam', colors: ['color(display-p3 0.9138 0.4712 0.6032)', 'color(display-p3 0.9772 0.8864 0.3782)'], direction: 0, type: 'radial', radialPosition: 'left' },
    ],
  },
  {
    name: 'Mesh',
    presets: [
      { name: 'Iris', colors: ['color(display-p3 0.4187 0.4913 0.8894)', 'color(display-p3 0.4385 0.3016 0.6157)', 'color(display-p3 0.8904 0.5935 0.9614)'], direction: 45 },
      { name: 'Rainbow Wash', colors: ['color(display-p3 0.9452 0.6226 0.6277)', 'color(display-p3 0.9539 0.8219 0.7764)', 'color(display-p3 0.9496 0.7696 0.9123)', 'color(display-p3 0.6178 0.5520 0.8011)', 'color(display-p3 0.9496 0.7696 0.9123)'], direction: 135 },
      { name: 'Lava Lamp', colors: ['color(display-p3 0.8563 0.1932 0.4718)', 'color(display-p3 0.9300 0.4523 0.1811)', 'color(display-p3 0.9592 0.7405 0.2543)'], direction: 60 },
      { name: 'Aurora Mesh', colors: ['color(display-p3 0.3496 0.7649 0.9783)', 'color(display-p3 0.1893 0.4400 0.9652)', 'color(display-p3 0.4527 0.2736 0.5742)'], direction: 135 },
      { name: 'Cyber', colors: ['color(display-p3 0.9121 0.3345 0.4301)', 'color(display-p3 0.2734 0.3654 0.9487)', 'color(display-p3 0.4584 0.9853 0.5776)'], direction: 135 },
      { name: 'Sunset Mesh', colors: ['color(display-p3 0.9310 0.4660 0.5081)', 'color(display-p3 0.7816 0.9089 0.9905)', 'color(display-p3 0.9480 0.6482 0.5232)'], direction: 90 },
      { name: 'Pearl', colors: ['color(display-p3 0.8597 0.7688 0.9725)', 'color(display-p3 0.6026 0.7666 0.9692)', 'color(display-p3 0.9740 0.8452 0.8779)'], direction: 135 },
      { name: 'Mountain Air', colors: ['color(display-p3 0.4311 0.7969 0.6458)', 'color(display-p3 0.1743 0.3478 0.5966)', 'color(display-p3 0.9637 0.7741 0.4923)'], direction: 180 },
      { name: 'Liquid', colors: ['color(display-p3 0.6178 0.5520 0.8011)', 'color(display-p3 0.9496 0.7696 0.9123)', 'color(display-p3 0.6339 0.9694 0.7142)', 'color(display-p3 0.6193 0.8204 0.9432)'], direction: 135 },
    ],
  },
];

// --- Flat backward-compat exports --------------------------------------------
// Some older call sites import the flat lists directly. Keep them working by
// flattening the categorized data so we have a single source of truth.

export const SOLID_PRESETS: string[] = SOLID_CATEGORIES.flatMap((c) => c.colors);
export const GRADIENT_PRESETS: GradientPreset[] = GRADIENT_CATEGORIES.flatMap((c) => c.presets);

// --- Koubou device color hex map (unchanged) ---------------------------------

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
