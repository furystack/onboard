import Ajv, { ValidateFunction } from 'ajv'
import { Injectable } from '@furystack/inject'
import JsonSchema from './schemas.json'

const definitionNames = Object.keys(JsonSchema.definitions) as Array<keyof typeof JsonSchema.definitions>

@Injectable()
export class JsonSchemaValidator {
  private readonly ajv = new Ajv({ allErrors: true })
  public readonly schema = new Map<typeof definitionNames[number], ValidateFunction>(
    definitionNames.map((name) => [name, this.ajv.compile({ ...JsonSchema, $ref: `#/definitions/${name}` })]),
  )

  public validateModel = <T>(data: any, typeName: typeof definitionNames[number]): data is T => {
    const result = this.schema.get(typeName)?.(data)
    return result === true
  }
}
