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

    if (response.ok && isDebug) {
      logger.info('History cleared', await response.json());
    }
  } catch (error) {
    logger.error(`Failed to clear history:`, error);
  }
};
