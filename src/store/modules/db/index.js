import * as types from '@/store/mutation-types/index'
import Vue from 'vue';
let state = {
	'alarm': [],
	'tableSpace': [],
	'sqlReport': [],
	'sqlBind': [],
	'sessionHistory': [],
	'awrShapshot': [],
	'sqlQuote': [],
	'sqlSummaryRpt':[],
	'sqlNoBind': [],
	'quoteReport': [],
	'orderReport': [],
	'dataDictionary': [],
	'tableSpaceReport': [],
	'sectionSpaceReport': [],
	'user': [],
	'role': [],
	'roleManager': [],
	'hostManager': [],
	'hostGroup': [],
	'templateManager': [],
	'exceptManager': [],
	'rank':[],
	'tableHistory': [],
	'sectionSpaceHistory': [],
	'hostTemplate': [],
	'hostList': [],
	'quoteReportHistory': [],
	'orderReportHistory': [],
	'recordChangeHistory': []
}

let actions = {
  [types.UPDATETABLELIST]({commit}, payload) {
		commit(types.UPDATETABLELIST, payload);
	}
}

let mutations = {
   [types.UPDATETABLELIST](state,{tableName, list}){
		if (!state[tableName]) state[tableName] = []
    Vue.set(state, tableName, [...list])
	}
}

let getters = {
	getList(tableName) {
		return state[tableName];
	}
}

export default {
	state,
	actions,
	mutations,
	getters
}