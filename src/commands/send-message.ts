import readline from 'readline';

import { clearHistory } from '../clear-history';
import { sendSingle } from '../send-single';
import { getSettings } from '../settings/get-settings';
import { initSettings } from '../settings/init-settings';
import { saveSettings } from '../settings/save-settings';
import { settingsFilePath } from '../settings/settings-constants';
import { logger } from '../utils/logger';

const sendMessageCommand = async (
  rl: readline.Interface,
  message: string,
  cmd: any
) => {
  const settings = await getSettings({ rl });

  if (cmd.debug) {
    logger.info('Debug mode enabled');
  }

  if (cmd.auth) {
    settings.headers!.authorization = cmd.auth;

    saveSettings(settings);

    logger.info(
      `Saving settings at ${settingsFilePath}:\n${JSON.stringify(settings, null, 2)}`
    );
    process.exit(0);
  }

  if (cmd.init) {
    await initSettings(rl);
  }

  await clearHistory({ rl });
  await sendSingle({ message, rl });
};

export default sendMessageCommand;
