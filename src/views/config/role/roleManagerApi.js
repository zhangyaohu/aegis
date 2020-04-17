import Http from '@/http/http';

let RoleManagerApi =  {
	queryList: (param) => {
		return Http.get('/config/user/roles/list', param)
		           .then(resp => {
								 return resp;
							 })
	}
}

export default RoleManagerApi;