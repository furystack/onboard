import { Prerequisite } from '../check-prerequisites'

export const isDockerComposeInstalled: Prerequisite = async (injector) => {
  try {
    await injector.execAsync('docker-compose version', {})
  } catch (error) {
    return { success: false, message: 'Docker-compose has not been found. Have you installed it?' }
  }
  return { success: true }
}
