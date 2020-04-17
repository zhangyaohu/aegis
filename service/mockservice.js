const express = require('express');   //引入express
const Mock = require('mockjs');       //引入mock

var bodyParser = require('body-parser');
const {dataList1, dataList2, dataList3} = require('./data.js');

let app = express();
app.use(bodyParser.json());
//对urlencoded请求体解析中间件,extended:true 高级模式 false:普通 没有区别
app.use(bodyParser.urlencoded({ extended: true }));
const Random = Mock.Random;

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
});

app.get('/api/alarm/list', function (req, res) {
    let {limit, start} = {...req.query};
    res.json(Mock.mock({
        'status': 200,
        'total': 20,
        [`data|${limit}`]: [
            {
                "name|+1": ["maxdata1", "maxdata2", "maxdata3"],
                "age|18-70": 70,
                "address": Random.region(),
                "date": Random.date(),
                "hostname|+1": ["maxdata1", "maxdata2", "maxdata3"],
                "servername|+1": ["oracle", "mysql", "sqlServer"],
                "info|1": ['"physical reads" more than baseline: 3.42 now: 20.52, cur', 'error ****'],
                "type|1": ["oracle", "mysql", "sqlServer"],
                "subtype|1": ["oracle1", "mysql1", "sqlServer1"],
                "level|1": [0, 1, 2],
                "role|1": ['no-ntf', '2'],
                "handle|1": [true, false]
            }
        ]
    }))
})

app.get('/api/tabspace/list', function (req, res) {
    let {limit, start} = {...req.query};
    res.json(Mock.mock({
        'status': 200,
        'total': 10,
        [`data|${limit}`]: [
            {
                "name|+1": ["TOTAL_SPACE", "SYSAUX", "SYSTEM", "USERS"],
                "memerySize": Math.random() * 1000,
                "date": Random.date(),
                "useSize": Math.random() * 1000,
                "availableSize": Math.random() * 1000,
                "increadentSize": Math.random() * 1000,
                "avarage": Math.random() * 100,
                "usePercent": Math.random() * 100,
                "day": Math.random() * 10,
            }
        ]
    }))
})

app.get('/api/sql-report/list', function(req, res) {
    let {limit, start} ={...req.query}
    res.json(Mock.mock({
        'status': 200,
        'total': 10,
        [`data|${limit}`]: [
            {
                "name|+1": ["maxdata2", "maxdata1"],
                "total": Math.random() * 10,
                "date": Random.date(),
                "fsc": Math.random() * 10,
                "exec|1": ['0/24/0/0',  '23/1/0/0', ''],
                "buff|1": ['0/24/0/0',  '23/1/0/0', ''],
                "disk|1": ['0/24/0/0',  '8/16/0/0', ''],
                "elap|1": ['8/16/0/0',  '0/24/0/0', ''],
                "rows|1": ['8/16/0/0',  '23/1/0/0', ''],
                "sort|1": ['23/1/0/0',  '8/16/0/0', '']
            }
        ]
    }))
})

app.get('/api/sql-bind/list', function(req, res) {
    let {limit, start} ={...req.query}
    res.json(Mock.mock({
        'status': 200,
        'total': 10,
        [`data|${limit}`]: [
            {
                "gmt_create|1": ["maxdata2", "maxdata1"],
                "service": Math.random() * 10,
                "sql_text": Random.date(),
                "sql_cnt": Math.random() * 10,
                "sql_delta|1": ['0/24/0/0',  '23/1/0/0', ''],
                "history|1": ['0/24/0/0',  '23/1/0/0', '']
            }
        ]
    }))
})

app.get('/api/oracle/metric', function(req, res) {
    res.json(Mock.mock({
        'status': 200,
        'total': 10,
        'data': [
            dataList1,
            dataList2,
            dataList3
        ]
    }))
})

app.get('/api/oracle/session-history/list',function(req, res) {
    let {limit, start} ={...req.query}
    res.json(Mock.mock({
        'status': 200,
        'total': 10,
        [`data|${limit}`]: [
            {
                "owner|1": ["SYS", ""],
                "name|1": ["AUD$","KET$_AUTOTASK_STATUS", ""],
                "type|1": ['TABLE', ''],
                "category|1": ['System I/O', 'user I/O', 'other'],
                "eventName|1": ['control file sequential read',  'Disk file Mirror Read', 'db file sequential read'],
                "count": Math.random() * 1000
            }
        ]
    }))
})

