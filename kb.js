!(() => {
  window.kbLastKey = null
  window.kb = (initObj) => {
    const kbObj = {}

    const reorderKeys = (keys) => {
      const keyOrder = ['ctrl', 'shift', 'alt']
      const newKeys = []
      keyOrder.forEach((key) => keys.includes(key) && newKeys.push(key))
      keys.forEach((key) => !newKeys.includes(key) && newKeys.push(key))
      return newKeys
    }

    const parseKey = (key) => {
      const keys = key.split('+')
      if (keys.length > 4) throw new Error(`kb.js: key "${key}" has more than 4 keys`)
      const newKeys = reorderKeys(keys)
      const newKey = newKeys.join('+')
      return newKey
    }

    Object.keys(initObj).forEach((key) => {
      if (typeof initObj[key] != 'function') throw new Error(`kb.js: value of key "${k}" must be a function`)
      const fun = initObj[key]
      const k = parseKey(key.trim().toLowerCase())
      kbObj[k] = fun
    })

    window.addEventListener('keydown', (e) => {
      if ([...document.querySelectorAll('input, textarea')].some((e) => e === document.activeElement)) return
      // create the key string
      const keys = []
      if (e.ctrlKey) keys.push('ctrl')
      if (e.shiftKey) keys.push('shift')
      if (e.altKey) keys.push('alt')
      keys.push(e.key)
      const key = keys.join('+').toLowerCase()

      if (kbObj[key]) {
        e.preventDefault()
        kbObj[key]()
      } else if (kbLastKey && kbObj[kbLastKey + ' ' + key]) {
        e.preventDefault()
        kbObj[kbLastKey + ' ' + key]()
      }

      window.kbLastKey = key
    })
  }
})()
