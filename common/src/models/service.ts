import { ProcessList } from './process-list'

export type ServiceAction = 'install' | 'update' | 'run'

export interface Service {
  name: string
  actions: Array<{ name: string; steps: ProcessList }>
}
