import { join } from 'path'
import { Injectable, Injector } from '@furystack/inject'
import { MongoRestore } from '../models/process'
import { isMongoToolsInstalled } from '../prerequisites/is-mongo-tools-installed'
import { ExecInstallContext } from './exec-install-step'
import { GenericStep } from './generic-step'

@Injectable()
export class MongoRestoreStep implements GenericStep<MongoRestore> {
  prerequisites = [isMongoToolsInstalled]
  public run = async (step: MongoRestore, context: ExecInstallContext) => {
    await this.injector.execAsync(
      `mongorestore${step.drop ? ' --drop' : ' --quiet'}${step.uri ? `--uri="${step.uri}"` : ''} -d ${
        step.dbName
      } ${join(context.inputDir, step.dumpPath)} `,
      {
        maxBuffer: 1024 * 1024 * 10,
        cwd: context.inputDir,
      },
    )
  }

  constructor(private readonly injector: Injector) {}
}
