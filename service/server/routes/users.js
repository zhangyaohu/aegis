var express = require('express');
var router = express.Router();
const db = require('../mysql/dbConfig.js')

/* GET users listing. */
router.get('/list', async function (req, res, next) {
  var param = req.query,
    sql = 'select * from users where',
    sqlCount = 'select count(*) as total from users where',
    direction = 'asc',
    orderBy = 'gmt_create',
    sqlStr = '';
  arg = [];
  if (param.id && param.id !== '') {
    sqlStr += ` and id='${param.id}'`
  }
  if (param.user_name && param.user_name !== '') {
    sqlStr += ` and username='${param.user_name}'`
  }
  if (param.service && param.service !== '') {
    sqlStr += ` and service='${param.service}'`
  }
  if (param.owner && param.owner !== '') {
    sqlStr += ` and owner='${param.owner}'`
  }
  if (param.object_type && param.object_type) {
    sqlStr += `  and object_type='${param.object_type}'`
  }
  if (param.starttime && param.endtime) {
    sqlStr += ` and gmt_create between '${param.starttime}' and '${param.endtime}'`
  }
  if (param.sort) {
    direction = param.sort.startsWith('-') ? 'asc' : 'desc';
    orderBy = param.sort.slice(1);
    sqlStr += ` order by '${orderBy}' ${direction}`
  }
  sql += sqlStr;
  sqlCount += sqlStr;
  if(param.start && param.limit) {
		sql+=` limit  ${param.start},  ${param.limit}`
	 }
  if (sql.indexOf('and') === -1) {
    sql = sql.replace('where', '');
  } else {
    sql = sql.replace('and', (it) => {
      return ''
    })
  }
  if (sqlCount.indexOf('and') === -1) {
    sqlCount = sqlCount.replace('where', '');
  } else {
    sqlCount = sqlCount.replace('and', (it) => {
      return ''
    })
  }
  var total = 0;
  await db.query(sqlCount, (err, rows) => {
    total = JSON.parse(JSON.stringify(rows))[0].total;
  })
  db.query(sql, (err, rows) => {
    res.json({
      status: 200,
      error_code: 200,
      data: JSON.parse(JSON.stringify(rows)),
      total: total
    })
  });
});

router.get('/role/list', async function (req, res, next) {
  var param = req.query,
    sql = 'select * from roles_users where',
    sqlCount = 'select count(*) as total from roles_users where',
    direction = 'asc',
    orderBy = 'gmt_create',
    sqlStr = '';
  arg = [];
  if (param.id && param.id !== '') {
    sqlStr += ` and id='${param.id}'`
  }
  if (param.user_name && param.user_name !== '') {
    sqlStr += ` and user_name='${param.user_name}'`
  }
  if (param.owner && param.owner !== '') {
    sqlStr += ` and owner='${param.owner}'`
  }
  if (param.roles && param.roles) {
    sqlStr += `  and roles='${param.roles}'`
  }
  if (param.starttime && param.endtime) {
    sqlStr += ` and gmt_create between '${param.starttime}' and '${param.endtime}'`
  }
  if (param.sort) {
    direction = param.sort.startsWith('-') ? 'asc' : 'desc';
    orderBy = param.sort.slice(1);
    sqlStr += ` order by '${orderBy}' ${direction}`
  }
  sql += sqlStr;
  sqlCount += sqlStr;
  if(param.start && param.limit) {
		sql+=` limit  ${param.start},  ${param.limit}`
	 }
  if (sql.indexOf('and') === -1) {
    sql = sql.replace('where', '');
  } else {
    sql = sql.replace('and', (it) => {
      return ''
    })
  }
  if (sqlCount.indexOf('and') === -1) {
    sqlCount = sqlCount.replace('where', '');
  } else {
    sqlCount = sqlCount.replace('and', (it) => {
      return ''
    })
  }
  var total = 0;
  await db.query(sqlCount, (err, rows) => {
    total = JSON.parse(JSON.stringify(rows))[0].total;
  })
  db.query(sql, (err, rows) => {
    res.json({
      status: 200,
      error_code: 200,
      data: JSON.parse(JSON.stringify(rows)),
      total: total
    })
  });
});

