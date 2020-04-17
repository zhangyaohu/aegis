import HttpApi from '@/http/http';

const AlarmHttpApi = {
	queryList: (param) => {
		return HttpApi.get('/alarm/list',param)
		       .then((resp) => {
             return resp;
					 });
	}
}

export default AlarmHttpApi;