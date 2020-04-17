import {uniqBy} from 'lodash'
export const setDocTitle = (arg) => {
	if (arg)
		return document.title = 'AEGIS-' + arg;
	else
		return document.title = 'AEGIS'
}

export const formatDateTime = (data, format) => {
	if (!data) return;
	let date = new Date(data);
	var o = {
		"M+": date.getMonth() + 1, //month	
		"d+": date.getDate(), //day
		"h+": date.getHours(), //hour	
		"m+": date.getMinutes(), //minute	
		"s+": date.getSeconds(), //second	
		"q+": Math.floor((date.getMonth() + 3) / 3), //quarter	
		"S": date.getMilliseconds() //millisecond
	}
	//格式化年匹配y的时表示有年
	if (/(y+)/.test(format)) format = format.replace(RegExp.$1,
		(date.getFullYear() + "").substr(4 - RegExp.$1.length));
	for (var k in o) if (new RegExp("(" + k + ")").test(format))
		format = format.replace(RegExp.$1,
			RegExp.$1.length == 1 ? o[k] :
				("00" + o[k]).substr(("" + o[k]).length));
	return format;
}

export const getUniqueId = () => {
	let initId = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'g', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9'],
		id = '',
		firstCount = 12,
		secondCount = 5,
		thirdCount = 3;
	let fn = () => {
		return initId[Math.floor(Math.random() * 36)]
	}
	for (let i = 0; i < firstCount; i++) {
		id += fn()
	}
	id += 'ox1234567890abcdef'.split('')[Math.floor(Math.random() * 18)];
	for (let i = 0; i < secondCount; i++) {
		id += fn();
	}
	id += '0123456789'.split('')[Math.floor(Math.random() * 10)];
	for (let i = 0; i < thirdCount; i++) {
		id += fn();
	}
	return id;
}

export const formatSize = (bytes, unit, width) => {
	bytes = Number(bytes);
	// if (bytes < 1 && bytes > 0)
	if (typeof bytes !== 'number' || isNaN(bytes)) bytes = 0;
	if (bytes < 0) bytes = 0;
	if (typeof width === 'undefined') width = 2;
	if (typeof unit === 'undefined') unit = 'B';
	var num = Math.pow(10, width);
	var sizes = ['K', 'M', 'G', 'T', 'P'];
	if (unit) {
		sizes.unshift('')
	} else {
		sizes.unshift('Byte')
	}
	if (bytes === 0) return '0 ' + sizes[0] + unit;
	var i = Math.floor(Math.log(bytes) / Math.log(1024));
	// for 0.xxxx number
	if (i < 0) i = 0;
	if (sizes[i] === 'B') num = 1;
	if (i >= 5) i = 5;
	return Math.round(bytes / Math.pow(1024, i) * num) / num + ' ' + sizes[i] + unit
}

export function sizeRoundToString(size) {
	var K = 1024;
	var M = K * K;
	var G = M * K;
	var T = G * K;
	var P = T * K;

	var sizeMap = {
		'K': K,
		'M': M,
		'G': G,
		'T': T,
		'P': P
	};

	var suffixes = ['P', 'T', 'G', 'M', 'K'];
	function round() {
		var s = suffixes.shift();
		if (!size || size < 1024) {
			return size + ' B'
		}

		var q = sizeMap[s];
		var ret = size / q;
		if (ret >= 1) {
			return toFixed(ret, 2) + ' ' + s
		} else {
			return round()
		}
	}

	return round()
}

export const exportTableData = (name, contents, mediaType) => {
	let mimeType = 'text/plain';
	if (mediaType) {
		mimeType = mediaType;
	}
	let uri = 'data:text/csv;charset=utf-8,\ufeff' + encodeURIComponent(contents);
	mimeType = mimeType || 'text/plain';
	//IE浏览器可以用window.navigator.msSaveOrOpenBlob来判断是否支持createObjectURL对象
	if (window.navigator && window.navigator.msSaveOrOpenBlob) {
		window.navigator.msSaveOrOpenBlob(blob, name);
	}
	let alink = document.createElement('a');
	alink.href = uri;
	alink.download = name;
	document.body.appendChild(alink);
	alink.onclick = (e) => {
		setTimeout(function () {
			window.URL.revokeObjectURL(alink.href)
		}, 1500)
	}
	alink.click();
	alink.remove()
}

export const exportTableData2 = (worksheet, str) => {
	let uri = 'data:application/vnd.ms-excel;base64,';
	let template = `<html xmlns:o="urn:schemas-microsoft-com:office:office" 
      xmlns:x="urn:schemas-microsoft-com:office:excel" 
      xmlns="http://www.w3.org/TR/REC-html40">
			<head>
			  <!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet>
        <x:Name>${worksheet}</x:Name>
        <x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet>
				</x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]-->
			 	<worksheet:nam>${worksheet}</worksheet:nam>
				</head>
			<body><table>${str}</table></body></html>`;
	//下载模板;
	let dlink =  document.createElement('a');
	let base64 = function(s) { return window.btoa(unescape(encodeURIComponent(s))) };
	var ctx = {worksheet: worksheet || 'Worksheet', table: str}
	dlink.href = uri +  base64(format(template, ctx));
	dlink.download = worksheet;
	dlink.click();
	dlink.remove()
}

let format = function (s, c) {
	return s.replace(/{(\w+)}/g,
		function (m, p) { return c[p]; })
}


export const changeElementTheme = (theme) => {
	const head = document.head || document.getElementsByTagName('head')[0];

	// 卸载原有的主题样式，设置定时器是为了防止抖动
	for (let i = head.children.length - 1; i > -1; i--) {
		const currentChild = head.children[i];
		if (currentChild.rel === 'stylesheet' && currentChild.href.includes('aegis')) {
			setTimeout(() => {
				currentChild.parentNode.removeChild(currentChild);
			}, 500);
		}
	}

	// '/public' 映射到 '/'，各位可根据情况设置相应路径
	const urls = ['/css'];
	urls.forEach(site => {
		const link = document.createElement('link');
		link.rel = 'stylesheet';
		link.type = 'text/css';
		link.href = `${site}/aegis-${theme}.css`;
		head.appendChild(link);
	});
} 

export const getService = (data) => {
	if(!!data){
		let arr = data.map(item => {
			return {
				label: item.service,
				value: item.service
			}
		})
		return uniqBy(arr, (item) => item.value)
	}
	else return []
}

export const isPhoneNumber = (str) => {
  let reg = /^((13[0-9])|(17[0-1,6-8])|(15[^4,\\D])|(18[0-9]))\d{8}$/
  if (!reg.test(str)) {
    return false
  }
  return true
}

export const isEmail = (str) => {
  let reg = /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/
  if (!reg.test(str)) return false
  return true
}
//阻止事件冒泡
export const stopBubble = (e) => {    
	//如果提供了事件对象，则这是一个非IE浏览器    
	if ( e && e.stopPropagation ){  
			//因此它支持W3C的stopPropagation()方法    
			e.stopPropagation();    
	} else {   
			//否则，我们需要使用IE的方式来取消事件冒泡    
			window.event.cancelBubble = true;    
	}   
} 

export const setIco = () => {
	let ico = document.createElement('link');
	ico.setAttribute('rel', 'shortcut icon');
	ico.setAttribute('type', 'image/x-ico');
	ico.setAttribute('href', '/public/favicon.ico');
	document.head.append(ico);
}