import { Command } from 'commander';
import { resolve } from 'node:path';
import { readFile } from 'node:fs/promises';
import chalk from 'chalk';
import { validateConfig } from '@appframe/core';
import { parse } from 'yaml';

interface ValidateOptions {
  config: string;
}

export const validateCommand = new Command('validate')
  .description('Validate an appframe config file')
  .option('-c, --config <path>', 'Path to config file', 'appframe.yml')
  .action(async (options: ValidateOptions) => {
    const configPath = resolve(options.config);

    let content: string;
    try {
      content = await readFile(configPath, 'utf-8');
    } catch {
      console.log(chalk.red(`Config file not found: ${configPath}`));
      process.exit(1);
    }

    let raw: unknown;
    try {
      raw = parse(content);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      console.log(chalk.red(`Invalid YAML: ${message}`));
      process.exit(1);
    }

    const result = validateConfig(raw);

    if (!result.success) {
      console.log(chalk.red('Config validation failed:\n'));
      for (const error of result.errors) {
        const path = error.path ? chalk.yellow(error.path) + ': ' : '';
        console.log(`  ${path}${error.message}`);
      }
      process.exit(1);
    }

    console.log(chalk.green('Config is valid.'));
    console.log();
    console.log(`  App:       ${result.config.app.name}`);
    console.log(`  Platforms: ${result.config.app.platforms.join(', ')}`);
    console.log(`  Style:     ${result.config.theme.style}`);
    console.log(`  Screens:   ${result.config.screens.length}`);
    console.log(`  Locales:   ${Object.keys(result.config.locales ?? {}).length || 'default only'}`);
  });