app.get('/api/oracle/sql-quote/list',function(req, res) {
    let {limit, start} ={...req.query}
    res.json(Mock.mock({
        'status': 200,
        'total': 10,
        [`data|${limit}`]: [
            {
                "sql_id": Math.random() * 1000,
                "sql_fulltext|1": ['select rowid, actschat, rset_owner,', 'declare TYPE attrs_cur IS REF CURSOR, m_cur attrs_cur,'],
                "fsc|1": ['YES', 'NO'],
                "exe":  Math.floor(Math.random() * 100),
                "exec_per": Math.random() * 100,
                "buf": Math.random() * 100,
                "buff_per": Math.random() * 100,
                "disk": Math.random() * 100,
                "disk_per": Math.random() * 100,
                "ela": Math.random() * 100,
                "elap_per": Math.random() * 100,
                "cput_per": Math.random() * 100,
                "parse_per": Math.random() * 100,
                "sort_per":Math.random() * 100,
                "rows_processed":Math.random() * 100,
                "app_name": Math.random() * 100
            }
        ]
    }))
})

app.get('/api/oracle/sql-quote/list', function(req, res){
    let {limit, start} ={...req.query}
    res.json(Mock.mock({
        'status': 200,
        'total': 10,
        [`data|${limit}`]: [
            {
                "id|1": Math.random() * 1000,
                "gmt_create": Random.date(),
                "topsql": 'top sql report',
                "awr": 'awr report',
                "addm_rptname": 'addm report',
                "metric": 'sys metric report',
                "fscan":  Math.random() * 1000,
                "isnew": Math.random() * 100,
                "iud|1": ['//', '8/0/0'],
                "total": Math.random() * 1000,
                "end_create": Random.date()
            }
        ]
    }))
})

app.get('/api/oracle/sql-rpt/list', function(req, res){
    let {limit, start} ={...req.query}
    res.json(Mock.mock({
        'status': 200,
        'total': 10,
        [`data|${limit}`]: [
            {
                "service|1": ['maxdata1', 'maxdata2'],
                "gmt_create": Random.date(),
                "fscan": Math.random() * 100,
                "execs|1": ['0/24/0/0', '0/23/0/0'],
                "lgrds|1": ['6/15/1/1', '8/6/0/0'],
                "phrds|1": ['18/5/0/0', '18/6/0/0'],
                "cpu|1":  ['2/21/0/0', '2/20/0/0'],
                "elapsed|1": ['2/21/0/0', '2/20/0/0'],
                "sorts|1": ['20/1/2/0', '20/0/2/0'],
                "rows|1": ['20/1/2/0', '20/0/2/0'],
                "total": Math.random() * 100
            }
        ]
    }))
})

app.get('/api/oracle/sql-bind/list', function(req, res){
    let {limit, start} ={...req.query}
    res.json(Mock.mock({
        'status': 200,
        'total': 10,
        [`data|${limit}`]: [
            {
                "service|1": ['maxdata1', 'maxdata2'],
                "gmt_create": Random.date(),
                "sql_text|1": ['SELECT /*+NESTED_TABLE_GET_REFS+*/', 'SELECT /*+NESTED_TABLE_GET_REF*/'],
                "sql_cnt": Math.random() * 100,
                "sql_delta": Math.random() * 100
            }
        ]
    }))
})


app.get('/api/oracle/quote-report/list', function(req, res) {
    let {limit, start} ={...req.query}
    res.json(Mock.mock({
        'status': 200,
        'total': 10,
        [`data|${limit}`]: [
            {
                "service|1": ['maxdata1', 'maxdata2'],
                "gmt_create": Random.date(),
                "owner|1": ['HSCZ2017', 'MDSYS', 'APEX_030200'],
                "table_name|1": ['Theme3d777_TAB', 'SYS_DATABASE', 'CSW_RECORD_TYPES$'],
                "inss": Math.random() * 10,
                "upds": Math.random() * 10,
                "dels": Math.random() * 10,
                "total_dmls": Math.random() * 10,
                "num_rows": Math.random() * 10,
                "no": Math.random() * 10,
                "avarage": Math.random() * 10,
                "trunc|1": ['NO', 'YES']
            }
        ]
    }))
})

