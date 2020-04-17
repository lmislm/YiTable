import Vue from 'vue'

import YiTable from './components/Table'
import YiColumn from './components/TableColumn'

import ColumnMixin from './components/column-mixin'
import './icon/index'
import Example from './components/Example'

if (process.env.NODE_ENV !== 'production') {
  new Vue({
    render: (h) => h(Example),
  }).$mount('#app')
}

export { YiTable, YiColumn, ColumnMixin }
