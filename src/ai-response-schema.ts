export interface AiResponse {
  /**
   * if the command is dangerous or not (e.g. rm -rf /)
   * @default false
   */
  isDangerous: boolean;
  /**
   * The command to run in the terminal
   */
  command: string | 'UNKNOWN';
}
