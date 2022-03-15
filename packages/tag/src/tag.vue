<template>
    <span class="g-tag" :style="customTag" :class="[`g-tag--${type}`, 
        tagSize ? `g-tag--${tagSize}` : '', {
            'is-closable': closable,
            'is-noborder': noborder
        }]">
        <span v-if="$slots.default"><slot></slot></span>
        <i v-if="closable" class="g-icon-close" @click="handleClose"></i>
    </span>
</template>
<script>
export default {
    name: 'GTag',
    componentName: 'GTag',
    props: {
        type: {
            type: String,
            default: 'default'
        },
        size: String,
        closable: Boolean,
        noborder: Boolean,
        custom: Object
    },
    computed: {
        tagSize() {
            return this.size;
        },
        customTag() {
            return this.custom
        }
    },
    methods: {
        handleClose(event) {
            event.stopPropagation();
            this.$emit('close', event)
        }
    }
}
</script>

