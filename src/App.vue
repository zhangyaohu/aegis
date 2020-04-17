<template>
	<div class="app-container">
		<router-view/>
	</div>
</template>

<script>
import Vue from "vue";
import Input from "@/views/components/Input";
import Table from "@/views/components/table/Table";
import State from "@/views/components/state/State";
import Loading from '@/views/components/loading/Loading';
import DialogController from '@/views/dialog/Controller';
import PageTemplate from "@/views/components/PageTemplate";
import Pagination from '@/views/components/pagination/Pagination';
import DetailTemplate from '@/views/components/DetailPageTemplate';
import HelperTrigger from "@/views/components/tooltips/HelperTrigger";
//列表页面模板
Vue.component("page-template", PageTemplate);
//input组件模板
Vue.component("mh-input", Input);
//table组件模板
Vue.component("mh-table", Table);
//弹出框组件模板
Vue.component("dialog-controller", DialogController);
//帮助提示组件模板
Vue.component("helper-trigger", HelperTrigger);
//分页组件模板
Vue.component("pagination", Pagination);
//loading组件模板
Vue.component("Loading", Loading);
//状态组件模板
Vue.component("State", State);
//详情组件模板
Vue.component("detail-template", DetailTemplate)
export default {
	name:'App'
}
</script>

<style lang="less" scoped>

</style>