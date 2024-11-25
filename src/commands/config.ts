import readline from 'readline';

import { Del } from '../actions/del';
import { Get } from '../actions/get';
import { Set } from '../actions/set';
import { getSettings } from '../settings/get-settings';
import { logger } from '../utils/logger';

const configCommand = async (action: string, key: string, value?: string) => {
  const settings = await getSettings();

  const actions: Record<string, () => Promise<void> | void> = {
    get: () => Get(settings, key),
    set: async () => await Set(settings, key, value),
    del: async () => await Del(settings, key, value)
  };

  if (actions[action]) {
    await actions[action]();
  } else {
    logger.error('Invalid command. Usage: config <set|del|get> <key> [value]');
    process.exit(0);
  }
};

export default configCommand;
