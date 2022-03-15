<template>
    <li class="g-menu-item"
        :class="[{
            'is-active': active,
            'is-disabled': disabled,
            'is-backgroundColor': backgroundColor
        }]"
        :style="[itemStyle]"
        @click.stop="handleClick"
        @mouseenter="onMouseEnter"
        @focus="onMouseEnter"
        @blur="onMouseLeave"
        @mouseleave="onMouseLeave"
        >
        
        <g-tooltip 
            v-if="parentMenu.$options.componentName === 'GMenu' && RootMenu.collapse && $slots.title" 
            effect="dark" 
            :content="$slots.title[0].children[0].text" 
            placement="right"
            :custom="tooltipStyle">
            <div class="g-menu__collapse-tooltip">
                <slot></slot>
            </div> 
        </g-tooltip>
        <template v-else>
            <slot></slot>
            <slot name="title"></slot>
        </template>
    </li>
</template>
<script>
    import Emitter from '../../../src/mixins/emitter'
    import MenuMixin from './menu-mixin'
    import GTooltip from '../../tooltip'
    export default {
        name: 'GMenuItem',
        componentName: 'GMenuItem',
        components: {
            GTooltip
        },
        mixins: [Emitter, MenuMixin],
        inject: {
            GMenuItemGroup: {
                default: ''
            },
            RootMenu: {
                default: ''
            },
            GSubmenu: {
                default: ''
            }
        },
        props: {
            index: {
                default: null,
                validator: val => typeof val === 'string' || val === null
            },
            disabled: Boolean,
        },
        computed: {
            active() {
                return this.index === this.RootMenu.activeIndex
            },
            hoverBackground() {
                return this.RootMenu.hoverBackground
            },
            backgroundColor() {
                return this.RootMenu.backgroundColor || ''
            },
            activeTextColor() {
                return this.RootMenu.activeTextColor || ''
            },
            textColor() {
                return this.RootMenu.textColor || ''
            },
            itemStyle() {
                const style = {
                    color: this.active ? this.activeTextColor : this.disabled ? '' : this.textColor,
                    backgroundColor: this.backgroundColor,
                }
                if (this.RootMenu.mode === 'horizontal' && !this.isNested) {
                    style.borderColor = this.active
                        ? (this.RootMenu.activeTextColor ? this.activeTextColor : '')
                        : 'transparent'
                }
                return style
            },
            isNested() {
                return this.parentMenu !== this.RootMenu
            },
            tooltipStyle() {
                return {
                    'z-index': 100,
                    'background': this.backgroundColor
                }
            }
        },
        watch: {
            // 'RootMenu.collapse'(newVal, oldVal) {
            //     if (newVal !== oldVal) this.isBlock()
            // }
        },
        methods: {
            isBlock() {
                let time
                // this.$nextTick(() => {
                //     if (this.RootMenu.collapse !== null && !this.RootMenu.collapse && this.RootMenu.mode === 'vertical') {
                //         if (this.$el.children.length > 0) {
                //             this.$el.children[1].style.transition = 'display 0.3'
                //             this.$el.children[1].style.display = 'none'
                //         }
                //     } else {
                //         if (this.$el.children.length > 0) {
                //             this.$el.children[1].style.transition = 'display 0.3'
                //             this.$el.children[1].style.display = ''
                //         }
                //     }
                // })
                clearTimeout(time)
            },
            handleClick() {
                if (this.disabled) return
                this.dispatch('GMenu', 'item-click', this)
                this.$emit('click', this)
            },
            onMouseEnter() {
                if (this.mode === 'horizontal' && !this.RootMenu.backgroundColor) return
                this.$el.style.backgroundColor = this.hoverBackground
            },
            onMouseLeave() {
                if (this.mode === 'horizontal' && !this.RootMenu.backgroundColor) return
                this.$el.style.backgroundColor = this.backgroundColor
            },
        },
        mounted() {
            this.parentMenu.addItem(this)
            this.RootMenu.addItem(this)
        },
        beforeDestroy() {
            this.parentMenu.removeItem(this)
            this.RootMenu.removeItem(this)
        }
    }
</script>