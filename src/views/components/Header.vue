<template>
	 <header class="mh-header">
		  <div class="mh-header__logo"></div>
			<div class="mh-header__center">
				<span class="mh-tab__container">
					<span class="mh-tab__item" 
					      :class="{'active': currSelectTab === 'alarm'}" @click="toggleTab('alarm')">告警</span>
				  <span class="mh-tab__item"
					      :class="{'active': currSelectTab === 'oracle'}" @click="toggleTab('oracle')">Oracle</span>
				  <span class="mh-tab__item"
					      :class="{'active': currSelectTab === 'config'}" @click="toggleTab('config')">配置</span>
				</span>
			</div>
			<div class="mh-header__right">
				<span class="mh-header__skin">
					换肤
					<ul class="mh-header__skin_select">
						<li class="mh-header__skin_content" @click.stop="toggleColor('default')">
							<span class="mh-header__skin_item" style="background: rgb(51, 51, 102)"></span>
						</li>
						<li class="mh-header__skin_content"  @click.stop="toggleColor('blue')">
							<span class="mh-header__skin_item" style="background: #409EFF"></span>
						</li>
						<li class="mh-header__skin_content" @click.stop="toggleColor('light')">
							<span class="mh-header__skin_item" style="background: #fff"></span>
						</li>
						<li class="mh-header__skin_content"  @click.stop="toggleColor('dark')">
							<span class="mh-header__skin_item" style="background: #222"></span>
						</li>
					</ul>
				</span>
				<span class="mh-header__layout" @click="() => $router.push({name: 'login'})">退出</span>
			</div>
	 </header>
</template>

<script>
import { changeElementTheme } from '@/views/utils/utils';
import {alarmList, oracleList, configList} from './menuList';
import Mixins from '@/mixins/Mixins';
export default {
	name: 'Header',
	mixins: [Mixins],
	data() {
		let _this = this;
		return {
			currSelectTab: 'alarm-list'
		}
	},
	mounted() {
		let _this = this;
		//页面头tab切换
		_this.currSelectTab = _this.$router.history.current.fullPath.split('/')[1];
		//更新左侧菜单栏
		_this.updateMenuList(_this.handleSet(_this.currSelectTab));
	},
	methods: {
		//切换头部tab
		toggleTab(arg) {
			let _this = this;
			if(_this.currSelectTab === arg) return;
			_this.currSelectTab = arg;
			//更新左侧菜单栏
			_this.updateMenuList(_this.handleSet(arg));
			//跳转到默认页
			_this.handleLinkTo(arg);
		},
		handleLinkTo(arg) {
			let _this = this;
			switch(arg) {
				case 'alarm':
					_this.$router.push({name: 'alarm-list'});
				break;
				case 'oracle':
				  _this.$router.push({name: 'trend-metric'})
				break;
				case 'config':
					_this.$router.push({name: 'user-manager'})
					break;
				default: 
				  _this.$router.push({name: 'alarm-list'})
			}
		},
		handleSet(arg) {
			//设置左侧菜单栏数据
		 let	_this = this, menuList = [];
			switch(arg) {
				case 'alarm':
				  menuList = alarmList;
				break;
				case 'oracle':
				  menuList = oracleList;
				break;
				case 'config':
					menuList = configList;
					break;
				default: 
				   menuList = alarmList;
			}
			return menuList;
		},
		toggleColor(theme) {
			//换肤操作
			let _this = this;
			localStorage.theme = theme;
			_this.updateSkin(theme);
			//切换加载的css
			changeElementTheme(theme);
		}
	},
	watch: {
		'$route': function(newVal, oldVal) {
				let _this = this;
			  _this.currSelectTab = newVal.fullPath.split('/')[1];
		  	_this.updateMenuList(_this.handleSet(_this.currSelectTab));
		}  
	}
}
</script>