import Http from '@/http/http';

let UserManagerApi = {
	queryList: (param) => {
		return Http.get('/config/user/list', param)
			.then((resp) => {
				return resp;
			})
	},
	queryRoleList: (param) => {
		return Http.get('/config/user/role/list', param)
			.then((resp) => {
				return resp;
			})
	},
	modifyUser: (param) => {
		return Http.post('/modifyUser', param)
			.then((resp) => {
				return Promise.resolve(resp);
			})
	},
	modifyPwd:(param) => {
		return Http.post('/modifyPwd', param)
		.then((resp) => {
			return Promise.resolve(resp);
		})
	}
}

export default UserManagerApi;