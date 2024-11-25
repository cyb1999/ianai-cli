// 导入其他provider

import { createDeepseekProvider } from './deepseek';
import { createKimiChat } from './kimi';

export const providerType = {
  kimi: 'kimi'
} as const;

export const providerTypeList = Object.values(providerType);

export type ProviderType = (typeof providerType)[keyof typeof providerType];

export const createProvider = async (
  type: ProviderType,
  config: any
): Promise<string> => {
  switch (type) {
    case providerType.kimi:
      return await createKimiChat(config);

    default:
      throw new Error(`Unknown provider type: ${type}`);
  }
};
