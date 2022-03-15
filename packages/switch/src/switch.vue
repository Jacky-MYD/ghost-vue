<template>
    <div class="g-switch" :class="{'is-checked': value}" @click="handleClick">
        <span class="g-switch__label g-switch__label--left" :class="{'is-active': !value}" v-if="inactiveText">{{inactiveText}}</span>
        <span class="g-switch__core" ref="core">
            <span class="g-switch__button"></span>
        </span>
        <span class="g-switch__label g-switch__label--right" :class="{'is-active': value}" v-if="activeText">{{activeText}}</span>
        <input class="g-switch__input" ref="input" type="checkbox" @change="handlechange" :name="name">
    </div>
</template>

<script>
export default {
    name: 'GSwitch',
    componentName: 'GSwitch',
    data() {
        return {

        }
    },
    props: {
        value: Boolean,
        activeColor: String,
        inactiveColor: String,
        name: String,
        activeText: String,
        inactiveText: String
    },
    methods: {
        async handleClick() {
            this.$emit('input', !this.value)
            this.handlechange()
            await this.$nextTick()
            this.setColor()
            this.$refs.input.checkbox = this.value
        },
        handlechange() {
            this.$emit('change', !this.value)
        },
        setColor() {
            if (this.activeColor || this.inactiveColor) {
                let color = this.value ? this.activeColor : this.inactiveColor
                this.$refs.core.style.borderColor = color
                this.$refs.core.style.backgroundColor = color
            }
        }
    },
    mounted() {
        this.setColor()
        this.$refs.input.checkbox = this.value
    }
}
</script>
