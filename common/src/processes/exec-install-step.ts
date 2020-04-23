import { Injector, Constructable } from '@furystack/inject'
import { Process } from '../models/process'
import { Service } from '../models/service'
import { NpmInstallStep } from './npm-install'
import { DockerInstallStep } from './docker-install'
import { NpmScriptStep } from './npm-script'
import { GitCloneStep } from './git-clone'
import { MongoRestoreStep } from './mongo-restore'
import { GenericStep } from './generic-step'
import { DownloadInputFileInstallStep } from './download-input-file'
import { DockerCommandStep } from './docker-command'
import { DockerComposeUpStep } from './docker-compose-up'

export interface ExecInstallContext {
  service: Service
  inputDir: string
  rootDir: string
  serviceDir: string
}

export const getServiceForInstallStep = <T extends Process>(
  step: T,
  injector: Injector,
): Constructable<GenericStep<T>> => {
  switch (step.type) {
    case 'NpmInstall':
      return NpmInstallStep as Constructable<GenericStep<T>>
    case 'DockerInstall':
      return DockerInstallStep as Constructable<GenericStep<T>>
    case 'NpmScript':
      return NpmScriptStep as Constructable<GenericStep<T>>
    case 'GitClone':
      return GitCloneStep as Constructable<GenericStep<T>>
    case 'MongoRestore':
      return MongoRestoreStep as Constructable<GenericStep<T>>
    case 'DownloadInputFile':
      return DownloadInputFileInstallStep as Constructable<GenericStep<T>>
    case 'DockerCommand':
      return DockerCommandStep as Constructable<GenericStep<T>>
    case 'DockerComposeUp':
      return DockerComposeUpStep as Constructable<GenericStep<T>>
    default:
      injector.logger.error({
        scope: `execInstallStep/${step.type}`,
        message: 'Step for type is not implemented',
        data: { step },
      })
      throw Error(`Step '${step.type}' not implemented!`)
  }
}

export const execInstallStep = async (injector: Injector, step: Process, context: ExecInstallContext) => {
  try {
    return await injector.getInstance(getServiceForInstallStep(step, injector)).run(step, context)
  } catch (error) {
    injector.logger.withScope(`execInstallStep/${context.service.name}/${step.type}`).warning({
      message: `The step has been failed`,
      data: {
        step,
        service: context.service,
        error,
        errorString: error.toString(),
      },
    })
    throw error
  }
}
