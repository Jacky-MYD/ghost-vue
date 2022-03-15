<template>
    <transition name="g-loading-fade">
        <div class="g-loading-mask"
            :class="[isBodyClass, className]"
            :style="[backgroundClass]"
            v-show="visible">
            <div class="g-loading-spinner">
                <i class="loading-icon" :class="[iconSport, customIcon]" v-if="customIcon"></i>
                <svg viewBox="0 0 50 50" class="loading-svg" v-else>
                    <circle class="svg-path" cx="25" cy="25" r="20" fill="none"></circle>
                </svg>
                <p class="g-loading-text" v-if="text">{{ text }}</p>
            </div>
        </div>
    </transition>
</template>
<script>
    export default {
        name: 'GLoading',
        componentName: 'GLoading',
        props: {
            text: String,
            customIcon: String,
            body: Boolean,
            visible: Boolean,
            background: String,
            staticIcon: Boolean,
            className: String
        },
        computed: {
            isBodyClass() {
                return this.body ? 'is-fixed' : ''
            },
            iconSport() {
                return this.staticIcon ? 'icon-sport' : ''
            },
            backgroundClass() {
                return this.background ? { 'background-color' : this.background } : ''
            }
        },
        mounted () {
            
        }
    }
</script>