app.get('/api/oracle/order-report/list', function(req, res) {
    let {limit, start} ={...req.query}
    res.json(Mock.mock({
        'status': 200,
        'total': 10,
        [`data|${limit}`]: [
            {
                "service|1": ['maxdata1', 'maxdata2'],
                "gmt_create": Random.date(),
                "owner|1": ['HSCZ2017', 'MDSYS', 'APEX_030200'],
                "sequence|1": ['Theme3d777_TAB', 'SYS_DATABASE', 'CSW_RECORD_TYPES$'],
                "min_value": Math.floor(Math.random() * 10),
                "max_value": Math.floor(Math.random() * 10),
                "incr_by": Math.floor(Math.random() * 10),
                "cache_size":Math.floor(Math.random() * 10),
                "last_number": Math.floor(Math.random() * 10)
            }
        ]
    }))
})

app.get('/api/oracle/data-dict/list', function(req, res) {
    let {limit, start} ={...req.query}
    res.json(Mock.mock({
        'status': 200,
        'total': 10,
        [`data|${limit}`]: [
            {
                "service|1": ['maxdata1', 'maxdata2'],
                "gmt_create": Random.date(),
                "owner|1": ['SYSMAN', 'MDSYS', 'APEX_030200'],
                "table_owner|1": ['SYSMAN', 'SYS_DATABASE', 'CSW_RECORD_TYPES$'],
                "table_name|1":['AQ$_MGMT_LOADER_QTABLE_G', 'AQ$_MGMT_LOADER_QTABLE_H', 'AQ$_MGMT_LOADER_QTABLE_I', 'AQ$_MGMT_LOADER_QTABLE_L'],
                "column_name|1": ['MSGID', 'SUBSCRIBER#'],
                "column_position": Math.floor(Math.random() * 10),
                "column_length":Math.floor(Math.random() * 100),
            }
        ]
    }))
})

app.get('/api/oracle/tableSpace-report/list', function(req, res) {
    let {limit, start} ={...req.query}
    res.json(Mock.mock({
        'status': 200,
        'total': 10,
        [`data|${limit}`]: [
            {
                "service|1": ['maxdata1', 'maxdata2'],
                "gmt_create": Random.date(),
                "tablespace|1": ['SYSMAN', 'MDSYS', 'APEX_030200'],
                "total_space":(Math.random() * 1024).toFixed(2),
                "used_space":(Math.random() * 1024).toFixed(2),
                "free_space": (Math.random() * 100).toFixed(2),
                "diff_space": (Math.random() * 100).toFixed(2),
                "used_rate":(Math.random() * 100).toFixed(2),
                "used_days":(Math.random() * 100).toFixed(2),
                "avg_space": (Math.random() * 100).toFixed(2),
                "grow_fact": (Math.random() * 365).toFixed(2),
            }
        ]
    }))
})

app.get('/api/oracle/sectionspace-report/list',  function(req, res) {
    let {limit, start} ={...req.query}
    res.json(Mock.mock({
        'status': 200,
        'total': 10,
        [`data|${limit}`]: [
            {
                "service|1": ['maxdata1', 'maxdata2'],
                "gmt_create": Random.date(),
                "owner|1": ['SYSMAN', 'MDSYS', 'APEX_030200'],
                "segment_name|1":['MGMT_METRICS', 'XDB$H_INDEX', 'XDB$ELEMENT'],
                "used_space":(Math.random() * 1024).toFixed(2),
                "diff_space": (Math.random() * 100).toFixed(2),
                "partition_name|1": ['', 'table_name'],
                "segment_type|1":['TABLE', 'INDEX'],
                "last_ddl_time": Random.date(),
                "tablespace_name": 'SYSAUX',
            }
        ]
    }))
})

app.post('/api/login', function(req,res) {
    let param = req.body;
    if(param.name !== 'admin' || param.password !== '123456') {
        res.json(Mock.mock({
            'status': 200,
            'data': "用户名或密码错误"
        }))
    }else {
        res.json(Mock.mock({
            'status': 200,
            'data': "登录成功"
        })) 
    }
})

