import '@furystack/logging'
import { Injector } from '@furystack/inject'
import Semaphore from 'semaphore-async-await'
import { CheckPrerequisitesService } from '../check-prerequisites'
import { Workspace, ServiceAction } from '../models'
import { execProcessOnService } from './exex-processes-on-service'

export const execProcessesOnAllServices = async (options: {
  injector: Injector
  workspace: Workspace
  parallel: number
  action: ServiceAction
}) => {
  const { injector, workspace, parallel, action } = options
  const logger = injector.logger.withScope('installAllServices')
  const lock = new Semaphore(parallel)

  const services = workspace.services.filter((service) => service.actions.find((a) => !!(a.name === action)))

  if (!services || !services.length) {
    logger.verbose({ message: 'No service to install, exiting...' })
    return
  }

  const checks = await injector.getInstance(CheckPrerequisitesService).checkPrerequisiteForServices({ services })
  if (checks.length) {
    logger.error({ message: `Some prerequisites has not been met`, data: { checks } })
    return
  }

  const promises = services.map(async (service) => {
    try {
      await lock.acquire()
      await execProcessOnService({
        injector,
        service,
        workdir: workspace.outputDirectory,
        inputDir: workspace.inputDirectory,
        action,
      })
      logger.information({
        message: `Finished service installation: ${service.name}`,
        data: { service },
      })
      lock.release()
    } catch (error) {
      logger.error({
        message: `An error happened during installing the service '${service.name}'`,
        data: { service, error, errorString: error.toString() },
      })
    }
  })

  await Promise.all(promises)

  for (let index = 0; index < parallel; index++) {
    await lock.acquire()
  }
}
