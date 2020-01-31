import { BaseValueType } from '../BaseValueType'
import ParamStringContainer from './container'

export class StringValueType extends BaseValueType {
  defaultValue = 'text'

  Component = ParamStringContainer

  doesValueMatch (value) {
    return typeof value === 'string'
  }
}
