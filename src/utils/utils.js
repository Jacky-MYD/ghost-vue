export const valueEquals = (a, b) => {
    // see: https://stackoverflow.com/questions/3115982/how-to-check-if-two-arrays-are-equal-with-javascript
    if (a === b) return true
    if (!(a instanceof Array)) return false
    if (!(b instanceof Array)) return false
    if (a.length !== b.length) return false
    for (let i = 0; i !== a.length; ++i) {
      if (a[i] !== b[i]) return false
    }
    return true
}

function extend(to, _from) {
    for (let key in _from) {
        if (object.hasOwnProperty(key)) {
            to[key] = _from[key]
        }
    }
    return to
}

export function toObject(arr) {
    let res = {}
    for (let i = 0, len = arr.length; i < len; i++) {
        if (arr[i]) {
            extend(res, arr[i])
        }
    }
    return res
}

export const getValueByPath = function(obj, path) {
    path = path || ''
    const paths = path.split('.')
    let res = obj
    let prop
    while ((prop = paths.shift())) {
        res = res[prop]
    }
    return res
}

export const getPropByPath = function(obj, path, strict) {
    let tempObj = obj
    path = path.replace(/\[(\w+)\]/g, '.$1')
    path = path.replace(/^\./, '')

    let keyArr = path.split('.')
    let i = 0;
    for (let len = keyArr.length; i < len - 1; ++i) {
        if (!tempObj && !strict) break;
        let key = keyArr[i]
        if (key in tempObj) {
            tempObj = tempObj[key]
        } else {
            if (strict) {
                throw new Error('please transfer a valid prop path to form item!')
            }
            break
        }
    }
    return {
        o: tempObj,
        k: keyArr[i],
        v: tempObj ? tempObj[keyArr[i]] : null
    };
}

export const escapeRegexpString = (value = '') => String(value).replace(/[|\\{}()[\]^$+*?.]/g, '\\$&')

export const arrayFindIndex = (arr, pred) => {
    for (let i = 0; i < arr.length; i++) {
        if (pred(arr[i])) return i        
    }
    return -1
} 

export const arrayFind = (arr, pred) => {
    const idx = arrayFindIndex(arr, pred)
    return idx !== -1 ? arr[idx] : undefined
}

export const generateId = () => {
    return Math.floor(Math.random() * 10000)
}

