const req = require.context('./svg')
const requireAll = requireContext => requireContext.keys().map(requireContext)

requireAll(req)
