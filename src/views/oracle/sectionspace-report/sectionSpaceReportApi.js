import Http from '@/http/http';

let SectionSpaceReportApi = {
	queryList: (param) => {
		return Http.get('/segspace/sectionspace-report/list', param)
		           .then(resp => {
								 return resp;
							 })
	}
}

export default SectionSpaceReportApi;