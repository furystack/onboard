import { join } from 'path'
import { Injectable, Injector } from '@furystack/inject'
import { NpmInstall } from '../models/process'
import { isNpmInstalled } from '../prerequisites/is-npm-installed'
import { ExecInstallContext } from './exec-install-step'
import { GenericStep } from './generic-step'

@Injectable()
export class NpmInstallStep implements GenericStep<NpmInstall> {
  prerequisites = [isNpmInstalled]
  public run = async (step: NpmInstall, context: ExecInstallContext) => {
    const dir = step.path ? join(context.serviceDir, step.path) : context.serviceDir
    await this.injector.execAsync('npm install', { cwd: dir, env: process.env })
  }
  constructor(private injector: Injector) {}
}
