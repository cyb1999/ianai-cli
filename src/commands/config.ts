import readline from 'readline';

import { Del } from '../actions/del';
import { Get } from '../actions/get';
import { Set } from '../actions/set';
import { getSettings } from '../settings/get-settings';
import { logger } from '../utils/logger';

const configCommand = async (
  rl: readline.Interface,
  action: string,
  key: string,
  value?: string
) => {
  const settings = await getSettings({ rl });

  const actions: Record<string, () => Promise<void> | void> = {
    get: () => Get(settings, key),
    set: async () => await Set(rl, settings, key, value),
    del: async () => await Del(rl, settings, key, value)
  };

  if (actions[action]) {
    await actions[action]();
  } else {
    logger.error('Invalid command. Usage: config <set|del|get> <key> [value]');
  }
};

export default configCommand;
