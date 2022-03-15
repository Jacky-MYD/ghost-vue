<template>
    <button class="g-button" :style="[thremStyle(), customButton]"  :disabled="disabled" :class="[`g-button--${type}`, 
        buttonSize ? `g-button--${size}` : '', {
        'is-plain': plain,
        'is-round': round,
        'is-circle': circle,
        'is-disabled': disabled
    }]" @click="handleClick">
        <i v-if="icon" :class="icon"></i>
        <span v-if="$slots.default"><slot></slot></span>
    </button>
</template>

<script>
export default {
    name: 'GButton',
    componentName: 'GButton',
    props: {
        type: {
            type: String,
            default: 'default'
        },
        plain: Boolean,
        round: Boolean,
        circle: Boolean,
        icon: String,
        disabled: Boolean,
        size: String,
        custom: Object
    },
    computed: {
        buttonSize() {
            return this.size;
        },
        customButton() {
            return this.custom
        }
    },
    methods: {
        handleClick(e) {
            this.$emit('click', e)
        },
        thremStyle() {
            if (this.$primary) {
                return {'color': this.$primary} 
            }
        }
    },
}
</script>
