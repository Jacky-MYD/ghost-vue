// 整个包的入口
import './fonts/font.scss'
import '../examples/assets/main.scss'
import GButton from './button/index'
import GDialog from './dialog/index'
import GInput from './input/index'
import GSwitch from './switch/index'
import GRadio from "./radio/index"
import GRadioButton from "./radio-button/index"
import GRadioGroup from './radio-group/index'
import GCheckbox from './checkbox/index'
import GCheckboxButton from './checkbox-button/index'
import GCheckboxGroup from './checkbox-group/index'
import GForm from './form/index'
import GFormItem from './form-item/index'
import GTag from './tag/index'
import GTooltip from './tooltip/index'
import GBadge from './badge/index'
import GPagination from './pagination/index'
import GSelect from './select/index'
import GOptionGroup from './option-group/index'
import GOption from './option/index'
import GTable from './table/index'
import GTableColumn from './table-column/index'
import GMenu from './menu/index'
import GMenuItem from './menu-item/index'
import GMenuItemGroup from './menu-item-group/index'
import GSubmenu from './submenu/index'
import GAlert from './alert/index'
import GLoading from './loading/index'
import GTree from './tree/index'
import GTabs from './tabs/index'
import GTabPane from './tab-pane/index'
import GMessage from './message/index'
import GMessageBox from './messageBox/index'
import GSteps from './steps/index'
import GStep from './step/index'
import GSlider from './slider/index'

// 储存组件列表
const components = [
    GButton,
    GDialog,
    GInput,
    GSwitch,
    GRadio,
    GRadioButton,
    GRadioGroup,
    GCheckbox,
    GCheckboxButton,
    GCheckboxGroup,
    GForm,
    GFormItem,
    GTag,
    GTooltip,
    GBadge,
    GPagination,
    GSelect,
    GOptionGroup,
    GOption,
    GTable,
    GTableColumn,
    GMenu,
    GMenuItem,
    GMenuItemGroup,
    GSubmenu,
    GAlert,
    GTree,
    GTabs,
    GTabPane,
    GSteps,
    GStep,
    GSlider,
    // GMessageBox
]

// 定义 install 方法，接受 Vue 作为参数。如果使用 use 注册插件，则所有组件都将被注册
const install = function (Vue) {
    // 遍历所有全局组件
    components.forEach(component => {
        Vue.component(component.name, component)
    })

    
    Vue.use(GLoading) // loading
    Vue.prototype.$message = GMessage // message
    Vue.prototype.$messagebox = GMessageBox // messageBox
    Vue.prototype.$confirm = GMessageBox.confirm
}

// 判断是否是直接引入文件，如果是，就不用调用 Vue.use()
if (typeof window !== 'undefined' && window.Vue) {
    install(window.Vue)
}

export default install