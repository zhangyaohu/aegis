import Http from '@/http/http';
let QuoteReportApi = {
	queryList: (param) => {
		return Http.get('/oracle/quote-report/list', param)
		    .then(resp => {
					return resp;
				})
	},
	historyQuery: () => {
		return Http.get('/oracle/quote-report/history/list', param)
		           .then(resp => {
								 return resp;
							 })
	}
}

export default QuoteReportApi;