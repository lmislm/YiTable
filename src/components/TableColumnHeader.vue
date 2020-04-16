<template>
  <th
    v-if="isVisible"
    :class="headerClass"
    role="columnheader"
    :aria-sort="ariaSort"
    :aria-disabled="ariaDisabled"
    @click="clicked"
  >
    <span class="cell" v-if="!isTypeSelection">
      {{ isTypeIndex ? (label || '#') : label }}
      <span class="sort" v-if="column.sortable">
        <yi-table-icon icon="yi-table-ascend" class="yi-table-sort-icon ascend"></yi-table-icon>
        <yi-table-icon icon="yi-table-descend" class="yi-table-sort-icon descend"></yi-table-icon>
      </span>
    </span>
    <span class="cell" v-else>
      <slot name="selection" />
    </span>
  </th>
</template>

<script>
import { classList } from '../utils'

export default {
  props: {
    column: {
      type: Object,
      required: true
    },
    sort: {
      type: Object,
      required: true
    }
  },
  computed: {
    ariaDisabled () {
      if (!this.column.sortable) {
        return 'true'
      }
      return false
    },
    ariaSort () {
      if (!this.column.sortable) {
        return false
      }
      if (this.column.prop !== this.sort.fieldName) {
        return 'none'
      }
      return this.sort.order === 'asc' ? 'ascending' : 'descending'
    },
    headerClass () {
      if (!this.column.sortable) {
        return classList('yi-table__th', this.column.headerClass)
      }
      if (this.column.prop !== this.sort.fieldName) {
        return classList('yi-table__th yi-table__th--sort', this.column.headerClass)
      }
      return classList(`yi-table__th yi-table__th--sort-${this.sort.order}`, this.column.headerClass)
    },
    isVisible () {
      return !this.column.hidden
    },
    label () {
      return this.column.label
    },
    isTypeIndex () {
      return this.column.type && this.column.type === 'index'
    },
    isTypeSelection () {
      return this.column.type && this.column.type === 'selection'
    }
  },
  methods: {
    clicked () {
      if (this.column.sortable) {
        this.$emit('click', this.column)
      }
    }
  }
}
</script>
