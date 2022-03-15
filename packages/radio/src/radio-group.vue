<template>
    <div class="g-radio-group">
        <slot></slot>
    </div>
</template>

<script>
export default {
    name: 'GRadioGroup',
    componentName: 'GRadioGroup',
    provide() {
        return {
            RadioGroup: this
        }
    },
    props: {
        value: null,
        size: String,
        disabled: Boolean
    },
    computed: {
        radioGroupSize() {
            return this.size
        }
    }
}
</script>
