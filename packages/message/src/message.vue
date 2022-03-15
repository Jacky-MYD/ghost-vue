<template>
    <transition name="g-msg-fade" @after-leave="handleAfterLeave">
        <div class="g-message"
            :class="[
                `g-message--${type}`,
                `g-message--${align}`,
                customClass
            ]"
            :style="positionStyle"
            v-show="visible"
            @mouseenter="clearTimer"
            @mouseleave="startTimer">
            <div class="g-message__prefixIcon">
                <i :class="iconClass" v-if="iconClass"></i>
                <i :class="typeClass" v-else></i>
            </div>
            <slot>
                <p v-if="!dangerouslyUseHTMLString" class="g-message__content">{{ message }}</p>
                <p v-else v-html="message" class="g-message__content"></p>
            </slot>
            <div class="g-message__suffixIcon" v-if="showClose" @click.stop="close">
                <span v-if="closeText">{{ closeText }}</span>
                <i class="g-icon-close"></i>
            </div>
        </div>
    </transition>
</template>
<script>
    export default {
        name: 'GMessage',
        componentName: 'GMessage',
        data () {
            return {
                visible: false,
                message: '',
                type: 'info',
                duration: 3000,
                showClose: false,
                closeText: '',
                align: 'left',
                iconClass: '',
                verticalOffset: 20,
                timer: null,
                onClose: null,
                dangerouslyUseHTMLString: false,
                customClass: ''
            }
        },
        computed: {
            typeClass() {
                return this.type && !this.iconClass 
                    ? `g-icon-${this.type}`
                    : ''
            },
            positionStyle() {
                return {
                    'top': `${this.verticalOffset}px`
                }
            }
        },
        methods: {
            handleAfterLeave() {
                this.$destroy(true);
                this.$el.parentNode.removeChild(this.$el);
            },

            close() {
                this.visible = false
                if (typeof this.onClose === 'function') {
                    this.onClose(this);
                }
            },

            startTimer() {
                if (this.duration > 0) {
                    this.timer = setTimeout(() => {
                        this.close()
                    }, this.duration)
                }
            },

            clearTimer() {
                clearTimeout(this.timer);
            },
        },
        mounted () {
            this.startTimer()
        },
        beforeDestroy () {
            this.clearTimer()
        }
    }
</script>