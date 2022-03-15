<template>
    <div :class="[
            'g-slider',
            `is-${vertical ? 'vertical' : 'horizontal'}`,
            disabled &&'is-disabled'
        ]"
        :style="heightStyle">

        <div class="g-slider__runway" ref="slider" @click.stop="onSliderClick">
            <div class="g-slider__bar" :style="barStyle"></div>
            <div class="g-slider__button-wrapper" 
                :style="wrapperStyle"
                @focus="handleMouseEnter"
                @blur="handleMouseLeave"
                @mouseenter="handleMouseEnter"
                @mouseleave="handleMouseLeave"
                @mousedown="onMouseDown"
                @touchstart="onMouseDown">
                <g-tooltip ref="tooltip" effect="dark" :placement="vertical ? 'right' : 'top'" v-if="showTooltip">
                    <span slot="content">{{ formatValue }}</span>
                    <div 
                        class="g-slider__button"
                        :class="{'hover': hovering, 'dragging': dragging}"></div>
                </g-tooltip>
                <div 
                    class="g-slider__button"
                    :class="{'hover': hovering, 'dragging': dragging}" v-else></div>
            </div>
            <div class="slider__mask" v-if="maskList.length > 0">
                <div class="slider-mask" v-for="(item,index) in maskList" :key="index" :style="getStopStyle(item.position)">
                    <span class="slider-mask-text" :style="getLabelStyle(item.mark)">{{getLable(item.mark)}}</span>
                </div>
            </div>
            
            <div class="slider__stops" v-if="showStops">
                <span class="slider-stops" v-for="(item,index) in stops" :key="index" :style="getStopStyle(item)" ></span>
            </div>
            
        </div>
        
    </div>
