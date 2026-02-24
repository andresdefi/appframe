import { Command } from 'commander';
import chalk from 'chalk';
import { listFrames } from '@appframe/core';

export const framesCommand = new Command('frames')
  .description('Manage device frames');

framesCommand
  .command('list')
  .description('List available device frames')
  .action(async () => {
    try {
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
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      console.log(chalk.red(`Failed to load frames: ${message}`));
      process.exit(1);
    }
  });

framesCommand
  .command('add <path>')
  .description('Add a custom device frame')
  .action((path: string) => {
    console.log(chalk.yellow(`Custom frame import not yet implemented: ${path}`));
    console.log(chalk.dim('To add a frame manually, add an SVG to frames/ and update manifest.json.'));
  });
