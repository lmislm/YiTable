<template>
  <div v-if="false">
    <slot />
  </div>
</template>

<script>

export default {
  props: {
    prop: {
      type: String
    },
    sortable: {
      type: Boolean,
      default: false
    },
    sortBy: {
      type: String,
      default: null
    },
    dataType: {
      type: String,
      default: 'string',
    },
    cellClass: {
      type: String,
      default: ''
    },
    headerClass: {
      type: String,
      default: ''
    },
    formatter: {
      type: Function,
      default: (v) => v
    },
    label: {
      type: String,
      default: null
    },
    hidden: {
      type: Boolean,
      default: false
    }
  }
}
</script>
