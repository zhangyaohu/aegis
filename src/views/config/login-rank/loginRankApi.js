import Http from '@/http/http';

let LoginRankApi = {
	queryList: (param) => {
	 return	Http.get('/config/user/rank/list', param)
	            .then(resp => {
								return resp;
							})
	}
}

export default LoginRankApi;