import { Command } from 'commander';
import { resolve } from 'node:path';
import chalk from 'chalk';
import { getUploadPlan, uploadScreenshots } from '@appframe/store-upload';

interface UploadOptions {
  config: string;
  platform?: string;
  locale?: string;
  dryRun?: boolean;
  yes?: boolean;
}

export const uploadCommand = new Command('upload')
  .description('Upload screenshots to App Store Connect and/or Google Play Console')
  .option('-c, --config <path>', 'Path to config file', 'appframe.yml')
  .option('-p, --platform <platform>', 'Upload to specific platform (ios, android)')
  .option('-l, --locale <code>', 'Upload specific locale only')
  .option('--dry-run', 'Show what would be uploaded without uploading')
  .option('-y, --yes', 'Skip confirmation prompt')
  .action(async (options: UploadOptions) => {
    const configPath = resolve(options.config);

    console.log(chalk.blue('appframe upload\n'));

    const platform = options.platform === 'ios' || options.platform === 'android'
      ? options.platform
      : undefined;

    try {
      // Show upload plan first
      const plans = await getUploadPlan({
        configPath,
        platform,
        locale: options.locale,
      });

      if (plans.length === 0) {
        console.log(chalk.yellow('No screenshots found to upload.'));
        console.log(chalk.dim('Run "appframe generate" first to generate screenshots.'));
        return;
      }

      console.log(chalk.white('Upload plan:\n'));
      for (const plan of plans) {
        const icon = plan.platform === 'ios' ? '' : '🤖';
        console.log(`  ${icon} ${chalk.cyan(plan.platform)} / ${chalk.green(plan.locale)} / ${chalk.dim(plan.displayType)}`);
        for (const file of plan.files) {
          console.log(chalk.dim(`    ${file}`));
        }
      }

      const totalFiles = plans.reduce((sum, p) => sum + p.files.length, 0);
      console.log(`\n  ${chalk.white(`Total: ${totalFiles} screenshots across ${plans.length} sets`)}\n`);

      if (options.dryRun) {
        console.log(chalk.dim('Dry run — no files were uploaded.'));
        return;
      }

      // Confirmation
      if (!options.yes) {
        console.log(chalk.yellow('⚠  This will replace existing screenshots in the store listings.'));
        console.log(chalk.dim('  Use --yes to skip this prompt, or --dry-run to preview.\n'));

        const readline = await import('node:readline');
        const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
        const answer = await new Promise<string>((resolve) => {
          rl.question(chalk.white('  Proceed with upload? [y/N] '), resolve);
        });
        rl.close();

        if (answer.toLowerCase() !== 'y') {
          console.log(chalk.dim('\n  Upload cancelled.'));
          return;
        }
        console.log();
      }

      // Required environment variables hint
      const hasIos = plans.some((p) => p.platform === 'ios');
      const hasAndroid = plans.some((p) => p.platform === 'android');

      if (hasIos) {
        const missing = ['ASC_ISSUER_ID', 'ASC_KEY_ID', 'ASC_APP_ID'].filter((k) => !process.env[k]);
        const hasKey = process.env['ASC_PRIVATE_KEY'] ?? process.env['ASC_PRIVATE_KEY_PATH'];
        if (!hasKey) missing.push('ASC_PRIVATE_KEY or ASC_PRIVATE_KEY_PATH');
        if (missing.length > 0) {
          console.log(chalk.red(`Missing iOS credentials: ${missing.join(', ')}`));
          console.log(chalk.dim('Set these environment variables to upload to App Store Connect.\n'));
          console.log(chalk.dim('  ASC_ISSUER_ID      — Issuer ID from App Store Connect > Users and Access > Keys'));
          console.log(chalk.dim('  ASC_KEY_ID         — Key ID of your API key'));
          console.log(chalk.dim('  ASC_PRIVATE_KEY    — The .p8 key content (or use ASC_PRIVATE_KEY_PATH)'));
          console.log(chalk.dim('  ASC_APP_ID         — Your app\'s Apple ID'));
          return;
        }
      }

      if (hasAndroid) {
        const missing = ['GOOGLE_PLAY_SERVICE_ACCOUNT', 'GOOGLE_PLAY_PACKAGE_NAME'].filter((k) => !process.env[k]);
        if (missing.length > 0) {
          console.log(chalk.red(`Missing Android credentials: ${missing.join(', ')}`));
          console.log(chalk.dim('Set these environment variables to upload to Google Play Console.\n'));
          console.log(chalk.dim('  GOOGLE_PLAY_SERVICE_ACCOUNT — Path to service account JSON key file'));
          console.log(chalk.dim('  GOOGLE_PLAY_PACKAGE_NAME   — Your app\'s package name (e.g. com.example.app)'));
          return;
        }
      }

      // Execute upload
      console.log(chalk.blue('Uploading...\n'));

      const summary = await uploadScreenshots({
        configPath,
        platform,
        locale: options.locale,
      });

      // Report results
      for (const result of summary.results) {
        const icon = result.platform === 'ios' ? '' : '🤖';
        if (result.errors.length > 0) {
          console.log(`  ${icon} ${chalk.cyan(result.platform)} / ${chalk.green(result.locale)} / ${chalk.dim(result.displayType)}`);
          console.log(chalk.green(`    ✓ ${result.uploaded.length} uploaded`));
          console.log(chalk.red(`    ✗ ${result.errors.length} failed:`));
          for (const err of result.errors) {
            console.log(chalk.red(`      ${err}`));
          }
        } else {
          console.log(`  ${icon} ${chalk.green('✓')} ${chalk.cyan(result.platform)} / ${chalk.green(result.locale)} — ${result.uploaded.length} uploaded`);
        }
      }

      console.log();
      if (summary.totalErrors > 0) {
        console.log(chalk.yellow(`Done with ${summary.totalErrors} errors. ${summary.totalUploaded} screenshots uploaded.`));
      } else {
        console.log(chalk.green(`Done! ${summary.totalUploaded} screenshots uploaded successfully.`));
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      console.error(chalk.red(`Upload failed: ${message}`));
      process.exit(1);
    }
  });
