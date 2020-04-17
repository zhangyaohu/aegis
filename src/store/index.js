import Vue from 'vue';
import Vuex from 'vuex';
import db from '@/store/modules/db/index.js';
import menu from '@/store/modules/menu/index.js';
import dialogController from '@/store/modules/dialogController';
import helperTips from '@/store/modules/tooltips/index.js';

Vue.use(Vuex);

export default new Vuex.Store({
	modules: {
	 menu,
	 db,
	 dialogController,
	 helperTips
	}
})