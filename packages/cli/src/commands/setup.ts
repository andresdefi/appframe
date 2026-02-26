import { Command } from 'commander';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import chalk from 'chalk';
import { detectKoubou } from '@appframe/core';

const execFileAsync = promisify(execFile);

export const setupCommand = new Command('setup')
  .description('Install optional dependencies (Koubou rendering engine)')
  .action(async () => {
    console.log(chalk.blue('Checking dependencies...\n'));

    // Check Koubou
    const detection = await detectKoubou();

    if (detection.available) {
      console.log(chalk.green(`  Koubou: installed (v${detection.version} at ${detection.binaryPath})`));
      console.log(chalk.dim('\n  All dependencies are installed.'));
      return;
    }

    console.log(chalk.yellow('  Koubou: not installed'));
    console.log(chalk.dim('  Koubou provides pixel-perfect rendering with 126+ device frames.\n'));
    console.log('Installing Koubou...\n');

    try {
      // Try pip install
      const { stdout, stderr } = await execFileAsync('pip3', ['install', 'koubou'], {
        timeout: 120_000,
      });

      if (stderr && !stderr.includes('Successfully installed')) {
        // pip warnings are normal, only show if it looks like an error
        const hasError = stderr.toLowerCase().includes('error');
        if (hasError) {
          console.log(chalk.yellow(stderr.trim()));
        }
      }

      if (stdout) {
        console.log(chalk.dim(stdout.trim()));
      }

      // Verify installation
      const verify = await detectKoubou();
      if (verify.available) {
        console.log(chalk.green(`\nKoubou v${verify.version} installed successfully!`));
        console.log(chalk.dim(`  Binary: ${verify.binaryPath}`));
        console.log(chalk.dim('\n  Use it with: appframe generate --renderer koubou'));
      } else {
        console.log(chalk.yellow('\npip install succeeded but kou binary not found on PATH.'));
        console.log(chalk.dim('  You may need to add the pip bin directory to your PATH.'));
        console.log(chalk.dim('  Try: export PATH="$HOME/Library/Python/3.9/bin:$PATH"'));
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      console.log(chalk.red(`\nFailed to install Koubou: ${message}`));
      console.log(chalk.dim('\nYou can install it manually:'));
      console.log(chalk.dim('  pip install koubou'));
      console.log(chalk.dim('  # or'));
      console.log(chalk.dim('  pip3 install koubou'));
      process.exit(1);
    }
  });
