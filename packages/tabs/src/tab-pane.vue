<template>
    <div 
        class="g-tab-pane" 
        :class="[{
            'is-active': active
        }]"
        v-if="active"
        @click.stop="handleClick">
        <slot v-if="$slots.default"></slot>
        <slot v-if="label && !$slots.default">{{ label }}</slot>
        <!-- <slot></slot> -->
    </div>
</template>
<script>
    import Emitter from '../../../src/mixins/emitter'
    export default {
        name: 'GTabPane',
        componentName: 'GTabPane',
        mixins: [Emitter],
        inject: {
            GTabs: {
                default: ''
            }
        },
        props: {
            label: String,
            name: String,
            disabled: Boolean
        },
        computed: {
            active() {
                console.log(this.$parent.currentName === this.name);
                return this.$parent.currentName === this.name
            }
        },
        methods: {
            handleClick(event) {
                if (this.disabled) return
                this.dispatch('GTabs', 'item-click', this)
            }
        },
        mounted () {
            this.$parent.paneNode.push(this)
        }
    }
</script>