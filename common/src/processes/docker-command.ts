import { Injectable, Injector } from '@furystack/inject'
import { DockerCommand } from '../models/process'
import '../services/exec-async'
import { isDockerInstalled } from '../prerequisites/is-docker-installed'
import { ExecInstallContext } from './exec-install-step'
import { GenericStep } from './generic-step'

@Injectable()
export class DockerCommandStep implements GenericStep<DockerCommand> {
  prerequisites = [isDockerInstalled]
  public run = async (step: DockerCommand, context: ExecInstallContext) => {
    await this.injector.execAsync(`docker ${step.command}`, { cwd: context.inputDir, env: process.env })
  }

  constructor(private readonly injector: Injector) {}
}
