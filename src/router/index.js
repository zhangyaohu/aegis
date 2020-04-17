import Vue from 'vue';
import {routes} from './route';
import {setDocTitle} from '@/views/utils/utils';
import VueRouter from 'vue-router';
Vue.use(VueRouter);

export const router = new VueRouter({
	mode: 'history',
	routes
})

router.beforeEach((to, form, next) => {
	setDocTitle(to.meta.title);
	next()
})