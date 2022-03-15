<template>
    <div class="g-checkbox-group">
        <slot></slot>
    </div>
</template>

<script>
export default {
    name: 'GCheckboxGroup',
    componentName: 'GCheckboxGroup',
    props: {
        value: Array,
        disabled: Boolean,
        size: String
    },
    provide() {
        return {
            CheckboxGroup: this
        }
    },
    computed: {
        checkboxGroupSize() {
            return this.size
        }
    }
}
</script>
