import { z } from 'zod';

import { logger } from '../utils/logger';
import { settingsDir } from './settings-constants';

export const settingsSchema = z.object({
  endpoint: z.string().url(),
  model_class: z.string({
    required_error: "'model_class' is required. (example: 'deepseek_code')",
  }),
  metadata: z.record(z.any()).optional(),
  payload: z.record(z.string()).optional(),
  headers: z.record(z.string()).optional(),
});

export type Settings = z.infer<typeof settingsSchema>;

export function validateSettings(settings) {
  const result = settingsSchema.safeParse(settings);
  if (!result.success) {
    for (const error of result.error.issues) {
      logger.error(`settings.json: ${error.message}\n
You can edit your settings file at file://${settingsDir}
or run 'ai --init' to re-initialize your settings.\n`);
    }
    process.exit(1);
  }
}
