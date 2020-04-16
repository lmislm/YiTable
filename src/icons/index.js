import Vue from 'vue'

import YiTableIcon from '@/components/YiTableIcon'

Vue.component('yi-table-icon', YiTableIcon)

const req = require.context('./svg')
const requireAll = requireContext => requireContext.keys().map(requireContext)

requireAll(req)
