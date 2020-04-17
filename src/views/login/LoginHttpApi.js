import HttpApi from '../../http/http';

const LoginHttpApi = {
	login: (param) => {
		return HttpApi.post('/login',param)
		       .then((resp) => {
             return resp;
					 });
	}
}

export default LoginHttpApi;