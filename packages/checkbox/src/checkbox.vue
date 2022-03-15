<template>
    <label class="g-checkbox" :class="[
        border && checkboxSize ? `g-checkbox--${checkboxSize}` : '', {
        'is-checked': isChecked,
        'is-disabled': isDisabled,
        'is-bordered': border
        }]">
        <span class="g-checkbox__input">
            <span class="g-checkbox__inner"></span>
            <input 
                type="checkbox" 
                class="g-checkbox__original"
                :name="name"
                :disabled="isDisabled"
                v-model="model"
                :value="label"
                @change="handleChange"
            >
        </span>
        <span class="g-checkbox__label">
            <slot></slot>
            <template v-if="!$slots.default">{{ label }}</template>
        </span>
    </label>
</template>

<script>
export default {
    name: 'GCheckbox',
    componentName: 'GCheckbox',
    inject: {
        CheckboxGroup: {
            default: ''
        }
    },
    props: {
        label: String,
        value: Boolean,
        name: String,
        disabled: Boolean,
        border: Boolean,
        size: String
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
        checkboxSize() {
            return this.CheckboxGroup.checkboxGroupSize || this.size;
        },
        isChecked() {
            return this.isGroup ? this.model.includes(this.label) : this.model
        },
        isDisabled() {
            return this.disabled || this.CheckboxGroup.disabled;
        },
    },
    methods: {
        handleChange() {
            this.$emit('change', value, event)
        }
    }
}
</script>
