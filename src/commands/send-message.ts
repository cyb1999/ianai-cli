import readline from 'readline';

import { sendSingle } from '../send-single';
import { initSettings } from '../settings/init-settings';

const sendMessageCommand = async (
  rl: readline.Interface,
  message: string,
  cmd: any
) => {
  if (cmd.init) {
    await initSettings(rl);
  }
  await sendSingle({ message });
};

export default sendMessageCommand;
