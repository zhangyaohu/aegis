import HttpApi from '@/http/http';

const SessionHistoryHttpApi = {
	queryList: (param) => {
		return HttpApi.get('/oracle/session-history/list',param)
		       .then((resp) => {
             return resp;
					 });
	}
}

export default SessionHistoryHttpApi;