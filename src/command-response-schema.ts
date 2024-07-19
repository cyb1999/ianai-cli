import path from 'path';
import { fileURLToPath } from 'url';

export const schemaDirname = path.dirname(fileURLToPath(import.meta.url));

export interface CommandResponse {
  action: 'command';
  command: string | 'UNKNOWN';
}
