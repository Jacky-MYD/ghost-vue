<template>
    <div class="g-select-dropdown g-popper"
        :style="{ minWidth: minWidth}">
        <slot></slot>
    </div>
</template>
<script>
    import Popper from '../../../src/utils/vue-popper'
    export default {
        name: 'GSelectDropdown',
        componentName: 'GSelectDropdown',
        mixins: [Popper],
        props: {
            placement: {
                default: 'bottom-start'
            },
            boundariesPadding: {
                default: 0
            },

            popperOptions: {
                default() {
                return {
                    gpuAcceleration: false
                };
                }
            },

            visibleArrow: {
                default: true
            },

            appendToBody: {
                type: Boolean,
                default: true
            }
        },
        computed: {
            popperClass() {
                return this.$parent.popperClass;
            }
        },
        data () {
            return {
                minWidth: '',
                referenceElm: null,
            }
        },
        watch: {
            '$parent.inputWidth'() {
                this.minWidth = this.$parent.$el.getBoundingClientRect().width + 'px'
            }
        },
        mounted () {
            this.referenceElm = this.$parent.$refs.reference.$el
            this.$parent.popperElm = this.popperElm = this.$el
            this.$on('updatePopper', () => {
                if (this.$parent.visible) this.updatePopper()
            })
            this.$on('destroyPopper', this.destroyPopper)
        }
    }
</script>
<style scoped></style>