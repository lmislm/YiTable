export default {
  functional: true,
  props: ['column', 'row', 'index'],
  render(createElement, { props }) {
    const data = {}
    if (props.column.cellClass) {
      data.class = props.column.cellClass
    }
    if (props.column.width) {
      data.style = { width: parseInt(props.column.width) + 'px' }
    }
    if (props.column.minWidth) {
      data.style = { 'min-width': parseInt(props.column.minWidth) + 'px' }
    }
    if (props.column.template) {
      return createElement('td', data, [
        createElement(
          'span',
          { class: 'cell' },
          props.column.template(props.row.data)
        )
      ])
    }
    if (props.column.component) {
      const component = props.column.component
      component.componentOptions.propsData.row = props.row.data
      return component
    }
    if (props.column.formatter.name !== '_default') {
      data.domProps = {}
      data.domProps.innerHTML = props.column.formatter(
        props.row.getValue(props.column.prop),
        props.row.data
      )
    }
    const isColumnIndex = props.column.type && props.column.type === 'index'
    return createElement('td', data, [
      createElement(
        'span',
        { class: 'cell' },
        // 真实id还是实时的index, 真实id:props.index,实时index:props.row.index
        // isColumnIndex ? props.index + 1 : props.row.getValue(props.column.prop)
        isColumnIndex ? props.row.index + 1 : props.row.getValue(props.column.prop)
      )
    ])
  }
}
