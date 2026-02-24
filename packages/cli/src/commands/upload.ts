import { Command } from 'commander';
import { resolve } from 'node:path';
import chalk from 'chalk';

interface UploadOptions {
  config: string;
  platform?: string;
  locale?: string;
  dryRun?: boolean;
}

export const uploadCommand = new Command('upload')
  .description('Upload screenshots to App Store Connect and/or Google Play Console')
  .option('-c, --config <path>', 'Path to config file', 'appframe.yml')
  .option('-p, --platform <platform>', 'Upload to specific platform (ios, android, all)')
  .option('-l, --locale <code>', 'Upload specific locale only')
  .option('--dry-run', 'Show what would be uploaded without uploading')
  .action(async (options: UploadOptions) => {
    const configPath = resolve(options.config);

    console.log(chalk.blue('appframe upload\n'));

    if (options.dryRun) {
      console.log(chalk.dim('Dry run mode — would upload:'));
      console.log(chalk.dim(`  Config: ${configPath}`));
      console.log(chalk.dim(`  Platform: ${options.platform ?? 'all'}`));
      console.log(chalk.dim(`  Locale: ${options.locale ?? 'all'}`));
      console.log();
    }

    // TODO: Store upload implementation (Phase 10)
    console.log(chalk.yellow('Store upload not yet implemented (Phase 10).'));
    console.log();
    console.log(chalk.dim('Planned integrations:'));
    console.log(chalk.dim('  - App Store Connect API (requires API key)'));
    console.log(chalk.dim('  - Google Play Developer API (requires service account)'));
    console.log();
    console.log(chalk.dim('For now, upload screenshots manually from the output directory.'));
  });
