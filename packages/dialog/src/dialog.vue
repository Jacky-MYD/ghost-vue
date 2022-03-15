<template>
    <transition name="g-dialog-fade">
        <div class="g-dialog__wrapper" v-show="visible" @click.self="handleClose">
            <div class="g-dialog" :style="{width: width, marginTop: top}">
                <div class="g-dialog__header">
                    <slot name="title">
                        <span class="g-dialog__title">{{ title }}</span>
                    </slot>
                    
                    <button class="g-dialog__headerbtn" @click="handleClose">
                        <i class="g-icon-close"></i>
                    </button>
                </div>
                <div class="g-dialog__body">
                    <slot></slot>
                </div>
                <div class="g-dialog__footer" v-if="$slots.footer">
                    <slot name="footer"></slot>
                </div>
            </div>
        </div>
    </transition>
    
</template>
<script>
    export default {
        name: 'GDialog',
        componentName: 'GDialog',
        props: {
            title: {
                type: String,
                default: '提示'
            },
            width: {
                type: String,
                default: '50%'
            },
            top: {
                type: String,
                default: '15vh'
            },
            visible: Boolean,
        },
        methods: {
            handleClose() {
                this.$emit('update:visible', false)
            }
        }
    }
</script>
