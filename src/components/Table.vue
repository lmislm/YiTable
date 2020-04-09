<template>
  <div class="yi-table">
    <div class="yi-table__table-wrapper">
      <table :class="fullTableClass" border="0" cellspacing="0" cellpadding="0">
        <slot name="before-header" :columns="columns" />
        <thead :class="tableHeadClass" v-if="showHeader">
          <tr>
            <table-column-header
              v-for="column in columns"
              :key="column.prop"
              :sort="sort"
              :column="column"
              @click="changeSorting"
            >
              <input
                slot="selection"
                type="checkbox"
                v-model="isAllSelected"
                :indeterminate.prop="allSelectedIndeterminate"
              />
            </table-column-header>
          </tr>
          <tr v-show="showFilter">
            <th v-for="column in columns" :key="column.prop">
              <slot :name="column.prop" />
            </th>
          </tr>
        </thead>
        <tbody :class="tableBodyClass">
          <template v-for="(row, index) in displayedRows">
            <table-row
              :key="index"
              :row="row"
              :index="index"
              :class="[index%2 == 1 ? 'even' : 'odd']"
              :columns="columns"
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
  </div>
</template>

<script>
import Column from '../classes/Column'
import Row from '../classes/Row'
import TableColumnHeader from './TableColumnHeader'
import TableRow from './TableRow'
import { classList, toggleRowStatus } from '../utils'

export default {
  components: {
    TableColumnHeader,
    TableRow
  },
  props: {
    data: {
      type: [Array, Function],
      default: () => []
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
    showFilter: Boolean,
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
    },
    stripe: Boolean,
    border: Boolean,
    maxHeight: [String, Number],
    showHeader: {
      type: Boolean,
      default: true
    },
    showRows: Array
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
    isAllSelected: false,
    allSelectedIndeterminate: false
  }),

  computed: {
    fullTableClass () {
      const border = this.border ? 'border' : ''
      const stripe = this.stripe ? 'stripe' : ''
      return classList('yi-table__table', [this.tableClass, border, stripe])
    },
    tableHeadClass () {
      return classList('yi-table__head', this.theadClass)
    },
    tableBodyClass () {
      return classList('yi-table__body', this.tbodyClass)
    },
    ariaCaption () {
      if (this.sort.fieldName === '') {
        return 'Table not sorted'
      }
      return `Table sorted by ${this.sort.fieldName} ${
        this.sort.order === 'asc' ? '(ascending)' : '(descending)'}`
    },
    usesLocalData () { // TODO: cache缓存
      return Array.isArray(this.data)
    },
    displayedRows () {
      const isSelectable = this.hasTypeSelection(this.sortedRows)
      if (isSelectable) {
        this.sortedRows.forEach(row => {
          this.$set(row, 'isSelectable', true)
        })
      }
      if (!this.usesLocalData) {
        return this.sortedRows
      }
      return this.sortedRows
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
      console.log('---')
      if (this.usesLocalData) {
        this.mapDataToRows()
        this.clearSelection()
      }
    },
    showRows () {
      console.log('===')
      if (this.usesLocalData) {
        this.mapDataToRows()
        this.clearSelection()
      }
    },
    isAllSelected (v) {
      this.displayedRows.forEach(row => {
        this.$set(row, 'isSelected', v)
      })
      this.$emit('select-all', this.displayedRows)
      if (v) {
        // 重置模糊选择状态
        this.allSelectedIndeterminate = false
      }
      this.emitRowSelectClick({ isAll: true })
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
    async pageChange () {
      await this.mapDataToRows()
    },
    async mapDataToRows () {
      const data = this.prepareLocalData()
      this.rows = data.map((rowData, rowIndex) => new Row(rowData, this.columns, rowIndex))
      this.$emit('data-change')
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
    emitRowSelectClick (options) {
      const selectRows = this.displayedRows.filter(row => !!row.isSelected && !!row.isSelectable)
      const selection = (this.deleteProp(selectRows, 'isSelected') || [])
        .map(row => row.data)
      // 累计所有选中的数据的data，推入一个数组
      this.selection = selection.slice()
      this.setHeaderCheckboxStatus(options)
      this.$emit('selection-change', this.selection)
    },
    setHeaderCheckboxStatus (options) {
      // 这种做法绝对有问题，TODO: 优化该部分
      if (!options.isAll) {
        if (this.selection.length < this.displayedRows.length) {
          this.allSelectedIndeterminate = true
        }
        if (this.selection.length === this.displayedRows.length) {
          this.isAllSelected = true
          this.allSelectedIndeterminate = false
        }
        if (this.selection.length === 0) {
          this.allSelectedIndeterminate = false
          this.isAllSelected = false
        }
      }
    },
    clearSelection () {
      // 清空所有选中状态
      this.displayedRows.forEach(row => {
        if (row.isSelected !== 'undefined' && row.isSelected) {
          this.$set(row, 'isSelected', false)
        }
      })
      // TODO: 优化这里的方法
      this.allSelectedIndeterminate = false
      this.isAllSelected = false
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
    },
    hasTypeSelection (columns) {
      const selections = columns.map(col => col.type === 'selection')
      return selections.length !== 0
    }
  }
}
</script>
<style lang="scss">
$--color-white: #ffffff !default;
$--color-text-regular: #606266 !default;
$--border-color-lighter: #ebeef5 !default;
$--color-primary-light-1: #ecf5ff;
$--background-color-base: #f5f7fa !default;

$--table-border-color: $--border-color-lighter !default;

$--table-font-color: $--color-text-regular;
$--table-border: 1px solid $--table-border-color !default;
$--table-current-row-background-color: $--color-primary-light-1 !default;
$--table-row-hover-background-color: $--background-color-base !important;

$align: center;

.yi-table {
  position: relative;
  overflow: hidden;
  box-sizing: border-box;
  flex: 1;
  width: 100%;
  max-width: 100%;
  background-color: $--color-white;
  font-size: 14px;
  color: $--table-font-color;
  .border {
    border-left: $--table-border;
    border-top: $--table-border;
    th,
    td {
      border-right: $--table-border;
    }
    // // 表格左边伪 border
    // &::after {
    //   top: 0;
    //   left: 0;
    //   width: 1px;
    //   height: 100%;
    // }
    // // 表格顶部伪 border
    // &::before {
    //   left: 0;
    //   top: 0;
    //   width: 100%;
    //   height: 1px;
    // }
  }
  .stripe {
    & .yi-table__body {
      & tr.even {
        td {
          background: #fafafa;
        }
      }
    }
  }
  .el-table__body td {
    transition: background-color 0.25s ease;
  }
  .yi-table__body tr:hover > td {
    background-color: $--table-row-hover-background-color;
  }

  th,
  td {
    border-bottom: $--table-border;
    border-bottom-width: 1px;
  }
  th,
  td {
    // padding: 6px 0; // mini
    padding: 8px 0; // small
    // padding: 10px 0; // medium
    min-width: 0;
    box-sizing: border-box;
    text-overflow: ellipsis;
    vertical-align: middle;
    position: relative;
    text-align: $align;
  }
  .cell {
    display: inline-block;
    width: 100%;
    box-sizing: border-box;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: normal;
    word-break: break-all;
    line-height: 23px;
    padding-left: 10px;
    padding-right: 10px;
  }
  tr {
    background-color: $--color-white;
    input[type="checkbox"] {
      margin: 0;
    }
    // &:nth-child(even) {
    //   background-color: #ebeef5;
    // }
  }
  tr {
    // border-bottom: 1px solid red;
    border-bottom: $--table-border;
  }
}
</style>
