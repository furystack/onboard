import { join } from 'path'
import { Injector } from '@furystack/inject'
import { Service } from '../models/service'
import { CheckPrerequisitesService } from '../check-prerequisites'
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
  action: string
}) => {
  const logger = options.injector.logger.withScope(`installService/${options.service.name}`)
  const steps = options.service.actions.find((a) => a.name === options.action)?.steps || []
  const checks = await options.injector.getInstance(CheckPrerequisitesService).checkPrerequisiteForSteps({ steps })

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
  } else {
    logger.information({
      message: `No steps to execute on service '${options.service.name}' in action '${options.action}', moving forward...`,
    })
  }
}
