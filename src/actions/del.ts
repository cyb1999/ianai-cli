import readline from 'readline';

import { spinner } from '@clack/prompts';

import { askConfirmation } from '../ask-confirmation';
import { saveSettings } from '../settings/save-settings';
import { Settings } from '../settings/settings-schema';
import { logger } from '../utils/logger';

export const Del = async (
  rl: readline.Interface,
  settings: Settings,
  key: string,
  value?: string
) => {
  const infoSpin = spinner();

  switch (key) {
    case 'header':
      if (value) {
        infoSpin.start(`Deleting key '${value}' from headers`);
        if (settings.headers && settings.headers[value]) {
          delete settings.headers[value];
          saveSettings(settings);
          infoSpin.stop(`Deleted key '${value}' from headers`);
        } else {
          logger.error(`Header key '${value}' not found`);
          infoSpin.stop();
        }
      } else {
        logger.error('Invalid command. Usage: config del header <headerKey>');
      }
      break;
    case 'metadata':
      if (value) {
        infoSpin.start(`Deleting key '${value}' from metadata`);
        if (settings.metadata && settings.metadata[value]) {
          delete settings.metadata[value];
          saveSettings(settings);
          infoSpin.stop(`Deleted key '${value}' from metadata`);
        } else {
          logger.error(`Metadata key '${value}' not found`);
          infoSpin.stop();
        }
      } else {
        logger.error(
          'Invalid command. Usage: config del metadata <metadataKey>'
        );
      }
      break;
    default:
      if (key && !value) {
        if (!settings.hasOwnProperty(key) && key !== 'authToken') {
          logger.error(`key '${key}' does not exist in settings`);
          process.exit(0);
        }
        const answer = await askConfirmation(
          rl,
          `Are you sure you want to delete the setting '${key}'? (yes/no): `
        );
        if (answer.toLowerCase().trim() === 'yes') {
          if (key !== 'authToken') {
            infoSpin.start(`Deleting key '${key}' from settings`);
            delete settings[key];
            saveSettings(settings);
            infoSpin.stop(`Deleted key '${key}' from settings`);
          } else {
            infoSpin.start(`Deleting authToken from headers`);
            delete settings.headers?.authorization;
            saveSettings(settings);
            infoSpin.stop(`Deleted authToken from headers`);
          }
        } else {
          logger.info('Operation canceled. Settings not updated.');
        }
      }

      break;
  }
};
