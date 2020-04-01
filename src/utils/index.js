export function classList(...classes) {
  return classes
    .map(c => (Array.isArray(c) ? c : [c]))
    .reduce((items, c) => items.concat(c), [])
}

export function get(object, path) {
  if (!path) {
    return object
  }

  if (object === null || typeof object !== 'object') {
    return object
  }

  const [pathHead, pathTail] = path.split(/\.(.+)/)

  return get(object[pathHead], pathTail)
}

export function pick(object, properties) {
  return properties.reduce((pickedObject, property) => {
    pickedObject[property] = object[property]
    return pickedObject
  }, {})
}

export function range(from, to) {
  return [...Array(to - from)].map((_, i) => i + from)
}

export function toggleRowStatus(statusArr, row, newVal) {
  let changed = false
  const index = statusArr.indexOf(row)
  const included = index !== -1

  const addRow = () => {
    statusArr.push(row)
    changed = true
  }
  const removeRow = () => {
    statusArr.splice(index, 1)
    changed = true
  }
  if (typeof newVal === 'boolean') {
    if (newVal && !included) {
      addRow()
    } else if (!newVal && included) {
      removeRow()
    }
  } else {
    if (included) {
      removeRow()
    } else {
      addRow()
    }
  }
  return changed
}