app.get('/api/oracle/awr-snapshot/list', function(req, res) {
    let {limit, start} ={...req.query}
    res.json(Mock.mock({
        'status': 200,
        'total': 10,
        [`data|${limit}`]: [
            {
                "service|1": ['maxdata1', 'maxdata2'],
                "gmt_create": Random.date(),
                "id": Math.floor(Math.random() * 1000),
                "end_time": Random.date(),
                "report_name|1":['orcl_awr_31552_31553.txt',"orcl_awr_31552_315.txt"],
                "db_name|1": ['orcl', 'mysql'],
                "begin_snap|1": [31552,31554,31556],
                "end_snap|1":[31552,31554,31556],
                "fscan|1": [369.123,456,789],
                "total": Math.floor(Math.random() * 1000),
                "addm_rptname|1": ['addm report', ''],
                "service|1":['orcl', 'mysql'],
                "isnew|1": [369,147,258],
                "ins": Math.floor(Math.random() * 10),
                "upd": Math.floor(Math.random() * 10),
                "del": Math.floor(Math.random() * 10),
                "lgrd|1": ['orcl', 'mysql'],
                "exec|1": ['update * from', 'delete * from'],
                "finish|1":[true, false],
            }
        ]
    })) 
})

app.get('/api/config/user/list', function(req, res) {
    let {limit, start} ={...req.query}
    res.json(Mock.mock({
        'status': 200,
        'total': 10,
        [`data|${limit}`]: [
            {
                "id": Math.floor(Math.random() * 1000) ,
                "gmt_modified": Random.date(),
                "username|1": ['yekai', 'zhuxu', 'zhouqing'],
                "mail|1":['yekai@taobao.com',"zhuxu@taobao.com"],
                "ww|1": ['叶开', '朱旭', '周青'],
                "mobile|1": ['13575782563','13646833294'],
                "role|1":['dba-sys','dba-dev'],
                "super|1": [1, 0]
            }
        ]
    })) 
})

app.get('/api/config/role/list', function(req, res) {
    let {limit, start} ={...req.query}
    res.json(Mock.mock({
        'status': 200,
        'total': 10,
        [`data|${limit}`]: [
            {
                "id": Math.floor(Math.random() * 1000) ,
                "gmt_create": Random.date(),
                "user_name|1": ['yekai', 'zhuxu', 'zhouqing'],
                "user_id":Math.floor(Math.random() * 1000),
                "user_ww|1": ['叶开', '朱旭', '周青'],
                "role_id": Math.floor(Math.random() * 1000),
                "role_name|1": ['linux-dba-role', 'linux-dba']
            }
        ]
    })) 
})

app.get('/api/config/role-manager/list', function(req, res) {
    let {limit, start} ={...req.query}
    res.json(Mock.mock({
        'status': 200,
        'total': 10,
        [`data|${limit}`]: [
            {
                "id": Math.floor(Math.random() * 1000) ,
                "gmt_create": Random.date(),
                "name|1": ['mys-test-roles', 'dev-test-roles', 'datac-dba-roles'],
                "owner|1":['yekai', 'zhuxu', 'zhouqing'],
                "description|1": ['mysql dev test group', 'beidou dev test group', 'datac-datac2 instance group'],
                "host_gids|1": ['38,41,42,44,45,46,47,49,50', '18,19,20', '20'],
                "user_ids|1": ['2,13,20,21,23,24,26,50,51,52,56,57,58', '18,19,20', '20'],
                "kind|1": ['mysql', 'oracle'],
                "type": "open"
            }
        ]
    })) 
})

app.get('/api/config/host-manager/list', function(req, res) {
    let {limit, start} ={...req.query}
    res.json(Mock.mock({
        'status': 200,
        'total': 10,
        [`data|${limit}`]: [
            {
                "id": Math.floor(Math.random() * 1000) ,
                "gmt_create": Random.date(),
                "name|1": ['alimmdb1.cnz', 'rptdb1.cnz', 'db150.cm2'],
                "os_type|1":['rhel 64bit', 'aix', 'linux'],
                "os_version|1": ['2.6.18-92.el5 #1 SMP', '5300-06-08-0831', '2.6.9-55.ELlargesmp'],
                "db_type|1": [0,1],
                "db_name|1": ['alimm', 'rptdb1', 'kgbdb2', 'misc'],
                "db_role|1": [0,1],
                "up_days": (Math.floor(Math.random() * 1000)) + 'days',
                "up_load":( Math.random() * 100).toFixed(2),
                "ip_addr": Random.domain(),
                "last_time": Random.date(),
                "mon_level": Math.ceil(Math.random() * 1),
                "threshold|1": [1, 0],
                "owner|1": ['叶开', '周青', ''],
                "service|1": ['alimm', 'rptdb1', 'comm']
            }
        ]
    })) 
})

