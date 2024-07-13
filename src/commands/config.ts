import readline from 'readline';

import { spinner } from '@clack/prompts';

import { getSettings } from '../settings/get-settings';
import { askForCustomObject } from '../settings/init-settings';
import { saveSettings } from '../settings/save-settings';
import { settingsFilePath } from '../settings/settings-constants';
import { logger } from '../utils/logger';

const configCommand = async (
  rl: readline.Interface,
  action: string,
  key: string,
  value?: string
) => {
  const infoSpin = spinner();
  const settings = await getSettings({ rl });

  const actions: Record<string, () => Promise<void> | void> = {
    get: () => {
      if (key) {
        if (settings.hasOwnProperty(key)) {
          logger.info(
            `Saving settings at ${settingsFilePath}:\n${JSON.stringify(
              {
                [key]: settings[key],
              },
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
    },
    set: async () => {
      if (key !== 'headers' && value) {
        if (settings.hasOwnProperty(key) && settings[key] !== undefined) {
          const answer = await askConfirmation(
            rl,
            `The setting '${key}' already exists with value '${settings[key]}'. Do you want to override it? (yes/no): `
          );
          if (answer.toLowerCase().trim() === 'yes') {
            settings[key] = value;
            saveSettings(settings);

            logger.success(`Updated:`, {
              [key]: value,
            });
          } else {
            logger.info('Operation canceled. Settings not updated.');
            return;
          }
        } else {
          settings[key] = value;
          saveSettings(settings);
          logger.success(`Updated:`, {
            [key]: value,
          });
        }
      } else if (key === 'headers') {
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
      } else if (key === 'metadata') {
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
      }
    },
    del: () => {
      if (key === 'header' && value) {
        infoSpin.start(`Deleting header '${value}'`);
        if (settings.headers && settings.headers[value]) {
          delete settings.headers[value];
          saveSettings(settings);
          infoSpin.stop(`Deleted header '${value}'`);
        } else {
          logger.error(`Header '${value}' not found`);
          infoSpin.stop();
        }
      } else if (key === 'metadata' && value) {
        infoSpin.start(`Deleting metadata '${value}'`);
        if (settings.metadata && settings.metadata[value]) {
          delete settings.metadata[value];
          saveSettings(settings);
          infoSpin.stop(`Deleted metadata '${value}'`);
        } else {
          logger.error(`Metadata '${value}' not found`);
          infoSpin.stop();
        }
      } else {
        logger.error('Invalid command. Usage: config del header <headerKey>');
      }
    },
  };

  if (actions[action]) {
    await actions[action]();
  } else {
    logger.error('Invalid command. Usage: config <set|del|get> <key> [value]');
  }
};

async function askConfirmation(
  rl: readline.Interface,
  question: string
): Promise<string> {
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      resolve(answer);
    });
  });
}

export default configCommand;