</template>
<script>
    import GTooltip from '../../tooltip'
    export default {
        name: 'GSlider',
        componentName: 'GSlider',
        components: {
            GTooltip
        },
        props: {
            value: {
                type: Number,
                default: 0
            },
            disabled: Boolean,
            step: {
                type: Number,
                default: 1
            },
            min: {
                type: Number,
                default: 0
            },
            max: {
                type: Number,
                default: 100
            },
            size: String,
            vertical: Boolean,
            height: {
                type: String,
                default: '200px'
            },
            showTooltip: {
                type: Boolean,
                default: true
            },
            marks: Object,
            showStops: Boolean
        },
        data () {
            return {
                dragging: false,
                hovering: false,
                isClick: false,
                startX: 0,
                currentX: 0,
                startY: 0,
                currentY: 0,
                startPosition: 0,
                newPosition: null,
                oldValue: this.value,
                sliderSize: 1,
            }
        },
        computed: {
            maxVal() {
                return this.max
            },
            minVal() {
                return this.min
            },
            currentPosition() {
                return `${ (this.value - this.minVal) / (this.maxVal - this.minVal) * 100 }%`
            },
            wrapperStyle() {
                return this.vertical ? { bottom: this.currentPosition } : { left: this.currentPosition }
            },
            formatValue() {
                return this.value
            },
            barStart() {
                return this.range
                ? `${ 100 * (this.minValue - this.min) / (this.max - this.min) }%`
                : '0%'
            },
            barStyle() {
                return this.vertical
                ? {
                    height: this.currentPosition,
                    // bottom: this.barStart
                } : {
                    width: this.currentPosition,
                    // left: this.barStart
                }
            },
            heightStyle() {
                return this.vertical && this.height ? {height: this.height } : ''
            },
            maskList() {
                if (!this.marks) return []
                const marksKeys = Object.keys(this.marks)
                return marksKeys.map(parseFloat)
                    .sort((a, b) => a - b)  
                    .filter(point => point <= this.max && point >= this.min)
                    .map(point => ({
                        point,
                        position: (point - this.min) * 100 / (this.max - this.min),
                        mark: this.marks[point]
                    }))
                    
            },
            
            stops() {
                if (!this.showStops || this.min > this.max) return []
                if (this.step === 0) {
                    process.env.NODE_ENV !== 'production' &&
                    console.warn('[Element Warn][Slider]step should not be 0.')
                    return []
                }
                const stopCount = (this.max - this.min) / this.step
                const stepWidth = 100 * this.step / (this.max - this.min)
                const result = []
                for (let i = 0; i < stopCount; i++) {
                    result.push(i * stepWidth);
                }
                
                if (this.range) {
                    return result.filter(step => {
                        return step < 100 * (this.minValue - this.min) / (this.max - this.min) ||
                        step > 100 * (this.maxValue - this.min) / (this.max - this.min)
                    })
                } else {
                    result.filter(step => step > 100 * (this.firstValue - this.min) / (this.max - this.min))
                    return result
                }
                
            }
        },
        methods: {
            getLable(key) {
                if (Object.prototype.toString.call(key) === '[object String]') {
                    return key
                } else if (Object.prototype.toString.call(key) === '[object Object]') {
                    return key.label
                }
            },
            getLabelStyle(key) {
                if (Object.prototype.toString.call(key) === '[object Object]') {
                    return key.style
                }
            },
            getStopStyle(position) {
                return this.vertical ? { 'bottom': position + '%' } : { 'left': position + '%' }
            },
            onMouseDown(event) {
                if (this.disabled) return
                event.preventDefault()
                this.onDragStart(event)
                window.addEventListener('mousemove', this.onDragging)
                window.addEventListener('touchmove', this.onDragging)
                window.addEventListener('mouseup', this.onDragEnd)
                window.addEventListener('touchend', this.onDragEnd)
                window.addEventListener('contextmenu', this.onDragEnd)
            },
            
            onDragStart(event) {
                this.dragging = true
                this.isClick = true
                if (event.type === 'touchstart') {
                    event.clientY = event.touches[0].clientY
                    event.clientX = event.touches[0].clientX
                }
                if (this.vertical) {
                    this.startY = event.clientY
                } else {
                    this.startX = event.clientX
                }
                this.startPosition = parseFloat(this.currentPosition)
                this.newPosition = this.startPosition
                
            },
            onDragging(event) {
                if (this.dragging) {
                    this.isClick = false
                    let diff = 0
                    if (event.type === 'touchmove') {
                        event.clientY = event.touches[0].clientY
                        event.clientX = event.touches[0].clientX
                    }
                    if (this.vertical) {
                        this.currentY = event.clientY
                        diff = (this.startY - this.currentY) / this.sliderSize * 100
                    } else {
                        this.currentX = event.clientX
                        diff = (this.currentX - this.startX) / this.sliderSize * 100
                    }
                    
                    this.newPosition = this.startPosition + diff
                    this.setPosition(this.newPosition)
                }
            },

            onDragEnd() {
                if (this.dragging) {
                    setTimeout(() => {
                        this.dragging = false
                        if (!this.isClick) {
                            this.setPosition(this.newPosition)
                        }
                    }, 0)
                    window.removeEventListener('mousemove', this.onDragging)
                    window.removeEventListener('touchmove', this.onDragging)
                    window.removeEventListener('mouseup', this.onDragEnd)
                    window.removeEventListener('touchend', this.onDragEnd)
                    window.removeEventListener('contextmenu', this.onDragEnd)
                }
            },
            setPosition(newPosition) {
                if (newPosition === null || isNaN(newPosition)) return
                if (newPosition < 0) {
                    newPosition = 0
                } else if (newPosition > 100) {
                    newPosition = 100
                }
                const lengthPerStep = 100 / ((this.max - this.min) / this.step)
                const steps = Math.round(newPosition / lengthPerStep)
                let value = steps * lengthPerStep * (this.max - this.min) * 0.01 + this.min
                value = parseFloat(value.toFixed(this.precision))
                this.$emit('input', value)
                this.$nextTick(() => {
                    this.$refs.tooltip && this.$refs.tooltip.updatePopper()
                })
                if (!this.dragging && this.value !== this.oldValue) {
                    this.oldValue = this.value
                }
            },
            handleMouseEnter() {
                this.hovering = true
            },
            handleMouseLeave() {
                this.hovering = false
            },
            // onLeftKeyDown() {
            //     if (this.disabled) return
            //     this.newPosition = parseFloat(this.currentPosition) - this.step / (this.max - this.min) * 100
            //     this.setPosition(this.newPosition)
            //     this.emitChange()
            // },
            // onRightKeyDown() {
            //     if (this.disabled) return
            //     this.newPosition = parseFloat(this.currentPosition) + this.step / (this.max - this.min) * 100
            //     this.setPosition(this.newPosition)
            //     this.emitChange()
            // },
            emitChange() {
                this.$nextTick(() => {
                    this.$emit('change', this.range ? [this.minValue, this.maxValue] : this.value)
                })
            },
            onSliderClick(event) {
                if (this.sliderDisabled || this.dragging) return
                    this.resetSize()
                if (this.vertical) {
                    const sliderOffsetBottom = this.$refs.slider.getBoundingClientRect().bottom
                    this.setPosition((sliderOffsetBottom - event.clientY) / this.sliderSize * 100)
                } else {
                    const sliderOffsetLeft = this.$refs.slider.getBoundingClientRect().left
                    this.setPosition((event.clientX - sliderOffsetLeft) / this.sliderSize * 100)
                }
                this.emitChange()
            },
            resetSize() {
                if (this.$refs.slider) {
                    this.sliderSize = this.$refs.slider[`client${ this.vertical ? 'Height' : 'Width' }`];
                }
            },
        },
        mounted () {
            this.resetSize()
        }
    }
</script>