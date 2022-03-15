import Vue from 'vue'
import GMessageBox from './message-box.vue'
import merge from '../../../src/utils/merge'

const MessageBoxConstructor = Vue.extend(GMessageBox)
let instance, msgQueue = [], currentMsg

const defaultCallback = (action) => {
    if (currentMsg) {
        let callback = currentMsg.callback
        if (typeof callback === 'function') {
            callback(action)
        }
    }
    if (currentMsg.resolve) {
        if (action === 'confirm') {
            currentMsg.resolve(action)
        } else if (currentMsg.reject && (action === 'cancel' || action === 'close')) {
            currentMsg.reject(action)
        }
    }
}

const initInstance = () => {
    instance = new MessageBoxConstructor({
        el: document.createElement('div')
    })
    instance.callback = defaultCallback
}

const showNextMsg = () => {
    if (!instance) {
        initInstance()
    }
    instance.action = ''

    if (!instance.visible) {
        if (msgQueue.length > 0) {
            currentMsg = msgQueue.shift()
            let options = currentMsg.options
            for (let prop in options) {
                if (options.hasOwnProperty(prop)) {
                    instance[prop] = options[prop]
                }
            }
            if (options.callback === undefined) {
                instance.callback = defaultCallback
            }
            let oldCb = instance.callback
            instance.callback = (action, instance) => {
                oldCb(action, instance)
                // showNextMsg()
            }
        }
        document.body.appendChild(instance.$el);
        Vue.nextTick(() => {
            instance.visible = true;
        })
    }
}

const MessageBox = function(options = {}, callback) { 
    // console.log(callback);
    if (typeof options === 'string') {
        options = {
            message: options,
        }
        if (typeof arguments[1] === 'string') {
            options.title = arguments[1]
        }
    } else if (options.callback && !callback) {
        callback = options.callback
    }

    if (typeof Promise !== 'undefined') {
        return new Promise((resolve, reject) => {
            msgQueue.push({
                options: merge({}, options),
                callback: callback,
                resolve: resolve,
                reject: reject
            })
            showNextMsg()
        })
    } else {

        msgQueue.push({
            options: merge({}, options),
            callback: callback,
        })
        showNextMsg()
    }

 }

 MessageBox.close = () => {
    return 1
 }

 MessageBox.confirm = (message, title, options) => {
    if (typeof title === 'object') {
        options = title
        title = ''
    } else if (title === undefined) {
        title = ''
    }
    return MessageBox(merge({
        title: title,
        message: message,
        $type: 'confirm',
    }, options))
 }

 MessageBox.close = () => {
    instance.doClose();
    instance.visible = false;
    msgQueue = [];
    currentMsg = null;
}

 export default MessageBox
 export { MessageBox }