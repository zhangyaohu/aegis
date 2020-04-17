import HttpApi from '@/http/http';

const AwrSnapShotApi = {
	queryList: (param) => {
		return HttpApi.get('/oracle/awr-snapshot/list',param)
		       .then((resp) => {
             return resp;
					 });
	}
}

export default AwrSnapShotApi;