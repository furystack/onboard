import { Prerequisite } from '../check-prerequisites'

export const isNpmInstalled: Prerequisite = async () => {
  if (!process.env.NPM_TOKEN || !process.env.NPM_TOKEN.length) {
    return { message: "The 'NPM_TOKEN' env.value has not been set.", success: false }
  }
  return { success: true }
}
