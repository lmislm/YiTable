<template>
  <tr @click="$emit('rowClick', row)">
    <cell
      v-for="column in visibleColumns"
      :key="column.id"
      :row="row"
      :index="index"
      :column="column"
    >
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
    index: Number
  },
  computed: {
    visibleColumns () {
      return this.columns.filter((column) => !column.hidden)
    }
  },
  methods: {
    onCheckboxClick () {
      const index = this.row.index
      const row = this.row
      this.$set(row, 'isSelected', !row.isSelected)
      this.$emit('rowSelect', {
        row,
        index,
        selected: !!row.isSelected
      })
    }
  },
  created () {
    this.$set(this.row, 'isSelectable', !this.row.selectable)
  }
}
</script>
