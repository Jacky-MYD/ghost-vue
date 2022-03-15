<template>
    <div class="g-menu-item-group">
        <div class="g-menu-item-group__title">
            <template v-if="!$slots.title">{{ title }}</template>
            <slot name="title"></slot>
        </div>
        <ul>
            <slot></slot>
        </ul>
    </div>
</template>
<script>
    export default {
        name: 'GMenuItemGroup',
        componentName: 'GMenuItemGroup',
        props: {
            disabled: Boolean,
            size: String,
            title: String
        },
        provide() {
            return {
                GMenuItemGroup: this
            }
        },
        computed: {
            menuItemGroupSize() {
                return this.size
            }
        }
    }
</script>