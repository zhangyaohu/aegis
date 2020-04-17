import * as types from '@/store/mutation-types/index.js';
import Vue from 'vue';
let state = {
  hepler: {

	}
}

let actions = {
  [types.UPDATEHEPLERTOOLTIPS]({commit, state}, payload) {
		commit(types.UPDATEHEPLERTOOLTIPS, payload);
	}
}

let mutations = {
  [types.UPDATEHEPLERTOOLTIPS](state, {name, data}) {
		if (!state[name]) state[name] = {}
    Vue.set(state, name, {...state[name], ...data})
	}
}

export default{
	state,
	actions,
	mutations
}