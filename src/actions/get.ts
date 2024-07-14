import { settingsFilePath } from '../settings/settings-constants';
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
    return;
  }
  if (key) {
    if (settings.hasOwnProperty(key)) {
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
  } else {
    logger.error('Invalid command. Usage: config get <key>');
  }
};
