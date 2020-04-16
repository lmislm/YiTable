export default {
  functional: true,
  props: ['column', 'row', 'index'],
  render(createElement, { props, children }) {
    const data = {}
    if (props.column.cellClass) {
      data.class = props.column.cellClass
    }
    if (props.column.width) {
      data.style = {
        width: parseInt(props.column.width) + 'px'
      }
    }
    if (props.column.align) {
      data.class = [
        props.column.cellClass,
        props.column.align && `is-${props.column.align}`
      ]
    }
    if (props.column.minWidth) {
      data.style = {
        'min-width': parseInt(props.column.minWidth) + 'px'
      }
    }
    if (props.column.template) {
      return createElement('td', data, [
        createElement(
          'span',
          {
            class: 'cell'
          },
          props.column.template({
            row: props.row.data,
            column: props.column,
            $index: props.index
          })
        )
      ])
    }
    if (props.column.component) {
      const component = props.column.component
      component.componentOptions.propsData.row = props.row.data
      return component
    }
    // TODO: 优化Function的判断
    // if (props.column.formatter.name !== '_default') {
    //   data.domProps = {}
    //   data.domProps.innerHTML = props.column.formatter(
    //     props.row.getValue(props.column.prop),
    //     props.row.data
    //   )
    // }
    // if (props.column.selectable.name !== '_default') {
    //   let canSelect = props.column.selectable(props.row.data, props.row.index)
    //   if (canSelect === 'undefined') {
    //     canSelect = true
    //   }
    //   props.row.isSelectable = canSelect
    //   if (!canSelect) {
    //     props.row.isSelected = false
    //   }
    // }
    // 表格列类型
    const createElementValue = (function value() {
      const columnType = props.column.type
      const isColumnIndex = columnType && columnType === 'index'
      const isColumnSelection = columnType && columnType === 'selection'
      const isRealColumnIndex = true // options
      if (isColumnIndex) {
        // 真实id还是实时的index, 实时id:props.index,真实index:props.row.index
        if (isRealColumnIndex) {
          return props.row.index + 1
        } else {
          return props.index + 1
        }
      }
      if (isColumnSelection) {
        return children // slots().default
      } else {
        return props.row.getValue(props.column.prop)
      }
    })()
    return createElement('td', data, [
      createElement(
        'span',
        {
          class: 'cell'
        },
        [createElementValue]
      )
    ])
  }
}