router.get('/roles/list', async function (req, res, next) {
  var param = req.query,
    sql = 'select * from roles where',
    sqlCount = 'select count(*) as total from roles where',
    direction = 'asc',
    orderBy = 'gmt_create',
    sqlStr = '';
  arg = [];
  if (param.id && param.id !== '') {
    sqlStr += ` and id='${param.id}'`
  }
  if (param.name && param.name !== '') {
    sqlStr += ` and name='${param.name}'`
  }
  if (param.owner && param.owner !== '') {
    sqlStr += ` and owner='${param.owner}'`
  }
  if (param.roles && param.roles) {
    sqlStr += `  and roles='${param.roles}'`
  }
  if (param.starttime && param.endtime) {
    sqlStr += ` and gmt_create between '${param.starttime}' and '${param.endtime}'`
  }
  if (param.sort) {
    direction = param.sort.startsWith('-') ? 'asc' : 'desc';
    orderBy = param.sort.slice(1);
    sqlStr += ` order by '${orderBy}' ${direction}`
  }
  sql += sqlStr;
  sqlCount += sqlStr;
  if(param.start && param.limit) {
		sql+=` limit  ${param.start},  ${param.limit}`
	 }
  if (sql.indexOf('and') === -1) {
    sql = sql.replace('where', '');
  } else {
    sql = sql.replace('and', (it) => {
      return ''
    })
  }
  if (sqlCount.indexOf('and') === -1) {
    sqlCount = sqlCount.replace('where', '');
  } else {
    sqlCount = sqlCount.replace('and', (it) => {
      return ''
    })
  }
  var total = 0;
  await db.query(sqlCount, (err, rows) => {
    total = JSON.parse(JSON.stringify(rows))[0].total;
  })
  db.query(sql, (err, rows) => {
    res.json({
      status: 200,
      error_code: 200,
      data: JSON.parse(JSON.stringify(rows)),
      total: total
    })
  });
});


router.get('/rank/list', async function (req, res, next) {
  var param = req.query,
    sql = 'select  *, count(*) as cnt, MAX(gmt_create) as last_time  from users_logins where',
    sqlCount = 'select count(*) as cnt from users_logins where',
    direction = 'asc',
    orderBy = 'last_time',
    sqlStr = '';
  arg = [];
  if (param.id && param.id !== '') {
    sqlStr += ` and id='${param.id}'`
  }
  if (param.name && param.name !== '') {
    sqlStr += ` and name='${param.name}'`
  }
  if (param.owner && param.owner !== '') {
    sqlStr += ` and owner='${param.owner}'`
  }
  if (param.roles && param.roles) {
    sqlStr += `  and roles='${param.roles}'`
  }
  if (param.starttime && param.endtime) {
    sqlStr += ` and gmt_create between '${param.starttime}' and '${param.endtime}'`
  }
  if (param.sort) {
    direction = param.sort.startsWith('-') ? 'asc' : 'desc';
    orderBy = param.sort.slice(1);
    sqlStr += ` order by '${orderBy}' ${direction}`
  }
  sqlStr += ` group by user_name`
  sql += sqlStr;
  sqlCount += sqlStr;
  if(param.start && param.limit) {
		sql+=` limit  ${param.start},  ${param.limit}`
	 }
  if (sql.indexOf('and') === -1) {
    sql = sql.replace('where', '');
  } else {
    sql = sql.replace('and', (it) => {
      return ''
    })
  }
  if (sqlCount.indexOf('and') === -1) {
    sqlCount = sqlCount.replace('where', '');
  } else {
    sqlCount = sqlCount.replace('and', (it) => {
      return ''
    })
  }

  var total = 0;
  await db.query(`SELECT count(t.cnt) as total FROM (${sqlCount}) as t`, (err, rows) => {
    total = JSON.parse(JSON.stringify(rows))[0].total;
    console.log(total);
  })
  db.query(sql, (err, rows) => {
    res.json({
      status: 200,
      error_code: 200,
      data: JSON.parse(JSON.stringify(rows)),
      total: total
    })
  });
});

module.exports = router;
