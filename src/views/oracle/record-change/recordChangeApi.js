import Http from '@/http/http';

let RecordChangeApi = {
	queryList: (param) => {
		return Http.get('/oracle/quote-report/record/list', param)
		           .then((resp) => {
								 return resp;
							 })
	}
}

export default RecordChangeApi;