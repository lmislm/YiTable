import YiTable from './components/Table'
import YiColumn from './components/TableColumn'
import ColumnMixin from './components/column-mixin'
import './icons/index'
const components = [YiTable, YiColumn, ColumnMixin]
const install = function (Vue) {
  if (install.installed) return
  components.map(com => Vue.component(com.name, com))
}
// script直接引入文件
if (typeof window !== 'undefined' && window.Vue) {
  install(window.Vue)
}
export default {
  install
}
