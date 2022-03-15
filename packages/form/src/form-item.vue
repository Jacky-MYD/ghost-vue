<template>
    <div class="g-form-item" :class="gFormItemSize ? `g-form-item--${gFormItemSize}` : ''" >
        <label class="g-form-item__label" 
            :style="{width: this.GForm.labelWidth}">{{ label }}</label>
        <div class="g-form-item__content">
            <slot></slot>
        </div>
    </div>
</template>

<script>
export default {
    name: 'GFormItem',
    componentName: 'GFormItem',
    props: {
        label: {
            type: String,
            default: ''
        },
        size: String
    },
    provide() {
        return {
            GFormItem: this
        }
    },
    inject: {
        GForm: {
            default: ''
        }
    },
    computed: {
        _formSize() {
            return this.GForm.size;
        },
        gFormItemSize() {
            return this.size || this._formSize;
        },
    }
}
</script>
