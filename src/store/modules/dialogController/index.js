import * as types from '@/store/mutation-types';
import Vue from 'vue';
let state = {
  dialogObject: {

	},
	dialogIdList: []
}

let actions = {
  [types.OPENDIALOG]({state, commit}, payload) {
		return new Promise((resolve, reject) => {
			commit(types.OPENDIALOG, payload);
			resolve(payload.id);
		})
	},
	[types.CLOSEDIALOG]({state, commit}, payload) {
		return new Promise((resolve, reject) => {
			commit(types.CLOSEDIALOG, payload);
		})
	},
	[types.CLOSE]({state, commit}, payload) {
		return new Promise((resolve, reject) => {
			commit(types.CLOSE, payload);
		})
	}
}

let mutations = {
  [types.OPENDIALOG](state, payload) {
		 Vue.set(state, 'dialogObject', {...state.dialogObject, [payload.id]: payload});
		 state.dialogIdList.push(payload.id);
	},
	[types.CLOSEDIALOG](state, id) {
		if (state.dialogIdList.indexOf(id) <= -1) return
    state.dialogIdList = state.dialogIdList.filter((uuid) => uuid !== id)
    delete state.dialogObject[id]
	},
	[types.CLOSE](state, payload) {
		state.dialogIdList.forEach(id => {
			delete state.dialogObject[id];
		})
		Vue.set(state, 'dialogIdList', []);
	}
}
 
export default {
	state,
	actions,
	mutations
}