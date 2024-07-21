import { type Payload } from './send-single';
import { getHeaders } from './settings/get-headers';
import { getSettings } from './settings/get-settings';
import { isDebug, logger } from './utils/logger';
import { safeJsonParse } from './utils/parse';
import {
  generateSectionTemplate,
  joinStrings,
  removedJsonPrefix
} from './utils/str';

export async function createDeepseekMessage<T>({
  rl,
  message,
  metadata,
  systemPrompt
}: {
  rl: any;
  message: string;
  metadata?: Record<string, any>;
  systemPrompt?: string;
}): Promise<T> {
  const settings = await getSettings({ rl });

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

  const payload: Payload = {
    message: '',
    model_class: '',
    stream: true,
    model_preference: null,
    temperature: 0
  };

  if (settings.model_class) {
    payload.model_class = settings.model_class;
  }
  const endpoint = settings.endpoint + '/completions';

  if (!endpoint) {
    logger.error(`Failed to resolve endpoint from settings: ${settings}`);
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

  payload.message = joinStrings(messageStrings);

  if (isDebug) {
    logger.info('payload', payload);
  }

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: getHeaders(settings),
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    throw new Error(`Failed to send message to endpoint: ${endpoint}`);
  }

  const data = await response.json();
  if (data.code) {
    logger.error(`Failed to send message`, data);
    process.exit(0);
  }

  const responseText = JSON.stringify(data);

  if (isDebug) {
    logger.info('responseText', responseText);
  }

  const jsonStrings = responseText
    .split('\n')
    .map((line: string) => line.trim())
    .filter((line: string) => line.startsWith('data:'))
    .map((line: string) => line.replace('data: ', ''));

  let str = '';
  for (const jsonString of jsonStrings) {
    try {
      const parsedJson = JSON.parse(jsonString);
      const deltaContent = parsedJson.choices?.[0]?.delta?.content;
      if (deltaContent) {
        str += deltaContent;
      }
    } catch (err) {
      throw new Error('Failed to parse endpoint response as JSON');
    }
  }

  const unprefixedStr = removedJsonPrefix(str);

  const responseMessage = safeJsonParse(unprefixedStr) as T;
  if (isDebug) {
    logger.info('Ai response', responseMessage);
  }

  return responseMessage;
}
