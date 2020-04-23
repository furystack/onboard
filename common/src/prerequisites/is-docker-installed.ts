import { Prerequisite } from '../check-prerequisites'

export const isDockerInstalled: Prerequisite = async (i) => {
  try {
    await i.execAsync('docker', {})
  } catch (error) {
    return { success: false, message: 'Docker has not been found. Have you installed it?' }
  }
  return { success: true }
}
