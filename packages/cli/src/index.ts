#!/usr/bin/env node

import { VERSION } from '@appframe/core';

const args = process.argv.slice(2);

if (args.includes('--version') || args.includes('-v')) {
  console.log(`appframe v${VERSION}`);
  process.exit(0);
}

if (args.includes('--help') || args.includes('-h') || args.length === 0) {
  console.log(`
appframe v${VERSION}
Generate professional App Store & Play Store promotional screenshots.

Usage:
  appframe <command> [options]

Commands:
  init        Create a new appframe config for your app
  generate    Generate screenshots from config
  preview     Open web preview for tweaking
  capture     Capture screenshots from simulator/emulator
  frames      Manage device frames
  validate    Validate config file
  upload      Upload screenshots to stores

Options:
  -v, --version  Show version
  -h, --help     Show help

Run "appframe <command> --help" for more info on a command.
`);
  process.exit(0);
}

console.log(`Unknown command: ${args[0]}`);
console.log('Run "appframe --help" for usage information.');
process.exit(1);
