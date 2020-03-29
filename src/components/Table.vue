<template>
  <div class="yi-table">
    <div class="yi-table__table-wrapper">
      <table :class="fullTableClass">
        <thead :class="tableHeadClass">
          <slot name="before-header" :columns="columns" />
          <tr>
            <table-column-header
              v-for="column in columns"
              :key="column.prop"
              :sort="sort"
              :column="column"
              @click="changeSorting"
            />
          </tr>
          <slot name="after-header" :columns="columns" />
        </thead>
        <tbody :class="tableBodyClass">
          <template v-for="(row, index) in displayedRows">
            <table-row
              :key="row.index"
              :row="row"
              :class="[ index % 2 === 0 ? 'even' : 'odd' ]"
              :columns="columns"
              @rowClick="emitRowClick"
            />
            <slot name="after-row" :index="index" :row="row.data" :columns="columns" />
          </template>
        </tbody>
        <slot name="footer" />
      </table>
    </div>

    <div v-if="displayedRows.length === 0" class="yi-table__message">{{ filterNoResults }}</div>

    <div style="display:none;">
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
import { classList } from '../utils'

export default {
  components: { TableColumnHeader, TableRow, TablePagination },
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
    cacheKey: {
      type: String,
      default: null
    },
    cacheLifetime: {
      type: Number,
      default: 5
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
    filterNoResults: {
      type: String,
      default: ''
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
    localSettings: {},
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
      let rows = this.rows
      if (this.usesLocalData && this.pagination) {
        const lastPage = this.pagination.currentPage - 1
        const lastElementOfLastPageIndex = lastPage * this.pagination.perPage
        rows = rows.slice(lastElementOfLastPageIndex, lastElementOfLastPageIndex + this.pagination.perPage)
      }
      return rows
    },
    storageKey () {
      const storageWithCacheKey = `vue-yi-table.${this.cacheKey}`
      const storageWithoutCacheKey = `vue-yi-table.${window.location.host}${window.location.pathname}${this.cacheKey}`
      return this.cacheKey ? storageWithCacheKey : storageWithoutCacheKey
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
      const data = this.usesLocalData ? this.prepareLocalData() : await this.fetchServerData()

      this.rows = data
        .map((rowData, rowIndex) => new Row(rowData, this.columns, rowIndex))

      this.$emit('data-change')
    },

    paginationEllipsisClick (event) {
      this.$emit('paginationEllipsisClick', event)
    },

    prepareLocalData () {
      this.count = this.data.length

      return this.data
    },

    async fetchServerData () {
      const page = (this.pagination && this.pagination.currentPage) || 1

      const response = await this.data({
        sort: this.sort,
        page: page
      })

      this.count = response.count

      return response.data
    },

    async refresh () {
      await this.mapDataToRows()
    },

    changeSorting (column) {
      if (this.sort.fieldName === column.prop) {
        this.sort.order = this.sort.order === 'asc' ? 'desc' : 'asc'
      } else {
        this.sort.fieldName = column.prop
        this.sort.order = 'asc'
      }

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
      this.$emit('rowClick', row)
      this.$emit('row-click', row)
    }
  }
}
</script>
