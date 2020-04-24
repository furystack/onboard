import { join } from 'path'
import { Injectable, Injector } from '@furystack/inject'
import { NpmScript } from '../models/process'
import { isNpmInstalled } from '../prerequisites/is-npm-installed'
import { ExecInstallContext } from './exec-install-step'
import { GenericStep } from './generic-step'

@Injectable()
export class NpmScriptStep implements GenericStep<NpmScript> {
  prerequisites = [isNpmInstalled]

  public run = async (step: NpmScript, context: ExecInstallContext) => {
    const dir = step.path ? join(context.serviceDir, step.path) : context.serviceDir
    await this.injector.execAsync(`npm run ${step.scriptName}`, { cwd: dir })
  }

  constructor(private readonly injector: Injector) {}
}
