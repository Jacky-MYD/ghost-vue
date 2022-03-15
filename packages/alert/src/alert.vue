<template>
    <transition name="g-alert-fade">
        <div class="g-alert"
            :class="[
                `g-alert--${type}`,
                `g-alert--${align}`,
                alignClass,
                boldAlignClass
            ]"
            v-show="visible">
            <div class="g-alert__icon g-alert__prefixIcon" v-if="showIcon">
                <i :class="[iconClass, isBigIcon]"></i>
            </div>
            <div class="g-alert__content">
                <span class="g-alert__title" :class="[isBoldTitle]" v-if="title || $slots.title">
                    <slot name="title">{{ title }}</slot>
                </span>
                <p class="g-alert__description" v-if="!description && $slots.default"><slot></slot></p>
                <p class="g-alert__description" v-if="description && !$slots.default"><slot>{{ description }}</slot></p>
            </div>
            <div class="g-alert__icon g-alert__suffixIcon" v-if="showClose" @click.stop="close">
                <span v-if="closeText">{{ closeText }}</span>
                <i class="g-icon-close"></i>
            </div>
        </div>
    </transition>
</template>
<script>
    const TYPE_CLASSES_MAP = {
        'success': 'g-icon-success',
        'info': 'g-icon-info',
        'warning': 'g-icon-warning',
        'error': 'g-icon-error'
    }
    export default {
        name: 'GAlert',
        componentName: 'GAlert',
        props: {
            title: String,
            description: String,
            size: String,
            showIcon: Boolean,
            showClose: Boolean,
            closeText: String, 
            align: {
                type: String,
                default: 'left'
            },
            type: {
                type: String,
                default: 'info'
            }
        },
        computed: {
            iconClass() {
                return TYPE_CLASSES_MAP[this.type]
            },
            alignClass() {
                return this.align === 'right' && this.showClose ? 'is-showright' : ''
            },
            isBigIcon() {
                return this.description || this.$slots.default ? 'is-big' : ''
            },
            isBoldTitle() {
                return this.description || this.$slots.default ? 'is-bold' : ''
            },
            boldAlignClass() {
                return this.description || this.$slots.default ? 'is-flexStart' : ''
            }
        },
        data () {
            return {
                visible: true
            }
        },
        methods: {
            close() {
                this.visible = false
                this.$emit('close')
            }
        }
    }
</script>