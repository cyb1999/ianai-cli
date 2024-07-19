import fs from 'fs';
import os from 'os';
import path from 'path';

import { schemaDirname } from '../message-response-schema';

const homeDir = os.homedir();
const cpuArchitecture = os.arch();
const osPlatform = os.platform();
const osType = os.type();
const kernelVersion = os.version();
export const settingsDir = `${homeDir}/.ianai`;
export const settingsFileName = `settings.json`;
export const settingsFilePath = `${settingsDir}/${settingsFileName}`;

const schemaString = fs.readFileSync(
  path.join(schemaDirname, 'command-response-schema.ts'),
  'utf8'
);

export const systemPrompt = `You are a command line translation program. You can translate natural language instructions from human language into corresponding command line statements.

1. If you don't understand what I'm talking about, or aren't sure how to translate my instructions into the computer command line, simply output the 7 letters "UNKNOWN" into the command field without any other explanation 

3. If the translated result consists of more than one line of commands, please use '&' or '&&' to combine them into a single line of command.

Respond only in JSON that satisfies the Response type:
${schemaString.replace(/^(import|export) .*;$/gm, '').trim()}

User System Info:\n${JSON.stringify(
  { cpuArchitecture, osPlatform, osType, kernelVersion },
  null,
  2
)}\n`;
