import { ProcessList } from './process-list'

export type ServiceAction = 'install' | 'update' | 'run'

export interface Service {
  name: string
  install: ProcessList
  update?: ProcessList
  run?: ProcessList
}
