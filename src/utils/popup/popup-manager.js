import Vue from 'vue'
import { addClass, removeClass } from '../dom'

let hasModal = false, hasInitZIndex = false, zIndex
const getModal = function() {
    if (Vue.prototype.$isServer) return 
    let modalDom = PopupManager.modalDom
}

const instance = {}

const PopupManager = {
    modalFade: true,

    getInstance: function(id) {
        return instance[id]
    },

    register: function(id, instance) {
        if (id && instance) {
            instance[id] = instance
        }
    },

    deregister: function(id) {
        if (id) {
            instance[id] = null
            delete instance[id]
        }
    },

    nextZIndex: function() {
        return PopupManager.zIndex++
    },

    modalStack: [],

    doOnModalClick: function() {
        const topItem = PopupManager.modalStack[PopupManager.modalStack.length - 1]
        if (!topItem) return

        const instance = PopupManager.getInstance(topItem.id)
        if (instance && instance.closeOnClickModal) {
            instance.close()
        }
    },

    openModal: function(id, zIndex, dom, modalClass, modalFade) {
        if (Vue.prototype.$isServer) return
        if (!id || zIndex === undefined) return

        this.modalFade = modalFade

        const modalStack = this.modalStack

        for (let i = 0, len = modalStack.length; i < len; i++) {
            const item = modalStack[i]
            if (item.id === id) {
                return
            }
            
        }

        const modalDom = getModal()

        addClass(modalDom, 'v-modal')
        if (this.modalFade && !hasModal) {
            addClass(modalDom, 'v-modal-enter')
        }

        if (modalClass) {
            let classArr = modalClass.trim().split(/\s+/)
            classArr.forEach(item => addClass(modalDom, item))
        }
        setTimeout(() => {
            removeClass(modalDom, 'v-modal-enter')
        }, 200)

        if (dom && dom.parentNode && dom.parentNode.nodeType != 11) {
            dom.parentNode.appendChild(modalDom)
        } else {
            document.body.appendChild(modalDom)
        }

        if (zIndex) modalDom.style.zIndex = zIndex

        modalDom.tabIndex = 0
        modalDom.style.display = ''

        this.modalStack.push({ id, zIndex, modalClass})
    },

    closeModal: function(id) {
        const modalStack = this.modalStack
        const modalDom = getModal()

        if (modalStack.length > 0) {
            const topItem = modalStack[modalStack.length - 1]
            if (topItem.id === id) {
                if (topItem.modalClass) {
                    let classArr = topItem.modalClass.trim().split(/\s+/)
                    classArr.forEach(item => removeClass(modalDom, item))
                }
        
                modalStack.pop()
                if (modalStack.length > 0) {
                    modalDom.style.zIndex = modalStack[modalStack.length - 1].zIndex
                }
            } else {
                for (let i = modalStack.length - 1; i >= 0; i--) {
                    if (modalStack[i].id === id) {
                        modalStack.splice(i, 1)
                        break
                    }
                }
            }
        }

        if (modalStack.length === 0) {
            if (this.modalFade) {
                addClass(modalDom, 'v-modal-leave')
            }
            setTimeout(() => {
                if (modalStack.length === 0) {
                    if (modalDom.parentNode) modalDom.parentNode.removeChild(modalDom)
                    modalDom.style.display = 'none'
                    PopupManager.modalDom = undefined
                }
                removeClass(modalDom, 'v-modal-leave')
            }, 200)
        }
    },

}
Object.defineProperty(PopupManager, 'zIndex', {
    configurable: true,
    get() {
        if (!hasInitZIndex) {
            zIndex = zIndex || (Vue.prototype.$ELEMENT || {}).zIndex || 2000
        }
        return zIndex
    },
    set(value) {
        zIndex = value
    }
})

if (!Vue.prototype.$isServer) {
    window.addEventListener('keydown', function(event) {
        if (event.keyCode === 27) {
            const topPopup = getTopPopup();
        
            if (topPopup && topPopup.closeOnPressEscape) {
                topPopup.handleClose
                ? topPopup.handleClose()
                : (topPopup.handleAction ? topPopup.handleAction('cancel') : topPopup.close());
            }
        }
    })
}
export default PopupManager