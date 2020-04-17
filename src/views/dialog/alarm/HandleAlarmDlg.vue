<template>
  <dialog-template>
    <template slot="header">
       <span class="title">注册新故障</span>
			 <span class="model-close el-icon-close" @click="close"></span>
		</template>
		<template slot="body">
       <div style="padding: 30px 50px">
				 <mh-input  label="大类" 
				            inputClass="input_300" 
										v-model="type"
										placeholder="请输入大类" 
										:show-error="invalidtype"
										props="type"
										@validate="validate('type')" 
										:error-message="rules.type.message"/>
				 <mh-input  label="小类" 
				            inputClass="input_300" 
										v-model="subType"
										placeholder="请输入大类" 
										:show-error="invalidsubType"
										props="subType"
										@validate="validate('subType')" 
										:error-message="rules.subType.message"/>
				 <mh-input type="textarea" label="描述" inputClass="input_300" v-model="descrption" placeholder="请输入描述"/>
			 </div>
		</template>
		<template slot="footer">
		   <span class="btn-confirm" @click="submit()">提交</span>
			 <span class="btn-cancel" @click="close()">取消</span>
		</template>
	</dialog-template>
</template>

<script>
import DialogTemplate from '@/views/dialog/DialogTemplate';
import Mixins from '@/mixins/Mixins';
export default {
	name: "HandleAlarmDlg",
	mixins: [Mixins],
	components: {
		DialogTemplate
	},
	data() {
		return {
			type: '',
			subType: '',
			descrption: '',
			invalidtype: false,
			invalidsubType: false,
			rules: {
				type: {
					message: ''
				},
				subType: {
					message: ''
				}
			}
		}
	},
	methods: {
		close() {
			let _this = this;
			_this.closeDialog(_this.dialogId);
		},
		//校验单个表单
		validate(name) {
			let _this = this, input = '';
			input = _this[name].trim();
				_this[`invalid${name}`] = false;
			//表单不能为空并且长度小于4
			if(/^\s*$/.test(input) || input.length < 4) {
				_this[`invalid${name}`] = true;
				_this.rules[`${name}`].message = '阈值最少需要4个字符';
				return;
			}
		},
		//整体校验表单
		valdiateAll(){
			let _this = this, props = ['type', 'subType'];
			//循环校验
			props.forEach(name => {
				_this.validate(name);
			})
			//如果有一个校验不通过则整体校验失败
			let invalid = props.some(name => _this[`invalid${name}`] === true);
			return invalid;
		},
		//处理参数
		getMsg() {
			let _this = this;
			return {

			}
		},
		//提交表单
		submit() {
			let _this = this;
			if(_this.valdiateAll()) return;
			_this.dialogData.param.ok(_this.getMsg())
			   .then(() => {
					 _this.close();
				 });
		}
	}
}
</script>

<style lang="less" scoped>

</style>