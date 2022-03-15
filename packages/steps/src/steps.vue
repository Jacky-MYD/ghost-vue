<template>
    <div :class="[
        'g-steps',
        `g-steps--${direction}`
    ]">
        <slot></slot>
    </div>
</template>
<script>
    export default {
        name: 'GSteps',
        componentName: 'GSteps',
        props: {
            space: [Number, String],
            active: Number,
            
            alignCenter: Boolean,
            // simple: Boolean,
            direction: {
                type: String,
                default: 'horizontal'
            },
            finishStatus: {
                type: String,
                default: 'finish'
            },
            processStatus: {
                type: String,
                default: 'process'
            }
        },
        
        data () {
            return {
                steps: [],
                stepOffset: 0
            }
        },
        watch: {
            active(newVal, oldVal) {
                this.$emit('change', newVal, oldVal)
            },
            steps(steps) {
                steps.forEach((child, index) => {
                    child.index = index
                })
            }
        }
    }
</script>