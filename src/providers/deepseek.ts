import { getHeaders } from '../settings/get-headers';
import { getSettings } from '../settings/get-settings';

import axios from 'axios';

export type Payload = {
  chat_session_id: string;
  parent_message_id: null;
  prompt: string;
  ref_file_ids: string[];
  thinking_enabled: boolean;
};

// TODO
export const createDeepseekProvider = async (payload: {
  message: string;
}): Promise<string> => {
  const settings = await getSettings();

  const createChatSession = async () => {
    const response = await axios.post(
      `${settings.endpoint}/chat_session/create`,
      { agent: 'chat' },
      { headers: getHeaders(settings) }
    );

    return response.data.data.biz_data.id;
  };

  const chatSessionId = await createChatSession();

  const createCompletion = async () => {
    const requestPayload: Payload = {
      chat_session_id: chatSessionId,
      parent_message_id: null,
      prompt: payload.message,
      ref_file_ids: [],
      thinking_enabled: false
    };
    const response = await axios.post(
      `${settings.endpoint}/chat/completion`,
      requestPayload,
      {
        responseType: 'stream'
      }
    );

    return '';
  };
  return createCompletion();
};
