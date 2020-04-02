import YiTable from './components/Table'
import YiColumn from './components/TableColumn'
import YiPagination from './components/TablePagination'

export default {
  install(Vue) {
    Vue.component('yi-table', YiTable)
    Vue.component('yi-column', YiColumn)
    Vue.component('yi-pagination', YiPagination)
  }
}

export {YiTable, YiColumn}
