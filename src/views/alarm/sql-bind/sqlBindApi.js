import HttpApi from '@/http/http';

let SqlBindApi = {
	queryList: (param) => {
		return HttpApi.get('/sql-bind/list', param)
		              .then((resp) => {
										return resp;
									})
	}
}

export default SqlBindApi;