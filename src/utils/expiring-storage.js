const expiringStorage = {
  get(key) {
    const cached = JSON.parse(localStorage.getItem(key))
    if (!cached) {
      return null
    }
    // 设置了过期时间
    if (cached.expires) {
      const expires = new Date(cached.expires)
      if (expires < new Date()) {
        localStorage.removeItem(key)
        return null
      }
      return cached.value
    }
    return cached
  },
  has(key) {
    return this.get(key) !== null
  },
  set(key, value, lifeTimeInMinutes) {
    // 如果有lifeTimeInMinutes则按时间来，没有的话。就保存为永久
    if (lifeTimeInMinutes) {
      const currentTime = new Date().getTime()
      const secondsInMinute = 60
      const milisecondsInSecond = 1000
      const expires = new Date(currentTime + (lifeTimeInMinutes * secondsInMinute * milisecondsInSecond))
      localStorage.setItem(key, JSON.stringify({ value, expires }))
    } else {
      localStorage.setItem(key, JSON.stringify(value))
    }
  }
}
export default expiringStorage
