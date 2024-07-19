import { settingsFilePath } from '../constants/settings-constants';
import { Settings } from '../settings/settings-schema';
import { logger } from '../utils/logger';

export const Get = (settings: Settings, key: string) => {
  if (key == 'all') {
    logger.info(
      `Current settings at ${settingsFilePath}:\n${JSON.stringify(
        settings,
        null,
        2
      )}`
    );
  } else if (settings.hasOwnProperty(key) && key !== 'all') {
    logger.info(
      `Current settings at ${settingsFilePath}:\n${JSON.stringify(
        { [key]: settings[key] },
        null,
        2
      )}`
    );
  } else {
    logger.error(`Setting '${key}' not found`);
  }
  process.exit(0);
};
