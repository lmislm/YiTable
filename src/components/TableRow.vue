<template>
  <tr @click="$emit('rowClick', row)">
    <td v-if="selectable"><input type="checkbox" @click.stop="onCheckboxClick" :checked="row.isSelected"></td>
    <cell v-for="column in visibleColumns" :key="column.id" :row="row" :column="column" :selectable="selectable" />
  </tr>
</template>

<script>
import cell from './cell'

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
    selectable: {
      type: Boolean,
      default: false
    }
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
  }
}
</script>
