import readline from 'readline';

export class AppContext {
  private static instance: AppContext;
  private _rl: readline.ReadLine | null = null;
  private _config: Record<string, any> | null = null;

  private constructor() {}

  static getInstance(): AppContext {
    if (!AppContext.instance) {
      AppContext.instance = new AppContext();
    }
    return AppContext.instance;
  }

  init(rl: readline.ReadLine) {
    this._rl = rl;
  }

  get rl(): readline.ReadLine {
    if (!this._rl) {
      throw new Error('ReadLine interface not initialized');
    }
    return this._rl;
  }

  setConfig(config: Record<string, any>) {
    this._config = config;
  }
}

export const appContext = AppContext.getInstance();
