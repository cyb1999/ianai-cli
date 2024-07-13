import chalk from 'chalk';
import readline from 'readline';

import { logger } from './utils/logger';

export function askQuestion(
  rl: readline.Interface,
  query: string,
  options: string[] = []
): Promise<string> {
  return new Promise((resolve) => {
    let fullQuery = chalk.cyan(query);
    if (options.length > 0) {
      fullQuery += '\n';
      options.forEach((option, index) => {
        fullQuery += `${index + 1}. ${option}\n`;
      });
      fullQuery += `Enter your choice (1-${options.length}): `;
    } else {
      fullQuery += ' ';
    }

    rl.question(fullQuery, (answer) => {
      if (options.length > 0) {
        const choice = parseInt(answer, 10);
        // Check if the choice is a valid number within the options range
        if (!isNaN(choice) && choice >= 1 && choice <= options.length) {
          resolve(options[choice - 1]);
        } else {
          logger.error('Invalid choice, please try again.');
          resolve(askQuestion(rl, query, options)); // Recursively ask again
        }
      } else {
        // For a simple query, directly resolve the answer
        resolve(answer);
      }
    });
  });
}
