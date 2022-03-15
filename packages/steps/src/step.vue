<template>
    <div :class="[
        'g-step',
        `is-${$parent.direction}`,
        isLast && !space && !isCenter && 'is-flex',
        isCenter && !isVertical && !isSimple && 'is-center'
    ]"
        :style="style">
        <div :class="[
            'g-step__header',
            `is-${currentStatus}`
        ]">
            <div class="g-step__line"></div>
            <div class="g-step__icon" 
                :class="[
                    `is-${ icon ? 'icon' : 'text' }`
                ]">
                <slot name="title" v-if="currentStatus !== 'success' && currentStatus !== 'error'">
                    <i :class="[icon]" v-if="icon"></i>
                    <span class="g-step__icon-inner" v-else>{{ index + 1 }}</span>
                </slot>
                <i :class="[
                    'g-step__icon-inner',
                    'is-status',
                    `g-icon-${currentStatus === 'success' ? 'check' : 'wrong'}`
                ]" v-else></i>
            </div>
        </div>
        <div class="g-step__main">
            <div :class="[
                'g-step__title',
                `is-${currentStatus}`
            ]">{{ title }}</div>
            <div :class="[
                'g-step__description',
                `is-${currentStatus}`
            ]">{{ description }}</div>
        </div>
    </div>
</template>
<script>
    export default {
        name: 'GStep',
        componentName: 'GStep',
        props: {
            title: String,
            icon: String,
            description: String,
            status: String
        },
        data () {
            return {
                index: -1,
                internalStatus: ''
            }
        },
        computed: {
            currentStatus() {
                return this.status || this.internalStatus;
            },
            isCenter() {
                return this.$parent.alignCenter;
            },
            isVertical() {
                return this.$parent.direction === 'vertical';
            },
            isLast() {
                const parent = this.$parent;
                return parent.steps[parent.steps.length - 1] === this;
            },
            stepsCount() {
                return this.$parent.steps.length;
            },
            isSimple() {
                return this.$parent.simple;
            },
            space() {
                const { isSimple, $parent: { space } } = this;
                return isSimple ? '' : space ;
            },
            style() {
                const style = {};
                const parent = this.$parent
                const len = parent.steps.length

                const space = (typeof this.space === 'number'
                    ? this.space + 'px'
                    : this.space
                    ? this.space
                    : 100 / (len - (this.isCenter ? 0 : 1)) + '%')
                style.flexBasis = space;
                if (this.isVertical) return style
                if (this.isLast) {
                    style.maxWidth = 100 / this.stepsCount + '%'
                } else {
                    style.marginRight = -this.$parent.stepOffset + 'px'
                }

                return style
            }
        },
        methods: {
            updateStatus(val) {
                const prevChild = this.$parent.$children[this.index - 1];
                if (val > this.index) {
                    this.internalStatus = this.$parent.finishStatus
                } else if (val === this.index && this.prevStatus !== 'error') {
                    this.internalStatus = this.$parent.processStatus
                } else {
                    this.internalStatus = 'wait'
                }

                if (prevChild) prevChild.calcProgress(this.internalStatus)
            },
            calcProgress(status) {
                let step = 100;
                const style = {};

                style.transitionDelay = 150 * this.index + 'ms';
                if (status === this.$parent.processStatus) {
                    step = this.currentStatus !== 'error' ? 0 : 0;
                } else if (status === 'wait') {
                    step = 0;
                    style.transitionDelay = (-150 * this.index) + 'ms';
                }

                style.borderWidth = step && !this.isSimple ? '1px' : 0;
                this.$parent.direction === 'vertical'
                    ? style.height = step + '%'
                    : style.width = step + '%';

                this.lineStyle = style;
            }
        },
        beforeCreate() {
            this.$parent.steps.push(this);
        },
        mounted () {
            const unwatch = this.$watch('index', val => {
                this.$watch('$parent.active', this.updateStatus, { immediate: true })
                this.$watch('$parent.processStatus', () => {
                    const activeIndex = this.$parent.active
                    this.updateStatus(activeIndex)
                }, { immediate: true })
                unwatch()
            })
        }
    }
</script>