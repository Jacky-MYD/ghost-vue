<style lang="scss" scoped>
    .g-button, .g-tag {
        margin: 10px!important;
    }
    
</style>>
<style lang="scss">
    /* .item .g-button {
        margin: 0!important;
        margin-left: 30px!important;
    } */
    .table {
        margin: auto;
        width: 820px;
    }
    .box {
        margin: 50px auto;
        width: 500px;
    }
    .top {
        text-align: center;
    }

    .left {
        float: left;
        width: 80px;
    }

    .right {
        float: right;
        width: 80px;
    }

    .bottom {
        clear: both;
        text-align: center;
    }

    .item {
        margin: 4px;
    }

    .left .g-tooltip__popper,
    .right .g-tooltip__popper {
        padding: 8px 10px;
    }
    .content {
        /* position: relative; */
        display: inline-block;
        margin: auto 20px;
        width: 300px;
        height: 200px;
        border: 1px solid #cccccc;
    }
</style>
<template>
    <div id="app">
        <!-- <div class="button">
            <g-button>按钮</g-button>
            <g-button type="primary">按钮</g-button>
            <g-button type="success">按钮</g-button>
            <g-button type="info">按钮</g-button>
            <g-button type="warning">按钮</g-button>
            <g-button type="danger">按钮</g-button>
            <br><br>
            <g-button icon="g-icon-close" plain>按钮</g-button>
            <g-button type="primary" icon="g-icon-close" plain>按钮</g-button>
            <g-button type="success" icon="g-icon-close" plain>按钮</g-button>
            <g-button type="info" icon="g-icon-close" plain>按钮</g-button>
            <g-button type="warning" icon="g-icon-close" plain>按钮</g-button>
            <g-button type="danger" icon="g-icon-close" plain>按钮</g-button>
            <br><br>
            <g-button round>按钮</g-button>
            <g-button type="primary" round>按钮</g-button>
            <g-button type="success" round>按钮</g-button>
            <g-button type="info" round>按钮</g-button>
            <g-button type="warning" round>按钮</g-button>
            <g-button type="danger" round>按钮</g-button>
            <br><br>
            <g-button icon="g-icon-close" plain round>按钮</g-button>
            <g-button type="primary" icon="g-icon-close" plain size="medium" round>按钮</g-button>
            <g-button type="success" icon="g-icon-close" plain size="small" round>按钮</g-button>
            <g-button type="info" icon="g-icon-close" plain size="small" round>按钮</g-button>
            <g-button type="warning" icon="g-icon-close" plain size="mini" round>按钮</g-button>
            <g-button type="danger" icon="g-icon-close" plain round>按钮</g-button>
            <br><br>            
            <g-button disabled>按钮</g-button>
            <g-button type="primary" disabled>按钮</g-button>
            <g-button type="success" disabled>按钮</g-button>
            <g-button type="info" disabled>按钮</g-button>
            <g-button type="warning" disabled>按钮</g-button>
            <g-button type="danger" disabled :custom="custom">按钮</g-button>
            <br><br> 
            <g-button plain disabled>按钮</g-button>
            <g-button type="primary" size="medium" plain disabled>按钮</g-button>
            <g-button type="success" size="small" plain disabled>按钮</g-button>
            <g-button type="info" size="small" plain disabled>按钮</g-button>
            <g-button type="warning" size="mini" plain disabled>按钮</g-button>
            <g-button type="danger" plain disabled>按钮</g-button>

            <br><br>            
            <g-button disabled circle>按</g-button>
            <g-button type="primary" disabled circle>按</g-button>
            <g-button type="success" disabled circle>按</g-button>
            <g-button type="warning" disabled circle>按</g-button>
            <g-button type="danger" disabled circle>按</g-button>
            <br><br> 
            <g-button plain disabled circle>按</g-button>
            <g-button type="primary" size="medium" plain disabled circle>按</g-button>
            <g-button type="success" size="small" plain disabled circle>按</g-button>
            <g-button type="warning" size="mini" plain disabled circle>按</g-button>
            <g-button type="danger" plain disabled circle>按</g-button>
        </div> -->
        <!--------------------------------- radio -------------------------------------->
        <!-- <div class="radio">
            <g-radio label="1" v-model="gender" disabled>男</g-radio>
            <g-radio label="0" v-model="gender" disabled>女</g-radio>
            <br><br>
            <g-radio-group v-model="gender">
                <g-radio label="1" disabled>男</g-radio>
                <g-radio label="0">女</g-radio>
            </g-radio-group>
            <br><br>
            <g-radio-group v-model="gender">
                <g-radio label="1" border>男阿斯顿</g-radio>
                <g-radio label="0" border>女</g-radio>
            </g-radio-group>
            <br><br>
            <g-radio-group v-model="gender" size="small">
                <g-radio label="1" border>男阿斯顿</g-radio>
                <g-radio label="0" border>男阿斯顿</g-radio>
                <g-radio label="1" border>男阿斯顿</g-radio>
            </g-radio-group>
            <br><br>
            <g-radio label="1" v-model="gender" border disabled>男阿斯顿</g-radio>
            <g-radio label="0" v-model="gender" border size="medium" disabled>男阿斯顿</g-radio>
            <g-radio label="1" v-model="gender" border size="small" disabled>男阿斯顿</g-radio>
            <g-radio label="0" v-model="gender" border size="mini" disabled>男阿斯顿</g-radio>
            <br><br>
        </div> -->
        <!--------------------------------- radio-button -------------------------------------->
        <!-- <br><br> -->
        <!-- <div class="radio-button">
            <g-radio-group v-model="radio1">
                <g-radio-button label="按钮1"></g-radio-button>
                <g-radio-button label="按钮2"></g-radio-button>
                <g-radio-button label="按钮3"></g-radio-button>
            </g-radio-group>
            <br><br>
            <g-radio-group v-model="radio1" size="medium">
                <g-radio-button label="按钮1"></g-radio-button>
                <g-radio-button label="按钮2"></g-radio-button>
                <g-radio-button label="按钮3"></g-radio-button>
            </g-radio-group>
            <br><br>
            <g-radio-group v-model="radio1" size="small">
                <g-radio-button label="按钮1" disabled></g-radio-button>
                <g-radio-button label="按钮2" disabled></g-radio-button>
                <g-radio-button label="按钮3"></g-radio-button>
            </g-radio-group>
            <br><br>
            <g-radio-group v-model="radio1" size="mini" disabled>
                <g-radio-button label="按钮1"></g-radio-button>
                <g-radio-button label="按钮2"></g-radio-button>
                <g-radio-button label="按钮3"></g-radio-button>
            </g-radio-group>
        </div> -->
        <!-- <br><br> -->
        <!--------------------------------- checkbox -------------------------------------->
        <!-- <div class="checkbox">
            <g-checkbox label="1" v-model="active" border size="small" disabled>男</g-checkbox>
            <g-checkbox label="1" v-model="active1" disabled border size="mini">男</g-checkbox>
            <g-checkbox label="1" v-model="active1" border size="mini">男</g-checkbox>
            <br><br>
            <g-checkbox label="1" v-model="active" border size="small">男</g-checkbox>
            <g-checkbox label="1" v-model="active1" border size="mini">男</g-checkbox>
            <g-checkbox label="1" v-model="active1" border size="mini">男</g-checkbox>
            <br><br>
            <g-checkbox-group v-model="hobby">
                <g-checkbox label="抽烟" border></g-checkbox>
                <g-checkbox label="喝酒" disabled></g-checkbox>
                <g-checkbox label="汤头"></g-checkbox>
            </g-checkbox-group>
            <br><br>
            <g-checkbox-group v-model="hobby" size="medium">
                <g-checkbox label="抽烟" border></g-checkbox>
                <g-checkbox label="喝酒" disabled></g-checkbox>
                <g-checkbox label="汤头"></g-checkbox>
            </g-checkbox-group>
            <br><br>
            <g-checkbox-group v-model="hobby" size="small">
                <g-checkbox label="抽烟" border disabled></g-checkbox>
                <g-checkbox label="喝酒" disabled></g-checkbox>
                <g-checkbox label="汤头"></g-checkbox>
            </g-checkbox-group>
            <br><br>
            <g-checkbox-group v-model="hobby" size="mini">
                <g-checkbox label="抽烟" border></g-checkbox>
                <g-checkbox label="喝酒" disabled></g-checkbox>
                <g-checkbox label="汤头"></g-checkbox>
            </g-checkbox-group>
        </div> -->
        <!--------------------------------- checkbox-button -------------------------------------->
        <!-- <div class="checkbox-button">
            <br><br>
            <g-checkbox-group v-model="hobby" disabled>
                <g-checkbox-button label="抽烟"></g-checkbox-button>
                <g-checkbox-button label="喝酒" disabled></g-checkbox-button>
                <g-checkbox-button label="汤头" disabled></g-checkbox-button>
                <g-checkbox-button label="蹦迪"></g-checkbox-button>
                <g-checkbox-button label="撩妹"></g-checkbox-button>
            </g-checkbox-group>
            <br><br>
            <g-checkbox-group v-model="hobby" size="medium">
                <g-checkbox-button label="抽烟"></g-checkbox-button>
                <g-checkbox-button label="喝酒" disabled></g-checkbox-button>
                <g-checkbox-button label="汤头" disabled></g-checkbox-button>
                <g-checkbox-button label="蹦迪"></g-checkbox-button>
                <g-checkbox-button label="撩妹"></g-checkbox-button>
            </g-checkbox-group>
            <br><br>
            <g-checkbox-group v-model="hobby" size="small">
                <g-checkbox-button label="抽烟"></g-checkbox-button>
                <g-checkbox-button label="喝酒" disabled></g-checkbox-button>
                <g-checkbox-button label="汤头" disabled></g-checkbox-button>
                <g-checkbox-button label="蹦迪"></g-checkbox-button>
                <g-checkbox-button label="撩妹"></g-checkbox-button>
            </g-checkbox-group>
            <br><br>
            <g-checkbox-group v-model="hobby" size="mini">
                <g-checkbox-button label="抽烟"></g-checkbox-button>
                <g-checkbox-button label="喝酒" disabled></g-checkbox-button>
                <g-checkbox-button label="汤头" disabled></g-checkbox-button>
                <g-checkbox-button label="蹦迪"></g-checkbox-button>
                <g-checkbox-button label="撩妹"></g-checkbox-button>
            </g-checkbox-group>
        </div> -->
        <!-- <br><br> -->
        <!--------------------------------- input-text -------------------------------------->
        <!-- <div class="input">
            <g-input placeholder="请输入用户名" type="text" name="username" v-model="username" clearable width="150px"></g-input>
            <br><br>
            <g-input placeholder="请输入用户名" type="password" name="username" size="medium" v-model="username" show-password></g-input>
            <br><br>
            <g-input placeholder="请输入用户名" type="text" name="username" size="small" v-model="username" readonly></g-input>
            <br><br>
            <g-input placeholder="请输入用户名" type="text" name="username" size="mini" v-model="username" readonly></g-input>
            <br><br>
            <g-input width="250px">
                <template slot="prepend">Http://</template>
            </g-input>
            <br><br>
            <g-input size="medium">
                <template slot="prepend">
                    <i  class="g-icon-circle-close"></i>
                </template>
            </g-input>
            <br><br>
            <g-input size="small">
                <template slot="append">.com</template>
            </g-input>
            <br><br>
            <g-input disabled size="mini">
                <template slot="prepend">Http://</template>
                <template slot="append">.com</template>
            </g-input>
            <br><br>
            <g-input placeholder="请输入用户名" type="text" name="username" v-model="username" size="small" prefix-icon="g-icon-circle-close"></g-input>
            <br><br>
            <g-input placeholder="请输入用户名" type="text" name="username" v-model="username" suffix-icon="g-icon-circle-close"></g-input>
            <br><br>
            <g-input placeholder="请输入用户名" type="text" name="username" v-model="username">
                <i slot="prefix" class="g-icon-circle-close"></i>
            </g-input>
            <br><br>
            <g-input placeholder="请输入用户名" type="text" name="username" v-model="username">
                <i slot="suffix" class="g-icon-circle-close"></i>
            </g-input>
        </div> -->
        <!--------------------------------- input-textarea -------------------------------------->
        <!-- <div class="textarea">
            <br><br>
            <g-input placeholder="请输入内容" type="textarea" :autosize="{minRows: 1, maxRows: 2 }" resize="none" :maxlength="10" showWordLimit v-model="username"></g-input>
        </div> -->
        <!--------------------------------- tag -------------------------------------->
        <!-- <div class="tag">
            <br><br>
            <g-tag >标签一</g-tag>
            <g-tag size="medium">标签一</g-tag>
            <g-tag size="small">标签一</g-tag>
            <g-tag size="mini">标签一</g-tag>
            <br><br>
            <g-tag >标签一</g-tag>
            <g-tag type="primary">标签一</g-tag>
            <g-tag type="success">标签一</g-tag>
            <g-tag type="warning">标签一</g-tag>
            <g-tag type="danger" noborder>标签一</g-tag>
            <g-tag type="info">标签一</g-tag>
            <g-tag :custom="tagCustom">自定义</g-tag>
            <br><br>
            <g-tag closable>可关闭</g-tag>
            <g-tag type="primary" closable>标签一</g-tag>
            <g-tag type="success" closable size="medium">标签一</g-tag>
            <g-tag type="warning" closable size="small">标签一</g-tag>
            <g-tag type="danger" closable size="mini">标签一</g-tag>
        </div> -->
        <!--------------------------------- form -------------------------------------->
        <!-- <div class="form">
            <br><br>
            <g-form :model="model" labg-width="100px" size="small">
                <g-form-item label="用户名">
                    <g-input placeholder="请输入用户名" v-model="model.username"></g-input>
                </g-form-item>
                <g-form-item label="密码" size="mini">
                    <g-input type="password" placeholder="请输入密码" v-model="model.password"></g-input>
                </g-form-item>
                <g-form-item label="选择">
                    <g-switch v-model="model.active"></g-switch>
                </g-form-item>
            </g-form>
        </div> -->
        <!--------------------------------- switch -------------------------------------->
        <!-- <div class="switch">
            <g-switch v-model="active" @change="change"></g-switch>
            <br><br>
            <g-switch v-model="active" inactive-text="左标签" active-text="右标签" active-color="#13ce66" inactive-color="red" name="username"></g-switch>
        </div> -->
        <!--------------------------------- tooltip -------------------------------------->
        <!-- <div style="width: 500px; margin: 50px auto;">
            <div class="top">
                <g-tooltip class="item" effect="dark" content="Top Left 提示文字" placement="top-start">
                    <g-button>上左</g-button>
                </g-tooltip>
                <g-tooltip class="item" effect="dark" content="Top Center 提示文字" placement="top">
                    <g-button>上边</g-button>
                </g-tooltip>
                <g-tooltip class="item" effect="dark" content="Top Right 提示文字" placement="top-end">
                    <g-button>上右</g-button>
                </g-tooltip>
                <g-tooltip content="Right Top 提示文字" placement="top">
                    <g-button class="g-slider__button">23234</g-button>
                </g-tooltip>
            </div>
            <div class="left">
                <g-tooltip class="item" effect="dark" content="Left Top 提示文字" placement="left-start">
                    <g-button>左上</g-button>
                </g-tooltip>
                <g-tooltip class="item" effect="dark"  content="Left Center 提示文字" placement="left">
                    <g-button>左边</g-button>
                </g-tooltip>
                <g-tooltip class="item" effect="dark" content="Left Bottom 提示文字" placement="left-end">
                    <g-button>左下</g-button>
                </g-tooltip>
            </div>

            <div class="right">
                <g-tooltip class="item" effect="dark" content="Right Top 提示文字" placement="right-start">
                    <g-button>右上</g-button>
                </g-tooltip>
                <g-tooltip class="item" effect="dark"  content="Right Center 提示文字" placement="right">
                    <g-button>右边</g-button>
                </g-tooltip>
                <g-tooltip class="item" effect="dark" content="Right Bottom 提示文字" placement="right-end">
                    <g-button>右下</g-button>
                </g-tooltip>
            </div>
            <div class="bottom">
                <g-tooltip class="item" effect="dark"  content="Bottom Left 提示文字" placement="bottom-start">
                    <g-button>下左</g-button>
                </g-tooltip>
                <g-tooltip class="item" effect="dark" content="Bottom Ce阿双方的客户阿手机壳撒回复卡就是电饭煲击杀白癜风撒娇哭的好办法就仨复合地板寄卡收费寄卡扫黄打非nter 提示文字" placement="bottom">
                    <g-button>下边</g-button>
                </g-tooltip>
                <g-tooltip class="item" effect="dark" content="Bottom Right 提示文字" placement="bottom-end">
                    <g-button>下右</g-button>
                </g-tooltip>
            </div>
        </div> -->
        <!--------------------------------- badge -------------------------------------->
        <!-- <br><br>
        <div class="badge">
            <g-badge :value="12" class="item">
                <g-button size="small">评论</g-button>
            </g-badge>
            <g-badge :value="3" class="item">
                <g-button size="small">回复</g-button>
            </g-badge>
            <g-badge :value="200" :max="99" type="primary" class="item">
                <g-button size="small">回复</g-button>
            </g-badge>
            <g-badge :value="100" :max="10" type="warning" class="item">
                <g-button size="small">回复</g-button>
            </g-badge>

            <g-badge value="new" class="item">
                <g-button size="small">评论</g-button>
            </g-badge>
            <g-badge value="hot" class="item">
                <g-button size="small">回复</g-button>
            </g-badge>

            <g-badge is-dot class="item" style="margin-left: 30px">数据查询</g-badge>
            <g-badge is-dot class="item" hidden>
                <g-button class="share-button" icon="g-icon-close" type="primary"></g-button>
            </g-badge>
        </div> -->
        <!--------------------------------- select -------------------------------------->
         <br><br>
        <div class="select">
            <!-- <g-select v-model="value" placeholder="请选择" @change="selectChange">
                <g-option
                    v-for="(item, index) in options"
                    :key="index"
                    :value="item.value"
                    :label="item.label"
                    :disabled="item.disabled"></g-option>
            </g-select> -->
            <!--<br><br>
            <g-select v-model="value" width="300px" size="small" placeholder="请选择"></g-select>
            <br><br>
            <g-select v-model="value" disabled placeholder="请选择"></g-select>
            <br><br>
            <g-select v-model="value" placeholder="请选择" clearable filterable></g-select>
            <br><br>
            <g-select v-model="value" placeholder="请选择" multiple></g-select>
            <br><br>
            <g-select v-model="value" placeholder="请选择">
                <g-option-group v-for="(optionsItem, ind) in optionGroup" :key="ind" :label="optionsItem.label">
                    <g-option
                        v-for="(item, index) in optionsItem.options"
                        :key="index"
                        :value="item.value"
                        :label="item.label"
                        :disabled="item.disabled"></g-option>
                </g-option-group>
            </g-select>
            <br><br>
            <g-select v-model="value1" placeholder="请选择" multiple>
                <g-option
                    v-for="(item, index) in options"
                    :key="index"
                    :value="item.value"
                    :label="item.label"
                    :disabled="item.disabled"></g-option>
            </g-select>
            <br><br>
            <g-select v-model="value1" filterable placeholder="请选择">
                <g-option
                    v-for="(item, index) in options"
                    :key="index"
                    :value="item.value"
                    :label="item.label"
                    :disabled="item.disabled"></g-option>
            </g-select>-->
        </div> 
        <!--------------------------------- pagination -------------------------------------->
        <!-- <div class="pagination">
            <g-pagination
                :current-page="currentPage4"
                :page-sizes="[10, 20, 30, 100, 200, 300, 400]"
                :page-size="10"
                :hideOnSinglePage="false"
                layout="total, sizes, prev, pager, next, jumper"
                :total="100">
            </g-pagination>
            <g-pagination
                :current-page="currentPage4"
                :page-sizes="[10, 20, 30, 100, 200, 300, 400]"
                :page-size="10"
                :hideOnSinglePage="false"
                background
                layout="total, sizes, prev, pager, next, jumper"
                :total="100">
            </g-pagination>
            <g-pagination
                :current-page="currentPage4"
                :page-sizes="[10, 20, 30, 100, 200, 300, 400]"
                :page-size="10"
                :hideOnSinglePage="false"
                :customStyleObj="customStyle"
                layout="total, sizes, prev, pager, next, jumper"
                :total="100">
            </g-pagination>
        </div> -->
        <!--------------------------------- dialog -------------------------------------->
        <!-- <div class="dialog">
            <g-button type="primary" @click="visible=true">显示dialog</g-button>
            <g-dialog title="温馨提示" width="30%" top="100px" :visible.sync="visible">
                <span>这是一段信息</span>
                <template v-slot:footer>
                    <g-button @click="visible=false">取消</g-button>
                    <g-button type="primary" @click="visible=false">确定</g-button>
                </template>
            </g-dialog>

            <g-dialog width="30%" top="100px" :visible.sync="visible">
                <template v-slot:title>
                    <h3>我是标题</h3>
                </template>
            </g-dialog>
        </div> -->
        <!--------------------------------- table -------------------------------------->
        <!-- <div class="table">
            <g-table :data="tableData" max-height="250" stripe empty-text="暂无数据" size="mini">
                <g-table-column fixed prop="date" label="日期" width="150"> </g-table-column>
                <g-table-column prop="name" label="姓名" width="120"> </g-table-column>
                <g-table-column prop="province" label="省份" width="120"> </g-table-column>
                <g-table-column prop="city" label="市区" width="120"> </g-table-column>
                <g-table-column prop="address" label="地址" width="300"> </g-table-column>
                <g-table-column prop="zip" label="邮编" width="120"> </g-table-column>
                <g-table-column fixed="right"  label="操作" width="120">
                    <template slot-scope="scope">
                        <g-button
                            @click.native.prevent="deleteRow(scope.$index, tableData)"
                            type="text"
                            size="mini">
                            移除
                        </g-button>
                    </template>
                </g-table-column>
            </g-table>
            <br><br>
            <g-table :data="tableData" max-height="250" stripe size="small">
                <g-table-column prop="date" label="日期" width="180px"></g-table-column>
                <g-table-column prop="name" label="姓名" width="180"></g-table-column>
                <g-table-column prop="address" label="地址" width="380"></g-table-column>
            </g-table>
            <br><br>
            <g-table :data="tableData" max-height="250" stripe size="mini">
                <g-table-column prop="date" label="日期" width="180px"></g-table-column>
                <g-table-column prop="name" label="姓名" width="180"></g-table-column>
                <g-table-column prop="address" label="地址" width="380"></g-table-column>
            </g-table>
        </div> -->
        <!--------------------------------- menu -------------------------------------->
        <br><br>
        <!-- <g-button @click="isCollapse=false">展开</g-button>
        <g-button type="primary" @click="isCollapse=true">收取</g-button>
        <div class="menu" style="display: flex;">
            <g-menu :default-active="activeIndex" class="g-menu-demo" mode="horizontal" @select="handleSelect" width="500px">
                <g-menu-item index="1">处理中心</g-menu-item>
                <g-submenu index="2">
                    <template slot="title">我的工作台</template>
                    <g-menu-item index="2-1">选项1</g-menu-item>
                    <g-menu-item index="2-2">选项2</g-menu-item>
                    <g-menu-item index="2-3">选项3</g-menu-item>
                    <g-submenu index="2-4">
                        <template slot="title">选项4</template>
                        <g-menu-item index="2-4-1">选项1</g-menu-item>
                        <g-menu-item index="2-4-2">选项2</g-menu-item>
                        <g-menu-item index="2-4-3">选项3</g-menu-item>
                    </g-submenu>
                </g-submenu>
                <g-menu-item index="3" disabled>消息中心</g-menu-item>
                <g-menu-item index="4">订单管理</g-menu-item>
            </g-menu>
            <br><br>
            <g-menu :default-active="activeIndex" class="g-menu-demo" mode="horizontal" @select="handleSelect" 
                width="500px"
                background-color="#545c64"
                text-color="#fff"
                active-text-color="#ffd04b">
                <g-menu-item index="1">处理中心</g-menu-item>
                <g-submenu index="2">
                    <template slot="title">我的工作台</template>
                    <g-menu-item index="2-1">选项1</g-menu-item>
                    <g-menu-item index="2-2" disabled>选项2</g-menu-item>
                    <g-menu-item index="2-3">选项3</g-menu-item>
                    <g-submenu index="2-4">
                        <template slot="title">选项4</template>
                        <g-menu-item index="2-4-1">选项1</g-menu-item>
                        <g-menu-item index="2-4-2">选项2</g-menu-item>
                        <g-menu-item index="2-4-3">选项3</g-menu-item>
                    </g-submenu>
                </g-submenu>
                <g-menu-item index="3" disabled>消息中心</g-menu-item>
                <g-menu-item index="4">订单管理</g-menu-item>
            </g-menu>
            <br><br>
            <g-menu
                width="500px"
                default-active="1-1"
                class="g-menu-vertical-demo"
                @open="handleOpen"
                @close="handleClose">
                <g-submenu index="1">
                    <template slot="title">
                        <i class="g-icon-view"></i>
                        <span>导航一</span>
                    </template>
                    <g-menu-item-group>
                        <template slot="title">分组一</template>
                        <g-menu-item index="1-1">选项1</g-menu-item>
                        <g-menu-item index="1-2">选项2</g-menu-item>
                    </g-menu-item-group>
                    <g-menu-item-group title="分组2">
                        <g-menu-item index="1-3">选项3</g-menu-item>
                    </g-menu-item-group>
                    <g-submenu index="1-4">
                        <template slot="title">选项4</template>
                        <g-menu-item index="1-4-1">选项1</g-menu-item>
                    </g-submenu>
                </g-submenu>
                <g-menu-item index="2">
                    <i class="g-icon-arrow-right"></i>
                    <span slot="title">导航二</span>
                </g-menu-item>
                <g-menu-item index="3" disabled>
                    <i class="g-icon-arrow-left"></i>
                    <span slot="title">导航三</span>
                </g-menu-item>
                <g-menu-item index="4">
                    <i class="g-icon-arrow-up"></i>
                    <span slot="title">导航四</span>
                </g-menu-item>
            </g-menu>
            <br><br>
            <g-menu
                width="500px"
                default-active="2"
                class="g-menu-vertical-demo"
                background-color="#545c64"
                text-color="#fff"
                :collapse="isCollapse"
                active-text-color="#ffd04b"
                @open="handleOpen"
                @close="handleClose">
                <g-submenu index="1">
                    <template slot="title">
                        <i class="g-icon-view"></i>
                        <span>导航一</span>
                    </template>
                    <g-menu-item-group>
                        <template slot="title">分组一</template>
                        <g-menu-item index="1-1">选项1</g-menu-item>
                        <g-menu-item index="1-2">选项2</g-menu-item>
                    </g-menu-item-group>
                    <g-menu-item-group title="分组2">
                        <g-menu-item index="1-3">选项3</g-menu-item>
                    </g-menu-item-group>
                    <g-submenu index="1-4">
                        <template slot="title">选项4</template>
                        <g-menu-item index="1-4-1">选项1</g-menu-item>
                    </g-submenu>
                </g-submenu>
                <g-menu-item index="2">
                    <i class="g-icon-arrow-right"></i>
                    <span slot="title">导航二</span>
                </g-menu-item>
                <g-menu-item index="3" disabled>
                    <i class="g-icon-arrow-left"></i>
                    <span slot="title">导航三</span>
                </g-menu-item>
                <g-menu-item index="4">
                    <i class="g-icon-arrow-up"></i>
                    <span slot="title">导航四</span>
                </g-menu-item>
            </g-menu>
        </div> -->
        <!--------------------------------- alert -------------------------------------->
        <!-- <div class="alert">
            <g-alert title="成功提示的文案" type="success" showIcon></g-alert>
            <br>
            <g-alert title="消息提示的文案" type="info" align="center" closeText="关闭" showIcon showClose></g-alert>
            <br>
            <g-alert title="警告提示的文案" type="warning" align="right" showIcon showClose></g-alert>
            <br>
            <g-alert title="错误提示的文案" type="error" align="right" showIcon></g-alert>
            <br>

            <g-alert type="success" showIcon showClose>
                <span slot="title">我是标题</span>
                <span>我是描述</span>
            </g-alert>
            <br><br>
            <g-alert type="error" showIcon align="right" description="21312">
                <span slot="title">我是标题</span>
            </g-alert>
            <br><br>
            <g-alert type="warning" showIcon align="right" showClose>
                <span slot="title">我是标题1</span>
                <span>我是描述1</span>
            </g-alert>
        </div> -->
        <!--------------------------------- loading -------------------------------------->
        <!-- <div class="loading" style="display: flex;">
            <g-button type=primary @click="show">show Loading</g-button>
            <span class="content" v-loading="showLoading" g-loading-text="玩命加载" g-loading-className="myLoading">
                1111
            </span>
            <span class="content" v-loading="showLoading" g-loading-text="加载中" :staticIcon="true" g-loading-customIcon="g-icon-info">
                222
            </span>

            <span class="content" v-loading="showLoading" g-loading-text="加载中" :staticIcon="true" g-loading-customIcon="g-icon-info" g-loading-background="rgba(0,0,0,.3)">
                333
            </span>

            <span class="content" v-loading.body.lock="showLoading" g-loading-text="拼命加载"></span>
            
        </div> -->
        <!--------------------------------- tree -------------------------------------->
        <!-- <div class="tree">
            <g-tree 
                :data="treeData" 
                showCheckbox 
                node-key="id"
                :default-expanded-keys="[2, 3]"
                :default-checked-keys="[5]"
                :props="defaultProps"
                @node-click="nodeClick"
                @node-collapse="nodeCollapse"
                @node-expand="nodeExpand"
                @check-change="checkChange"
                @check="check"></g-tree>
            <br><br>
            <g-tree 
                :data="treeData" 
                showCheckbox 
                node-key="id"
                :default-expanded-keys="[2, 3]"
                :default-checked-keys="[5, 6, 8]"
                :props="defaultProps" 
                iconType="square"></g-tree>
        </div> -->
        <!--------------------------------- message -------------------------------------->
        <!-- <div class="message">
            <g-button type="primary" @click="open">message</g-button>
            <g-button :plain="true" @click="open1">消息</g-button>
            <g-button :plain="true" @click="open2">成功</g-button>
            <g-button :plain="true" @click="open3">警告</g-button>
            <g-button :plain="true" @click="open4">错误</g-button>
            <g-button :plain="true" @click="openHTML">使用 HTML 片段</g-button>
        </div> -->
        <!--------------------------------- tabs -------------------------------------->
        <!-- <div class="tabs" style="width: 600px; margin: auto;" >
            <g-tabs v-model="activeName" @tab-click="handleClick" tabPosition="top" type="border-card">
                <g-tab-pane label="用户管理" name="first"></g-tab-pane>
                <g-tab-pane label="配置管理" name="second"><span>配置管理</span></g-tab-pane>
                <g-tab-pane label="角色管理" name="third">角色管理</g-tab-pane>
                <g-tab-pane label="定时任务补偿" name="fourth">定时任务补偿</g-tab-pane>
                <g-tab-pane name="five">
                    <span slot="label"><i class="g-icon-close"></i> 我的行程</span>
                    我的行程
                </g-tab-pane>
            </g-tabs>
            <br>
            <g-tabs v-model="activeName" @tab-click="handleClick" tabPosition="bottom" type="border-card">
                <g-tab-pane label="用户管理" name="first"></g-tab-pane>
                <g-tab-pane label="配置管理" name="second"><span>配置管理</span></g-tab-pane>
                <g-tab-pane label="角色管理" name="third">角色管理</g-tab-pane>
                <g-tab-pane label="定时任务补偿" name="fourth">定时任务补偿</g-tab-pane>
            </g-tabs>
            <br>
            <g-tabs v-model="activeName" @tab-click="handleClick" tabPosition="right" type="border-card">
                <g-tab-pane label="用户管理" name="first"></g-tab-pane>
                <g-tab-pane label="配置管理" name="second"><span>配置管理</span></g-tab-pane>
                <g-tab-pane label="角色管理" name="third">角色管理</g-tab-pane>
                <g-tab-pane label="定时任务补偿" name="fourth">定时任务补偿</g-tab-pane>
            </g-tabs>
            <br>
            <g-tabs v-model="activeName" @tab-click="handleClick" tabPosition="left" type="border-card">
                <g-tab-pane label="用户管理" name="first"></g-tab-pane>
                <g-tab-pane label="配置管理" name="second"><span>配置管理</span></g-tab-pane>
                <g-tab-pane label="角色管理" name="third">角色管理</g-tab-pane>
                <g-tab-pane label="定时任务补偿" name="fourth">定时任务补偿</g-tab-pane>
            </g-tabs>
            <br>
            <g-tabs v-model="activeName" @tab-click="handleClick" tabPosition="right">
                <g-tab-pane label="用户管理" name="first"></g-tab-pane>
                <g-tab-pane label="配置管理" name="second"><span>配置管理</span></g-tab-pane>
                <g-tab-pane label="角色管理" name="third">角色管理</g-tab-pane>
                <g-tab-pane label="定时任务补偿" name="fourth">定时任务补偿</g-tab-pane>
            </g-tabs>
        </div> -->
        <!--------------------------------- messagebox -------------------------------------->
        <!-- <div class="messagebox">
            <g-button type="primary" @click="openbox">messagebox</g-button>
        </div> -->
        
        <!--------------------------------- step -------------------------------------->
        <!-- <div class="steps" style="width: 800px; height: 300px; margin: auto;">
            <g-steps alignCenter finishStatus="success" :active="active">
                <g-step title="步骤 1"></g-step>
                <g-step title="步骤 2" description="我是步骤二，我是步骤二"></g-step>
                <g-step title="步骤 3"></g-step>
            </g-steps>
            <br><br>
            <g-steps alignCenter :active="active" @change="stepChange" direction="vertical">
                <g-step title="步骤 1"></g-step>
                <g-step title="步骤 2" description="我是步骤二，我是步骤二"></g-step>
                <g-step title="步骤 3"></g-step>
            </g-steps>
            <br><br>
            <g-button @click="next">下一步</g-button>
        </div> -->
        <br><br>
        <div class="slider" style="width: 500px; margin: 50px auto;">
            <div class="block" >
                <g-slider v-model="slider" :step="10" showStops></g-slider>
            </div>
            <br><br>
            <div class="block" >
                <g-slider v-model="slider" :step="10" :showTooltip="false" :marks="marks"></g-slider>
            </div>
            <!-- <div class="block" style="height: 500px;">
                <g-slider v-model="slider" height="200px" disabled vertical></g-slider>
            </div> -->
        </div>
        
    </div>
