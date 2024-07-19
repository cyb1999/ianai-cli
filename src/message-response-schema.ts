import path from 'path';
import { fileURLToPath } from 'url';

export const schemaDirname = path.dirname(fileURLToPath(import.meta.url));

export interface SingleMessageResponse {
  action: 'message';
  message: string;
}

export interface MultiMessageResponse {
  action: 'messages';
  messages: string[];
}

export type MessageResponse = SingleMessageResponse | MultiMessageResponse;
