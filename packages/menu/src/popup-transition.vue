<template>
    <transition name="g-popup-fade" mode="">
        <div>
            <slot></slot>
        </div>
    </transition>
</template>
<script>
    export default {
        name: 'GMenuCollapseTransition',
        componentName: 'GMenuCollapseTransition',
    }
</script>