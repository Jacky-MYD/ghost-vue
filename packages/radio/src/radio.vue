<template>
    <label class="g-radio" :class="[label === model ? 'is-checked' : '', 
        border && radioSize ? `g-radio--${radioSize}` : '', {
        'is-disabled': disabled,
        'is-bordered': border
        }]">
        <span class="g-radio__input">
            <span class="g-radio__inner"></span>
            <input 
                type="radio" 
                class="g-radio__original"
                :value="label"
                :name="name"
                :disabled="disabled"
                v-model="model"
                @change="handleChange"
            >
        </span>
        <span class="g-radio__label">
            <slot></slot>
            <template v-if="!$slots.default">{{ label }}</template>
        </span>

    </label>
</template>

<script>
export default {
    name: 'GRadio',
    componentName: 'GRadio',
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
        border: Boolean,
        disabled: Boolean,
        size: String
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
        radioSize() {
            return this.RadioGroup.radioGroupSize || this.size;
        },
        isGroup() {
            return !!this.RadioGroup
        }
    },
    methods: {
        handleChange(e) {
            this.$emit('change', this.value)
        }
    }
}
</script>
