import HttpApi from '@/http/http';

let SqlReportApi = {
	queryList: (param) => {
		return HttpApi.get('/sql-report/list', param)
		              .then((resp) => {
										return resp;
									})
	}
}

export default SqlReportApi;