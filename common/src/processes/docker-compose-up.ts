import { join } from 'path'
import { Injectable, Injector } from '@furystack/inject'
import { DockerComposeUp } from '../models/process'
import '../services/exec-async'
import { isDockerComposeInstalled } from '../prerequisites/is-docker-compose-installed'
import { ExecInstallContext } from './exec-install-step'
import { GenericStep } from './generic-step'

@Injectable()
export class DockerComposeUpStep implements GenericStep<DockerComposeUp> {
  prerequisites = [isDockerComposeInstalled]
  public run = async (step: DockerComposeUp, context: ExecInstallContext) => {
    await this.injector.execAsync(`docker-compose -f ${join(context.inputDir, step.composeFile)} up -d`, {
      cwd: context.inputDir,
      env: process.env,
    })
  }

  constructor(private readonly injector: Injector) {}
}
