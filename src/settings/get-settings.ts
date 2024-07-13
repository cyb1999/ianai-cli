import { initSettings } from './init-settings'
import { settingsFilePath } from './settings-constants'
import fs from 'fs'
import readline from 'readline'
import { Settings, validateSettings } from './settings-schema'
import { logger } from '../utils/logger'

export async function getSettings({ rl }: { rl: readline.Interface }): Promise<Settings> {
  let settings: Settings | undefined
  let settingsFile: string | undefined

  try {
    settingsFile = fs.readFileSync(settingsFilePath, 'utf8')
  } catch (error) {
    await initSettings(rl)
  }

  try {
    if (settingsFile) {
      settings = JSON.parse(settingsFile)
    }
  } catch (error) {
    logger.error(
      `Error parsing JSON ${settingsFilePath}\n\nYou can edit your settings file manually to resolve the issue, or try reinitializing a new settings file by running the following command: \n\x1b[36mai --init\n`
    )
    process.exit(1)
  }

  if (settings) {
    validateSettings(settings)
    return settings
  }

  logger.error('Failed to read settings file')
  process.exit(1)
}
