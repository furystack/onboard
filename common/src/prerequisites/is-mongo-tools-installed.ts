import { Prerequisite } from '../check-prerequisites'

export const isMongoToolsInstalled: Prerequisite = async (i) => {
  try {
    await i.execAsync('mongorestore --help', {})
  } catch (error) {
    return { success: false, message: '"mongorestore" has not been found. Have you installed it?' }
  }
  return { success: true }
}
