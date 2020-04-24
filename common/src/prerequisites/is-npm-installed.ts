import { Prerequisite } from '../check-prerequisites'

export const isNpmInstalled: Prerequisite = async (i) => {
  try {
    await i.execAsync('npm --v', {})
  } catch (error) {
    return { success: false, message: 'Git has not been found. Have you installed it?' }
  }
  return { success: true }
}
