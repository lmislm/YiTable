<template>
  <tr @click="$emit('row-click', row)" :class="[...getRowTrClasses()]">
    <cell v-for="(column, i) in visibleColumns" :key="i" :row="row" :index="index" :column="column">
      <checkbox v-if="column.type === 'selection'"
        @click="onCheckboxClick"
        :checked="row.isSelected"
        :disabled="!row.isSelectable"></checkbox>
    </cell>
  </tr>
</template>

<script>
import cell from './rowCell'
import Checkbox from './Checkbox.vue'
export default {
  components: {
    cell,
    Checkbox
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
    setTrRowClassName () {
      if (!this.rowClassName) return
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
    getRowTrClasses () {
      return [this.index % 2 == 1 ? 'even' : '', this.row.isHighLight ? 'high-light' : '', this.setTrRowClassName()]
    },
    isString (value) {
      const type = typeof value
      return type === 'string'
    }
  }
}
</script>
