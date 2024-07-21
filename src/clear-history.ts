import readline from 'readline';

import { getHeaders } from './settings/get-headers';
import { getSettings } from './settings/get-settings';
import { isDebug, logger } from './utils/logger';

export const clearHistory = async ({ rl }: { rl: readline.Interface }) => {
  const settings = await getSettings({ rl });
  const endpoint = settings.endpoint + '/clear_context';

  const payload = {
    model_class: settings.model_class,
    append_welcome_message: false
  };

  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: getHeaders(settings),
      body: JSON.stringify(payload)
    });
    const data = await response.json();
    if (response.ok && isDebug) {
      logger.info('History cleared', data);
    }

    if (data.code) {
      logger.error(`Failed to clear history`, data);
      process.exit(0);
    }
  } catch (error) {
    logger.error(`Failed to clear history:`, error);
  }
};
