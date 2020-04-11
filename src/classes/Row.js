import { get } from '../utils'

export default class Row {
  constructor(data, columns, index) {
    this.data = data
    this.columns = columns
    this.index = index
  }
  getValue(columnName) {
    return get(this.data, columnName)
  }
  getColumn(columnName) {
    return this.columns.find(column => column.prop === columnName)
  }
  getSortableValue(columnName) {
    const { dataType, type } = this.getColumn(columnName)
    let value = this.getValue(columnName)
    if (value === undefined || value === null) {
      return ''
    }
    if (value instanceof String) {
      value = value.toLowerCase()
    }
    if (type === 'index') {
      return this.index
    }
    if (dataType === 'numeric') {
      return value
    }
    return value.toString()
  }
}