app.get('/api/config/host-group/list', function(req, res) {
    let {limit, start} ={...req.query}
    res.json(Mock.mock({
        'status': 200,
        'total': 10,
        [`data|${limit}`]: [
            {
                "id": Math.floor(Math.random() * 1000) ,
                "gmt_create": Random.date(),
                "name|1": ['alimmdb1.cnz', 'rptdb1.cnz', 'db150.cm2'],
                "description|1":['aix databases group', 'linux-group', 'linux'],
                "type|1": ['oracle', 'mysql'],
                "owner|1": ['yekai','zhouqing', ''],
                "host_ids|1": ['', '1', '3,4,5,6,7,8', '4,5,6,7,8,9'],
                "host_name|1": ['aix130', 'aix150'],
                "status|1":['open', 'close'],
                "member_cnt":Math.ceil( Math.random() * 10),
                "load_avg":['0.28/0.02/0.59', '0.28/0.02/0.5', ''],
                "cpus_avg": ['0.38/0.9/0.59', '0.28/0.02/0.5', ''],
                "cpuw_avg":['0.38/0.9/0.59', '0.28/0.02/0.5', ''],
                "threshold|1": [1, 0],
                "swap_avg": ['0.38/0.9/0.59', '0.28/0.02/0.5', ''],
                "memu_avg": ['0.38/0.9/0.59', '0.28/0.02/0.5', ''],
                "memf_avg": ['0.38/0.9/0.59', '0.28/0.02/0.5', ''],
                "neti_avg": Math.random().toFixed(2),
                "meto_avg":  Math.random().toFixed(2),
                "gmt_modified": Random.date()
            }
        ]
    })) 
})

app.get('/api/config/template-manager/list', function(req, res) {
    let {limit, start} ={...req.query}
    res.json(Mock.mock({
        'status': 200,
        'total': 10,
        [`data|${limit}`]: [
            {
                "id": Math.floor(Math.random() * 1000) ,
                "gmt_create": Random.date(),
                "name|1": ['active session', 'log file sync', 'execute count'],
                "sname|1":['sess', 'lfswt', 'cpus'],
                "kind|1": ['oracle', 'mysql'],
                "type|1": ['SYSCUST', 'SYSWTIM', 'SYSSTAT'],
                "tags|1": ['session,core', 'trans,core', 'core'],
                "level|1": [0,1],
                "soryby":  Math.ceil(Math.random() * 10)
            }
        ]
    })) 
})

app.get('/api/config/except-manager/list', function(req, res) {
    let {limit, start} ={...req.query}
    res.json(Mock.mock({
        'status': 200,
        'total': 10,
        [`data|${limit}`]: [
            {
                "id": Math.floor(Math.random() * 1000) ,
                "gmt_create": Random.date(),
                "err_code|1": ['ORA-00600n', 'ORA-01555', 'RMAN-00569'],
                "err_type|1":['dba-ys', 'dba-dev', 'dba-all'],
                "err_mesg|1": ['internal error code, arguments: [], [], [], [], [], [], [], []', 'snapshot too old: rollback segment number  with name "" too small', 'ALTER DATABASE CLOSE only permitted with no sessions connected'],
                "gmt_modified": Random.date(),
                "times":  Math.ceil(Math.random() * 10)
            }
        ]
    })) 
})

app.get('/api/config/except-manager/list', function(req, res) {
    let {limit, start} ={...req.query}
    res.json(Mock.mock({
        'status': 200,
        'total': 10,
        [`data|${limit}`]: [
            {
                "id": Math.floor(Math.random() * 1000) ,
                "gmt_create": Random.date(),
                "err_code|1": ['ORA-00600n', 'ORA-01555', 'RMAN-00569'],
                "err_type|1":['dba-ys', 'dba-dev', 'dba-all'],
                "err_mesg|1": ['internal error code, arguments: [], [], [], [], [], [], [], []', 'snapshot too old: rollback segment number  with name "" too small', 'ALTER DATABASE CLOSE only permitted with no sessions connected'],
                "gmt_modified": Random.date(),
                "times":  Math.ceil(Math.random() * 10)
            }
        ]
    })) 
})

app.get('/api/config/rank/list', function(req, res) {
    let {limit, start} ={...req.query}
    res.json(Mock.mock({
        'status': 200,
        'total': 10,
        [`data|${limit}`]: [
            {
                "user_name|1": ['admin', 'yekai'],
                "last_time": Random.date(),
                "count":  Math.ceil(Math.random() * 10)
            }
        ]
    })) 
})

app.listen('3000', () => {
    console.log('监听端口 3000')
})