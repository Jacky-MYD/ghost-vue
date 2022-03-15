<!-- <template>
    <div :class="[
        'g-tabs',
        `g-tabs--${tabPosition}`
    ]">
        <div :class="[
            'g-tabs__header',
            `is-${tabPosition}`
        ]">
            <div :class="[
                'g-tabs__nav-wrap',
                `is-${tabPosition}`
            ]">
                <slot></slot>
            </div>
            
        </div>  
        <div class="g-tabs__content">
            
        </div>
        
    </div>
</template> -->
<script>
    import Emitter from '../../../src/mixins/emitter'
    export default {
        name: 'GTabs',
        componentName: 'GTabs',
        mixins: [Emitter],
        provide() {
            return {
                GTabs: this
            }
        },
        props: {
            value: {
                required: true
            },
            type: {
                type: String,
                default: 'default'
            },
            tabPosition: {
                type: String,
                default: 'top'
            }
        },
        data () {
            return {
                currentName: this.value,
                paneNode: []
            }
        },
        methods: {
            handleItemClick(item, ind, ev) {
                this.setCurrentName(item.name)
                this.$emit('tab-click', item, ind, event)
            },
            setCurrentName(val) {
                this.currentName = val
                this.$emit('input', val)
            }
        },
        created () {
            this.$on('item-click', this.handleItemClick)
        },
        watch: {
            value(val) {
                this.setCurrentName(val)
            }
        },
        render(h) {
            const header = (
                <div class={{
                    'g-tabs__header': true,
                    [`is-${this.type}`]: true,
                    [`is-${ this.tabPosition }`]: this.tabPosition
                }}>
                    <div class={{
                        'g-tabs__nav-wrap': true,
                        [`is-${ this.tabPosition }`]: this.tabPosition
                    }}>
                        { this.paneNode.map((pane, index) => {
                            return (
                                <div class={{
                                    'g-tab-pane': true,
                                    'is-active': pane.active
                                }}
                                    on-click={(ev) => {
                                        this.handleItemClick(pane, index, ev)
                                    }}>
                                    { pane.$slots.label || pane.label }
                                </div>
                            )
                        })}
                    </div>
                </div>
            )

            const panels = (
                <div class={'g-tabs__content'}>
                    {this.$slots.default}
                </div>
            )
            return (
                <div class={{
                    'g-tabs': true,
                    [`g-tabs--${this.type}`]: true,
                    [`g-tabs--${this.tabPosition}`]: this.tabPosition
                }}>
                    {
                        this.tabPosition !== 'bottom' && this.tabPosition !== 'right' ? [header, panels] : [panels, header]
                    }
                    
                </div>
            )
        }
    }
</script>