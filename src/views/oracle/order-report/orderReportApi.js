import http from '@/http/http';

let OrderReportApi = {
	queryList:  (param) => {
		return http.get('/oracle/order-report/list', param)
		           .then(resp => {
								 return resp;
							 })
	}
}

export default OrderReportApi;