import HttpApi from '@/http/http';

let sectionSpaceApi = {
	queryList: (param) => {
		return HttpApi.get('/segspace/list', param)
		              .then((resp) => {
										return resp;
									})
	}
}

export default sectionSpaceApi;