<template>
  <div class="yi-table">
    <div class="yi-table-set right-bottom" :class="{'outside': !inside}" v-if="showOption">
      <span @click="onShowFilter" :class="['yi-filter', { 'is-show': isShowFilter }]">
        <slot name="filter-icon">
          <yi-table-icon icon="yi-table-filter" class-name="table-icon filter" :class="{ 'is-show': isShowFilter }"></yi-table-icon>
        </slot>
      </span>
      <yi-popover trigger="click" :options="{ placement: 'bottom' }" append-to-body @show="handlePopoverShow" @hide="handlePopoverHide">
        <div :class="['yi-popover popper', { 'is-show': isPopoverShow }]">
          <div class="column-set">
            <checkbox
              :key="i"
              v-for="(item, i) in columnProps"
              v-model="item.show"
              :id="item.label"
            >{{item.label}}</checkbox>
          </div>
        </div>
        <span slot="reference">
          <slot name="option-icon">
            <yi-table-icon icon="yi-table-option" class-name="table-icon option" :class="{ 'is-show': isPopoverShow }"></yi-table-icon>
          </slot>
        </span>
      </yi-popover>
    </div>
    <div class="yi-table__table-wrapper">
      <table
        :class="[fullTableClass, align && `is-${align}`]"
        border="0"
        cellspacing="0"
        cellpadding="0"
      >
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
            <checkbox
              slot="selection"
              v-model="isAllSelected"
              :indeterminate="allSelectedIndeterminate"
            ></checkbox>
            </table-column-header>
          </tr>
          <tr v-show="showFilter || isShowFilter">
            <template v-for="(col, index) in columns">
              <th v-if="!col.hidden" :key="index">
                <span class="cell">
                  <slot :name="col.prop" />
                </span>
              </th>
            </template>
          </tr>
        </thead>
        <tbody :class="tableBodyClass">
          <template v-for="(row, index) in displayedRows">
            <table-row
              :key="index"
              :row="row"
              :index="index"
              :row-class-name="rowClassName"
              :columns="columns"
              @rowSelect="emitRowSelectClick"
              @row-click="rowClick"
            />
            <slot name="after-row" :index="index" :row="row.data" :columns="columns" />
          </template>
        </tbody>
        <slot name="footer" />
      </table>
    </div>
    <slot />
    <div
      class="yi-table__empty yi-table__empty-text"
      v-if="!showColumns.length && displayedRows.length && !hasShowColumn"
    >
      <slot name="empty-text">~</slot>
    </div>
    <div v-if="!displayedRows.length" class="yi-table__empty yi-table__empty-text">
      <slot name="empty-text">~</slot>
    </div>
  </div>
</template>

<script>
import Column from '../classes/Column'
import Row from '../classes/Row'
import TableColumnHeader from './TableColumnHeader'
import TableRow from './TableRow'
import Checkbox from './Checkbox.vue'
import { classList, toggleRowStatus } from '../utils'
import cloneDeep from 'lodash.clonedeep'
import expiringStorage from '../utils/expiring-storage'
import YiTableIcon from '@/components/YiTableIcon'


import YiPopover from './PopoverJs'

const CACHE_NAME = 'YITABLE'

