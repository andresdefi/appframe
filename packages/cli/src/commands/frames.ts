import { Command } from 'commander';
import chalk from 'chalk';

export const framesCommand = new Command('frames')
  .description('Manage device frames');

framesCommand
  .command('list')
  .description('List available device frames')
  .action(() => {
    // TODO: Read from frames/manifest.json (Phase 3)
    console.log(chalk.blue('Available device frames:\n'));
    console.log(chalk.dim('  Frame system not yet implemented (Phase 3).'));
    console.log(chalk.dim('  Built-in frames will include:'));
    console.log('    - iphone-16-pro-max');
    console.log('    - iphone-15-pro-max');
    console.log('    - ipad-pro-13');
    console.log('    - ipad-pro-11');
    console.log('    - pixel-10');
    console.log('    - pixel-9-pro');
    console.log('    - generic-phone');
    console.log('    - generic-tablet');
  });

framesCommand
  .command('add <path>')
  .description('Add a custom device frame')
  .action((path: string) => {
    // TODO: Implement in Phase 3
    console.log(chalk.yellow(`Frame import not yet implemented (Phase 3): ${path}`));
  });
