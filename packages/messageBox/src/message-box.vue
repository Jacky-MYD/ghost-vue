<template>
    <transition name="g-msgbox-fade">
        <div 
            class="g-message-box-mask"
            v-show="visible"
            @click.stop="handleAction('close')">
            <div class="g-message-box-dialog">
                <div class="g-message-box-dialog-header">
                    <span>{{ title }}</span>
                    <i class="g-icon-close" @click.stop="handleAction('close')" v-if="showClose"></i>
                </div>
                <div class="g-message-box-dialog-content">
                    <i :class="['header-icon', iconClass]" :style="iconStyles" v-if="iconClass"></i> {{ message }}
                </div>
                <div class="g-message-box-dialog-footer">
                    <g-button class="msg-btn" size="small" v-if="cancelText" @click.stop="handleAction('cancel')">{{ cancelText }}</g-button>
                    <g-button class="msg-btn" size="small" type="primary" v-if="confirmText" @click.stop="handleAction('confirm')">{{ confirmText }}</g-button>
                </div>
            </div>
        </div>
    </transition>
</template>
<script>
    import GButton from '../../button/index'
    export default {
        name: 'GMessageBox',
        componentName: 'GMessageBox',
        components: {
            GButton
        },
        data () {
            return {
                uid: 1,
                visible: false,
                icon: '',
                iconStyle: null,
                title: '',
                message: '',
                type: 'info',
                cancelText: '',
                confirmText: '',
                showClose: false,
                action: '',
                onClose: null,
                onConfirm: null,
                beforeClose: null
            }
        },
        // props: {
            
        // },
        computed: {
            iconClass() {
                return this.icon
            },
            iconStyles() {
                return this.iconStyle
            }
        },
        methods: {
            getSafeClose() {
                const currentId = this.uid;
                return () => {
                    this.$nextTick(() => {
                        if (currentId === this.uid) this.doClose();
                    })
                }
            },
            handleAction(action) {
                this.action = action
                if (typeof this.beforeClose === 'function') {
                    this.beforeClose(action, this, this.doClose)
                } else {
                    this.doClose()
                }
            },
            doClose() {
                if (!this.visible) return
                this.visible = false
                setTimeout(() => {
                    if (this.action) this.callback(this.action, this)
                })
            },
            cancel() {
                this.visible = false
                if (typeof this.onClose === 'function') {
                    this.onClose(this)
                }
            },
            confirm() {
                this.visible = false
                if (typeof this.onConfirm === 'function') {
                    this.onConfirm(this);
                }
            }
        },
        watch: {
            visible(val) {
                this.uid++
            }
        }
    }
</script>