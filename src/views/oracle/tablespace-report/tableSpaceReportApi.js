import Http from '@/http/http';

let TableSpaceReportApi =  {
	queryList: (param) => {
		return Http.get('/tabspace/tableSpace-report/list', param)
		           .then((resp) => {
								 return resp;
							 })
	}
}

export default TableSpaceReportApi;