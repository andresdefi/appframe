import { Command } from 'commander';
import { writeFile, access } from 'node:fs/promises';
import { resolve } from 'node:path';
import chalk from 'chalk';
import type { TemplateStyle, Platform } from '@appframe/core';

interface InitOptions {
  output?: string;
  name?: string;
  style?: TemplateStyle;
  force?: boolean;
}

function generateConfig(opts: {
  name: string;
  description: string;
  platforms: Platform[];
  style: TemplateStyle;
  features: string[];
}): string {
  const { name, description, platforms, style, features } = opts;

  const themePresets: Record<TemplateStyle, { primary: string; secondary: string; background: string; text: string; subtitle: string }> = {
    minimal: {
      primary: '#2563EB',
      secondary: '#7C3AED',
      background: '#F8FAFC',
      text: '#0F172A',
      subtitle: '#64748B',
    },
    bold: {
      primary: '#FF4D6A',
      secondary: '#7B2FFF',
      background: '#1A1A2E',
      text: '#FFFFFF',
      subtitle: '#E2E8F0',
    },
    glow: {
      primary: '#6366F1',
      secondary: '#EC4899',
      background: '#0A0A0F',
      text: '#F8FAFC',
      subtitle: '#94A3B8',
    },
    playful: {
      primary: '#F59E0B',
      secondary: '#10B981',
      background: '#FFF7ED',
      text: '#1C1917',
      subtitle: '#78716C',
    },
    clean: {
      primary: '#000000',
      secondary: '#666666',
      background: '#FFFFFF',
      text: '#000000',
      subtitle: '#6B7280',
    },
    branded: {
      primary: '#FF6B00',
      secondary: '#FF9A45',
      background: '#FF6B00',
      text: '#FFFFFF',
      subtitle: '#FFFFFFCC',
    },
    editorial: {
      primary: '#8B7355',
      secondary: '#A0926B',
      background: '#F5F0E8',
      text: '#2C2416',
      subtitle: '#7A7062',
    },
    fullscreen: {
      primary: '#000000',
      secondary: '#000000',
      background: '#000000',
      text: '#FFFFFF',
      subtitle: '#CCCCCC',
    },
  };

  const colors = themePresets[style];

  const featuresYaml = features.length > 0
    ? features.map((f) => `    - "${f}"`).join('\n')
    : '    - "Feature 1"\n    - "Feature 2"\n    - "Feature 3"';

  const platformsYaml = platforms.map((p) => `"${p}"`).join(', ');

  let iosOutput = '';
  let androidOutput = '';

  if (platforms.includes('ios')) {
    iosOutput = `
  ios:
    sizes: [6.7, 6.5]
    format: png`;
  }

  if (platforms.includes('android')) {
    androidOutput = `
  android:
    sizes: ["phone"]
    format: png
    featureGraphic: true`;
  }

  return `# appframe config — ${name}
# Docs: https://github.com/appframe/appframe
#
# Copy tips — screenshots are ads, not docs:
#   - One idea per headline (never use "and")
#   - 3-5 words per line, readable at thumbnail size
#   - Three approaches: paint a moment, state an outcome, kill a pain
#   - Use \\n for intentional line breaks

app:
  name: "${name}"
  description: "${description}"
  platforms: [${platformsYaml}]
  features:
${featuresYaml}

theme:
  style: ${style}
  colors:
    primary: "${colors.primary}"
    secondary: "${colors.secondary}"
    background: "${colors.background}"
    text: "${colors.text}"
    subtitle: "${colors.subtitle}"
  font: inter
  fontWeight: 600

frames:
  ${platforms.includes('ios') ? 'ios: generic-phone' : '# ios: generic-phone'}
  ${platforms.includes('android') ? 'android: generic-phone' : '# android: generic-phone'}
  style: flat

# Vary layouts across slides — don't use the same composition for every screen.
# Compositions: single, duo-overlap, duo-split, hero-tilt, fanned-cards
screens:
  - screenshot: screenshots/screen-1.png
    headline: "Your main headline here"
    subtitle: "A supporting line that adds context"
    layout: center
    composition: single

  - screenshot: screenshots/screen-2.png
    headline: "Highlight a key feature"
    layout: angled-right

  - screenshot: screenshots/screen-3.png
    headline: "Show another great feature"
    layout: center

# Per-screen background override — alternate light/dark for visual rhythm:
#   background: "#1E1B4B"

# locales:
#   es:
#     screens:
#       - headline: "Tu titular principal aqui"
#         subtitle: "Una linea de apoyo que agrega contexto"
#       - headline: "Destaca una funcion clave"
#       - headline: "Muestra otra gran funcion"

output:
  platforms: [${platformsYaml}]${iosOutput}${androidOutput}
  directory: ./output
`;
}

export const initCommand = new Command('init')
  .description('Create a new appframe config for your app')
  .option('-o, --output <path>', 'Output path for config file', 'appframe.yml')
  .option('-n, --name <name>', 'App name')
  .option('-s, --style <style>', 'Template style (minimal, bold, glow, playful, clean, branded, editorial)')
  .option('-f, --force', 'Overwrite existing config', false)
  .action(async (options: InitOptions) => {
    const outputPath = resolve(options.output ?? 'appframe.yml');

    // Check if file already exists
    if (!options.force) {
      try {
        await access(outputPath);
        console.log(
          chalk.red(`Config file already exists: ${outputPath}`),
        );
        console.log(chalk.dim('Use --force to overwrite.'));
        process.exit(1);
      } catch {
        // File doesn't exist, good to go
      }
    }

    const name = options.name ?? 'My App';
    const style = (options.style as TemplateStyle | undefined) ?? 'minimal';
    const platforms: Platform[] = ['ios', 'android'];
    const description = 'A great app that does great things';
    const features = ['Feature 1', 'Feature 2', 'Feature 3'];

    const config = generateConfig({ name, description, platforms, style, features });

    await writeFile(outputPath, config, 'utf-8');

    console.log(chalk.green(`Created ${outputPath}`));
    console.log();
    console.log(chalk.dim('Next steps:'));
    console.log(chalk.dim('  1. Edit the config with your app details'));
    console.log(chalk.dim('  2. Add your screenshots to the screenshots/ folder'));
    console.log(chalk.dim('  3. Run: appframe generate'));
  });
