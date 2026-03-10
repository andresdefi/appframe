import { Command } from 'commander';
import chalk from 'chalk';
import { listFrames, getDeviceFamilies } from '@appframe/core';
import type { DeviceCategory } from '@appframe/core';

export const framesCommand = new Command('frames')
  .description('Manage device frames');

framesCommand
  .command('list')
  .description('List available device frames')
  .option('--koubou', 'Show full Koubou device catalog')
  .action(async (opts: { koubou?: boolean }) => {
    try {
      if (opts.koubou) {
        showKoubouCatalog();
        return;
      }

      const frames = await listFrames();

      console.log(chalk.blue('Available device frames:\n'));

      const grouped = new Map<string, typeof frames>();
      for (const frame of frames) {
        const key = frame.manufacturer;
        if (!grouped.has(key)) grouped.set(key, []);
        grouped.get(key)!.push(frame);
      }

      for (const [manufacturer, manufacturerFrames] of grouped) {
        console.log(chalk.bold(`  ${manufacturer.charAt(0).toUpperCase() + manufacturer.slice(1)}`));
        for (const frame of manufacturerFrames) {
          const tags = frame.tags.length > 0 ? chalk.dim(` (${frame.tags.join(', ')})`) : '';
          console.log(`    ${chalk.green(frame.id)} — ${frame.name} (${frame.year})${tags}`);
          console.log(chalk.dim(`      Screen: ${frame.screenResolution.width}x${frame.screenResolution.height} | Frame: ${frame.frameSize.width}x${frame.frameSize.height}`));
        }
        console.log();
      }

      console.log(chalk.dim(`  ${frames.length} frames available.`));
      console.log(chalk.dim(`  Use --koubou to see the full Koubou device catalog (${getDeviceFamilies().length} device families).`));
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      console.log(chalk.red(`Failed to load frames: ${message}`));
      process.exit(1);
    }
  });

function showKoubouCatalog(): void {
  const families = getDeviceFamilies();

  console.log(chalk.blue('Koubou device catalog:\n'));

  const categoryLabels: Record<DeviceCategory, string> = {
    iphone: 'iPhone',
    ipad: 'iPad',
    mac: 'Mac',
    watch: 'Apple Watch',
  };

  const grouped = new Map<DeviceCategory, typeof families>();
  for (const family of families) {
    if (!grouped.has(family.category)) grouped.set(family.category, []);
    grouped.get(family.category)!.push(family);
  }

  let totalDevices = 0;

  for (const [category, categoryFamilies] of grouped) {
    console.log(chalk.bold(`  ${categoryLabels[category]}`));
    for (const family of categoryFamilies) {
      const colorNames = family.colors.map(c => c.name).join(', ');
      const hasLandscape = family.landscapeColors && family.landscapeColors.length > 0;
      const orientations = hasLandscape ? 'Portrait + Landscape' : 'Portrait';
      const deviceCount = family.colors.length * (hasLandscape ? 2 : 1);
      totalDevices += deviceCount;

      const preview = family.previewFrameId
        ? chalk.dim(` [preview: ${family.previewFrameId}]`)
        : chalk.dim(' [export only]');

      console.log(`    ${chalk.green(family.id)} — ${family.name} (${family.year})${preview}`);
      console.log(chalk.dim(`      Colors: ${colorNames}`));
      console.log(chalk.dim(`      ${orientations} | ${family.screenResolution.width}x${family.screenResolution.height} | ${deviceCount} variant${deviceCount > 1 ? 's' : ''}`));
    }
    console.log();
  }

  console.log(chalk.dim(`  ${families.length} device families, ${totalDevices} total variants.`));
}

framesCommand
  .command('add <path>')
  .description('Add a custom device frame')
  .action((path: string) => {
    console.log(chalk.yellow(`Custom frame import not yet implemented: ${path}`));
    console.log(chalk.dim('To add a frame manually, add an SVG to frames/ and update manifest.json.'));
  });
