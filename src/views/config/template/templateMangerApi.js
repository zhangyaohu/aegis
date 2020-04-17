import  Http from '@/http/http';

let TemplateManagerApi = {
	queryList: (param) => {
		return Http.get('/config/template/list', param)
		    .then(resp => {
					return resp;
				})
	}
}

export default TemplateManagerApi;