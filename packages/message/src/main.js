import Vue from 'vue'
import GMessage from './message.vue'
import { PopupManager } from '../../../src/utils/popup'

const MessageConstructor = Vue.extend(GMessage)

let instance, instances = [], seed = 1
const Message = function(options = {}) {  
    if (typeof options === 'string') {
        options = {
            message: options,
        }
    }

    let userOnClose = options.onClose
    let id = 'message_' + seed++

    options.onClose = function() {
        Message.close(id, userOnClose);
    }
    instance = new MessageConstructor({
        data: options
    })

    instance.id = id
    
    instance.$mount()
    document.body.appendChild(instance.$el)
    let verticalOffset = options.offset || 20;
    instances.forEach(item => {
        verticalOffset += item.$el.offsetHeight + 16
    })
    instance.verticalOffset = verticalOffset
    instance.visible = true
    instance.$el.style.zIndex = PopupManager.nextZIndex()
    instances.push(instance)
    return instance
}

Message.close = function(id, userOnClose) {
    let len = instances.length
    let index = -1
    let removedHeight
    for (let i = 0; i < len; i++) {
        if (id === instances[i].id) {
            removedHeight = instances[i].$el.offsetHeight
            index = i
            if (typeof userOnClose === 'function') {
                userOnClose(instances[i])
            }
            instances.splice(i, 1)
            break
        }
    }
    if (len <= 1 || index === -1 || index > instances.length - 1) return
    for (let i = index; i < len - 1 ; i++) {
        let dom = instances[i].$el
        dom.style['top'] =
            parseInt(dom.style['top'], 10) - removedHeight - 16 + 'px'
    }
}

export default Message