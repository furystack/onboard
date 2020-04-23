import { Prerequisite } from '../check-prerequisites'

export const isGitInstalled: Prerequisite = async (i) => {
  try {
    await i.execAsync('git help', {})
  } catch (error) {
    return { success: false, message: 'Git has not been found. Have you installed it?' }
  }
  return { success: true }
}
