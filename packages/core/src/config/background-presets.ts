export interface GradientPreset {
  name: string;
  colors: string[];
  direction: number;
  type?: 'linear' | 'radial';
}

export const GRADIENT_PRESETS: GradientPreset[] = [
  { name: 'Sunset', colors: ['color(display-p3 0.9302 0.4557 0.2720)', 'color(display-p3 0.9399 0.7951 0.3768)', 'color(display-p3 0.9209 0.2963 0.4044)'], direction: 135 },
  { name: 'Ocean', colors: ['color(display-p3 0.1283 0.3163 0.8010)', 'color(display-p3 0.2908 0.3887 0.9343)', 'color(display-p3 0.4943 0.6875 0.9644)'], direction: 135 },
  { name: 'Aurora', colors: ['color(display-p3 0.3553 0.7765 0.9790)', 'color(display-p3 0.6744 0.9857 0.6528)'], direction: 135 },
  { name: 'Midnight', colors: ['color(display-p3 0.0569 0.0475 0.1540)', 'color(display-p3 0.1849 0.1693 0.3748)', 'color(display-p3 0.1412 0.1412 0.2360)'], direction: 135 },
  { name: 'Coral', colors: ['color(display-p3 0.9452 0.6226 0.6277)', 'color(display-p3 0.9667 0.8188 0.9300)'], direction: 135 },
  { name: 'Lavender', colors: ['color(display-p3 0.6178 0.5520 0.8011)', 'color(display-p3 0.9496 0.7696 0.9123)'], direction: 135 },
  { name: 'Emerald', colors: ['color(display-p3 0.2743 0.5910 0.5559)', 'color(display-p3 0.4682 0.9240 0.5370)'], direction: 135 },
  { name: 'Fire', colors: ['color(display-p3 0.8955 0.2867 0.1460)', 'color(display-p3 0.9528 0.8367 0.3117)'], direction: 135 },
  { name: 'Berry', colors: ['color(display-p3 0.5139 0.2040 0.8538)', 'color(display-p3 0.2632 0.0294 0.8433)'], direction: 135 },
  { name: 'Peach', colors: ['color(display-p3 0.9873 0.9281 0.8349)', 'color(display-p3 0.9470 0.7251 0.6392)'], direction: 135 },
  { name: 'Sky', colors: ['color(display-p3 0.2638 0.4950 0.7068)', 'color(display-p3 0.5310 0.8257 0.9645)', 'color(display-p3 1.0000 1.0000 1.0000)'], direction: 180 },
  { name: 'Dusk', colors: ['color(display-p3 0.1872 0.2412 0.3074)', 'color(display-p3 0.9255 0.4862 0.4442)'], direction: 135 },
  { name: 'Mint', colors: ['color(display-p3 0.3076 0.6798 0.6096)', 'color(display-p3 0.6299 0.7826 0.3318)'], direction: 135 },
  { name: 'Rose', colors: ['color(display-p3 0.8871 0.6260 0.6580)', 'color(display-p3 0.9781 0.8715 0.8834)'], direction: 135 },
  { name: 'Indigo', colors: ['color(display-p3 0.4187 0.4913 0.8894)', 'color(display-p3 0.4385 0.3016 0.6157)'], direction: 135 },
  { name: 'Slate', colors: ['color(display-p3 0.7454 0.7639 0.7786)', 'color(display-p3 0.1872 0.2412 0.3074)'], direction: 135 },
  { name: 'Candy', colors: ['color(display-p3 0.9161 0.4041 0.4968)', 'color(display-p3 0.4343 0.5070 0.9533)'], direction: 135 },
  { name: 'Forest', colors: ['color(display-p3 0.1468 0.3013 0.3616)', 'color(display-p3 0.5009 0.6914 0.5185)'], direction: 135 },
  { name: 'Neon', colors: ['color(display-p3 0.4336 0.9350 0.4502)', 'color(display-p3 0.1991 0.4517 0.8721)'], direction: 135 },
  { name: 'Warm', colors: ['color(display-p3 0.8904 0.5935 0.9614)', 'color(display-p3 0.8901 0.3848 0.4354)'], direction: 135 },
];

export const SOLID_PRESETS: string[] = [
  'color(display-p3 0.0000 0.0000 0.0000)', 'color(display-p3 0.1020 0.1020 0.1748)', 'color(display-p3 0.0952 0.1282 0.2351)', 'color(display-p3 0.1000 0.2008 0.3641)', 'color(display-p3 0.3080 0.2093 0.4963)',
  'color(display-p3 0.8438 0.3220 0.3882)', 'color(display-p3 0.9608 0.9608 0.9608)', 'color(display-p3 0.9804 0.9804 0.9804)', 'color(display-p3 0.1817 0.2031 0.2107)', 'color(display-p3 0.3963 0.4300 0.4450)',
  'color(display-p3 0.3229 0.7107 0.5877)', 'color(display-p3 0.3649 0.7958 0.7837)', 'color(display-p3 0.4132 0.3631 0.8745)', 'color(display-p3 0.9612 0.8036 0.4868)', 'color(display-p3 0.8255 0.4633 0.3612)',
  'color(display-p3 0.8795 0.9011 0.9122)', 'color(display-p3 0.7067 0.7436 0.7622)', 'color(display-p3 0.1872 0.2412 0.3074)', 'color(display-p3 0.5197 0.2825 0.6571)', 'color(display-p3 0.2638 0.4950 0.7068)',
];
