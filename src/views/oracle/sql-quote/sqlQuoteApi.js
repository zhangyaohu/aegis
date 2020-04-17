import Http from '@/http/http';

let SqlQuoteApi = {
	queryList: (param) => {
		return Http.get('/oracle/sql-quote/list', param)
		       .then((resp) => {
						 return resp;
					 });
	},
	querySummaryRpt: (param) => {
		return Http.get('/oracle/sql-quote/sql-rpt/list', param)
		.then((resp) => {
			return resp;
		});
	},
	querySqlBind: (param) => {
		return Http.get('/oracle/sql-quote/sql-bind/list', param)
		.then((resp) => {
			return resp;
		});
	}
}

export default SqlQuoteApi;