#!/usr/bin/env node

import { Command } from 'commander';
import { VERSION } from '@appframe/core';
import { initCommand } from './commands/init.js';
import { generateCommand } from './commands/generate.js';
import { validateCommand } from './commands/validate.js';
import { framesCommand } from './commands/frames.js';

const program = new Command();

program
  .name('appframe')
  .description('Generate professional App Store & Play Store promotional screenshots')
  .version(VERSION, '-v, --version');

program.addCommand(initCommand);
program.addCommand(generateCommand);
program.addCommand(validateCommand);
program.addCommand(framesCommand);

program.parse();
