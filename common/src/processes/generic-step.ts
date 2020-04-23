import { Process } from '../models/process'
import { Prerequisite } from '../check-prerequisites'
import { ExecInstallContext } from './exec-install-step'

export interface GenericStep<T extends Process> {
  run: (stepOptions: T, context: ExecInstallContext) => Promise<void>
  prerequisites?: Prerequisite[]
}
