import readline from 'readline';

import { askQuestion } from '../ask-question';
import { settingsFilePath } from '../constants/settings-constants';
import { askForCustomObject } from '../settings/init-settings';
import { saveSettings } from '../settings/save-settings';
import {
  getDefaults,
  Settings,
  settingsSchema,
  validateSettings
} from '../settings/settings-schema';
import { logger } from '../utils/logger';
import { appContext } from '../app-context';

const updateFunctions: {
  [key: string]: (
    settings: Settings,
    value: string,
    rl?: readline.Interface
  ) => void;
} = {
  headers: async (settings, value, rl) => {
    const headers = await askForCustomObject(rl!, 'headers');
    settings.headers = { ...settings.headers, ...headers };
    logger.info(
      `Saving headers at ${settingsFilePath}:\n${JSON.stringify(
        settings.headers,
        null,
        2
      )}`
    );
  },
  metadata: async (settings, value, rl) => {
    const metadata = await askForCustomObject(rl!, 'metadata');
    settings.metadata = { ...settings.metadata, ...metadata };
    logger.info(
      `Saving metadata at ${settingsFilePath}:\n${JSON.stringify(
        settings.metadata,
        null,
        2
      )}`
    );
  },
  authToken: (settings, value) => {
    settings.headers = { ...settings.headers, authorization: value };
    saveSettings(settings);
    logger.success(`Updated authToken in headers:`, { authorization: value });
    process.exit(0);
  },
  commitment: async (settings, value, rl) => {
    const { commitment } = getDefaults(settingsSchema);
    const generate = Number(
      (await askQuestion(
        rl!,
        'Enter the number of commits to generate(default is 1):'
      )) || commitment.generate
    );
    const maxlength = Number(
      (await askQuestion(
        rl!,
        'Enter the maximum length of the commit message(default is 60, maximum 100):'
      )) || commitment.maxlength
    );
    settings.commitment = { ...settings.commitment, generate, maxlength };
    validateSettings(settings);
    saveSettings(settings);
    logger.success(`Updated commitment:`, settings.commitment);
    process.exit(0);
  }
};

const updateSetting = (settings: Settings, key: string, value: string) => {
  settings[key] = value;
  saveSettings(settings);
  logger.success(`Updated:`, { [key]: value });
  process.exit(0);
};

const handleSetKey = async (settings: Settings, key: string, value: string) => {
  const rl = appContext.rl;
  if (updateFunctions[key]) {
    updateFunctions[key](settings, value, rl);
  } else {
    validateSettings(settings);
    updateSetting(settings, key, value);
  }
};
export const Set = async (settings: Settings, key: string, value?: string) => {
  const [actualKey, actualValue] = key.includes('=')
    ? key.split('=')
    : [key, value];
  await handleSetKey(settings, actualKey, actualValue ?? '');
};
