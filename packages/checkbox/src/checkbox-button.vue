<template>
    <label class="g-checkbox-button" :class="[
        buttonSize ? `g-checkbox-button--${buttonSize}` : '', {
        'is-checked': isChecked,
        'is-disabled': isDisabled,
        }]">
        <span class="g-checkbox-button__input">
            <span class="g-checkbox-button__inner"></span>
            <input 
                type="checkbox" 
                class="g-checkbox-button__original"
                :name="name"
                :disabled="isDisabled"
                v-model="model"
                :value="label"
            >
        </span>
        <span class="g-checkbox-button__label">
            <slot></slot>
            <template v-if="!$slots.default">{{ label }}</template>
        </span>
    </label>
</template>

<script>
export default {
    name: 'GCheckboxButton',
    componentName: 'GCheckboxButton',
    inject: {
        CheckboxGroup: {
            default: ''
        }
    },
    props: {
        label: String,
        value: Boolean,
        name: String,
        disabled: Boolean
    },
    computed: {
        model: {
            get() {
                return this.isGroup ? this.CheckboxGroup.value : this.value
            },
            set(value) {
                this.isGroup ? this.CheckboxGroup.$emit('input', value) : this.$emit('input', value)
            }
        },
        isGroup() {
            return !!this.CheckboxGroup
        },
        buttonSize() {
            return this.CheckboxGroup.checkboxGroupSize || this.size;
        },
        isChecked() {
            return this.isGroup ? this.model.includes(this.label) : this.model
        },
        isDisabled() {
            console.log(this.CheckboxGroup.disabled);
            return this.disabled || this.CheckboxGroup.disabled;
        },
    },
    methods: {

    }
}
</script>
