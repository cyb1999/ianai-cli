import readline from 'readline';

import { sendSingle } from '../send-single';
import { initSettings } from '../settings/init-settings';
import { clearHistory } from '../clear-history';

const sendMessageCommand = async (
  rl: readline.Interface,
  message: string,
  cmd: any
) => {
  if (cmd.init) {
    await initSettings(rl);
  }
  await clearHistory({ rl });
  await sendSingle({ message, rl });
};

export default sendMessageCommand;
