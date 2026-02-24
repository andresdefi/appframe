import { Command } from 'commander';
import { resolve, join } from 'node:path';
import { mkdir } from 'node:fs/promises';
import { execFileSync } from 'node:child_process';
import chalk from 'chalk';

interface CaptureOptions {
  platform: string;
  device?: string;
  output: string;
  count: string;
  delay: string;
  interactive: boolean;
}

function listIOSSimulators(): string[] {
  try {
    const output = execFileSync('xcrun', ['simctl', 'list', 'devices', 'available', '-j'], {
      encoding: 'utf-8',
    });
    const data = JSON.parse(output) as {
      devices: Record<string, Array<{ name: string; udid: string; state: string }>>;
    };
    const devices: string[] = [];
    for (const [runtime, devs] of Object.entries(data.devices)) {
      for (const dev of devs) {
        if (dev.state === 'Booted') {
          devices.push(`${dev.name} (${dev.udid}) [${runtime.split('.').pop()}] — Booted`);
        }
      }
    }
    return devices;
  } catch {
    return [];
  }
}

function listAndroidDevices(): string[] {
  try {
    const output = execFileSync('adb', ['devices', '-l'], { encoding: 'utf-8' });
    const lines = output.trim().split('\n').slice(1);
    return lines
      .filter((line) => line.includes('device'))
      .map((line) => line.trim());
  } catch {
    return [];
  }
}

function getBootedIOSSimulatorUDID(): string | null {
  try {
    const output = execFileSync('xcrun', ['simctl', 'list', 'devices', 'booted', '-j'], {
      encoding: 'utf-8',
    });
    const data = JSON.parse(output) as {
      devices: Record<string, Array<{ udid: string }>>;
    };
    for (const devs of Object.values(data.devices)) {
      if (devs.length > 0 && devs[0]) return devs[0].udid;
    }
    return null;
  } catch {
    return null;
  }
}

function captureIOSScreenshot(udid: string, outputPath: string): void {
  execFileSync('xcrun', ['simctl', 'io', udid, 'screenshot', outputPath], { stdio: 'pipe' });
}

function captureAndroidScreenshot(device: string | undefined, outputPath: string): void {
  const args = device
    ? ['-s', device, 'exec-out', 'screencap', '-p']
    : ['exec-out', 'screencap', '-p'];
  const buffer = execFileSync('adb', args);
  const { writeFileSync } = require('node:fs') as typeof import('node:fs');
  writeFileSync(outputPath, buffer);
}

function waitForKeypress(message: string): Promise<void> {
  return new Promise((res) => {
    process.stdout.write(message);
    process.stdin.setRawMode(true);
    process.stdin.resume();
    process.stdin.once('data', () => {
      process.stdin.setRawMode(false);
      process.stdin.pause();
      console.log();
      res();
    });
  });
}

function sleep(ms: number): Promise<void> {
  return new Promise((res) => setTimeout(res, ms));
}

function commandExists(cmd: string): boolean {
  try {
    execFileSync('which', [cmd], { stdio: 'pipe' });
    return true;
  } catch {
    return false;
  }
}

export const captureCommand = new Command('capture')
  .description('Capture screenshots from iOS Simulator or Android Emulator')
  .option('-p, --platform <platform>', 'Platform to capture from (ios, android)', 'ios')
  .option('-d, --device <id>', 'Device name or ID (auto-detects if omitted)')
  .option('-o, --output <dir>', 'Output directory for screenshots', './screenshots')
  .option('-n, --count <number>', 'Number of screenshots to capture', '1')
  .option('--delay <ms>', 'Delay between captures in timed mode (ms)', '0')
  .option('-i, --interactive', 'Press Enter to capture each screenshot', false)
  .action(async (options: CaptureOptions) => {
    const platform = options.platform.toLowerCase();
    const outputDir = resolve(options.output);
    const count = parseInt(options.count, 10);
    const delay = parseInt(options.delay, 10);

    await mkdir(outputDir, { recursive: true });

    if (platform === 'ios') {
      if (!commandExists('xcrun')) {
        console.log(chalk.red('xcrun not found. Make sure Xcode is installed.'));
        process.exit(1);
      }

      const udid = options.device ?? getBootedIOSSimulatorUDID();
      if (!udid) {
        console.log(chalk.red('No booted iOS Simulator found.'));
        console.log(chalk.dim('\nAvailable booted simulators:'));
        const sims = listIOSSimulators();
        if (sims.length === 0) {
          console.log(chalk.dim('  None running. Boot a simulator first:'));
          console.log(chalk.dim('  open -a Simulator'));
        } else {
          sims.forEach((s) => console.log(chalk.dim(`  ${s}`)));
        }
        process.exit(1);
      }

      console.log(chalk.blue(`Capturing ${count} screenshot(s) from iOS Simulator...\n`));

      for (let i = 0; i < count; i++) {
        if (options.interactive) {
          await waitForKeypress(chalk.dim(`  Press any key to capture screenshot ${i + 1}/${count}...`));
        } else if (delay > 0 && i > 0) {
          await sleep(delay);
        }

        const filename = `screen-${i + 1}.png`;
        const outputPath = join(outputDir, filename);

        try {
          captureIOSScreenshot(udid, outputPath);
          console.log(`  ${chalk.green('+')} ${filename}`);
        } catch (err) {
          const message = err instanceof Error ? err.message : 'Unknown error';
          console.log(`  ${chalk.red('x')} ${filename} — ${message}`);
        }
      }
    } else if (platform === 'android') {
      if (!commandExists('adb')) {
        console.log(chalk.red('adb not found. Make sure Android SDK is installed and adb is in PATH.'));
        process.exit(1);
      }

      const devices = listAndroidDevices();
      if (devices.length === 0) {
        console.log(chalk.red('No connected Android devices found.'));
        console.log(chalk.dim('Start an emulator or connect a device via USB.'));
        process.exit(1);
      }

      console.log(chalk.blue(`Capturing ${count} screenshot(s) from Android device...\n`));

      for (let i = 0; i < count; i++) {
        if (options.interactive) {
          await waitForKeypress(chalk.dim(`  Press any key to capture screenshot ${i + 1}/${count}...`));
        } else if (delay > 0 && i > 0) {
          await sleep(delay);
        }

        const filename = `screen-${i + 1}.png`;
        const outputPath = join(outputDir, filename);

        try {
          captureAndroidScreenshot(options.device, outputPath);
          console.log(`  ${chalk.green('+')} ${filename}`);
        } catch (err) {
          const message = err instanceof Error ? err.message : 'Unknown error';
          console.log(`  ${chalk.red('x')} ${filename} — ${message}`);
        }
      }
    } else {
      console.log(chalk.red(`Unknown platform: ${platform}. Use "ios" or "android".`));
      process.exit(1);
    }

    console.log(chalk.green(`\nScreenshots saved to ${outputDir}`));
  });
