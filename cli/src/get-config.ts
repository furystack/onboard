import { existsSync, readFileSync } from 'fs'
import { Injector } from '@furystack/inject'
import { JsonSchemaValidator, Workspace } from '@furystack/onboard-common'

export const getConfig = async ({ injector, fileName }: { injector: Injector; fileName: string }) => {
  const logger = injector.logger.withScope('@furystack/onboard-cli/get-config')
  if (!existsSync(fileName)) {
    await logger.fatal({ message: `The file '${fileName}' does not exists.` })
    process.exit(1)
  }
  const file = readFileSync(fileName)
  try {
    const fileContent = JSON.parse(file.toString())
    const validator = injector.getInstance(JsonSchemaValidator)
    const validationResult = validator.validateModel<Workspace>(fileContent, 'Workspace')
    if (!validationResult) {
      await logger.fatal({ message: `Failed to validate the config file.` })
    }
    return fileContent as Workspace
  } catch (error) {
    await logger.fatal({ message: `Failed to parse the file '${fileName}'.`, data: { error } })
    process.exit(1)
  }
}
