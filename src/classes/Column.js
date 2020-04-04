import { pick } from '../utils'

export default class Column {
  constructor(columnComponent) {
    const properties = pick(columnComponent, [
      'type',
      'prop',
      'label',
      'dataType', // 限定的比较死
      'sortable',
      'sortBy',
      'hidden',
      'formatter',
      'cellClass',
      'width',
      'minWidth',
      'headerClass'
    ])

    for (const property in properties) {
      if (Object.prototype.hasOwnProperty.call(properties, property)) {
        this[property] = columnComponent.componentInstance[property]
      }
    }
    // TODO: 这里的tag判断只是为了在本组件中插入组件Component
    if (~columnComponent.componentOptions.tag.indexOf('table-column')) {
      this.template = columnComponent.componentInstance.$scopedSlots.default
    } else {
      this.component = columnComponent
    }
  }

  isSortable() {
    return this.sortable
  }

  getSortPredicate(sortOrder, allColumns) {
    const sortFieldName = this.getSortFieldName()

    const sortColumn = allColumns.find(column => column.prop === sortFieldName)

    const dataType = sortColumn.dataType

    if (dataType.startsWith('date') || dataType === 'numeric') {
      return (row1, row2) => {
        const value1 = row1.getSortableValue(sortFieldName)
        const value2 = row2.getSortableValue(sortFieldName)

        if (sortOrder === 'desc') {
          return this.fNumber(value2) < this.fNumber(value1) ? -1 : 1
        }

        return this.fNumber(value1) < this.fNumber(value2) ? -1 : 1
      }
    }

    return (row1, row2) => {
      const value1 = row1.getSortableValue(sortFieldName)
      const value2 = row2.getSortableValue(sortFieldName)
      if (sortOrder === 'desc') {
        return value2.localeCompare(value1)
      }
      return value1.localeCompare(value2)
    }
  }

  fNumber (value) {
    return Number(value) || value
  }

  getSortFieldName() {
    return this.sortBy || this.prop
  }
}
