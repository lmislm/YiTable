<template>
  <tr @click="$emit('row-click', row)" :class="trRowClassName()">
    <cell v-for="(column, i) in visibleColumns" :key="i" :row="row" :index="index" :column="column">
      <input
        v-if="column.type === 'selection'"
        type="checkbox"
        @click.stop="onCheckboxClick"
        :checked="row.isSelected"
        :disabled="!row.isSelectable"
      />
    </cell>
  </tr>
</template>

<script>
import cell from './rowCell'

export default {
  components: {
    cell
  },
  props: {
    columns: {
      type: Array,
      required: true
    },
    row: {
      type: Object,
      required: true
    },
    index: Number,
    rowClassName: [String, Function]
  },
  computed: {
    visibleColumns () {
      return this.columns.filter((column) => !column.hidden)
    },
    rowData () {
      return this.row.data
    },
    rowIndex () {
      return this.row.index
    }
  },
  methods: {
    trRowClassName () {
      if (this.isString(this.rowClassName)) {
        return this.rowClassName
      }
      return this.rowClassName({ row: this.rowData, index: this.rowIndex })
    },
    onCheckboxClick () {
      const row = this.row
      this.$set(this.row, 'isSelected', !row.isSelected)
      this.$emit('rowSelect', {
        row: this.rowData,
        index: this.rowIndex,
        selected: !!row.isSelected
      })
    },
    isString (value) {
      const type = typeof value
      return type === 'string'
    }
  }
}
</script>
