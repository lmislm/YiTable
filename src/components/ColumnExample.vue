<template>
  <td v-if="row">{{ row.b }}</td>
</template>

<script>
import ColumnMixin from './column-mixin'

export default {
  mixins: [ColumnMixin],
  data () {
    return {
      show: 'b'
    }
  }
}
</script>
