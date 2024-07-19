import fs from 'fs';

import { settingsFilePath } from '../constants/settings-constants';
import { logger } from '../utils/logger';
import { Settings } from './settings-schema';

export function saveSettings(settings: Settings) {
  try {
    fs.writeFileSync(settingsFilePath, JSON.stringify(settings, null, 2));
  } catch (err: any) {
    logger.error(`Error saving settings file: ${err.message}`);
  }
}
