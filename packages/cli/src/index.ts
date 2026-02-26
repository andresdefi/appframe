#!/usr/bin/env node

import { Command } from 'commander';
import { VERSION } from '@appframe/core';
import { initCommand } from './commands/init.js';
import { generateCommand } from './commands/generate.js';
import { validateCommand } from './commands/validate.js';
import { framesCommand } from './commands/frames.js';
import { captureCommand } from './commands/capture.js';
import { previewCommand } from './commands/preview.js';
import { uploadCommand } from './commands/upload.js';
import { koubouConfigCommand } from './commands/koubou-config.js';
import { setupCommand } from './commands/setup.js';

const program = new Command();

program
  .name('appframe')
  .description('Generate professional App Store & Play Store promotional screenshots')
  .version(VERSION, '-v, --version');

program.addCommand(initCommand);
program.addCommand(generateCommand);
program.addCommand(validateCommand);
program.addCommand(framesCommand);
program.addCommand(captureCommand);
program.addCommand(previewCommand);
program.addCommand(uploadCommand);
program.addCommand(koubouConfigCommand);
program.addCommand(setupCommand);

program.parse();
