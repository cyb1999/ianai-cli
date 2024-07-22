#!/usr/bin/env node
import { Command } from 'commander';
import readline from 'readline';

import pageJson from '../package.json';
import { clearHistory } from './clear-history';
import commitCommand from './commands/commit';
import configCommand from './commands/config';
import sendMessageCommand from './commands/send-message';

const program = new Command();
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});
program
  .version(pageJson.version)
  .description('A CLI tool to interact with the DeepSeek chat API')
  .option('--debug', 'Enable debug mode')
  .option('--init', 'Initialize settings');

program
  .command('config <action> <key> [value]')
  .description('Manage configuration')
  .action(async (action, key, value) => {
    await configCommand(rl, action, key, value);
  });

program
  .command('commit [option]')
  .description('generate a commit message')
  .option(
    '-g, --generate <count>',
    'generate specified number of commit messages'
  )
  .option('-m, --maxlength <length>', 'set maximum length of commit messages')
  .option(
    '-t --type <type>',
    'Formatting submission information according to regular submission specifications'
  )
  .action(async (_, cmd) => {
    await commitCommand(rl, cmd);
  });

program
  .arguments('[args...]')
  .description(
    'Send a message to an AI.\nUsage: ai <your-input-message>\nExample: ai echo Hello, World!'
  )
  .action(async (message, cmd) => {
    const userPrompt = message.join(' ');
    await sendMessageCommand(rl, userPrompt, cmd);
  });

program.parse(process.argv);
