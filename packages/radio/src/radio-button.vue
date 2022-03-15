<template>
    <label class="g-radio-button" :class="[label === model ? 'is-checked' : '',
        buttonSize ? `g-radio-button--${buttonSize}` : '', 
        {
            'is-disabled': isDisabled
        }]">
        <input 
            type="radio" 
            class="g-radio-button__original"
            :value="label"
            :name="name"
            :disabled="isDisabled"
            v-model="model"
            @change="handleChange"
        >
        <span class="g-radio-button__label">
            <slot></slot>
            <template v-if="!$slots.default">{{ label }}</template>
        </span>
    </label>
</template>

<script>
export default {
    name: 'GRadioButton',
    componentName: 'GRadioButton',
    inject: {
        RadioGroup: {
            default: ''
        }
    },
    props: {
        label: {
            type: [String, Number, Boolean],
            default: ''
        },
        value: null,
        name: String,
        size: String,
        disabled: Boolean,
    },
    computed: {
        model: {
            get() {
                return this.isGroup ? this.RadioGroup.value : this.value
            },
            set(value) {
                this.isGroup ? this.RadioGroup.$emit('input', value) : this.$emit('input', value)
            }
        },
        buttonSize() {
            return this.RadioGroup.radioGroupSize || this.size;
        },
        isDisabled() {
            return this.disabled || this.RadioGroup.disabled;
        },
        isGroup() {
            return !!this.RadioGroup
        }
    },
    methods: {
        handleChange() {
            this.$emit('change', this.value)
        }
    }
}
</script>
