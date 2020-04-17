import Vue from 'vue';
import App from './App.vue';
import {router}  from '@/router/';
import store from '@/store/index';
import element from '@/element/index.js';
import {changeElementTheme, setIco} from '@/views/utils/utils';
import 'babel-polyfill';

Vue.use(element);
export let app = new Vue({
	el: '#app',
	router,
	store,
	render: h => h(App)
})
if(localStorage.theme)
changeElementTheme(localStorage.theme);
else
changeElementTheme('default');
setIco() 