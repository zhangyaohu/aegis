<template>
  <dialog-template>
    <template slot="header">
      <span class="title">注册新故障</span>
      <span class="model-close el-icon-close" @click="close"></span>
    </template>
    <template slot="body">
      <div class="dialog-body" style="padding: 30px 60px;">
        <mh-input
          label="用户"
          inputClass="input_300"
          v-model="username"
          placeholder="请输入用户"
          :show-error="emptyusername || invalidusername"
          props="username"
          @validate="validate('username')"
          :error-message="rules.username.message"
        />
        
				<!-- <mh-input
          label="密码"
          inputClass="input_300"
          v-model="password"
					type="password"
          placeholder="请输入密码"
          :show-error="emptypassword || invalidpassword"
          props="password"
          @validate="validate('password')"
          :error-message="rules.password.message"
        /> -->

        <mh-input
          label="邮箱"
          inputClass="input_300"
          v-model="mail"
          placeholder="请输入邮箱"
          :show-error="invalidmail"
          props="mail"
          @validate="validate('mail')"
          :error-message="rules.mail.message"
        />

        <mh-input
          label="旺旺"
          inputClass="input_300"
          v-model="ww"
          placeholder="请输入旺旺"
          :show-error="emptyww || invalidww"
          props="ww"
          @validate="validate('ww')"
          :error-message="rules.ww.message"
        />

        <mh-input
          label="手机"
          inputClass="input_300"
          v-model="mobile"
          placeholder="请输入手机"
          :show-error="emptymobile || invalidmobile"
          props="mobile"
          @validate="validate('mobile')"
          :error-message="rules.mobile.message"
        />

        <mh-input
          label="角色"
          inputClass="input_300"
          v-model="role"
          placeholder="请输入角色"
          :show-error="emptyrole || invalidrole"
          props="role"
          @validate="validate('role')"
          :error-message="rules.role.message"
        />

        <mh-input
          label="授权"
          inputClass="input_300"
          v-model="auth"
					type="select"
					:selectGroup = 'authGroup'
          placeholder="请输入授权"
        />

        <mh-input
          label="分页"
          inputClass="input_300"
          v-model="page_rows"
          placeholder="请输入分页"
          :show-error="emptypage_rows || invalidpage_rows"
          props="page_rows"
          @validate="validate('page_rows')"
          :error-message="rules.page_rows.message"
        />
      </div>
    </template>
    <template slot="footer">
      <span class="btn-confirm" @click="submit()">提交</span>
      <span class="btn-cancel" @click="close()">取消</span>
    </template>
  </dialog-template>
</template>

<script>
import Mixins from '@/mixins/Mixins';
import DialogTemplate from '@/views/dialog/DialogTemplate';
import { isPhoneNumber, isEmail} from '@/views/utils/utils';
export default {
	name: "ModifyUserDlg",
	mixins: [Mixins],
	components: {
		DialogTemplate
	},
	data() {
		return {
			username: '',
			password: '',
			mobile: '',
			mail:'',
			role: '',
			ww: '',
			page_rows: 0,
			emptyusername: false,
			invalidusername: false,
			emptypassword: false,
			invalidpassword: false,
			emptymobile: false,
			invalidmobile: false,
			emptymail: false,
			invalidmail: false,
			emptyww: false,
			invalidww: false,
			emptyauth: false,
			invalidauth: false,
			invalidpage_rows: false,
			emptypage_rows: false,
			invalidrole: false,
			emptyrole: false,
			auth: '0',
			authGroup: [
				{
				 label: 'No',
				 value: '0'
				},
				{
				 label: 'YES',
			  	value:'1'
			  }
			],
			rules: {
				username: {
					message: ''
				},
				password: {
					message: ''
				},
				mobile: {
					message: ''
				},
				role: {
					message: ''
				},
				ww: {
					message: ''
				},
				auth: {
					message: ''
				},
				mail: {
					message: ''
				},
				page_rows: {
					message: ''
				}
			}
		}
	},
	mounted() {
		let _this = this;
		_this.username = _this.dialogData.param.param.username;
		_this.mail = _this.dialogData.param.param.mail;
		_this.mobile = _this.dialogData.param.param.mobile;
		_this.auth = _this.dialogData.param.param.super;
		// _this.password = decyptPwd('aegis', _this.dialogData.param.param.password);
		_this.role = _this.dialogData.param.param.role;
		_this.page_rows = _this.dialogData.param.param.page_rows;
		_this.ww =  _this.dialogData.param.param.ww;
	},
	methods: {
		close() {
			let _this = this;
			_this.closeDialog(_this.dialogId);
		},
		//校验单个表单
		validate(name) { 
			let _this = this, input = '', message = '';
			input = String(_this[name]).trim();
				_this[`invalid${name}`] = false;
				switch(name) {
					case 'ww': 
							message = '旺旺';
							break;
					case 'username': 
							message = '用户';
							break;
					case 'password':
							message =  '密码';
							break;
					case 'role':
							message = '角色';
							break;
					case 'page_rows':
							message = '分页';
							break;
					case 'mail':
							message = '邮箱';
							break;
					case 'mobile':
							message = '手机';
							break;
				}
			//表单不能为空并且长度小于4
				_this.rules[`${name}`].message = '';
			_this[`empty${name}`] = false;
			if(/^\s*$/.test(input)) {
				_this[`empty${name}`] = true;
				_this.rules[`${name}`].message = message + '不能为空!';
				return;
			}
				_this[`invalid${name}`] = false;
			if(name === 'mobile' && !isPhoneNumber(input)) {
				_this[`invalid${name}`] = true;
				_this.rules[`${name}`].message = message + '格式错误!';
				return;
			}
			if(name === 'mail' && !isEmail(input)) {
				_this[`invalid${name}`] = true;
				_this.rules[`${name}`].message = message + '格式错误!';
				return;
			}
			if(name === 'password' && input.length < 6) {
				_this[`invalid${name}`] = true;
				_this.rules[`${name}`].message = message + '至少6位!';
				return;
			}
			if(name === 'page_rows' && !/^[\d]\d$/.test(input)) {
				_this[`invalid${name}`] = true;
				_this.rules[`${name}`].message = message + '分页应该为数字!';
				return;
			}
		},
		//整体校验表单
		valdiateAll(){
			let _this = this, props = ['username', 'mail', 'role', 'mobile', 'ww', 'page_rows', 'auth'];
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
        username: _this.username,
        mail: _this.mail,
        ww: _this.ww,
        mobile: _this.mobile,
        role: _this.role,
        super: _this.auth,
        page_rows: _this.page_rows,
        id: _this.dialogData.param.param.id
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