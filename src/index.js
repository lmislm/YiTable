import Vue from 'vue'

import YiTable from './components/Table'
import YiColumn from './components/TableColumn'
import ColumnMixin from './components/column-mixin'
import YiTableIcon from '@/components/YiTableIcon'

Vue.component('yi-table-icon', YiTableIcon)

const req = require.context('./icons/svg')
const requireAll = requireContext => requireContext.keys().map(requireContext)
requireAll(req)

export default {
  install(Vue) {
    Vue.component('yi-table', YiTable)
    Vue.component('yi-table-column', YiColumn)
    Vue.component('yi-table-icon', YiTableIcon)
  }
}
export {YiTable, YiColumn, ColumnMixin, YiTableIcon}
