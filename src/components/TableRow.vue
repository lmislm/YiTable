<template>
  <tr @click="$emit('rowClick', row)">
    <cell v-for="column in visibleColumns" :key="column.id" :row="row" :column="column" />
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
    }
  },
  computed: {
    visibleColumns () {
      return this.columns.filter((column) => !column.hidden)
    }
  }
}
</script>
