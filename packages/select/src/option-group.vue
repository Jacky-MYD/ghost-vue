<template>
    <ul class="g-select-group__wrap">
        <li class="g-select-group__title">{{ label }}</li>
        <li>
            <ul class="g-select-group">
                <slot></slot>
            </ul>
        </li>
    </ul>
</template>
<script>
    import Emitter from '../../../src/mixins/emitter'
    export default {
        name: 'GOptionGroup',
        componentName: 'GOptionGroup',
        mixins: [Emitter],
        props: {
            label: String,
            disabled: Boolean
        },
        data() {
            return {
                visible: false
            }
        },
        watch: {
            disabled(val) {
                this.broadcast('GOption', 'handleGroupDisabled', val)
            }
        },
        methods: {
            queryChange() {
                this.visible = this.$children && Array.isArray(this.$children) 
                    && this.$children.some(option => option.visible === true)
            }
        },
        created () {
            this.$on('queryChange', this.queryChange)
        },
        mounted () {
            if (this.disabled) {
                this.broadcast('GOption', 'handleGroupDisabled', this.disabled)
            }
        }
    }
</script>