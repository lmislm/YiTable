<template>
  <div class="yi-table">
    <div class="yi-table__table-wrapper">
      <table :class="fullTableClass">
        <thead :class="tableHeadClass">
          <slot name="before-header" :columns="columns" />
          <tr>
            <!-- selectale抽离成组件？ -->
            <th v-if="selectable">
              <input type="checkbox" @click="toggleSelectAll"/>
            </th>
            <table-column-header
              v-for="column in columns"
              :key="column.prop"
              :sort="sort"
              :column="column"
              @click="changeSorting"
            />
            <!-- :all-selected="toggleSelectAlled"
            :indeterminate-selected="indeterminateSelected"
            :selectable="selectable"-->
          </tr>
          <slot name="after-header" :columns="columns" />
        </thead>
        <tbody :class="tableBodyClass">
          <template v-for="(row, index) in displayedRows">
            <table-row
              :key="row.index"
              :row="row"
              :class="[index%2 == 0 ? 'even' : 'odd']"
              :columns="columns"
              :selectable="selectable"
              @rowClick="emitRowClick"
              @rowSelect="emitRowSelectClick"
            />
            <slot name="after-row" :index="index" :row="row.data" :columns="columns" />
          </template>
        </tbody>
        <slot name="footer" />
      </table>
    </div>
    <div v-if="displayedRows.length === 0" class="yi-table__empty-text">{{emptyText}}</div>
    <div v-if="displayedRows.length === 0 && !emptyText" class="yi-table__empty">
      <slot />
    </div>
    <template v-if="pagination && count">
      <slot name="pagination" :pagination="{ count, pageChange, paginationEllipsisClick }">
        <table-pagination
          :current-page="pagination.currentPage"
          :per-page="pagination.perPage"
          :count="count"
          @pageChange="pageChange"
          @ellipsisClick="paginationEllipsisClick"
        />
      </slot>
    </template>
  </div>
</template>

<script>
import Column from '../classes/Column'
import Row from '../classes/Row'
import TableColumnHeader from './TableColumnHeader'
import TableRow from './TableRow'
import TablePagination from './TablePagination'
import { classList, toggleRowStatus } from '../utils'

