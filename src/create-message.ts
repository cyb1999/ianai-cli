import { createProvider } from './providers';
import { getSettings } from './settings/get-settings';
import { isDebug, logger } from './utils/logger';
import { safeJsonParse } from './utils/parse';
import {
  generateSectionTemplate,
  joinStrings,
  removedJsonPrefix
} from './utils/str';

export async function createMessage<T>({
  message,
  metadata,
  systemPrompt
}: {
  message: string;
  metadata?: Record<string, any>;
  systemPrompt?: string;
}): Promise<T> {
  const settings = await getSettings();

  if (!message) {
    logger.error(
      'Message is required. Please provide a message to send to the AI.'
    );
    process.exit(1);
  }

  if (!settings.headers!.authorization) {
    logger.error(
      'AuthToken is required. Please run `ai --init` or `ai config set authToken <your-auth-token>` to set the authorization.'
    );
    process.exit(1);
  }

  let messageStrings: string[] = [];

  if (metadata && Object.keys(metadata).length !== 0) {
    messageStrings.push(
      generateSectionTemplate('Metadata', JSON.stringify(metadata, null, 2))
    );
  }
  if (systemPrompt) {
    messageStrings.push(systemPrompt);
  }

  messageStrings.push(message);

  try {
    const content = (await createProvider(settings.provider, {
      message: joinStrings(messageStrings)
    })) as string;

    if (isDebug) {
      logger.info('Ai response', content);
    }

    return content as T;
  } catch (error) {
    throw new Error(`Failed to send message: ${error}`);
  }
}
