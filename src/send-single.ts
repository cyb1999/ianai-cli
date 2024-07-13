import { exec as execCb } from 'child_process';
import clipboardy from 'clipboardy'; // 需要安装 clipboardy 模块
import { promisify } from 'util';

import { cancel, confirm, select, spinner } from '@clack/prompts';

import { getHeaders } from './settings/get-headers';
import { getSettings } from './settings/get-settings';
import { systemPrompt } from './settings/settings-constants';
import { logger } from './utils/logger';
import { safeJsonParse } from './utils/parse';
import {
  generateSectionTemplate,
  joinStrings,
  removedJsonPrefix,
} from './utils/str';

const exec = promisify(execCb);

export const isDebug = process.argv.includes('--debug');

type Payload = {
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
    { value: 'exit', label: 'Exit' },
  ],
};
export async function sendSingle({
  message,
  rl,
}: {
  message: string;
  rl: any;
  isError?: boolean;
}) {
  const settings = await getSettings({ rl });

  const payload: Payload = {
    message: '',
    model_class: '',
    stream: true,
    model_preference: null,
    temperature: 0,
  };

  if (settings.model_class) {
    payload.model_class = settings.model_class;
  }

  let metadataStr = '';
  if (settings.metadata && Object.keys(settings.metadata).length !== 0) {
    metadataStr = generateSectionTemplate(
      'Metadata',
      JSON.stringify(settings.metadata, null, 2)
    );
  }

  const userMessage = generateSectionTemplate('User Prompt', `${message}`);

  payload.message = joinStrings({
    isNewLine: true,
    args: [metadataStr, systemPrompt, userMessage],
  });
  const endpoint = settings.endpoint + '/completions';

  if (!endpoint) {
    logger.error(`Failed to resolve endpoint from settings: ${settings}`);
    process.exit(1);
  }
  if (isDebug) {
    logger.info('payload:', payload);
  }

  const infoSpin = spinner();
  infoSpin.start('Sending message to AI...');

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: getHeaders(settings),
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    logger.error(`Failed to send message to endpoint: ${endpoint}`);
    process.exit(1);
  }

  let responseText;
  try {
    responseText = await response.text();

    if (isDebug) {
      console.log('responseText', responseText);
    }

    const jsonStrings = responseText
      .split('\n')
      .map((line: string) => line.trim())
      .filter((line: string) => line.startsWith('data:'))
      .map((line: string) => line.replace('data: ', ''));

    let str = '';
    for (const jsonString of jsonStrings) {
      try {
        const parsedJson = JSON.parse(jsonString);
        const deltaContent = parsedJson.choices?.[0]?.delta?.content;
        if (deltaContent) {
          str += deltaContent;
        }
      } catch (err) {
        logger.error('Failed to parse endpoint response as JSON');
        console.error(err);
        process.exit(1);
      }
    }

    const unprefixedStr = removedJsonPrefix(str);

    const parsedResponse = safeJsonParse(unprefixedStr) as {
      command: string;
      isDangerous: boolean;
    };

    infoSpin.stop();

    const { isDangerous = false, command } = parsedResponse;

    if (command == 'UNKNOWN') {
      logger.error('❌ Command not found');
      process.exit(1);
    }
    if (isDangerous) {
      logger.warn('This command is dangerous. Please review before proceeding.');
    }

    logger.info(`>`, command);
    if (isDebug) {
      logger.info(`Ai response:`, parsedResponse);
    }

    const selected = await select(selectOptions);

    if (selected === 'run') {
      if (isDangerous) {
        const confirmed = await confirm({
          message: '⚠️ This command is dangerous. Are you sure you want to proceed?',
        });

        if (!confirmed) {
          cancel('Operation canceled.');
        }
      }
      infoSpin.start('Executing command...');
      try {
        const { stdout } = await exec(command, { timeout: 50000 });
        infoSpin.stop(
          `✅ Command executed ${stdout ? 'result:' : 'successful!'} \n`
        );
        logger.success(stdout);
      } catch (error) {
        logger.error('❌ Failed to execute command', error);
        infoSpin.stop('❌ Failed to execute command!');
        process.exit(1);
      }
    } else if (selected === 'copy') {
      clipboardy.writeSync(command);
      logger.success('✅ Copied to the clipboard!');
    }
    process.exit(0);
  } catch (err) {
    logger.error('Failed to parse endpoint response as JSON');
    console.error(err);
    process.exit(1);
  }
}
