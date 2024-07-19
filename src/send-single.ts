import chalk from 'chalk';
import clipboardy from 'clipboardy'; // 需要安装 clipboardy 模块
import { execaCommand } from 'execa';

import { outro, select, spinner } from '@clack/prompts';

import { CommandResponse } from './command-response-schema';
import { systemPrompt } from './constants/settings-constants';
import { createDeepseekMessage } from './create-deepseek-message';
import { getSettings } from './settings/get-settings';
import { logger } from './utils/logger';
import { generateSectionTemplate } from './utils/str';

export type Payload = {
  message: string;
  model_class: string;
  stream: boolean;
  model_preference: string | null;
  temperature: number;
};

const selectOptions = {
  message: 'Select one option:',
  options: [
    { value: 'run', label: 'Run command' },
    { value: 'copy', label: 'Copy to clipboard' },
    { value: 'exit', label: 'Exit' }
  ]
};
export async function sendSingle({
  message,
  rl
}: {
  message: string;
  rl: any;
  isError?: boolean;
}) {
  const settings = await getSettings({ rl });

  const userMessage = generateSectionTemplate('User Prompt', `${message}`);

  const infoSpin = spinner();
  infoSpin.start('Sending message to AI...');

  try {
    const response = await createDeepseekMessage<CommandResponse>({
      rl,
      metadata: settings.metadata,
      systemPrompt,
      message: userMessage
    });
    infoSpin.stop();

    const { command } = response;
    logger.info(`>`, command);

    if (command == 'UNKNOWN') {
      outro(chalk.red('Failed to generate command from AI'));
      process.exit(0);
    }

    const selected = await select(selectOptions);

    if (selected === 'run') {
      outro(`Executing ${chalk.cyan(command)}`);
      try {
        await execaCommand(command, {
          stdio: 'inherit',
          shell: process.env.SHELL || true
        });
      } catch (error) {}
    } else if (selected === 'copy') {
      clipboardy.writeSync(command);
      logger.success('✅ Copied to the clipboard!');
    }
    process.exit(0);
  } catch (err) {
    logger.error('Failed to parse endpoint response as JSON');
    logger.error(err);
    process.exit(1);
  }
}
