import Http from '@/http/http';

let ExceptManagerApi = {
	queryList: (param) => {
		return Http.get('/alarm/alert-code/list', param)
		           .then(resp => {
								 return resp;
							 })
	}
}

export default ExceptManagerApi;