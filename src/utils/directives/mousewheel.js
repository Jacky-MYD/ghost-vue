import normalizeWheel from 'normalize-wheel'

const isFirefox = typeof navigator !== 'undefined' && navigator.userAgent.toLowerCase().indexOf('firefox') > -1
const mousewheel = (el, cb) => {
    if (el && el.addEventListener) {
        el.addEventListener(isFirefox ? 'DOMMouseScroll' : 'mousewheel', (event) => {
            const normailized = normalizeWheel(event)
            cb && cb.apply(this, [event, normailized])
        })
    }
}

export default {
    bind(el, binding) {
        mousewheel(el, binding.value)
    }
}