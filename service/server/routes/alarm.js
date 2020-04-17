var express = require('express');
var router = express.Router();
const db = require('../mysql/dbConfig.js')

router.get('/list', async function(req, res) {
	var param = req.query, 
	sql = 'select * from alerts where',
	sqlCount = 'select count(*) as total from alerts where',
	direction = 'asc', 
	orderBy= 'gmt_create',
	sqlStr = ''; 
	arg = [];
	if(param.sname && param.sname !== '') {
		sqlStr+=` and sname='${param.sname}'`
	}
	if(param.hostname && param.hostname !== ''){
    sqlStr +=` and host_name='${param.hostname}'`
	}
	if(param.starttime && param.endtime) {
		sqlStr+= ` and 'gmt_create' between '${param.starttime}' and '${param.endtime}'`
	}
	if(param.sort) {
		direction	= param.sort.startsWith('-') ? 'asc' : 'desc';
		orderBy = param.sort.slice(1);
		sqlStr+=` order by '${orderBy}' ${direction}`
	 }
	 sql+=sqlStr;
	 sqlCount += sqlStr;
	 if(param.start && param.limit) {
		sql+=` limit  ${param.start},  ${param.limit}`
	 }
	if(sql.indexOf('and') === -1) {
		sql = sql.replace('where', '');
	}else {
	  sql = sql.replace('and', (it) => {
      return ''
		})
	}
	if(sqlCount.indexOf('and') === -1) {
		sqlCount = sqlCount.replace('where', '');
	}else {
	  sqlCount = sqlCount.replace('and', (it) => {
      return ''
		})
	}
	var total = 0;
	await db.query(sqlCount,(err,rows) => {
		total = JSON.parse(JSON.stringify(rows))[0].total;
	})
	db.query(sql, (err,rows) => {
		console.log(rows);
   res.json({
		 status: 200,
		 error_code: 200,
		 data: JSON.parse(JSON.stringify(rows)),
		  total: total,
	 })
	});
})


router.get('/alert-code/list', async function(req, res) {
	var param = req.query, 
	sql = 'select *, concat(err_code, "\r\t", err_mesg) as message from alerts_codes where',
	sqlCount = 'select count(*) as total from alerts_codes where',
	direction = 'asc', 
	orderBy= 'gmt_create',
	sqlStr = ''; 
	arg = [];
	if(param.err_code && param.err_code !== '') {
		sqlStr+=` and err_code='${param.err_code}'`
	}
	if(param.err_mesg && param.err_mesg !== ''){
    sqlStr +=` and err_mesg='${param.err_mesg}'`
	}
	if(param.starttime && param.endtime) {
		sqlStr+= ` and 'gmt_create' between '${param.starttime}' and '${param.endtime}'`
	}
	if(param.sort) {
		direction	= param.sort.startsWith('-') ? 'asc' : 'desc';
		orderBy = param.sort.slice(1);
		sqlStr+=` order by '${orderBy}' ${direction}`
	 }
	 sql+=sqlStr;
	 sqlCount += sqlStr;
	 if(param.start && param.limit) {
		sql+=` limit  ${param.start},  ${param.limit}`
	 }
	if(sql.indexOf('and') === -1) {
		sql = sql.replace('where', '');
	}else {
	  sql = sql.replace('and', (it) => {
      return ''
		})
	}
	if(sqlCount.indexOf('and') === -1) {
		sqlCount = sqlCount.replace('where', '');
	}else {
	  sqlCount = sqlCount.replace('and', (it) => {
      return ''
		})
	}
	var total = 0;
	await db.query(sqlCount,(err,rows) => {
		total = JSON.parse(JSON.stringify(rows))[0].total;
	})
	db.query(sql, (err,rows) => {
		console.log(rows);
   res.json({
		 status: 200,
		 error_code: 200,
		 data: JSON.parse(JSON.stringify(rows)),
		  total: total,
	 })
	});
})

module.exports = router;