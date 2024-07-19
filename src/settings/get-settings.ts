import {
  isNil,
  omitBy,
} from 'es-toolkit';
import fs from 'fs';
import readline from 'readline';

import { settingsFilePath } from '../constants/settings-constants';
import { logger } from '../utils/logger';
import { safeJsonParse } from '../utils/parse';
import { initSettings } from './init-settings';
import {
  getDefaults,
  Settings,
  settingsSchema,
  validateSettings,
} from './settings-schema';

export async function getSettings({
  rl,
  argv,
}: {
  rl: readline.Interface;
  argv?: Partial<Settings>;
}): Promise<Settings> {
  let settings: Partial<Settings> = {};
  const defaultSettings = getDefaults(settingsSchema);

  let settingsFile: string | undefined;
  try {
    settingsFile = fs.readFileSync(settingsFilePath, 'utf8');
  } catch (error) {
    await initSettings(rl);
  }

  // If there is a file, read the file first
  if (settingsFile) {
    try {
      settings = omitBy(
        {
          ...defaultSettings,
          ...safeJsonParse(settingsFile),
        },
        isNil
      );
    } catch (error) {
      logger.error(
        `Error parsing JSON ${settingsFilePath}\n\nYou can edit your settings file manually to resolve the issue, or try reinitializing a new settings file by running the following command: \n\x1b[36mai --init\n`
      );
      process.exit(1);
    }
  }

  // If there are command line arguments, overwrite the settings
  if (argv && Object.keys(argv).length) {
    settings = {
      ...settings,
      commitment: omitBy(
        {
          ...defaultSettings.commitment,
          ...settings.commitment,
          ...argv.commitment,
        },
        isNil
      ) as Settings['commitment'],
    };
  }

  try {
    validateSettings(settings);
    return settings as Settings;
  } catch (error: any) {
    logger.error(`Error validating settings: ${error.message}`);
    process.exit(1);
  }
}