export default {
  components: {
    YiPopover,
    TableColumnHeader,
    TableRow,
    YiTableIcon,
    Checkbox
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
    cacheKey: {
      type: String,
      default: null,
    },
    cache: { // 默认存储表格列配置
      type: Boolean,
      default: true
    },
    tableCacheName: {
      type: String,
      default: 'YITABLE'
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
    stripe: {
      type: Boolean,
      default: true
    },
    border: {
      type: Boolean,
      default: true
    },
    rowClassName: [String, Function],
    maxHeight: [String, Number],
    showHeader: {
      type: Boolean,
      default: true
    },
    align: {
      type: String,
      default: ''
    },
    highlightCurrentRow: Boolean,
    showOption: {
      type: Boolean,
      default: true
    },
    inside: Boolean
  },

  data: () => ({
    columns: [],
    rows: [],
    currentRow: {},
    sort: {
      fieldName: '',
      order: ''
    },
    count: undefined,
    selection: [],
    rowSelection: [],
    isAllSelected: false,
    isShowFilter: false,
    showColumns: [],
    hasShowColumn: false,
    columnProps: [],
    allSelectedIndeterminate: false,
    isPopoverShow: false
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
    usesLocalData () { // TODO: cache缓存
      return Array.isArray(this.data)
    },
    displayedRows () {
      // 这个地方每次变动displayRows都会修改isSelectable为true,todo需要优化
      this.sortedRows.forEach(row => {
        // TODO：这里又实现了一遍rowCell中的方法
        const selectionCol = row.columns.find(col => col.type === 'selection')
        const isSelectable = selectionCol && selectionCol.selectable && selectionCol.selectable(row.data, row.index)
        this.$set(row, 'isSelectable', isSelectable)
      })
      if (this.highlightCurrentRow) {
        this.sortedRows.forEach(row => {
          this.$set(row, 'isHighLight', false)
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
      // slice makes a copy of the array, instead of mutating the orginal
      const rowsCopy = cloneDeep(this.rows)
      const sorted = rowsCopy.sort(sortColumn.getSortPredicate(this.sort.order, this.columns))
      return sorted
    },
    storageKey () {
      // 根据业务cacheKey来缓存cache名，TODO: 处理异常
      return this.cacheKey || ''
    }
  },
  watch: {
    data () {
      if (this.usesLocalData) {
        this.mapDataToRows()
        this.clearSelection()
      }
    },
    showColumns (v, oldVal) {
      if (this.usesLocalData) {
        this.columns = this.columns.map(col => {
          col.hidden = col.prop !== undefined && !~v.indexOf(col.prop)
          return col
        })
        // 判断列表中还有展示的没有计入的列prop为undefined
        this.hasShowColumn = this.columns.find(col => col.prop === undefined)
        // oldVal.length 判断，表示初始化进来时不存缓存，要手动触发配置列，才会存缓存
        if (this.cache && oldVal.length) {
          this.saveState()
        }
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
    },
    currentRow (newRowData, oldRowData) {
      // Todo: 比对新旧
      this.$emit('current-change', newRowData, oldRowData)
    },
    columnProps: {
      deep: true,
      handler (v) {
        this.showColumns = v.filter(col => col.show).map(col => col.prop)
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
    const columnProps = this.columns.filter(col => Boolean(col.prop)).map(col => ({ prop: col.prop, label: col.label }))
    // 封装的组件中，这里会有区别
    this.columnProps = columnProps
    this.$emit('column-props', columnProps)
    // 从缓存中恢复表格列配置
    if (this.cache) {
      this.restoreSate()
    } else {
      this.columnProps.forEach(col => {
        this.$set(col, 'show', true)
      })
    }
    await this.mapDataToRows()
  },
  methods: {
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
    rowClick (row) {
      // 高亮选中的行，其他行都是不高亮
      this.setCurrentRow(row.data)
      this.$emit('row-click', row.data)
    },
    emitRowSelectClick (options) {
      // 优化这个options
      const selectRows = this.displayedRows.filter(row => !!row.isSelectable && !!row.isSelected)
      const selection = (this.deleteProp(selectRows, 'isSelected') || []).map(row => row.data)
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
    toggleRowSelection (rowData, selectStatus) {
      // selectStatus 为空时，toggleRowSelection进行反选
      const changeObj = toggleRowStatus(this.rowSelection, rowData, selectStatus)
      if (changeObj.isChanged) {
        this.setRowSelectedStatus(
          this.displayedRows,
          changeObj.rowData,
          (typeof selectStatus !== 'boolean') ? changeObj.isAdd : selectStatus
        )
      }
    },
    toggleAllSelection () {
      // 清空选中特定行的状态
      this.rowSelection = []
      // 切换所有行的选中状态
      // TODO: 可以优化遍历嘛，这里内层有好几个forEach
      const rowDatas = this.displayedRows
      this.toggleAllStatus = !this.toggleAllStatus
      rowDatas.forEach(row => {
        this.setRowSelectedStatus(this.displayedRows, row.data, this.toggleAllStatus)
      })
    },
    setRowSelectedStatus (rows, rowData, status) {
      const rowDatas = rows.map(row => row.data)
      const index = rowDatas.indexOf(rowData)
      rows.forEach((row, i) => {
        if (i === index) {
          this.$set(row, 'isSelected', status)
        }
      })
      this.emitRowSelectClick({ isAll: false })
    },
    setCurrentRow (rowData) {
      if (this.highlightCurrentRow) {
        const rows = this.displayedRows
        const rowsData = rows.map(r => r.data)
        const index = rowsData.indexOf(rowData)
        rows.forEach((row, i) => {
          row.isHighLight = !!(i === index)
        })
      }
      this.currentRow = rowData
    },
    saveState () {
      // 存入value为列表类型，在这里进行查重替换
      // { storageKey: value, storageKey2: value2 }，value是表格配置的prop
      const cachedObj = expiringStorage.get(CACHE_NAME)
      // 当前表格新的数据
      const tableKey = this.storageKey
      if (!tableKey) return
      const tablePropsValue = this.columnProps
        .filter(col => ~this.showColumns.indexOf(col.prop))
        .map(col => col.prop)
      let keyValue = {}
      // 是否这个表格之前已经存过
      if (cachedObj) {
        cachedObj[tableKey] = tablePropsValue
        // 去重塞入key检查
        expiringStorage.set(CACHE_NAME, cachedObj)
      } else {
        keyValue[tableKey] = tablePropsValue
        expiringStorage.set(CACHE_NAME, keyValue)
      }
    },
    restoreSate () {
      // 根据缓存中内容显示列表内容
      const cachedObj = expiringStorage.get(CACHE_NAME)
      if (cachedObj) {
        const showColumnProps = (cachedObj[this.storageKey] || [])
        this.columnProps.forEach(col => {
          this.$set(col, 'show', (col.prop === undefined) || ~showColumnProps.indexOf(col.prop))
        })
      } else {
        this.columnProps.forEach(col => {
          this.$set(col, 'show', true)
        })
      }
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
    onShowFilter () {
      this.isShowFilter = !this.isShowFilter
      this.$emit('filter', this.isShowFilter)
    },
    handlePopoverShow () {
      this.isPopoverShow = true
    },
    handlePopoverHide () {
      this.isPopoverShow = false
    }
  }
}
</script>
<style lang="scss">
$--theme-color: #409eff;
$--color-white: #ffffff;
$--font-size-base: 14px;
$--color-text-regular: #606266;
$--border-color-lighter: #ebeef5;
$--color-primary-light-1: #ecf5ff;
$--background-color-base: #f5f7fa;
$--background-color-even: #fafafa;
$--background-icon-color: #c0c4cc;
$--box-shadow-light: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
$--color-text-secondary: #909399;

/* Table
--------------------------*/
$--table-border-color: $--border-color-lighter;
$--table-font-color: $--color-text-regular;
$--table-border: 1px solid $--table-border-color;
$--table-current-row-background-color: $--color-primary-light-1 !important;
$--table-row-hover-background-color: $--background-color-base;
$--table-row-even-background-color: $--background-color-even;

/* Popover
--------------------------*/
$--popover-background-color: $--color-white;
$--popover-font-size: $--font-size-base;
$--popover-border-color: $--border-color-lighter;
$--popover-padding: 12px;
$--index-popper: 2000;

/* Scrollbar
--------------------------*/
$--scrollbar-background-color: rgba($--color-text-secondary, 0.3);
$--scrollbar-hover-background-color: rgba($--color-text-secondary, 0.5);

.yi-table {
  position: relative;
  box-sizing: border-box;
  width: 100%;
  max-width: 100%;
  background-color: $--color-white;
  font-size: 14px;
  color: $--table-font-color;
  height: 100%;
  overflow-y: unset;
  .yi-table-set {
    user-select: none;
    .table-icon {
      width: 18px;
      height: 18px;
      cursor: pointer;
      fill: $--color-text-regular;
      &.filter {
        margin-right: 5px;
      }
      &.is-show {
        fill: $--theme-color;
      }
    }
    &.right-bottom {
      position: absolute;
      right: 0;
      z-index: 1;
    }
    &.outside {
      top: -20px;
    }
  }
  .yi-table__head {
    .yi-table__th--sort,
    .yi-table__th--sort-desc,
    .yi-table__th--sort-asc {
      .cell {
        cursor: pointer;
      }
    }
    .yi-table__th--sort-desc {
      .sort {
        .ascend {
          fill: $--background-icon-color;
        }
        .descend {
          fill: $--theme-color;
        }
      }
    }
    .yi-table__th--sort-asc {
      .sort {
        .ascend {
          fill: $--theme-color;
        }
        .descend {
          fill: $--background-icon-color;
        }
      }
    }
  }
  .yi-table__table-wrapper {
    height: inherit;
    overflow-y: auto;
    &::-webkit-scrollbar {
      position: absolute;
      right: 2px;
      bottom: 2px;
      z-index: 1;
      border-radius: 4px;
      opacity: 0;
      transition: opacity 120ms ease-out;
      width: 6px;
      top: 2px;
    }
    &::-webkit-scrollbar-thumb {
      position: relative;
      display: block;
      width: 0;
      height: 0;
      cursor: pointer;
      border-radius: 4px;
      background-color: $--scrollbar-background-color;
      transition: 0.3s background-color;
      &:hover {
        background-color: $--scrollbar-hover-background-color;
      }
    }
    .yi-table__table {
      width: 100%;
      text-align: center;
      .yi-table__body {
        tr {
          transition: background-color 0.25s ease;
          &:hover {
            background-color: $--table-row-hover-background-color;
          }
        }
      }
      .cell {
        display: inline-block;
        width: 100%;
        box-sizing: border-box;
        text-overflow: ellipsis;
        white-space: normal;
        word-break: break-all;
        line-height: 23px;
        padding-left: 10px;
        padding-right: 10px;
        .index,
        .selection {
          width: 55px;
        }
        .sort {
          display: inline-flex;
          flex-direction: column;
          align-items: center;
          vertical-align: middle;
          cursor: pointer;
          overflow: initial;
          position: relative;
          .yi-table-sort-icon {
            width: 12px;
            height: 12px;
            fill: $--background-icon-color;
            cursor: pointer;
            &.ascend {
              margin-top: -3px;
              margin-bottom: -3px;
            }
            &.descend {
              margin-top: -3px;
            }
          }
        }
      }
      tr {
        border-bottom: $--table-border;
        // background-color: $--color-white;
        input[type='checkbox'] {
          margin: 0;
        }
        &.high-light {
          background-color: $--table-current-row-background-color;
        }
        .is-center {
          text-align: center;
        }
        .is-left {
          text-align: left;
        }
        .is-right {
          text-align: right;
        }
      }
      th,
      td {
        border-bottom: $--table-border;
        border-bottom-width: 1px;
        padding: 8px 0; // small
        // padding: 6px 0; // mini
        // padding: 10px 0; // medium
        min-width: 0;
        box-sizing: border-box;
        text-overflow: ellipsis;
        vertical-align: middle;
        position: relative;
      }
      &.is-left {
        text-align: left;
      }
      &.is-right {
        text-align: right;
      }
      &.border {
        border-left: $--table-border;
        border-top: $--table-border;
        th,
        td {
          border-right: $--table-border;
        }
      }
      // &.stripe {
      //   &,.even {
      //     background-color: $--table-row-even-background-color;
      //   }
      // }
    }
  }
  .yi-table__empty {
    min-height: 60px;
    display: flex;
    justify-content: center;
    border-left: $--table-border;
    border-right: $--table-border;
    border-bottom: $--table-border;
    align-items: center;
  }
}
/**提取特定颜色到外部，方便外部定义时，可以覆盖里面的样式 */
tr {
  background-color: $--color-white;
}
.stripe {
  &,
  .even {
    background-color: $--table-row-even-background-color;
  }
}
// 列表配置样式popper
.yi-popover {
  position: absolute;
  background: $--popover-background-color;
  border-radius: 4px;
  border: $--table-border;
  padding: $--popover-padding;
  z-index: $--index-popper;
  color: $--color-text-regular;
  line-height: 1.4;
  text-align: justify;
  font-size: $--popover-font-size;
  box-shadow: $--box-shadow-light;
  word-break: break-all;
  .column-set {
    display: flex;
    flex-direction: column;
  }
  &.is-show {
    color: $--theme-color;
  }
}
.yi-filter {
  &.is-show {
    color: $--theme-color;
  }
}
</style>
