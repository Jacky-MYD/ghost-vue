<template>
    <div class="g-form">
        <slot></slot>
    </div>
</template>

<script>
export default {
    name: 'GForm',
    componentName: 'GForm',
    props: {
        model: {
            type: Object,
            required: true
        },
        labelWidth: {
            type: String,
            default: '120px'
        },
        size: String
    },
    provide() {
        return {
            GForm: this 
        }
    },
    computed: {
        
    }
}
</script>
