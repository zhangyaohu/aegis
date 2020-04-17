import Http from '@/http/http';

let HostManagerApi = {
	queryList: (param) => {
		return Http.get('/config/host/list', param)
		           .then(resp => {
								 return resp;
							 })
	},
	queryTemplate: (param) => {
		return Http.get('/config/host/template/list', param)
		           .then((resp) => {
								 return resp;
							 })
	}
}

export default HostManagerApi;