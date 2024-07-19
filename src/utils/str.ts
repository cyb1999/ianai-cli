import { logger } from './logger';

export const generateSectionTemplate = (sectionTitle: string, content: string) => {
  return `${sectionTitle}:\n${content.trim()}\n`;
};

export const joinStrings = (args: string[]): string => {
  return args.join('\n');
};

export const removedJsonPrefix = (str: string): string => {
  try {
    return str.replace(/^```json\s+/, '').replace(/\s+```$/, '');
  } catch (error) {
    logger.error({ error });
    return '';
  }
};
