import { logger } from './logger';

export const generateSectionTemplate = (sectionTitle: string, content: string) => {
  return `${sectionTitle}:\n${content.trim()}\n`;
};

export const joinStrings = ({
  isNewLine = true,
  args,
}: {
  isNewLine?: boolean;
  args: string[];
}): string => {
  const newline = isNewLine ? '\n' : '';

  return args.join(newline);
};

export const removedJsonPrefix = (str: string): string => {
  try {
    return str.replace(/^```json\s+/, '').replace(/\s+```$/, '');
  } catch (error) {
    logger.error({ error });
    return '';
  }
};
