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
    const dataType = this.getColumn(columnName).dataType

    let value = this.getValue(columnName)

    if (value === undefined || value === null) {
      return ''
    }

    if (value instanceof String) {
      value = value.toLowerCase()
    }

    if (dataType === 'numeric') {
      return value
    }

    return value.toString()
  }
  // 是否可以过滤
  getFilterableValue(columnName) {
    const value = this.getValue(columnName)

    if (!value) {
      return ''
    }

    return value.toString().toLowerCase()
  }

  passesFilter(filter) {
    return this.columns
      .filter(column => column.isFilterable())
      .map(column => this.getFilterableValue(column.getFilterFieldName()))
      .filter(
        filterableValue => filterableValue.indexOf(filter.toLowerCase()) >= 0
      ).length
  }
}
