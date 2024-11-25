import chalk from 'chalk';
import { execa } from 'execa';
import readline from 'readline';

import { confirm, isCancel, outro, select, spinner } from '@clack/prompts';

import { Commitment, CommitType } from '../constants/commit-constant';
import { createMessage } from '../create-message';
import { MessageResponse } from '../message-response-schema';
import { getSettings } from '../settings/get-settings';
import { getDetectedMessage, getStagedDiff } from '../utils/git';
import { isDebug, logger } from '../utils/logger';
import { generatePrompt } from '../utils/prompt';
import { initSettings } from '../settings/init-settings';
import { appContext } from '../app-context';

const commitCommand = async (argv: {
  generate: number | undefined;
  maxlength: number | undefined;
  type: CommitType;
  init: string;
}) => {
  const rl = appContext.rl;
  if (argv.init) {
    await initSettings(rl);
  }

  let commitment: Commitment = { type: '' };

  if (argv.generate) {
    commitment.generate = Number(argv.generate);
  }
  if (argv.maxlength) {
    commitment.maxlength = Number(argv.maxlength);
  }

  if (argv.type) {
    commitment.type = argv.type;
  }

  const settings = await getSettings({
    argv: {
      commitment
    }
  });

  const { generate, maxlength, type } = settings.commitment;
  const scanningFiles = spinner();
  scanningFiles.start('scanningFile staged files');

  const staged = await getStagedDiff();

  if (!staged) {
    logger.info('No staged changes found');
    process.exit(0);
  }

  if (isDebug) {
    logger.info('Staged', staged);
  }

  scanningFiles.stop(
    `${getDetectedMessage(staged.files)}:\n${staged.files
      .map((file) => `     ${file}`)
      .join('\n')}`
  );

  const s = spinner();
  s.start('The AI is analyzing your changes');
  let message = '';
  let response = {} as MessageResponse;
  try {
    response = await createMessage<MessageResponse>({
      systemPrompt: generatePrompt('en', maxlength!, type!, generate!),
      message: staged?.diff
    });
  } catch (error) {
  } finally {
    s.stop();
  }

  if (response.action === 'message') {
    message = response.message;
    const confirmed = await confirm({
      message: `Use this commit message?\n\n${chalk.cyan(message)}\n`
    });

    if (!confirmed || isCancel(confirmed)) {
      outro('Commit cancelled');
    } else {
      await execa('git', ['commit', '-m', message]);
    }
  } else if (response.action === 'messages') {
    const selected = await select({
      message: 'Please select a commit message template:',
      options: response.messages.map((value) => ({
        label: value,
        value
      }))
    });

    if (isCancel(selected)) {
      outro('Commit cancelled');
      return;
    }

    message = selected as string;
    await execa('git', ['commit', '-m', message]);
  }
};

export default commitCommand;
