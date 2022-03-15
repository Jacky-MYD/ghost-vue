<template>
    <li class="g-submenu"
        :class="[{
            'is-active': active,
            'is-disabled': disabled
        }]"
        :style="[itemStyle]"
        @click.stop="handleClick"
        @mouseenter="handleMouseenter"
        @mouseleave="handleMouseleave"
        @focus="handleMouseenter">
        <div class="g-submenu__title"
            :style="[titleStyle]">
            <template v-if="!$slots.title">{{ title }}</template>
            <slot name="title"></slot>
            <i :class="['g-submenu__icon', 'g-icon-' + iconClass]"></i>
            
        </div>
        <g-popup-transition :class="[mode === 'horizontal' ? 'g-submenu--horizontal' : 'g-submenu--vertical']"
            :placement="mode === 'horizontal' ? currentPlacement : ''"
            :style="placementStyle"
            v-if="mode === 'horizontal'"
            @mouseenter="handleMouseenter"
            @mouseleave="handleMouseleave">
            <ul class="g-menu-popup" 
                :class="[
                    `g-menu--popup-${currentPlacement}`
                ]"
                v-show="isOpen">
                <slot></slot>
            </ul>
        </g-popup-transition>
        <transition name="g-collapse-fade" v-else>
            <div :class="[mode === 'horizontal' ? 'g-submenu--horizontal' : 'g-submenu--vertical']"
                @mouseenter="handleMouseenter"
                @mouseleave="handleMouseleave">
                <ul class="g-menu-popup g-menu-collapse__popper"
                    :style="[itemStyle]"
                    v-show="!RootMenu.collapse">
                    <slot></slot>
                </ul>
                <ul class="g-menu-popup g-menu-collapse__popper"
                    :style="[itemStyle]"
                    v-show="RootMenu.collapse && isOpen"
                    >
                    <slot></slot>
                </ul>
            </div>
        </transition>
        
    </li>
</template>
<script>
    import Emitter from '../../../src/mixins/emitter'
    import MenuMixin from './menu-mixin'
    import GPopupTransition from './popup-transition'
    export default {
        name: 'GSubmenu',
        componentName: 'GSubmenu',
        mixins: [Emitter, MenuMixin],
        components: {
            GPopupTransition
        },
        props: {
            index: {
                type: String,
                required: true
            },
            title: String,
            disabled: Boolean,
            size: String
        },
        inject: {
            RootMenu: {
                default: ''
            }
        },
        provide() {
            return {
                GSubmenu: this
            }
        },
        computed: {
            GSubmenuSize() {
                return this.size
            },
            mode() {
                return this.RootMenu.mode
            },
            iconClass() {
                return this.isFirstLevel ?  this.isOpen ? 'arrow-down is-reverse' : 'arrow-down' : this.isOpen ? 'arrow-next is-reverse' : 'arrow-next'

            },
            active() {
                let isActive = false
                const submenus = this.submenus
                const items = this.items
                Object.keys(items).forEach(index => {
                    if (items[index].active) {
                        isActive = true
                    }
                })
                Object.keys(submenus).forEach(index => {
                    if (submenus[index].active) {
                        isActive = true
                    }
                })
                return isActive
            },
            isFirstLevel() {
                let isFirstLevel = true
                let parent = this.$parent
                while (parent && parent !== this.rootMenu) {
                    if (['GSubmenu', 'GMenuItemGroup'].indexOf(parent.$options.componentName) > -1) {
                        isFirstLevel = false
                        break
                    } else {
                        parent = parent.$parent
                    }
                }
                return isFirstLevel
            },
            placementStyle() {
                return this.isFirstLevel ? {'top': '63px'} : {'top': '0', 'right': '-150px'}
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
                    color: this.active ? this.activeTextColor : this.textColor,
                    backgroundColor: this.backgroundColor,
                    borderColor: this.active && this.isFirstLevel ?  this.activeTextColor: 'transparent'
                }
                return style
            },
            titleStyle() {
                const style = {
                    color: this.active ? this.activeTextColor : this.textColor,
                    backgroundColor: this.backgroundColor,
                }
                return style
            }
        },
        data () {
            return {
                isOpen: false,
                submenus: {},
                items: {},
                currentPlacement: '',
            }
        },
        methods: {
            handleClick() {
                if ((this.RootMenu.collapse && this.RootMenu.mode === 'vertical') || this.disabled) return
                this.dispatch('GMenu', 'submenu-click', this)
            },
            handleMouseenter(event) {
                this.isOpen = true
                if (this.mode === 'horizontal' && !this.RootMenu.backgroundColor) return
                this.$el.children[0].style.backgroundColor = this.hoverBackground
            },
            handleMouseleave() {
                this.isOpen = false
                if (this.mode === 'horizontal' && !this.RootMenu.backgroundColor) return
                this.$el.children[0].style.backgroundColor = this.backgroundColor
            },
            addItem(item) {
                this.$set(this.items, item.index, item)
            },
            removeItem(item) {
                delete this.items[item.index]
            },
            addSubmenu(item) {
                this.$set(this.submenus, item.index, item)
            },
            removeSubmenu(item) {
                delete this.submenus[item.index]
            },
            updateSubmenu() {
                this.currentPlacement = this.mode === 'horizontal' && this.isFirstLevel
                ? 'bottom-start'
                : 'right-start'
            },
            handleCollapseToggle() {
                console.log(234234);
            }
        },
        created () {
            this.$on('toggle-collapse', this.handleCollapseToggle)
        },
        mounted() {
            this.parentMenu.addSubmenu(this)
            this.RootMenu.addSubmenu(this)
            this.updateSubmenu()
        },
        beforeDestroy() {
            this.parentMenu.removeSubmenu(this)
            this.RootMenu.removeSubmenu(this)
        },
        watch: {
            
        }
    }
</script>