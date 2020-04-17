import HttpApi from '@/http/http';

let TableSpaceApi = {
	queryList: (param) => {
		return HttpApi.get('/tabspace/list', param)
		              .then((resp) => {
										return resp;
									})
	}
}

export default TableSpaceApi;