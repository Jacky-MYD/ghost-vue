<template>
    <div :style="{'width': width}" :class="[
        type === 'textarea' ? 'g-textarea' : 'g-input',
        inputSize ? `g-input--${inputSize}` : '',
        {
            'is-exceed': inputExceed,
            'g-input--suffix': showSuffix,
            'g-input-group': $slots.prepend || $slots.append,
            'g-input-group--append': $slots.append,
            'g-input-group--prepend': $slots.prepend,
            'g-input--prefix': $slots.prefix || prefixIcon,
            'g-input--suffix': $slots.suffix || suffixIcon || clearable || showPassword
        }]">
        <template v-if="type !== 'textarea'">
            <!-- 前置元素 -->
            <div class="g-input-group__prepend" v-if="$slots.prepend">
                <slot name="prepend"></slot>
            </div>
            <!-- 前置内容 -->
            <span class="g-input__prefix" v-if="$slots.prefix || prefixIcon">
                <slot name="prefix"></slot>
                <i class="g-input__icon" v-if="prefixIcon" :class="prefixIcon"></i>
            </span>
            <input 
                ref="input"
                class="g-input__inner"
                :class="{'is-disabled': disabled}"
                :placeholder="placeholder"
                :type="showPassword ? (passwordVisible ? 'text' : 'password') : type"
                :name="name"
                :autocomplete="autocomplete"
                :disabled="disabled"
                :value="value"
                :readonly="readonly"
                v-bind="$attrs"
                @input="handleInput"
                @focus="handleFocus"
                @blur="handleBlur"
                @change="handleChange"
            >
            <!-- 后置内容 -->
            <span class="g-input__suffix" v-if="showSuffix">
                <slot name="suffix"></slot>
                <i class="g-input__icon" v-if="suffixIcon" :class="suffixIcon"></i>
                <i class="g-input__icon g-icon-circle-close" v-if="clearable" @click="clear"></i>
                <i class="g-input__icon" :class="[passwordVisible ? 'g-icon-view' : 'g-icon-invisible']" v-if="showPassword" @click="handlePassword"></i>
            </span>
            <!-- 后置元素 -->
            <div class="g-input-group__append" v-if="$slots.append">
                <slot name="append"></slot>
            </div>
        </template>
        <template v-else>
            <textarea 
                ref="textarea"
                class="g-textarea__inner"
                :name="name"
                :autocomplete="autocomplete"
                :placeholder="placeholder"
                :disabled="disabled"
                :readonly="readonly"
                :style="textareaStyle"
                v-bind="$attrs"
                @compositionstart="handleCompositionStart"
                @compositionupdate="handleCompositionUpdate"
                @compositionend="handleCompositionEnd"
                @input="handleInput"
                @focus="handleFocus"
                @blur="handleBlur"
                @change="handleChange"
            ></textarea>
            <span class="g-input__count" v-if="isWordLimitVisible && type === 'textarea'" >{{textLength}}/{{upperLimit}}</span>
        </template>
    </div>
</template>

