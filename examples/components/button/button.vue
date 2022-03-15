<template>
    <button class="g-button" :style="thremStyle()"  :disabled="disabled" :class="[`g-button--${type}`, {
        'is-plain': plain,
        'is-round': round,
        'is-circle': circle,
        'is-disabled': disabled
    }]" @click="handleClick">
        <i v-if="icon" :class="icon"></i>
        <span v-if="$slots.default"><slot></slot></span>
    </button>
</template>

<script>
export default {
    name: 'GButton',
    // 封装一个通用的组件，会对props做一个约束，props进行校验
    props: {
        type: {
            type: String,
            default: 'default'
        },
        plain: {
            type: Boolean,
            default: false
        },
        round: {
            type: Boolean,
            default: false
        },
        circle: {
            type: Boolean,
            default: false
        },
        icon: {
            type: String,
            default: ''
        },
        disabled: {
            type: Boolean,
            default: false
        }
    },
    methods: {
        handleClick(e) {
            this.$emit('click', e)
        },
        thremStyle() {
            if (this.$primary) {
                return {'color': this.$primary} 
            }
        }
    }
}
</script>

<style lang="scss" scoped>
    .g-button {
        display: inline-block;
        line-height: 1;
        white-space: nowrap;
        cursor: pointer;
        background: white;
        border: 1px solid #dcdfe6;
        color: #606266;
        -webkit-appearance: none;
        text-align: center;
        box-sizing: border-box;
        outline: none;
        margin: 0;
        transition: 0.1s;
        font-weight: 500;
        // 禁止元素的文字被选中
        -ms-user-select: none;
        -webkit-user-select: none;
        -moz-user-select: none;
        padding: 12px 20px;
        font-size: 14px;
        border-radius: 4px;
        &:hover,
        &:focus {
            color: #409eff;
            border-color: #c6e2ff;
            background-color: #ecf5ff;
        }
    }
    // .g-button--primary {
    //     color: white;
    //     background-color: #409eff;
    //     border-color: #409eff;
    //     &:hover,
    //     &:focus {
    //         background: #66b1ff;
    //         border-color: #66b1ff;
    //         color: white;
    //     }
    // }
    .g-button--success {
        color: white;
        background-color: #67c23a;
        border-color: #67c23a;
        &:hover,
        &:focus {
            background: #85ce61;
            border-color: #85ce61;
            color: white;
        }
    }
    .g-button--info {
        color: white;
        background-color: #909399;
        border-color: #909399;
        &:hover,
        &:focus {
            background: #a6a9ad;
            border-color: #a6a9ad;
            color: white;
        }
    }
    .g-button--warning {
        color: white;
        background-color: #e6a23c;
        border-color: #e6a23c;
        &:hover,
        &:focus {
            background: #ebb563;
            border-color: #ebb563;
            color: white;
        }
    }
    .g-button--danger {
        color: white;
        background-color: #f56c6c;
        border-color: #f56c6c;
        &:hover,
        &:focus {
            background: #f78989;
            border-color: #f78989;
            color: white;
        }
    }

    .g-button.is-plain {
        &:hover,
        &:focus {
            background: #409eff;
            border-color: #409eff;
            color: white;
        }
    }
    .g-button--primary.is-plain {
        color: #409eff;
        background-color: #ecf5ff;
        border-color: #b3d8ff;
        &:hover,
        &:focus {
            background: #409eff;
            border-color: #409eff;
            color: white;
        }
    }
    .g-button--success.is-plain {
        color: #67c23a;
        background-color: #f9f9eb;
        border-color: #c2e7b0;
        &:hover,
        &:focus {
            background: #67c23a;
            border-color: #67c23a;
            color: white;
        }
    }
    .g-button--info.is-plain {
        color: #909399;
        background-color: #f4f4f5;
        border-color: #d3d4d6;
        &:hover,
        &:focus {
            background: #909399;
            border-color: #909399;
            color: white;
        }
    }
    .g-button--warning.is-plain {
        color: #e6a23c;
        background-color: #fdf6ec;
        border-color: #f5dab1;
        &:hover,
        &:focus {
            background: #e6a23c;
            border-color: #e6a23c;
            color: white;
        }
    }
    .g-button--danger.is-plain {
        color: #f56c6c;
        background-color: #fef0f0;
        border-color: #fbc4c4;
        &:hover,
        &:focus {
            background: #f56c6c;
            border-color: #f56c6c;
            color: white;
        }
    }

    .g-button.is-round {
        border-radius: 20px;
        padding: 12px 23px;
    }

    .g-button.is-circle {
        border-radius: 50%;
        padding: 12px;
    }

    .g-button [class*=g-icon-]+span {
        margin-left: 5px;
    }

    .g-button.is-disabled {
        // background-color: #f5f7fa;
        // border-color: #e4e7ed;
        // color: #c0c4cc;
        cursor: not-allowed;
    }
</style>
