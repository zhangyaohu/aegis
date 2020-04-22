import Http from '@/http/http';

let DataDictionaryApi = {
	queryList: (param) => {
		return Http.get('/oracle/data-dict/list', param)
		           .then((resp) => {
								 return resp;
							 })
	},
	queryColumn: (param) => {
		return Http.get('/oracle/data-dict/column/list', param)
		           .then((resp) => {
								 return resp;
							 })
	},
	queryIndex: (param) => {
		return Http.get('/oracle/data-dict/index/list', param)
		           .then((resp) => {
								 return resp;
							 })
	}
} 

export default DataDictionaryApi;