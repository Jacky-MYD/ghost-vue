<template>
    <div class="g-menu-wrapper" :style="[collapseStyle]">
        <ul :style="{justifyContent: justifyContent, backgroundColor: backgroundColor, color: textColor}"
            :class="[
                {
                    'g-menu': true,
                    'g-menu__collapse': collapse
                },
                `g-menu-wrapper--${mode}`
            ]"
            >
            <slot></slot>
        </ul>
    </div>
</template>
<script>
    import Emitter from '../../../src/mixins/emitter'
    export default {
        name: 'GMenu',
        componentName: 'GMenu',
        mixins: [Emitter],
        provide() {
            return {
                RootMenu: this
            }
        },
        props: {
            mode: {
                type: String,
                default: 'vertical'
            },
            width: {
                type: String,
                default: '100%'
            },
            justifyContent: {
                type: String,
                default: ''
            },
            defaultActive: String,
            textColor: String,
            activeTextColor: String,
            backgroundColor: String,
            collapse: Boolean,
            defaultOpeneds: Array,
            uniqueOpened: Boolean,
            router: String
        },
        data () {
            return {
                activeIndex: this.defaultActive,
                items: {},
                submenus: {},
                openedMenus: (this.defaultOpeneds && this.collapse) ? this.defaultOpeneds.slice(0) : []
            }
        },
        computed: {
            hoverBackground() {
                return this.backgroundColor ? this.mixColor(this.backgroundColor, 0.2) : ''
            },
            isMenuPopup() {
                return this.mode === 'horizontal' || (this.mode === 'vertical' && this.collapse)
            },
            collapseStyle() {
                return this.collapse ? 
                    { width: '55px', transition: 'width 0.3s' }  : { width: this.width, transition: 'width 0.3s' }
            }
        },
        watch: {
            defaultActive(val){
                if(!this.items[val]){
                    this.activeIndex = null
                }
                this.updateActiveIndex(val)
            },
            defaultOpeneds(val) {
                if (this.collapse) this.openedMenus = val
            },
            collapse(val) {
                if (val) this.openedMenus = []
                // this.broadcast('GSubmenu', 'toggle-collapse', val)
            }
        },
        methods: {
            updateActiveIndex(val) {
                const item = this.items[val] || this.items[this.activeIndex] || this.items[this.defaultActive]

                if (item) {
                    this.activeIndex = item.index
                    this.initOpenedMenu()
                } else {
                    this.activeIndex = null
                }
            },
            initOpenedMenu() {
                const index = this.activeIndex
                const activeItem = this.items[index]
                if (!activeItem || this.mode === 'horizontal' || this.collapse) return

                let indexPath = activeItem.indexPath

                indexPath.forEach(index => {
                    let submenu = this.submenus[index]
                    submenu && this.openMenu(index, submenu.indexPath, submenu)
                })
            },
            handleItemClick(item) {
                const { index, indexPath } = item
                const oldActiveIndex = this.activeIndex

                const hasIndex = item.index !== null
                if (hasIndex) {
                    this.activeIndex = item.index
                }

                this.$emit('select', index, indexPath, item)

                if (this.mode === 'horizontal' || this.collapse) {
                    this.openedMenus = []
                }

                if (this.router && hasIndex) {
                    this.routeToItem(item, (error) => {
                        this.activeIndex = oldActiveIndex
                        if (error) {
                            if (error.name === 'NavigationDuplicated') return
                            console.error(error)
                        }
                    })
                }

            },
            handleSubmenuClick(submenu) {
                
                const { index, indexPath } = submenu
                let isOpened = this.openedMenus.indexOf(index) !== -1
                if (isOpened) {
                    this.closeMenu(index, submenu)
                    this.$emit('close', index, indexPath)
                    
                } else {
                    this.openMenu(index, indexPath, submenu)
                    this.$emit('open', index, indexPath)
                    
                }
            },
            closeMenu(idx, submenu) {
                const index = this.openedMenus.indexOf(idx)
                if (index !== -1) this.openedMenus.splice(index, 1)
                if (this.mode === 'horizontal') return
                submenu.$el.style.maxHeight = '57px'
            },
            openMenu(idx, indexPath, submenu) {
                let openedMenus = this.openedMenus
                if (openedMenus.indexOf(idx) !== -1) return

                if (this.uniqueOpened) {
                    this.openedMenus = openedMenus.filter( index => {
                        return indexPath.indexOf(index) !== -1
                    })
                }
                this.openedMenus.push(idx)
                if (this.mode === 'horizontal') return
                submenu.$el.style.maxHeight = "500px"
            },
            routeToItem(item, onError) {
                let route = item.route || item.index
                try {
                    this.$router.push(route, () => {}, onError)
                } catch(e) {
                    console.log(e)
                }
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
            getColorChannels(color) {
                color = color.replace('#', '')
                if (/^[0-9a-fA-F]{3}$/.test(color)) {
                    color = color.split('')
                    for (let i = 2; i >= 0; i--) {
                        color.splice(i, 0, color[i])
                    }
                    color = color.join('')
                }
                if (/^[0-9a-fA-F]{6}$/.test(color)) {
                    return {
                        red: parseInt(color.slice(0, 2), 16),
                        green: parseInt(color.slice(2, 4), 16),
                        blue: parseInt(color.slice(4, 6), 16)
                    }
                } else {
                    return {
                        red: 255,
                        green: 255,
                        blue: 255
                    }
                }
            },
            mixColor(color, percent) {
                let { red, green, blue } = this.getColorChannels(color)
                if (percent > 0) { 
                    red *= 1 - percent
                    green *= 1 - percent
                    blue *= 1 - percent
                } else { 
                    red += (255 - red) * percent
                    green += (255 - green) * percent
                    blue += (255 - blue) * percent
                }
                return `rgb(${ Math.round(red) }, ${ Math.round(green) }, ${ Math.round(blue) })`
            },
        },
        mounted () {
            this.initOpenedMenu()
            this.$on('item-click', this.handleItemClick)
            this.$on('submenu-click', this.handleSubmenuClick)
            this.$watch('items', this.updateActiveIndex)
        }
    }
</script>