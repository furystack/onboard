import { Service } from './service'

export interface Workspace {
  name: string
  inputDirectory: string
  outputDirectory: string
  services: Service[]
}