<script>
import Emitter from '../../../src/mixins/emitter'
import calcTextareaHeight from './calcTextareaHeight'
import merge from '../../../src/utils/merge'
import {isKorean} from '../../../src/utils/shared';
export default {
    name: 'GInput',
    componentName: 'GInput',
    mixins: [Emitter],
    inheritAttrs: false,
    inject: {
        GForm: {
            default: ''
        },
        GFormItem: {
            default: ''
        },
        GSelect: {
            default: ''
        }
    },
    props: {
        placeholder: {
            type: String,
            default: ''
        },
        type: {
            type: String,
            default: 'text'
        },
        autocomplete: {
            type: String,
            default: 'off'
        },
        autosize: {
            type: [Boolean, Object],
            default: false
        },
        validateEvent: {
            type: Boolean,
            default: true
        },
        name: String,
        disabled: Boolean,
        value: [String, Number, Array],
        clearable: Boolean,
        showPassword: Boolean,
        prefixIcon: String,
        suffixIcon: String,
        readonly: Boolean,
        size: String,
        width: String,
        resize: String,
        showWordLimit: Boolean,

    },
    data() {
        return {
            passwordVisible: false,
            textareaCalcStyle: {},
            isComposing: false,
            focused: false,
        }
    },
    computed: {
        showSuffix() {
            return this.clearable || this.showPassword || this.suffixIcon || this.$slots.suffix
        },
        inputSize() {
            return this.size || this.GFormItem.size ||  this.GForm.size || this.GSelect.size
        },
        isWordLimitVisible() {
            return this.showWordLimit &&
          this.$attrs.maxlength &&
          (this.type === 'text' || this.type === 'textarea') &&
          !this.disabled &&
          !this.readonly &&
          !this.showPassword
        },
        textLength() {
            if (typeof this.value === 'number') {
                return String(this.value).length
            }
            return (this.value || '').length
        },
        inputExceed() {
            return this.isWordLimitVisible &&
            (this.textLength > this.upperLimit)
        },
        upperLimit() {
            return this.$attrs.maxlength
        },
        nativeInputValue() {
            return this.value === null || this.value === undefined ? '' : String(this.value);
        },
        textareaStyle() {
            return merge({}, this.textareaCalcStyle, { resize: this.resize });
        },
    },
    methods: {
        focus() {
            this.getInput().focus();
        },
        blur() {
            this.getInput().blur();
        },
        updateIconOffset() {
            this.calcIconOffset('prefix');
            this.calcIconOffset('suffix');
        },
        clear() {
            this.$emit('input', '');
            this.$emit('change', '');
            this.$emit('clear');
        },
        handlePassword() {
            this.passwordVisible = !this.passwordVisible
        },
        calcIconOffset(place) {
            let elList = [].slice.call(this.$el.querySelectorAll(`.g-input__${place}`) || []);
            if (!elList.length) return;
            let el = null;
            for (let i = 0; i < elList.length; i++) {
                if (elList[i].parentNode === this.$el) {
                    el = elList[i];
                    break;
                }
            }
            if (!el) return;
                const pendantMap = {
                suffix: 'append',
                prefix: 'prepend'
            };

            const pendant = pendantMap[place];
            if (this.$slots[pendant]) {
                el.style.transform = `translateX(${place === 'suffix' ? '-' : ''}${this.$el.querySelector(`.g-input-group__${pendant}`).offsetWidth}px)`;
            } else {
                el.removeAttribute('style');
            }
        },
        resizeTextarea() {
            if (this.$isServer) return
            const { autosize, type } = this
            if (type !== 'textarea') return
                if (!autosize) {
                this.textareaCalcStyle = {
                    minHeight: calcTextareaHeight(this.$refs.textarea).minHeight
                }
                return
            }
            const minRows = autosize.minRows
            const maxRows = autosize.maxRows

            this.textareaCalcStyle = calcTextareaHeight(this.$refs.textarea, minRows, maxRows)
        },
        
        getInput() {
            return this.$refs.input || this.$refs.textarea
        },
        setNativeInputValue() {
            const input = this.getInput()
            if (!input) return
            if (input.value === this.nativeInputValue) return
            
            input.value = this.nativeInputValue
        },
        handleInput(event) {
            if (this.isComposing) return;
            if (event.target.value === this.nativeInputValue) return;

            this.$emit('input', event.target.value);
            this.$nextTick(this.setNativeInputValue);
        },
        handleChange(event) {
            this.$emit('change', event.target.value);
        },
        handleFocus(event) {
            this.focused = true;
            this.$emit('focus', event);
        },
        handleBlur(event) {
            this.focused = false;
            this.$emit('blur', event);
            if (this.validateEvent) {
                this.dispatch('GFormItem', 'g.form.blur', [this.value]);
            }
        },
        handleCompositionStart() {
            this.isComposing = true;
        },
        handleCompositionUpdate(event) {
            const text = event.target.value;
            const lastCharacter = text[text.length - 1] || '';
            this.isComposing = !isKorean(lastCharacter);
        },
        handleCompositionEnd(event) {
            if (this.isComposing) {
            this.isComposing = false;
            this.handleInput(event);
            }
        },
    },
    mounted() {
        this.setNativeInputValue()
        this.resizeTextarea()
        this.updateIconOffset()
    },
    updated() {
      this.$nextTick(this.updateIconOffset)
    },
    watch: {
        value(val) {
            this.$nextTick(this.resizeTextarea)
            if (this.validateEvent) {
                this.dispatch('GFormItem', 'g.form.change', [val])
            }
        },
        nativeInputValue() {
            this.setNativeInputValue();
        },
        type() {
            this.$nextTick(() => {
                this.setNativeInputValue();
                this.resizeTextarea();
                this.updateIconOffset();
            });
        }
    }
}
</script>
