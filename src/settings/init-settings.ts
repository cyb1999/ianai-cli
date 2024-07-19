import fs from 'fs';
import readline from 'readline';

import { askQuestion } from '../ask-question';
import { settingsDir, settingsFilePath } from '../constants/settings-constants';
import { logger } from '../utils/logger';
import { saveSettings } from './save-settings';
import { getDefaults, Settings, settingsSchema } from './settings-schema';

export async function initSettings(rl: readline.Interface) {
  fs.mkdirSync(settingsDir, { recursive: true });
  let settings: Settings = {
    endpoint: '',
    model_class: '',
    payload: {},
    headers: {},
    metadata: {},
    commitment: {
      type: ''
    }
  };
  const defaultValues = getDefaults(settingsSchema);
  const endpoint =
    (await askQuestion(rl, 'Enter the API endpoint(default deepseek): ')) ||
    defaultValues.endpoint;

  const model_class =
    (await askQuestion(rl, 'Enter the model (default deepseek): ')) ||
    defaultValues.model_class;

  const authorization = await askQuestion(rl, `Enter your auth token: `);
  const headers = await askForCustomObject(rl, 'headers');

  settings.endpoint = endpoint;
  settings.model_class = model_class;
  settings.commitment = defaultValues.commitment;

  settings.headers = { ...headers, authorization };

  logger.info(
    `Saving settings at ${settingsFilePath}:\n${JSON.stringify(
      settings,
      null,
      2
    )}}`
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
