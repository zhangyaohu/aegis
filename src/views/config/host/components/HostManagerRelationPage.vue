<template>
  <detail-template>
    <template slot="header">
      <span class="detail-page__back el-icon-back" @click="$emit('close')">回到主机管理</span>
    </template>
		<template slot="body">
       <component :is="ctrlTab.ctrl" :param="ctrlTab.param"></component>
		</template>
  </detail-template>
</template>

<script>
import TemplatePage from '@/views/config/host/components/HostTemplatePage';
import HostMetricPage from '@/views/config/host/components/HostMetricPage';
export default {
	name: 'HostManagerRelationPage',
	components: {
		'host-template': TemplatePage,
		'metric': HostMetricPage
	},
	props: {
		param: {
			type: Object,
			default: () => {
				return {}
			}
		}
	},
	data() {
		return {
			ctrlTab: {
				ctrl:'',
				param: {}
			}
		}
	},
	mounted() {
		let _this = this;
		debugger
		_this.ctrlTab.ctrl = _this.param.operate;
		delete _this.param.operate;
		_this.ctrlTab.param = _this.param;
	}
}
</script>