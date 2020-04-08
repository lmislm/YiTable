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
    if (props.column.formatter.name !== '_default') {
      data.domProps = {}
      data.domProps.innerHTML = props.column.formatter(
        props.row.getValue(props.column.prop),
        props.row.data
      )
    }
    if (props.column.selectable.name !== '_default') {
      const canSelect = props.column.selectable(props.row.data, props.row.index)
      // 注意：先赋值给isSelectable，然后再确定是否被选中
      props.row.isSelectable = canSelect
      props.row.isSelected = canSelect ? props.row.isSelected : false
    }
    // 表格列类型
    const columnType = props.column.type
    const isColumnIndex = columnType && columnType === 'index'
    const isColumnSelection = columnType && columnType === 'selection'
    // 序号列是否用的是实时的index
    const isRealColumnIndex = true // options
    console.log(children, 'children')
    return createElement('td', data, [
      createElement(
        'span',
        {
          class: 'cell'
        },
        // 真实id还是实时的index, 实时id:props.index,真实index:props.row.index
        // isColumnIndex ? props.index + 1 : props.row.getValue(props.column.prop)
        [
          isColumnIndex
            ? isRealColumnIndex
              ? props.row.index + 1
              : props.index + 1
            : isColumnSelection
            ? children // slots().default
            : props.row.getValue(props.column.prop)
        ]
      )
    ])
  }
}
