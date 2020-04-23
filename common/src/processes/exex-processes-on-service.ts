import { join } from 'path'
import { Injector } from '@furystack/inject'
import { Service, ServiceAction } from '../models/service'
import { CheckPrerequisitesService } from '../check-prerequisites'
import { Process } from '../models/process'
import { execInstallStep } from './exec-install-step'
import { getStepDisplayNames } from './get-step-display-names'

const getServiceDir = (service: Service, workDir: string) => {
  return join(workDir, service.name)
}

export const execProcessOnService = async (options: {
  injector: Injector
  service: Service
  workdir: string
  inputDir: string
  stepFilters?: Array<Process['type']>
  action: ServiceAction
}) => {
  const logger = options.injector.logger.withScope(`installService/${options.service.name}`)

  const steps = (options.service[options.action] || []).filter((step) =>
    options.stepFilters && options.stepFilters.length ? options.stepFilters.includes(step.type) : true,
  )

  const checks = await options.injector
    .getInstance(CheckPrerequisitesService)
    .checkPrerequisiteForSteps({ steps, stepFilters: options.stepFilters })

  if (checks.length) {
    logger.error({
      message: `Some prerequisites has not been met`,
      data: { ...options, checks },
    })
  }

  if (steps && steps.length) {
    logger.information({
      message: `Installing service ${options.service.name}...`,
      data: { steps },
    })

    const installServiceInjector = options.injector.createChild({ owner: options.service })

    for (const step of steps) {
      const stepName = getStepDisplayNames(step)
      logger.information({
        message: `Executing step in service '${options.service.name}': ${stepName}`,
        data: {
          step,
          service: options.service,
        },
      })
      try {
        await execInstallStep(installServiceInjector, step, {
          rootDir: options.workdir,
          serviceDir: getServiceDir(options.service, options.workdir),
          service: options.service,
          inputDir: options.inputDir,
        })
      } catch (error) {
        logger.error({
          message: `There was an error installing the service '${options.service.name}' during the step '${step.type}'`,
          data: { service: options.service, step, error, errorString: error.toString() },
        })
        throw error
      }
    }
    await installServiceInjector.dispose()
  }
}
