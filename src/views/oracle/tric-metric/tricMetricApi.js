import HttpApi from '@/http/http';

const TrendMetricHttpApi = {
	queryMetric: (param) => {
		return HttpApi.get('/curves/dispbyh',param)
		       .then((resp) => {
             return resp;
					 });
	}
}

export default TrendMetricHttpApi;