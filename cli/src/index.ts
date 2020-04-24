import { join } from 'path'
import yargs from 'yargs'
import { Injector } from '@furystack/inject'
import { InMemoryLogging, execProcessesOnAllServices, ServiceAction } from '@furystack/onboard-common'
import { ConsoleLogger, VerboseConsoleLogger } from '@furystack/logging'
import { ArgType } from './arg-type'
import { getConfig } from './get-config'

const injector = new Injector().useLogging(InMemoryLogging)

const defaultArguments: ArgType = {
  action: 'update',
  parallel: 1,
}

const cmd = yargs
  .scriptName('@furystack/onboard-cli')
  .showHelpOnFail(false, 'Use --help for available options')
  .command<ArgType>('*', '', async ({ argv }) => {
    const args = { ...defaultArguments, ...argv }
    args.verbose ? injector.useLogging(VerboseConsoleLogger) : injector.useLogging(ConsoleLogger)
    const rootLogger = injector.logger.withScope('@furystack/onboard-cli')
    rootLogger.verbose({ message: 'Initializing', data: { args } })
    const config = await getConfig({ injector, fileName: join(process.cwd(), `${args.workspace}.json`) })
    rootLogger.verbose({ message: 'Config verified', data: { config } })
    await execProcessesOnAllServices({
      injector,
      action: args.action as ServiceAction,
      parallel: args.parallel,
      workspace: config,
    })
  })
  .option('workspace', {
    type: 'string',
    default: 'onboard',
    description: 'The workspace name',
  })
  .option('action', {
    type: 'string',
    description: "The action to execute (e.g. 'update' or 'install')",
    default: 'update',
  })
  .option('parallel', {
    type: 'number',
    description: 'how many installs can run parallelly',
    default: 1,
  })
  .option('services', {
    type: 'array',
    description: 'a list of services to install',
  })

export default cmd.argv
