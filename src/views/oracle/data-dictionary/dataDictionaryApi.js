import Http from '@/http/http';

let DataDictionaryApi = {
	queryList: (param) => {
		return Http.get('/oracle/data-dict/list', param)
		           .then((resp) => {
								 return resp;
							 })
	}
} 

export default DataDictionaryApi;