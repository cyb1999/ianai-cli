import { Settings } from './settings-schema';

export function getHeaders(settings: Settings) {
  const headers = {
    'Content-Type': 'application/json'
  };
  if (settings.headers) {
    Object.assign(headers, settings.headers);
  }
  return headers;
}
