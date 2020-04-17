const LoginPage = () => import(/*webpackChunkName: 'LoginPage'*/'@/views/login/LoginPage');
const AlaramPage = () => import(/*webpackChunkName: 'LoginPage'*/'@/views/alarm/alarm/AlarmPage');
const SqlBindPage = () => import(/*webpackChunkName：'SQLBINDPAGE'*/'@/views/alarm/sql-bind/SqlBindPage');
const SqlQuotePage = () => import(/*webpackChunkName: 'SQLQUOTEPAGE'*/'@/views/oracle/sql-quote/Sql-quote');
const UserManagerPage = () => import(/*webpackChunkName: 'USERMANAGERPAGE'*/'@/views/config/user/UserManagerPage');
const RoleManagerPage = () => import(/*webpackChunkName: 'ROLEMANAGERPAGE'*/'@/views/config/role/RoleManagerPage');
const HostManagerPage = () => import(/*webpackChunkName: 'HOSTMANAGERPAGE'*/'@/views/config/host/HostManagerPage');
const SqlReportPage = () =>  import(/*webpackChunkName: 'SQLREPORTPAGE'*/'@/views/alarm/sql-report/SqlReportPage');
const HostGroupPage = () => import(/*webpackChunkName: 'HOSTGROUPPAGE'*/'@/views/config/host-group/HostGroupPage');
const LoginRankPage = () => import(/*webpackChunkName: 'LOGINRANKPAGE'*/'@/views/config/login-rank/LoginRankPage');
const TableSpacePage = () => import(/*webpackChunkName: 'TABLESPACEPAGE'*/'@/views/alarm/table-space/TableSpacePage');
const TrendMetricPage = () => import(/*webpackChunkName: 'TRENDMETRICPAGE'*/'@/views/oracle/tric-metric/TrendMetricPage');
const QuoteReportPage = () => import(/*webpackChunkName: 'QUOTEREPORTPAGE'*/'@/views/oracle/quote-report/QuoteReportPage');
const OrderReportPage = () => import(/*webpackChunkName: 'ORDERREPORTPAGE'*/'@/views/oracle/order-report/OrderReportPage');
const RecordChangePage = () => import(/*webpackChunkName: 'RECORDCHANGEPAGE'*/'@/views/oracle/record-change/RecordChangePage');
const SectionSpacePage = () => import(/*webpackChunkName:  'SECTIONSPACEPAGE'*/'@/views/alarm/section-space/SectionSpacePage');
const AwrSnapShotPage = () => import(/*webpackChunkName: 'AWRSNAPSHOTPAGE'*/       '@/views/oracle/awr-snapshot/AwrSnapShotPage');
const TemplateManagerPage = () => import(/*webpackChunkName: 'TEMPLATEMANAGERPAGE'*/'@/views/config/template/TemplateManagerPage');
const ExceptManagerPage  = () => import(/*webpackChunkName: 'EXCEPTMANAGERPAGE'*/'@/views/config/except-manager/ExceptManagerPage');
const DataDictionaryPage = () => import(/*webpackChunkName: 'DATADICTIONARYPAGE'*/'@/views/oracle/data-dictionary/DataDictionaryPage');
const SessionHistoryPage = () => import(/*webpackChunkName: 'SESSIONHISTORYPAGE'*/'@/views/oracle/session-history/SessionHistoryPage');
const TableSpaceReportPage = () => import(/*webpackChunkName: 'TABLESPACEREPORTPAGE'*/'@/views/oracle/tablespace-report/TableSpaceReportPage');
const SectionSpaceReportPage = () => import(/*webpackChunkName: 'SECTIONSPACEREPORTPAGE'*/'@/views/oracle/sectionspace-report/SectionSpaceReportPage');
const Main = () => import(/*webpackChunkName: 'MainPage'*/'@/views/Main');
export const routes = [
	{
		path: '*',
		redirect: '/alarm'
	},
	{
		path: '/login',
		name: 'login',
		component: LoginPage,
		meta: {
			title: '登录'
		}
	},
	{
		path: '/alarm',
		name: 'main',
		component: Main,
		children: [
			{
				path: 'alarm-list',
				name: 'alarm-list',
				component: AlaramPage,
				meta: {
					title: '告警明细列表'
				}
			},
			{
				path: 'trend-list',
				name: 'trend-list',
				component: AlaramPage,
				meta: {
					title: '趋势图预警'
				}
			},
			{
				path: 'tablespace',
				name: 'tablespace',
				component: TableSpacePage,
				meta: {
					title: '表空间预警'
				}
			},
			{
				path: 'section-space',
				name: 'section-space',
				component: SectionSpacePage,
				meta: {
					title: '段空间预警'
				}
			},
			{
				path: 'sql-report',
				name: 'sql-report',
				component: SqlReportPage,
				meta: {
					title:'SQL区段报表'
				}
			},
			{
				path: 'sql-bind',
				name: 'sql-bind',
				component: SqlBindPage,
				meta: {
					title:'SQL区段绑定变量'
				}
			}
		]
	},
	{
		path: '/oracle',
		name: 'oracle',
		component: Main,
		children: [
			{
				path: 'trend-metric',
				name: 'trend-metric',
				component: TrendMetricPage,
				meta: {
					title:'关键指标趋势'
				}
			},
			{
				path: 'session-history',
				name: 'session-history',
				component: SessionHistoryPage,
				meta: {
					title: '活动会话历史'
				}
			},
			{
				path: 'awr-snapshot',
				name: 'awr-snapshot',
				component: AwrSnapShotPage,
				meta: {
					title: 'AWR快照列表'
				}
			},
			{
				path: 'sql-quote',
				name: 'sql-quote',
				component: SqlQuotePage,
				meta: {
					title:'SQL全文索引'
				}
			},
			{
				path: 'quote-report',
				name: 'quote-report',
				component: QuoteReportPage,
				meta:  {
					title: '索引访问报表'
				}
			},
			{
				path: 'record-change',
				name: 'record-change',
				component: RecordChangePage,
				meta: {
					title: '记录变更报表'
				}
			},
			{
				path: 'order-report',
				name: 'order-report',
				component: OrderReportPage,
				meta: {
					title: ''
				}
			},
			{
				path: 'data-dict',
				name: 'data-dict',
				component: DataDictionaryPage,
				meta: {
					title: ''
				}
			},
			{
				path: 'tablespace-report',
				name: 'tablespace-report',
				component: TableSpaceReportPage,
				meta: {
					title: ''
				}
			},
			{
				path: 'sectionspace-report',
				name: 'sectionspace-report',
				component: SectionSpaceReportPage,
				meta: {
					title:''
				}
			}
		]
	},
	{
		path: '/config',
		name: 'config',
		component: Main,
		children: [
			{
				path: 'user-manager',
				name: 'user-manager',
				component: UserManagerPage,
				meta: {
					title: '用户管理'
				}
			},
			{
				path: 'role-manager',
				name: 'role-manager',
				component: RoleManagerPage,
				meta: {
					title: '角色管理'
				}
			},
			{
				path: 'host-manager',
				name: 'host-manager',
				component: HostManagerPage,
				meta: {
					title: '主机管理'
				}
			},
			{
				path: 'host-group',
				name: 'host-group',
				component: HostGroupPage,
				meta: {
					title: '主机群组'
				}
			},
			{
				path: 'template-manager',
				name: 'template-manager',
				component: TemplateManagerPage,
				meta: {
					title: ''
				}
			},
			{
				path: 'except-manager',
				name: 'except-manager',
				component: ExceptManagerPage,
				meta: {
					title: ''
				}
			},
			{
				path: 'login-rank',
				name: 'login-rank',
				component: LoginRankPage,
				meta: {
					title: ''
				}
			}
		]
	}
]