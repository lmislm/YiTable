<template>
  <th
    v-if="isVisible"
    :class="headerClass"
    role="columnheader"
    :aria-sort="ariaSort"
    :aria-disabled="ariaDisabled"
    @click="clicked"
  >
    <span class="cell" v-if="!isTypeSelection">{{ isTypeIndex ? (label || '#') : label }}</span>
    <span class="cell" v-else>
      <slot name="selection"/>
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
      if (!this.column.isSortable()) {
        return 'true'
      }
      return false
    },
    ariaSort () {
      if (!this.column.isSortable()) {
        return false
      }
      if (this.column.prop !== this.sort.fieldName) {
        return 'none'
      }
      return this.sort.order === 'asc' ? 'ascending' : 'descending'
    },
    headerClass () {
      if (!this.column.isSortable()) {
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
      if (!this.column.label) {
        return this.column.prop
      }
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
      if (this.column.isSortable()) {
        this.$emit('click', this.column)
      }
    }
  }
}
</script>
