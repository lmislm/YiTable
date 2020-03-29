import Vue from 'vue'

import Table from './components/Table'
import TableColumn from './components/TableColumn'
import TablePagination from './components/TablePagination';

import ColumnMixin from './components/column-mixin'

import Example from './components/Example'

if (process.env.NODE_ENV !== 'production') {
  new Vue({
    render: (h) => h(Example),
  }).$mount('#app')
}

export { Table, TableColumn, TablePagination, ColumnMixin }
