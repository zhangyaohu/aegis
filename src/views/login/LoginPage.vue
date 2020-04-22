<template>
	 <div class="login-login">
		 <div class="login-login__container">
			 <div class="login-login__content">
					<div class="login-input login-input__name">
						<input class="login-input__inner" 
						       v-model="name" 
									 placeholder="请输入用户名"
									 @blur="validate('name')"
									 :class="{'is-error': emptyname || invalidname}"/>
						<span class="error-text" v-show="emptyname || invalidname">{{rules.name.message}}</span>
				</div>
				<div class="login-input login-input__password">
					<input type="password" autocomplete="new-password" hidden/>
					<input class="login-input__inner" 
					       v-model="password" 
								 placeholder="请输入密码"
								 @blur="validate('password')"
								 type="password"
								:class="{'is-error':emptypassword || invalidpassword}"/>
					<span class="error-text" v-show="emptypassword || invalidpassword">{{rules.password.message}}</span>
				</div>
				<div class="login-input">
					<div v-if="!loading" class="login-input__submit" @click="submit()">登录</div>
					<div v-if="loading" class="login-input__submit" @click="submit()">
					    登录中
							<i class="el-icon-loading" style="color: #fff"></i>
					</div>
				</div>
			 </div>
		 </div>
	 </div>
</template>

<script>
import LoginHttpApi from './LoginHttpApi';
export default {
	name: 'LoginPage',
	 data() {
		 return {
			 name: '',
			 password: '',
			 emptyname: false,
			 invalidname: false,
			 emptypassword: false,
			 invalidpassword: false,
			 loading: false,
			 rules: {
				 name: {message: ''},
				 password: {message: ''}
			 }
		 }
	 },
	 mounted() {
		 let _this = this;
		 window.addEventListener('keyup', _this.keyUpSubmit)
	 },
	 methods: {
		 //单个校验表单
		 validate(arg) {
			 let _this = this, input = '';
			 input = _this[arg];
			 _this[`empty${arg}`] = false;
			 if(/^\s*$/.test(input)) {
				 _this[`empty${arg}`] = true;
				 _this.rules[arg].message = '不能为空';
				 return;
			 }
		 },
		 //整体校验表单
		 validateAll(){
			 let _this = this, props = ['name', 'password'];
			 props.forEach((arg) => _this.validate(arg));
			 let invalid = props.some((arg) => _this[`empty${arg}`] === true || _this[`invalid${arg}`] === true);
			 return invalid;
		 },
		 //提交表单
		 submit() {
			 let _this = this;
			 if(_this.validateAll()) return;
			 _this.loading = true;
			 LoginHttpApi.login(_this.confirmParam())
			    .then((resp) => {
						console.log(resp);
						if(resp.code === 200) {
							localStorage.username= _this.name;
							_this.$router.push('/alarm-list');
						}else if(resp.code === 400) {
							_this.$notify.error({
								message: '用户名或者密码错误!'
							})
						}
						_this.loading = false;
					}).catch(() => {
						_this.loading = false;
					});
		 },
		 //登录参数
		 confirmParam() {
			 let _this = this;
			 return {
				 name: _this.name,
				 password: _this.password
			 }
		 },
		 //回车键提交表单
		 keyUpSubmit(e) {
			 let _this = this;
			 if(e.keyCode && e.keyCode === 13) {
         _this.submit();
			 }
		 }
	 },
	 destroyed() {
		 let _this = this;
		 window.removeEventListener('keyup', _this.keyUpSubmit)
	 }
}
</script>