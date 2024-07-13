#!/usr/bin/env node
import { Command } from 'commander';
import readline from 'readline';

import pageJson from '../package.json';
import configCommand from './commands/config';
import sendMessageCommand from './commands/send-message';
import { initSettings } from './settings/init-settings';
import { logger } from './utils/logger';

const program = new Command();
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});
program
  .version(pageJson.version)
  .description('A CLI tool to interact with the DeepSeek chat API')
  .option('--debug', 'Enable debug mode')
  .option('--init', 'Initialize settings')
  .action(async (cmd) => {
    if (cmd.debug) {
      logger.info('Debug mode enabled');
    }

    if (cmd.init) {
      const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
      });
      await initSettings(rl);
    }
  });

program
  .command('config <action> <key> [value]')
  .description('Manage configuration')
  .action(async (action, key, value) => {
    await configCommand(rl, action, key, value);
  });

program
  .arguments('[args...]')
  .description('Send a message to a ai')
  .action(async (message, cmd) => {
    const userPrompt = message.join(' ');
    await sendMessageCommand(rl, userPrompt, cmd);
  });
program.parse(process.argv);
