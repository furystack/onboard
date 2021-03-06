import { Injector, Injectable } from '@furystack/inject'
import { Service } from './models/service'
import { getServiceForInstallStep } from './processes/exec-install-step'
import { Process } from './models'

export type Prerequisite = (injector: Injector) => Promise<{ message: string; success: false } | { success: true }>

export const genericPrerequisites: Prerequisite[] = []

@Injectable({ lifetime: 'singleton' })
export class CheckPrerequisitesService {
  private cached = new Set<Prerequisite>()
  public async check(...prereqs: Prerequisite[]) {
    const promises = prereqs
      .filter((pr) => {
        if (!this.cached.has(pr)) {
          this.cached.add(pr)
          return true
        }
        return false
      })
      .map((pr) => pr(this.injector))
    const result = await Promise.all(promises)
    const errors = result.filter((r) => r && r.success === false)
    return errors
  }

  public async checkPrerequisiteForServices(options: { services: Service[] }) {
    const steps = options.services
      .map((service) => service.actions)
      .reduce(
        (prev, current) => [...prev, ...current.reduce((p, s) => [...p, ...s.steps], [] as Process[])],
        [] as Process[],
      )
    return await this.checkPrerequisiteForSteps({ steps })
  }

  public async checkPrerequisiteForSteps(options: { steps: Process[] }) {
    const prereqs = options.steps
      .map((step) => getServiceForInstallStep(step, this.injector))
      .map((step) => this.injector.getInstance(step))
      .filter((step) => step.prerequisites && step.prerequisites.length)
      .reduce<Prerequisite[]>((prev, current) => [...prev, ...(current.prerequisites as Prerequisite[])], [])

    return await this.check(...prereqs)
  }

  constructor(private readonly injector: Injector) {}
}