</template>

<script>
export default {
    data() {
        return {
            slider: 20,
            aa: 1,
            custom: {
                'background': 'red',
                'color': 'green',
                'font-size': '20px'
            },
            gender: '0',
            radio1: '按钮2',
            // active: false,
            active1: true,
            hobby: ['抽烟', '汤头'],
            username: 'Jacky is a man',
            model: {
                username: 'Jacky',
                password: '123',
                active: true
            },
            tagCustom: {
                'background': '#fff',
                'color': 'green',
            },
            value: '',
            options: [
                {
                    value: 1,
                    label: '北京'
                },
                {
                    value: 2,
                    label: '上海',
                    disabled: true
                },
                {
                    value: 3,
                    label: '广州'
                },
                {
                    value: 4,
                    label: '深圳'
                },
                {
                    value: 5,
                    label: '杭州'
                }
            ],
            optionGroup: [
                {
                    label: '热门城市',
                    options: [
                        {
                            value: 'Shanghai',
                            label: '上海'
                        },
                        {
                            value: 'Beijing',
                            label: '北京'
                        }
                    ]
                },
                {
                    label: '城市名',
                    options: [
                        {
                            value: 1,
                            label: '北京'
                        },
                        {
                            value: 2,
                            label: '上海',
                            disabled: true
                        },
                        {
                            value: 3,
                            label: '广州'
                        },
                        {
                            value: 4,
                            label: '深圳'
                        },
                        {
                            value: 5,
                            label: '杭州'
                        }
                    ]
                }
            ],
            value1: [],
            currentPage4: 5,
            customStyle: {
                'background-color': 'red',
                'color': 'white' 
            },
            visible: false,
            tableData1: [],
            tableData: [{
                date: '2016-05-03',
                name: '王小虎',
                province: '上海',
                city: '普陀区',
                address: '上海市普陀区金沙江路 1518 弄',
                zip: 200333
            }, {
                date: '2016-05-02',
                name: '王小虎',
                province: '上海',
                city: '普陀区',
                address: '上海市普陀区金沙江路 1518 弄',
                zip: 200333
            }, {
                date: '2016-05-04',
                name: '王小虎',
                province: '上海',
                city: '普陀区',
                address: '上海市普陀区金沙江路 1518 弄',
                zip: 200333
            }, {
                date: '2016-05-01',
                name: '王小虎',
                province: '上海',
                city: '普陀区',
                address: '上海市普陀区金沙江路 1518 弄',
                zip: 200333
            }, {
                date: '2016-05-08',
                name: '王小虎',
                province: '上海',
                city: '普陀区',
                address: '上海市普陀区金沙江路 1518 弄',
                zip: 200333
            }, {
                date: '2016-05-06',
                name: '王小虎',
                province: '上海',
                city: '普陀区',
                address: '上海市普陀区金沙江路 1518 弄',
                zip: 200333
            }, {
                date: '2016-05-07',
                name: '王小虎',
                province: '上海',
                city: '普陀区',
                address: '上海市普陀区金沙江路 1518 弄',
                zip: 200333
            }],
            activeIndex: '1',
            isCollapse: true,
            showLoading: false,
            treeData: [
                {
                    id: 1,
                    label: '一级 1',
                    children: [{
                        id: 4,
                        label: '二级 1-1',
                        children: [{
                            id: 9,
                            label: '三级 1-1-1'
                        }, {
                            id: 10,
                            label: '三级 1-1-2'
                        }]
                    }]
                }, 
                {
                    id: 2,
                    label: '一级 2',
                    children: [{
                        id: 5,
                        label: '二级 2-1'
                    }, {
                        id: 6,
                        label: '二级 2-2',
                        disabled: true
                    }]
                }, 
                {
                    id: 3,
                    label: '一级 3',
                    disabled: true,
                    children: [{
                        id: 7,
                        label: '二级 3-1'
                    }, {
                        id: 8,
                        label: '二级 3-2'
                    }]
                }],
            defaultProps: {
                children: 'children',
                label: 'label'
            },
            activeName: 'second',
            iconStyle: {
                'color': '#eba735'
            },
            active: 0,
            marks: {
                0: '0°C',
                8: '8°C',
                37: '37°C',
                50: {
                    style: {
                        color: '#1989FA',
                        fontWeight: 500
                    },
                    label: '50%'
                }
            }
        }
    },
    methods: {
        next() {
            if (this.active++ > 2) this.active = 0
        },
        selectChange(val) {
            console.log(val);
            console.log(22, this.value);
        },
        change(val) {
            console.log(213, val)
        },
        deleteRow(idx, data) {
            console.log(idx);
            console.log(data);
        },
        handleClose(key, keyPath) {
            console.log(key, keyPath);
        },
        handleSelect(key, keyPath, item) {
            console.log(key, keyPath, item);
        },
        handleOpen(key, keyPath) {
            console.log(key, keyPath);
        },
        show() {
            this.showLoading = true
            setTimeout(() => {
                this.showLoading = false
            }, 3000)
        },

        nodeClick(data, node, el) {
            // console.log(111, data);
            // console.log(222, node);
            // console.log(333, el);
        },

        nodeCollapse(data, node, el) {
            console.log(444, data);
            console.log(555, node);
            console.log(666, el);
        },

        nodeExpand(data, node, el) {
            console.log(777, data);
            console.log(888, node);
            console.log(999, el);
        },

        checkChange(data, checked, indeterminate) {
            // console.log(112, data);
            // console.log(113, checked);
            // console.log(114, indeterminate);
        },

        check(data, obj) {
            console.log(221, data);
            console.log(222, obj)
        },
    
        open() {
            // this.$message('字符串')
            // this.$message({
            //     message: '默认图标',
            //     type: 'success'
            // })
            // this.$message({
            //     message: '自定义图标',
            //     type: 'error',
            // })
            this.$message({
                message: '自定义图标',
                type: 'warning',
                showClose: true,
                duration: 100000,
                align: 'right'
            })
        },
        open1() {
            this.$message({
            message: '这是一条消息提示'
            });
        },

        open2() {
            this.$message({
            showClose: true,
            message: '恭喜你，这是一条成功消息',
            type: 'success'
            });
        },

        open3() {
            this.$message({
            showClose: true,
            message: '警告哦，这是一条警告消息',
            type: 'warning'
            });
        },

        open4() {
            this.$message({
            showClose: true,
            message: '错了哦，这是一条错误消息',
            type: 'error'
            });
        },
        openHTML() {
            this.$message({
                dangerouslyUseHTMLString: true,
                message: '<strong>这是 <i>HTML</i> 片段</strong>'
            });
        },

        handleClick(tab, ind, event) {
            // console.log(tab, ind, event);
            // console.log(this.activeName);
        },

        openbox() {
            // this.visible = true
            this.$messagebox({
                title: '我是标题',
                message: '我是内容',
                showClose: true,
                confirmText: '确定',
                cancelText: '取消',
                beforeClose: (action, instance, done) => {
                    // console.log(123, e)
                    if (action === 'confirm') {
                        instance.confirmText = '执行中...';
                        setTimeout(() => {
                            done();
                        }, 3000);
                    } else {
                        done()
                    }
                }
            }).then(action => {
                this.$message({
                    type: 'info',
                    message: 'action: ' + action
                });
            }).catch((action) => {
                this.$message({
                    type: 'info',
                    message: 'action: ' + action
                });
            })

            // this.$confirm('我是内容', '我是标题', {
            //     confirmText: '确定',
            //     cancelText: '取消',
            //     icon: 'g-icon-warning',
            //     iconStyle: this.iconStyle,
            //     showClose: true
            // }).then((res) => {
            //     this.$message({
            //         type: 'success',
            //         message: 'action: ' + res
            //     });
            // }).catch((action) => {
            //     this.$message({
            //         type: 'info',
            //         message: 'action: ' + action
            //     });
            // })
        },
        
        stepChange(newVal, oldVal) {
            console.log(111, newVal, oldVal);
        }
    }

}
</script>

<style lang="scss">

</style>
