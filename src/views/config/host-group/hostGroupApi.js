import Http from '@/http/http';

let HostGroupApi = {
	queryList: (param) => {
		return Http.get('/config/host/host-group/list', param)
		           .then(resp => {
								 return resp;
							 })
	},
	queryHostList: (param) => {
		return Http.get('/config/host/detail/list', param)
		           .then(resp => {
								 return resp;
							 })
	}
}

export default HostGroupApi;