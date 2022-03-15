import Vue from 'vue'
import { addClass, removeClass } from '../../../src/utils/dom'
import Loading from './loading.vue'

const Mask = Vue.extend(Loading)
const GLoading = () => {
    const toggleLoading = (el, binding) => {
        let parent = binding.modifiers.body ? document.body : el
        if (binding.value) {
            Vue.nextTick(() => {
                addClass(parent, 'g-loading-parent--relative')
                if (binding.modifiers.lock) addClass(parent, 'g-loading-parent--overflow')
                parent.appendChild(el.mask)
                el.instance.visible = true
            })
        } else {
            el.instance.visible = false
            removeClass(parent, 'g-loading-parent--relative')
            removeClass(parent, 'g-loading-parent--overflow')
        }
    }
    Vue.directive('loading', {
        bind: function(el, binding, vnode) {
            el.style.position = 'relative'
            const text = el.getAttribute('g-loading-text') || ''
            const customIcon = el.getAttribute('g-loading-customIcon') || ''
            const background = el.getAttribute('g-loading-background') || ''
            const className = el.getAttribute('g-loading-className') || ''
            const staticIcon = new Boolean(el.getAttribute('staticIcon'))
            const vm = vnode.context
            
            const propsData = {
                text: text,
                customIcon: customIcon,
                background: background,
                className: className,
                staticIcon: staticIcon || false,
                body: binding.modifiers.body || false,
                lock: binding.modifiers.lock,
                visible: binding.value || false
            }
            const mask = new Mask({
                propsData 
            }).$mount()

            el.instance = mask
            el.mask = mask.$el

            binding.value && toggleLoading(el, binding)
        },
        update: function(el, binding) {
            if (binding.value !== binding.oldValue) {
                toggleLoading(el, binding)
            }
        },
        unbind: function(el, binding) {
            
        }
    })
}

export default GLoading