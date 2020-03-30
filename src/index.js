import Vue from 'vue'

import YiTable from './components/Table'
import YiColumn from './components/TableColumn'
import YiPagination from './components/TablePagination';

import ColumnMixin from './components/column-mixin'

import Example from './components/Example'

if (process.env.NODE_ENV !== 'production') {
  new Vue({
    render: (h) => h(Example),
  }).$mount('#app')
}

export { YiTable, YiColumn, YiPagination, ColumnMixin }
