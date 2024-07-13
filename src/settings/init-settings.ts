import fs from 'fs';
import readline from 'readline';

import { askQuestion } from '../ask-question';
import { logger } from '../utils/logger';
import { saveSettings } from './save-settings';
import { settingsDir, settingsFilePath } from './settings-constants';
import { Settings } from './settings-schema';

export async function initSettings(rl: readline.Interface) {
  fs.mkdirSync(settingsDir, { recursive: true });
  let settings: Settings = {
    endpoint: '',
    model_class: '',
    payload: {},
    headers: {},
    metadata: {},
  };
  const endpoint = await askQuestion(
    rl,
    'Enter the API endpoint(default deepseek): '
  );
  const model_class = await askQuestion(
    rl,
    'Enter the model class(default deepseek): '
  );
  const headers = await askForCustomObject(rl, 'headers');

  settings.endpoint = endpoint ? endpoint : 'https://chat.deepseek.com/api/v0/chat';
  settings.model_class = model_class ? model_class : 'deepseek_code';
  settings.headers = headers;

  logger.info(
    `Saving settings at ${settingsFilePath}:\n${JSON.stringify(settings, null, 2)}}`
  );

  saveSettings(settings);
  rl.close();
  process.exit(0);
}

export async function askForCustomObject(
  rl: readline.Interface,
  objectName: string
) {
  const obj = {};
  let addingObj = true;

  while (addingObj) {
    const key = await askQuestion(
      rl,
      `Enter ${objectName} key (or type 'done' to finish): `
    );

    if (key.toLowerCase() === 'done') {
      addingObj = false;
    } else {
      const value = await askQuestion(
        rl,
        `Enter value for ${objectName} '${key}': `
      );
      obj[key] = value;
    }
  }

  return obj;
}
