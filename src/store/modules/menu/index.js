import * as types from '@/store/mutation-types/index'
import _ from 'lodash';
import Vue from 'vue';
let state = {
	menuList: [],
	flag: false,//标记是否为第一次进入主页面,
	skin: '',
	breadList: [
		{
			name: "alarm-list",
			path: "/alarm/alarm-list",
			params: {},
			query: {}
		}
	]
}

let actions = {
	[types.UPDATEMENULIST]({ commit }, payload) {
		commit(types.UPDATEMENULIST, payload);
	},
	[types.UPDATEBREAD]({ commit }, payload) {
		commit(types.UPDATEBREAD, payload);
	},
	[types.DELETEBREAD]({ commit }, payload) {
		commit(types.DELETEBREAD, payload);
	},
	[types.UPDATESKIN]({ state, commit}, payload) {
		commit(types.UPDATESKIN, payload);
	},
	[types.CLOSEALLBREAD]({commit}, payload) {
		commit(types.CLOSEALLBREAD)
	}
}

let mutations = {
	[types.UPDATEMENULIST](state, payload) {
		state.menuList = [];
		Vue.set(state, 'menuList', [...payload]);
	},
	[types.UPDATEBREAD](state, payload) {
		 let newState = [];
		 if(_.isArray(payload))
		   Vue.set(state, 'breadList',[...state.breadList, ...payload]);
		 else 
		   Vue.set(state, 'breadList',[...state.breadList, payload])
		 for(let i in state.breadList) {
			 if(JSON.stringify(newState).indexOf(JSON.stringify(state.breadList[i])) === -1){
				newState.push(state.breadList[i]);
			 }
		 }
		 Vue.set(state, 'breadList',[...newState]);
		 localStorage.pageOpenedList = JSON.stringify([...state.breadList]);
	},
	[types.DELETEBREAD](state, payload) {
		let newState = [];
		state.breadList.forEach((item) => {
			if (item.name !== payload.name) {
				newState.push(item);
			}
		})
		Vue.set(state, 'breadList', [...newState]);
	},
	[types.UPDATESKIN](state, payload) {
		Vue.set(state, 'skin', payload);
	},
	[types.CLOSEALLBREAD](state) {
		Vue.set(state, 'breadList', [{
			name: "alarm-list",
			path: "/alarm/alarm-list",
			params: {},
			query: {}
		}]);
		localStorage.pageOpenedList = [];
	}
}

let getters = {
	setMenuList() {
		return state.menuList;
	}
}

export default {
	state,
	actions,
	mutations,
	getters
}