export default {
  components: {
    TableColumnHeader,
    TableRow,
    TablePagination
  },
  props: {
    data: {
      type: [Array, Function],
      default: () => []
    },
    pagination: {
      type: Object,
      default: undefined
    },
    showCaption: {
      type: Boolean,
      default: true
    },
    sortBy: {
      type: String,
      default: ''
    },
    sortOrder: {
      type: String,
      default: ''
    },
    selectable: {
      type: Boolean,
      default: false
    },
    emptyText: {
      type: String,
      default: ''
    },
    tableClass: {
      type: Function,
      default: () => ''
    },
    theadClass: {
      type: Function,
      default: () => ''
    },
    tbodyClass: {
      type: Function,
      default: () => ''
    }
  },

  data: () => ({
    columns: [],
    rows: [],
    sort: {
      fieldName: '',
      order: ''
    },
    count: undefined,
    selection: [],
    isAllSelected: false
  }),

  computed: {
    fullTableClass () {
      return classList('yi-table__table', this.tableClass)
    },
    tableHeadClass () {
      return classList('yi-table__table__head', this.theadClass)
    },
    tableBodyClass () {
      return classList('yi-table__table__body', this.tbodyClass)
    },
    ariaCaption () {
      if (this.sort.fieldName === '') {
        return 'Table not sorted'
      }
      return `Table sorted by ${this.sort.fieldName} ${
        this.sort.order === 'asc' ? '(ascending)' : '(descending)'}`
    },
    usesLocalData () {
      return Array.isArray(this.data)
    },
    displayedRows () {
      // let rows = this.rows // 前端分页，TODO: 加attr来判断
      // if (this.usesLocalData && this.pagination) {
      //   const lastPage = this.pagination.currentPage - 1
      //   const lastElementOfLastPageIndex = lastPage * this.pagination.perPage
      //   rows = rows.slice(lastElementOfLastPageIndex, lastElementOfLastPageIndex + this.pagination.perPage)
      // }
      if (!this.usesLocalData) {
        return this.sortedRows
      }
      if (!this.showFilter) {
        return this.sortedRows
      }
      if (!this.columns.filter(column => column.isFilterable()).length) {
        return this.sortedRows
      }
      return this.sortedRows.filter(row => row.passesFilter(this.filter))
    },
    sortedRows () {
      if (!this.usesLocalData) {
        return this.rows
      }
      if (this.sort.fieldName === '') {
        return this.rows
      }
      if (this.columns.length === 0) {
        return this.rows
      }
      const sortColumn = this.getColumn(this.sort.fieldName)
      if (!sortColumn) {
        return this.rows
      }
      // 深拷贝，JSON.parse方法会有函数循环限制
      // slice makes a copy of the array, instead of mutating the orginal
      const rowsCopy = this.rows.slice(0)
      const sorted = rowsCopy.sort(sortColumn.getSortPredicate(this.sort.order, this.columns))
      return sorted
    }
  },
  watch: {
    data () {
      if (this.usesLocalData) {
        this.mapDataToRows()
      }
    }
  },
  created () {
    this.sort.fieldName = this.sortBy
    this.sort.order = this.sortOrder
  },
  async mounted () {
    const columnComponents = this.$slots.default
      .filter((column) => column.componentInstance)
      .map((column) => column)
    this.columns = columnComponents.map((column) => new Column(column))
    columnComponents.forEach((columnCom) => {
      if (columnCom.componentInstance.$options.props) {
        Object.keys(columnCom.componentInstance.$options.props).forEach((prop) => {
          columnCom.componentInstance.$watch(prop, () => {
            this.columns = columnComponents.map((column) => new Column(column))
          })
        })
      }
    })
    await this.mapDataToRows()
  },
  methods: {
    cloneArray (arrayToCopy) {
      return arrayToCopy.slice(0)
    },
    async pageChange (page) {
      this.pagination.currentPage = page
      await this.mapDataToRows()
    },
    async mapDataToRows () {
      const data = this.prepareLocalData()
      this.rows = data.map((rowData, rowIndex) => new Row(rowData, this.columns, rowIndex))
      this.$emit('data-change')
    },
    paginationEllipsisClick (event) {
      this.$emit('paginationEllipsisClick', event)
    },
    prepareLocalData () {
      this.count = this.data.length
      return this.data
    },
    changeSorting (column) {
      if (this.sort.fieldName === column.prop) {
        this.sort.order = this.sort.order === 'asc' ? 'desc' : 'asc'
      } else {
        this.sort.fieldName = column.prop
        this.sort.order = 'asc'
      }
      // 比较是否是本地缓存数据
      if (this.usesLocalData) {
        this.$emit('sort', this.sort)
      } else {
        this.mapDataToRows()
      }
    },
    getColumn (columnName) {
      return this.columns.find((column) => column.prop === columnName)
    },
    emitRowClick (row) {
      // this.$emit('rowClick', row)
      this.$emit('row-click', row)
    },
    emitRowSelectClick () {
      const selectRows = this.displayedRows.filter(row => !!row.isSelected)
      const selection = (this.deleteProp(selectRows, 'isSelected') || [])
        .map(row => row.data)
      // 累计所有选中的数据的data，推入一个数组
      this.selection = selection.slice()
      this.$emit('selection-change', this.selection)
    },
    toggleSelectAll () {
      this.isAllSelected = !this.isAllSelected
      const rows = this.rows.map(row => ({...row, isSelected: this.isAllSelected}))
      console.log(rows)
      // 清空所有选中状态
      // this.displayedRows = this.sortedRows.map(row => ({
      //   ...row,
      //   isSelected: false
      // }))
      // // this.$emit('selection-change', [])
      // console.log(this.displayedRows, 'displayedRows')
    },
    initSelected () {
      console.log('initSelected')
    },
    clearSelection () {
      // 清空所有选中状态
      this.displayedRows.forEach(row => {
        if (row.isSelected !== 'undefined' && row.isSelected) {
          row.isSelected = false
        }
      })
      this.$emit('selection-change', [])
    },
    testRowSelect () {
      console.log(this.selection, 'slice()')
      this.toggleRowSelection(this.displayedRows[2].data, true)
    },
    toggleRowSelection (row, isSelected) {
      const change = toggleRowStatus(this.selection, row, isSelected)
      if (change) {
        // this.setRowSelectedStatus(this.displayedRows, row, isSelected)
        // console.log(this.selection, 'selection, toggleRow', this.displayedRows)
      }
      console.log(change)
    },
    setRowSelectedStatus (rows, row, status) {
      const index = rows.indexOf(row)
      // rows[index].isSelected = status
      rows.forEach((row, i) => {
        if (i === index) {
          row.isSelected = status
        }
      })
    },
    deleteProp (data, prop) {
      // TODO: 这里要用map嘛?
      return data.map(row => {
        // TODO: 配置eslint，Es6展开，会有no-unused-vars，Object.assign复制会有问题吗？
        const newRow = Object.assign({}, row)
        delete newRow[prop]
        return newRow
      })
    }
  }
}
</script>
<style>
/* 这里是一个暂时的接口，可能要封装到外部的class文件 */
td,
th {
  border: 1px solid #dddddd;
  text-align: left;
  padding: 8px;
}
tr:nth-child(even) {
  background-color: #dddddd;
}
</style>

