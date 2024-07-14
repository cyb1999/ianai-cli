import readline from 'readline';

import { askConfirmation } from '../ask-confirmation';
import { askForCustomObject } from '../settings/init-settings';
import { saveSettings } from '../settings/save-settings';
import { settingsFilePath } from '../settings/settings-constants';
import { Settings } from '../settings/settings-schema';
import { logger } from '../utils/logger';

const updateSetting = (settings: Settings, key: string, value: string) => {
  settings[key] = value;
  saveSettings(settings);
  logger.success(`Updated:`, { [key]: value });
};

const handleSetHeaders = async (rl: readline.Interface, settings: Settings) => {
  const headers = await askForCustomObject(rl, 'headers');
  settings.headers = { ...settings.headers, ...headers };
  saveSettings(settings);
  logger.info(
    `Saving settings at ${settingsFilePath}:\n${JSON.stringify(
      settings.headers,
      null,
      2
    )}`
  );
};

const handleSetMetadata = async (rl: readline.Interface, settings: Settings) => {
  const metadata = await askForCustomObject(rl, 'metadata');
  settings.metadata = { ...settings.metadata, ...metadata };
  saveSettings(settings);
  logger.info(
    `Saving settings at ${settingsFilePath}:\n${JSON.stringify(
      settings.metadata,
      null,
      2
    )}`
  );
};

const handleSetKey = async (
  rl: readline.Interface,
  settings: Settings,
  key: string,
  value: string
) => {
  if (settings.hasOwnProperty(key) && settings[key] !== undefined) {
    const answer = await askConfirmation(
      rl,
      `The setting '${key}' already exists with value '${settings[key]}'. Do you want to override it? (yes/no): `
    );
    if (answer.toLowerCase().trim() === 'yes') {
      updateSetting(settings, key, value);
    } else {
      logger.info('Operation canceled. Settings not updated.');
    }
  } else if (key === 'authToken') {
    settings.headers!.authorization = value;
    saveSettings(settings);
    logger.success(`Updated authToken in headers:`, { authorization: value });
  } else {
    updateSetting(settings, key, value);
  }
};

export const Set = async (
  rl: readline.Interface,
  settings: Settings,
  key: string,
  value?: string
) => {
  switch (key) {
    case 'headers':
      await handleSetHeaders(rl, settings);
      break;
    case 'metadata':
      await handleSetMetadata(rl, settings);
      break;
    default:
      if (!key) {
        logger.error(
          'Invalid command. Usage: config set <key>=<value> or <key> <value> '
        );
        return;
      }
      const [actualKey, actualValue] = key.includes('=')
        ? key.split('=')
        : [key, value];
      await handleSetKey(rl, settings, actualKey, actualValue ?? '');
      break;
  }
};
