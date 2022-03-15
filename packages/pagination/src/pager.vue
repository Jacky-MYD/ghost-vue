<template>
    <ul class="g-pager" @click="onPageClick">
        <li
         :style="[getCustomStyle]"
         class="g-pager-item"
         :class="{ actived: currentPage === 1, disabled}"
         v-if="pageCount > 0">1</li>
        <li
         :style="[getCustomStyle]"
         class="g-pager-item more btn-quickprev"
         :class="[quickprevIconClass, { disabled }]"
         v-if="showPrevMore"
         @mouseenter="onMouseenter('left')"
         @mouseleave="quickprevIconClass = 'g-icon-more'"></li>
        <li
         :style="[getCustomStyle]"
         v-for="pager in pagers"
         :key="pager"
         class="g-pager-item"
         :class="{ actived: currentPage === pager, disabled}">{{ pager }}</li>
        <li
         :style="[getCustomStyle]"
         class="g-pager-item more btn-quicknext"
         :class="[quicknextIconClass, { disabled }]"
         v-if="showNextMore"
         @mouseenter="onMouseenter('right')"
         @mouseleave="quicknextIconClass = 'g-icon-more'"></li>
        <li
         :style="[getCustomStyle]"
         class="g-pager-item"
         :class="{ actived: currentPage === pageCount, disabled}"
         v-if="pageCount > 1">{{ pageCount }}</li>
    </ul>
</template>
<script>
    export default {
        name: 'GPager',
        componentName: 'GPager',
        props: {
            currentPage: Number,
            pageCount: Number,
            pagerCount: Number,
            disabled: Boolean,
            customStyle: Object
        },
       
        watch: {
            showPrevMore(val) {
                if (!val) this.quickprevIconClass = 'g-icon-more';
            },

            showNextMore(val) {
                if (!val) this.quicknextIconClass = 'g-icon-more';
            },
        },
        computed: {
            getCustomStyle() {
                return this.customStyle || {}
            },
            pagers() {
                const pagerCount = this.pagerCount
                const halfPagerCount = (pagerCount - 1) / 2

                const currentPage = Number(this.currentPage)
                const pageCount = Number(this.pageCount)

                let showPrevMore = false
                let showNextMore = false
                
                return this.updateIconClass(pagerCount, halfPagerCount, currentPage, pageCount, showPrevMore, showNextMore)
            }
        },
        methods: {
            onPageClick(event) {
                const target = event.target
                if (target.tagName === 'UL' || this.disabled) return

                let newPage = Number(target.textContent)
                const pageCount = this.pageCount
                const currentPage = this.currentPage
                const pagerCountOffset = this.pagerCount - 2

                if (target.className.indexOf('more') !== -1) {
                    if (target.className.indexOf('quickprev') !== -1) {
                        newPage = currentPage - pagerCountOffset;
                    } else if (target.className.indexOf('quicknext') !== -1) {
                        newPage = currentPage + pagerCountOffset;
                    }
                }

                if (!isNaN(newPage)) {
                    if (newPage < 1) {
                        newPage = 1;
                    }

                    if (newPage > pageCount) {
                        newPage = pageCount;
                    }
                }

                if (newPage !== currentPage) {
                    this.$emit('change', newPage);
                }
            },
            onMouseenter(direction) {
                if (this.disabled) return
                if (direction === 'left') {
                    this.quickprevIconClass = 'g-icon-arrow-left';
                } else {
                    this.quicknextIconClass = 'g-icon-arrow-right';
                }
            },
            updateIconClass(pagerCount, halfPagerCount, currentPage, pageCount, showPrevMore, showNextMore) {
                if (pageCount > pagerCount) {
                    if (currentPage > (pagerCount - halfPagerCount)) {
                        showPrevMore = true
                    }

                    if (currentPage < (pageCount - halfPagerCount)) {
                        showNextMore = true
                    }
                }

                const pageArray = []
                if (showPrevMore && !showNextMore) {
                    const startPage = pageCount - (pagerCount - 2);
                    for (let i = startPage; i < pageCount; i++) {
                        pageArray.push(i);
                    }
                } else if (!showPrevMore && showNextMore) {
                    for (let i = 2; i < pagerCount; i++) {
                        pageArray.push(i);
                    }
                } else if (showPrevMore && showNextMore) {
                    const offset = Math.floor(pagerCount / 2) - 1;
                    for (let i = currentPage - offset ; i <= currentPage + offset; i++) {
                        pageArray.push(i);
                    }
                } else {
                    for (let i = 2; i < pageCount; i++) {
                        pageArray.push(i);
                    }
                }
                this.showPrevMore = showPrevMore
                this.showNextMore = showNextMore
                return pageArray
            }
        },
        data () {
            return {
                showPrevMore: false,
                showNextMore: false,
                quicknextIconClass: 'g-icon-more',
                quickprevIconClass: 'g-icon-more'
            }
        },
        
    }
</script>