import { Injectable, Injector } from '@furystack/inject'
import { DockerInstall } from '../models/process'
import { isDockerInstalled } from '../prerequisites/is-docker-installed'
import { ExecInstallContext } from './exec-install-step'
import { GenericStep } from './generic-step'

@Injectable()
export class DockerInstallStep implements GenericStep<DockerInstall> {
  prerequisites = [isDockerInstalled]
  public run = async (step: DockerInstall, context: ExecInstallContext) => {
    // ToDo: Check me, volume mappings
    await this.injector.execAsync(
      `docker run ${step.imageName} ${
        step.portMappings
          ? step.portMappings.map((port) => ` -d -p ${port.source}:${port.destination}/${port.type.toLowerCase()}`)
          : ''
      }`,
      { cwd: context.serviceDir, env: process.env },
    )
  }

  constructor(private readonly injector: Injector) {}
}
