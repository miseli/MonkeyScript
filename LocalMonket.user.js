/* eslint-disable no-undef */
/* eslint-disable no-eval */
// ==UserScript==
// @name         LocalMonket
// @namespace    http://tampermonkey.net/
// @version      1.5.6.2025.05.13
// @description  relayout pages on browsing webpages
// @author       Cube
// @match        *://*/*
// @match        http://192.168.1.102:1020/*
// @match        http://10.10.10.83/*
// @match        http://10.10.10.20/*
// @match        http://10.10.15.32/*
// @exclude      *://pt00.net/*
// @exclude      *://iFastNet.com/*
// @exclude      *://*.126.com/*
// @exclude      *://*.163.com/*
// @exclude      *://www.tutorialspoint.com/*
// @exclude      *://weui.io/*
// @exclude      *://jsrun.pro/*
// @exclude      *://*.aliyun.com/*
// @exclude      *://localhost:8080/*
// @license      MIT
//// @require      file:///D:/Dist/main.js
// @require      file:///G:/Users/Administrator/Desktop/personal/MonkeyToolCollection/dist/main.js

// @run-at       document-start
// @grant        unsafeWindow
// @grant        GM_download
// @grant        GM_openInTab
// ==/UserScript==

// js的页面生命周期 https://www.jianshu.com/p/5674c4cd9f3a
// 如果grant使用unsafeWindow,则window对象会被包装,使用unsafeWindow访问原生window.使用none则不然
// @webRequest   {"selector":{"include":"*://*vue.min.js", "exclude": "*://purge.jsdelivr.net/*"},"action":{"redirect":"https://cn.vuejs.org/js/vue.js"}}

// 猴子文档地址
// https://www.tampermonkey.net/documentation.php?version=4.11&ext=dhdg
// jquery更换标识符:  $j = $.noConflict()

// jq 获取事件函数的方法 来自:https://blog.csdn.net/zlllxl2002/article/details/46804117
// jq 1.x 元素的jqueryxxxxxxx属性对应着$.cache[属性值]
// jq 2.x cache被闭包处理,无法直接得到,所以可以用$._data(元素)
// jq 3.x 同2.x, 也可以直接通过元素.jqueryxxxxxxxx得到

// 鼠标选中,控制台输入window.getSelection().toString()

// 查找指定子元素的vue对象
/*
$$($0).data('find', false).parents().each((i,a)=>{
	if('__vue__' in a && !$$($0).data('find')){
		console.log($$(a))
		$$($0).data('find', true)
	}
})
*/

// 83平台
// 杨孝
// cookiestxtuser=lhshrl; cookiestxtpwd=774f2ad691509600; ASPSESSIONIDACRBTTAB=NGAIEAJAANEHGINGIEPOPMIK; usrid=434; cookiesname=%D1%EE%D0%A2; logoid=587292

// 王彦军
// cookiestxtpwd=224a08b570d10b63; cookiestxtuser=wyj; ASPSESSIONIDACRDSTBA=BMHJFNOBPPPAIMNPGMBJHBBL; usrid=39; cookiesname=%CD%F5%D1%E5%BE%FC; logoid=587270

/*
let c = 'cookiestxtpwd=224a08b570d10b63; cookiestxtuser=wyj; ASPSESSIONIDACRDSTBA=BMHJFNOBPPPAIMNPGMBJHBBL; usrid=39; cookiesname=%CD%F5%D1%E5%BE%FC; logoid=587270'.replaceAll(/ +/g,'')
let d = c.split(';')
for(let item of d){
	console.log(item)
	document.cookie = item
}

let c = 'cookiestxtpwd=224a08b570d10b63; cookiestxtuser=wyj; ASPSESSIONIDACRDSTBA=BMHJFNOBPPPAIMNPGMBJHBBL; usrid=39; cookiesname=%CD%F5%D1%E5%BE%FC; logoid=587270'.replaceAll(/ +/g,'')
let d = c.split(';')
for(let item of d){
	console.log(item)
	$cookies.set.apply(window, item.split('='))
}

$$("#mainFrame1").load(function(){.....}) 等待frame加载
framedocument = document.getElementById('mainFrame1').contentDocument || $("#mainFrame1")[0].contentDocument || document.frames['mainFrame1'].document;
*/

// 全民K歌曲
// $ajax.get('https://node.kg.qq.com/cgi/fcgi-bin/kg_ugc_get_homepage',{
//     params:{
//         jsonpCallback: 'cube',
//         type:'get_uinfo',
//         start: 1,
//         num: 15,
//         share_uid: '6a959f842424338b'
//     }
// }).then(function(res){
//     let cube = function(data){
//         console.log(data.data.ugclist)
//     }
//     eval(res.data)
// })

// hex转string
// let hex="74 6F 3A E4 B8 AD E5 BF 83 E6 9C BA E6 88 BF 32 30 30 30 2D 47 45 31 2F 30 2F 35";
// decodeURIComponent(hex.replace(/(\w+)[\s]*/g, '%$1'))

// 浏览器标签页显示与隐藏事件 visibilitychange
// 网页关闭先执行onbeforeunload,再执行window.onunload
// window.document.addEventListener('visibilitychange', function() {
//     if (window.document.visibilityState === 'visible') {
//         console.log('我回来了',this, new Date().toLocaleTimeString(), {begintime, randomTime})
//     } else if (window.document.visibilityState === 'hidden') {
//         console.log('我离开一会',this, new Date().toLocaleTimeString(), {begintime, randomTime})
//     }
// });

/******************************* Common Start ********************************/

/* 异步加载script脚本 */
function asyncLoadScript(url){
	return new Promise((resolve, reject)=>{
		let script = document.createElement('script')
		script.type = 'text/javascript'
		if (script.readyState) {
			script.onreadystatechange = function() {
				if (script.readyState == 'loaded' || script.readyState == 'complete') {
					script.onreadystatechange = null
					debugger
					resolve(script)
				}
			}
		}
		else {
			script.onload = () => resolve(script)
			script.onerror = () => reject(new Error(`Script load error for ${url}`));
		}

		script.src = url
		document.head.appendChild(script)
	})
}

// Promise.all([asyncloadScript('https://cdnjs.cloudflare.com/ajax/libs/jsencrypt/3.3.2/jsencrypt.js'),
// asyncloadScript('https://cdnjs.cloudflare.com/ajax/libs/sweetalert2/11.11.0/sweetalert2.all.js')]).then(res=>{
//  console.log('脚本加载完成', res)
// })
// let cdnlist = [
//   'https://unpkg.com/ajax-hook@2.0.3/dist/ajaxhook.min.js',
//   'https://cdnjs.cloudflare.com/ajax/libs/sweetalert2/11.14.4/sweetalert2.all.min.js',
//   'https://cdnjs.cloudflare.com/ajax/libs/jsencrypt/3.3.2/jsencrypt.min.js',
//   'https://cdnjs.cloudflare.com/ajax/libs/marked/14.1.3/marked.min.js',
//   'https://cdnjs.cloudflare.com/ajax/libs/jsrsasign/11.1.0/jsrsasign-all-min.js',
//   'https://cdnjs.cloudflare.com/ajax/libs/pinyin-pro/3.26.0/index.min.js',
// ]

function add_style(style_text){
	let s = unsafeWindow.document.createElement('style')
	s.type = 'text/css'
	s.textContent = style_text
	unsafeWindow.document.head.appendChild(s)
	console.log(s)
}

function add_script(script_text){
	let s = unsafeWindow.document.createElement('script')
	s.text = script_text
	unsafeWindow.document.body.appendChild(s)
	console.log(s)
}

function AddScript(src) {
	var s = $$('<script>').attr("src", src)
	$$("head").append(s[0])
}

function AddCss(src) {
	var s = $$('<link>').attr({ href: src, rel: "stylesheet" })
	$$("head").append(s[0])
}

/* 创建一个按钮 */
/**
 * @param {object or string}  options      包含{text,width,height,right,bottom,color,background,border}
 * @param {function}  clickEventFn 按钮单击事件函数
 * @param {Boolean} hover        是否隐藏按钮
 */
function addButton(options, clickEventFn, ishover) {
	const defaultOptions = {
		text: '点击我',
		width: '76px',
		height: '34px',
		right: '1000px',
		bottom: '580px',
		color: 'white',
		background: '#006158',
		border: '#cecfcf solid 1px',
		callback: (e)=>{console.log(e)},
		hover: true
	}
	if(typeof(options)=='string'){
		options = {text: options}
	}

	options = {...defaultOptions, ...options}


	let {text,width,height,right,bottom,color,background,border,callback,hover} = options
		let style = document.createElement('style')
		style.innerText = `

		.btn1 {
			color: ${color};
			background: ${background};
			border: ${border};
			width: ${width};
			height: ${height};
			right: ${right};
			bottom: ${bottom};
			position: absolute;
			border-radius: 3px;
			z-index: 99999;
		}
	`
		if(hover){
			style.innerText += `
			.btn1:hover {
				right: 0px;
			}

			.btn1 {
				color: white;
				cursor: pointer;
				background: rgb(0, 97, 88);
				border-radius: 3px;
				width: 76px;
				height: 34px;
				right: -66px;
				bottom: 30px;
				position: absolute;
				z-index: 99999;
				border: 1px solid rgb(206, 207, 207);
				transition: right 0.2s cubic-bezier(0.55, 0.06, 0.68, 0.19)
			}`
	}
	let btn = document.createElement('button')
	btn.classList.add('btn1')
	btn.innerText = text

	btn.addEventListener('click', (e) => callback(e))

	document.body.appendChild(btn)
	document.head.appendChild(style)
	return btn;
}

addButton.help = function(){
	const defaultOptions = {
		text: '点击我',
		width: '76px',
		height: '34px',
		right: '1000px',
		bottom: '580px',
		color: 'white',
		background: '#006158',
		border: '#cecfcf solid 1px',
		callback: (e)=>{console.log(e)},
		hover: true
	}
	console.log(defaultOptions)
}

/* 对比两个对象的不同,仅限于一层,不进行深度递归对比 */
function diff(obj1, obj2) {
	const changes = {
		added: {},
		deleted: {},
		modified: {}
	};

	// 找出obj2中新增的属性
	for (const key in obj2) {
		if (!(key in obj1)) {
			changes.added[key] = obj2[key];
		} else if (obj2[key] !== obj1[key]) {
			// 找出被修改的属性（这里只考虑简单的值比较，不包括数组和对象深度的比较）
			changes.modified[key] = {
				from: obj1[key],
				to: obj2[key]
			};
		}
	}

	// 找出obj1中被删除的属性
	for (const key in obj1) {
		if (!(key in obj2)) {
			changes.deleted[key] = obj1[key];
		}
	}

	return changes;
}

/* 随机产生一个指定月份中的日期 */
function getRandomDate(year, month) {
	// 创建一个表示月份第一天的Date对象
	// 注意月份需要+1以匹配人类的月份计数习惯（1-12）
		let today = new Date()

		if(year == undefined){
			month = today.getMonth()
			year = today.getFullYear()
		}else{
			month -= 1
		}

	let date = new Date(year, month, 1);

	// 获取该月份的天数
	// 注意getMonth()返回的是0-11的月份，所以这里直接使用传入的month即可
	let daysInMonth = new Date(year, month + 1, 0).getDate();

	// 生成一个随机天数
	let randomDay = Math.floor(Math.random() * daysInMonth) + 1;

	// 设置date对象为月份内的随机一天
	date.setDate(randomDay);

	// 格式化日期为YYYY-MM-DD
	// let formattedDate = date.getFullYear() + '-' + ('0' + (date.getMonth() + 1)).slice(-2) + '-' + ('0' + date.getDate()).slice(-2);
	let formattedDate = (date.getMonth() + 1) + '月' + ('0' + date.getDate()).slice(-2) + '日';
	return formattedDate;
}

/* 随机产生一个5位整数 */
function generateRandom5DigitNumber() {
	// 生成一个0到99999之间的整数
	let num = Math.floor(Math.random() * 100000);
	// 如果需要确保是5位数（即包括00000），则这一步其实是不必要的，
	// 因为Math.floor(Math.random() * 100000)已经涵盖了0到99999的范围
	// 但如果你想要确保结果总是以非零开头，可以稍微调整逻辑
	// 例如，通过 num = num % 90000 + 10000; 但这会排除00000到09999

	// 直接返回结果，因为已经涵盖了00000到99999
	return num.toString().padStart(5, '0'); // 使用padStart确保总是5位数
}

/* 创建一个半透明的log信息面板,展示消息用 */
function add_log_note_panel(){
	let lognote = `<div id="lognote" style="position: absolute; background-color: rgb(133 133 133 / 48%); width: 280px; height: 400px; border-radius: 10px; white-space: pre; cursor: default; bottom: 5px; right: 5px; user-select: none;">
			1.asdffffffffffff
			2.asdfffffffffff
			3.zxcvcvvvvvvvvvv
		</div>`
	// }
	lognote = $$(lognote)[0]
	document.body.appendChild(lognote)
	return lognote
}

/* 限流 */
function throttle(fn, interval) {
	// 维护上次执行的时间
	let last = 0;

	return function () {
		const context = this;
		const args = arguments;
		const now = Date.now();
		// 根据当前时间和上次执行时间的差值判断是否频繁
		if (now - last >= interval) {
			last = now;
			fn.apply(context, args);
		}
	};
}
/*防抖*/
function debounce(fn, delay) {
	// 记录定时器返回的ID
	let timer = null;

	return function () {
		const context = this;
		const args = arguments;
		// 当有事件触发时清除上一个定时任务
		if (timer) {
			clearTimeout(timer);
		}
		// 重新发起一个定时任务
		timer = setTimeout(() => {
			fn.apply(context, args);
		}, delay);
	};
}

/*AES加密*/
function aes_encrypt(text, rkey){
	let encrypt = $cryptojs.AES.encrypt(text, $cryptojs.enc.Utf8.parse(rkey), {
		mode: $cryptojs.mode.ECB,
		padding: $cryptojs.pad.Pkcs7
	}).toString();
	return encrypt
}


/******************************** Common End *********************************/

function 自动刷新进出记录(){
	let style = document.createElement('style')
	style.innerText = `
	#btn1:hover {
		right: 0px;
	}

	#btn1 {
		color: white;
		cursor: pointer;
		background: rgb(0, 97, 88);
		border-radius: 3px;
		width: 76px;
		height: 34px;
		right: -66px;
		bottom: 30px;
		position: absolute;
		z-index: 99999;
		border: 1px solid rgb(206, 207, 207);
		transition: right 0.2s cubic-bezier(0.55, 0.06, 0.68, 0.19)
	}`

	let btn = document.createElement('button')
	btn.id = 'btn1'

	document.body.appendChild(btn)
	document.head.appendChild(style)

	btn.style = `color: white;background: #006158; border-radius: 3px; width: 76px; height: 34px; right: 0px; bottom: 30px; position: absolute; z-index: 99999; border: #cecfcf solid 1px; `
	btn.innerText = '自动更新'
	btn.addEventListener('click',function () {
		new $swal('开始检查')
		let doClick = ()=>{
			console.warn('刷新')
			$$('#app > div > div.h-page-content > div.h-page-search.row-amount-4 > form > div.h-page-search__action > button.el-button.el-button--primary, #app > div > div.h-page-content > div.h-page-search.row-amount-6 > form > div.h-page-search__action > button.el-button.el-button--primary').trigger('click')
		}
		let tid = 0, pre = ''
		const handler = async function() {

			let beginDate = new Date(),
				endDate = new Date()
			beginDate.setHours(8,0,0,0)
			beginDate = beginDate.toISOString().replace(/Z$/,'+08:00')
			endDate.setHours(31,59,59,999)
			endDate = endDate.toISOString().replace(/Z$/,'+08:00')
			let postdata = {
				// "organization": "8a4903423be1411c90b2b316c29a6dd1",
				"doorRegionIndexCode": "e1429a6716b5452fa73066a27eac0b52",
				"isPic": 2,
				"pageSize": 100,
				"pageNo": 1,
				"subOrg": 1,
				"pageType": "1",
				"isEncrypt": 1,
				// "beginDate": "2024-09-17T00:00:00.000+08:00",
				// "endDate": "2024-09-17T23:59:59.999+08:00",
				beginDate,
				endDate,
				"extendPropertys": "{}"
			}

			let r = await $axios.post('https://10.10.54.18/acs/ui/v1/accessEventQuery/searchEventLog', postdata).then(res => {
				let tmp_personId = res.data.data.rows[0].personId,
					ret = false
				console.log(res.data.data.rows)
				let {personName, personId} = res.data.data.rows[0]
				console.warn({personName, personId, pre})
				if (pre == '') {
					pre = tmp_personId
				} else {
					if (pre != tmp_personId) {
						pre = tmp_personId
						ret = true
					}
				}
				return ret;
			})
			if(r){
				doClick()
			}
			clearInterval(tid)
			tid = setInterval(handler, 30000)
		}
		handler()
	})
}

(function() {
	'use strict';
	let module = {...GM_info.Cube};
	console.log(module)
	for (let item in module){
		// debugger
		let key = item.toLowerCase()
		unsafeWindow['$'+key] = module[item]
	}
	// console.table(module)
	unsafeWindow.$module = module
	unsafeWindow.$window = window
	unsafeWindow.$console = console
	// unsafeWindow.$DPlayer = DPlayer

	/*
	unsafeWindow['cube'] = $BreakOn(unsafeWindow,'XM_SERVER_CLOCK')
	if(location.host == 'github.com'){
		location.href = location.href.replace("https://github.com", "https://hub.fastgit.org")
	}
	*/
	$$(function(){
		console.log('日志',location.href)
		//jq.css不支持添加important样式,要么用jq.attr,要么用原生.
		// if(location.host != 'github1s.com'&&location.host != '192.168.1.102:8080'&&location.host != 'winmicr-3ne6125:8080'){
		//     $$("body")[0].style.setProperty("background","#CCE8CC","important")
		//     $$("body")[0].style.setProperty("background-color","#CCE8CC","important")
		// }
		// 辽宁干部在线学习网(新版),进入开始学习中单独刷 2025年更新
		if(/zyjs\.lngbzx\.gov\.cn.+video_detail/.test(location.href)){
			// return
			let nbtn = $$(`<button>刷单课</button>`)
			$$('body').append(nbtn)
			nbtn.attr('style',`color: white;background: #006158; border-radius: 3px; width: 76px; height: 34px; right: 0px; bottom: 80px; position: absolute; z-index: 99999; border: #cecfcf solid 1px; `)
			let getcourseinfo = async function(){
				/* 进入视频页获取课程信息 */
				let d = {"playCourse":"d1badf044b5c4c4a8c14537ccf14328b","user_course_id":14747131,"scormData":[{"sco_id":"res01","lesson_location":"30","session_time":30}]}
				let dd = d.scormData[0]

				let el = $$('div.bodys.is_cont')[0].__vue__
				let user_course_id = el.details_list.user_course_id
				let playCourse = $qs.parse(location.href)[Object.keys($qs.parse(location.href)).filter(item=>/playCourse/.test(item)).join('')]
				d.playCourse = playCourse
				d.user_course_id = user_course_id
				dd.lesson_location = 60*60
				dd.session_time = 60*60
				return [d];
			}


			/* 函数内周期刷课,刷完返回*/
			let shuakehandler = async function() {
				let d = await getcourseinfo()
				d = d[0]
				return new Promise(async function(resolve, reject) {
					async function inhandler(d) {
						let tid = setTimeout(function() {
							inhandler(d)
						}, 16000)
						let _axios = $axios.create({ headers: { Signature: 'adfasfsdaffsdafsdafaj' } })
						let ret = await _axios.post('https://zyjs.lngbzx.gov.cn/trainee/index/user_course', d)
						ret = ret.data
						if (ret.code != 0) {
							console.log('错误', d)
							reject('错误', d)
							clearTimeout(tid)
						} else {
							if ('cheat' in ret.data) {
								//alert(ret.data.message)
								console.log(ret.data.message, ret.data.learning_progress, new Date().toLocaleTimeString())
							} else {
								//alert(ret.message)
								console.log(ret.message, ret.data.learning_progress, new Date().toLocaleTimeString())
								if (ret.data.learning_progress >= 100 || ret.data.learning_progress == undefined) {
									console.log('完成', d)
									resolve('完成', d)
									clearTimeout(tid)
									return true
								}
							}
						}
					}
					inhandler(d)
				})
			}

			nbtn.click(shuakehandler)
		}
		// 辽宁干部在线学习网(新版),在未完成列表中批量刷
		if(/zyjs\.lngbzx\.gov\.cn.+study_center\/my_course/.test(location.href)){
			let custom_btn_side = `
			.custom_btn_side{
				color: white;
				background: #006158;
				border-radius: 3px;
				width: 76px;
				height: 34px;
				right: 0px;
				bottom: 30px;
				position: fixed;
				z-index: 99999;
				border: #cecfcf solid 1px;
			}`

			add_style(custom_btn_side)

			let nbtn = $$(`<button type="button">批量</button>`)
			$$('body').append(nbtn)
			nbtn.addClass('custom_btn_side')
			nbtn.click(async function(e){
				await 批量刷(e)
			})
		}
		//获取行政公文
		if(/10.10.10.20\/seeyon\/govdoc\/list.do/.test(location.href)){
			unsafeWindow['行政公文'] = function(){
				let names = []
				$$('#list tr').each((id,item)=>{
					let tds = $$(item).children('td')
					let name1 = $$(tds[1]).text().replace(/[\s"]*/g,'')
					let date1 = $$(tds[7]).text().slice(0,10).replace(/-/g,'') //处理时间
					let date2 = $$(tds[9]).text().slice(0,10).replace(/-/g,'') //发起时间
					names.push(`md "${date2}-${name1}"`)
				})
				copy(names.join('\r\n'))
			}

			setInterval(function(){
				let b = $$('#listSentTab').clone()
				$$('#listSentTab').after(b)
				let a = b.find('span')
				a.text('获取新公文')
				b.click(function(){
					alert(123)
				})
			},5000)
		}
		//人力资源
		if(/10\.10\.10\.83\/main.asp/.test(location.href)){
			let names = '大迪,大男,大燚,大博,大郝,大鑫'.split(',')
			names = '殷客松,殷客松,殷客松,殷客松,殷客松,殷客松'.split(',')
			$$('body > table > tbody > tr:nth-child(1) > td:nth-child(3) > p > font, body > table > tbody > tr:nth-child(4) > td > font').text(names[Math.floor(Math.random()*6)])
		}
		//查工资
		if(/10.10.10.24:8080\/WebReport\/ReportServer/.test(location.href)){
			let uidInput = $$('input[name="CYEAR"]')
			uidInput.attr('type','password')
			let btn = $$('.fr-btn-text[type=button]')[0]
			btn = $$(btn)
			let nbtn = btn.clone()
			nbtn = $$(`<button>编号</button>`)
			btn.parent().parent().parent().after(nbtn)
			nbtn.attr('style',`color:white; background: #47a8ea; border-radius: 3px; width: 80px; height: 21px; left: 0px; top: 30px; position: absolute;`)
			 // nbtn.attr('style',`margin-top:2px;color:white;background: #47a8ea;border-radius: 3px; width: 80px; height: 21px;`)

			let checkInput = (uid)=>{
				if(uid=='')return -1; //输入为空
				let flag = localStorage.getItem('cube')
				if(flag==null){
					if(uid!='123456') return -2; //密码错误
					localStorage.setItem('cube', '可以查询')
					return 0; //可以查询
				}
				else{
					if(isNaN(uid*1))return 0 //不是数字编号
					localStorage.removeItem('cube')
					return 1
				}
			}

			let clickEvent = (e)=>{
				let uid = uidInput.val()
				let flag = checkInput(uid)
				if(flag==-2){
					alert('请输入数据库密码')
					return;
				}else if(flag==-1){
					alert('输入为空,非法查询')
					return;
				}else if(flag==0){
					uidInput.val('')
					uidInput.attr('type','text')
					alert('请输入人员编号')
					return;
				}
				console.log(uid)
				console.log(document.cookie)
				uidInput.attr('type','password')

				let data = $qs.stringify({
					reportlet: "home/GZCX/PUR_SALARY.cpt",
					pkpsndoc: uid
				})
				$axios.post('http://10.10.10.24:8080/WebReport/ReportServer',data).then(res=>{
					let data = res.data.match(/sessionID=(\d+)/)
					let sessionID = data[1]
					let u = `http://10.10.10.24:8080/WebReport/ReportServer?_=${new Date().getTime()}&__boxModel__=true&op=page_content&sessionID=${sessionID}&pn=1`
					$axios.get(u).then(res=>{
						$('#content-container').html(res.data)
					})
				})
			}

			nbtn.click(throttle(clickEvent, 1000))
			uidInput.keypress(throttle((e)=>{
				if(e.which==13){
					clickEvent(e)
				}
			}, 1000))
		}
		// 百度页面优化
		if(/baidu.com/.test(location.href)){
			$$("#content_left").css('padding-left','1em');
		}
		// OA平台
		if(/\d+\.\d+\.\d+\.\d+.+\/seeyon\/main.do\?method=main/.test(location.href)){
			console.log('OA平台')
			setTimeout(()=>{
				return
				$$('.lev1Li:contains("责任")').hide()
				$$('.lev1Li:contains("HR")').hide()
			},500)
			let 跳过改密码 = function(){
				let btn = $(`
					<div id="cube" style="
						width: 350px;
						height: 51px;
						font-size: 2em;
						border: 0px;
						border: 1px solid #e4e4e4;
						background: #fafafa;
						box-shadow: 0 0 10px #333;
						overflow: hidden;
						position: fixed;
						top: 113px;
						left: 781px;
						z-index: 9999999;
						color: #ef0303;
						font-weight: 900;
						text-align: center;
						cursor: pointer;
					">双击我</p></div>
				`)

				if($("#pwdMessageBox").length>0)
					$("body").append(btn)
				btn.dblclick(function(){
					$("#pwdMessageBox_mask").remove()
					$("#pwdMessageBox").remove()
					$(".layui-layer-shade").remove()
					$("#layui-layer1").remove()
					btn.remove()
				})
				$("#pwdMessageBox_mask").dblclick(function(){
					btn.dblclick()
				})
				/*
				alert('双击任何位置关闭系统提示\n\n只要不点确定')
				$(".layui-layer-shade").remove()
				$("#pwdMessageBox_mask").remove()
				$("#layui-layer1").remove()
				$("#pwdMessageBox").remove()
				*/
			}
			setTimeout(跳过改密码(),500)
		}
		//国家中小学智慧教育
		if(/basic.smartedu.cn\/teacherTraining\/courseDetail/.test(location.href)){
			let authorization = function(url,method){
				let Ze = function(e) {
					for (var t = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ".split(""), n = "", r = 0; r < e; r++)
						n += t[Math.ceil(35 * Math.random())];
					return n
				}

				let authdata = JSON.parse(JSON.parse(localStorage.getItem('ND_UC_AUTH-e5649925-441d-4a53-b525-51a2f1c4e0a8&ncet-xedu&token')).value)
				, id = authdata.access_token
				, nonce = (function(e) {
					return (new Date).getTime() + parseInt(e, 10) + ":" + Ze(8)
				})(authdata.diff)

				let url_data = $url.parse(url)
				, relative_path = url_data.path
				, authority_host = url_data.host

				let data = `$ {nonce}\n${method.toUpperCase()}\n$ {relative_path}\n$ {authority_host}\n`
				, mac_key = authdata.mac_key
				, mac = $cryptojs.HmacSHA256(data, mac_key).toString($cryptojs.enc.Base64)

				return 'MAC id="'.concat(id, '",nonce="').concat(nonce, '",mac="').concat(mac, '"');
			}
			function study(classesid, length = 5000, userid = 452586206874){
				// Get得到课程某一大课的小课表
				$axios.get(`https://x-study-record-api.ykt.eduyun.cn/v1/study_details/${classesid}/${userid}`,{
					headers: {
						"sdp-app-id": "e5649925-441d-4a53-b525-51a2f1c4e0a8",
					}
				}).then(res=>{
					console.log(res.data.ext_info)
					let resource_list = JSON.parse(res.data.ext_info).resource_max_pos
					resource_list = Object.keys(resource_list).filter((a,b)=>{
						if(resource_list[a].type=='video')return true
						return false
					})

					resource_list.forEach((a,b)=>{
						$axios.put(`https://x-study-record-api.ykt.eduyun.cn/v1/resource_learning_positions/${a}/${userid}`, {position:length},{
							headers: {
								"sdp-app-id": "e5649925-441d-4a53-b525-51a2f1c4e0a8",
							}
						}).then(res=>{
							console.log(a, res.data)
						})
					})
				})
			}

			$$('<span>')
			.css({
				"position": "fixed",
				"top": 2,
				"left": 2,
				"padding": "8px 24px",
				"box-sizing": "border-box",
				"font-weight": 700,
				"font-size": 20,
				"color": "#fff",
				"border-radius": 4,
				"background-color": "#4898d5",
				"z-index": 9999,
				"cursor": "pointer",
			})
			.text('刷课')
			.click(function(){
				study($qs.parse($url.parse(location.href).query).courseId)
			}).appendTo(document.body)
		}
		//兵器网络教育平台
		if(/admin.nhrdc.cn:8100\/Home\/User\/course/.test(location.href)){
			$$('<span>')
			.css({
				"position": "fixed",
				"top": 2,
				"left": 2,
				"padding": "8px 24px",
				"box-sizing": "border-box",
				"font-weight": 700,
				"font-size": 20,
				"color": "#fff",
				"border-radius": 4,
				"background-color": "#4898d5",
				"z-index": 9999,
				"cursor": "pointer",
			})
			.text('刷课')
			.click(function(){
				//获取班级与课程id劫持getCourseDetails的usr_watch_time历史观看记录来达到刷课的目的
				let cube_t = 10800 //获取不到视频总长,假设越长越好
				classid   = $("#classid").val();
				course_id = $("#course_id").val();

				$.ajax({
					type : 'post',
					url  : '/Home/Course/getCourseDetails',
					data : {'classid':classid,'course_id':course_id},
					dataType : 'json',
					success : function(res) {
						if (res.code == 200) {
							res.data.user_watch_time = cube_t;
							$(".span").html('');
							//先渲染基础信息
							video_base_info_render(res.data);
							course_comment_paging(1,limit);
							//查看是否允许观看
							var check = checking_allow();
							if (check == 200) {
								checking_allow_render(res.data,1);
								alert('刷新网页查看结果')
							}else{
								checking_allow_render(res.data,0);
							}
						}
					}
				});
			}).appendTo(document.body)
		}
		// 辽宁省干部培训 公务员区 刷课
		if(/http:\/\/gwy.lngbzx.gov.cn\/student\/mycourse.do/.test(location.href)){
			showAlert = function(){}
			const nums = 30 //每个课程刷的次数
			let errhandler = (err)=>{alert("网络繁忙,或网址错误，请稍后刷新页面重试！");return false;}
			let shuakehandler = async function(e){
				let el = e.target
				let {courseStudentId, courseId} = $$(el).data()
				let {data} = await $axios(`http://gwy.lngbzx.gov.cn/student/enterCourse.do?courseStudentId=${courseStudentId}`).catch(errhandler)
				let matches = data.match(/name="watchId" value="(\d+)"/)
				if(matches.lenght<=1) throw '没有匹配到watchId'
				let watchId = matches[1]
				let req_generate = function(n){ // 刷课核心链接
					let result = []
					for(let i = 0; i<n; i++) result.push($axios(`http://gwy.lngbzx.gov.cn/student/video/json/ajaxRecordCourseWatchingTime.do?_x=${Math.random()}&watchId=${watchId}&courseId=${courseId}&courseStudentId=${courseStudentId}&{}`))
					return result
				}
				let ret = await $axios.all(req_generate(nums)).catch(errhandler)
				$$(el).text('OK')
				return true
			}

			// 单独刷按钮
			$$("table#table tr[timing]").each((id, item)=>{
				let courseStudentId = $$(item).attr('coursestudentid')
				, courseId = $$(item).attr('courseid')
				, timing = $$(item).attr('timing')

				let btn = $$(`<td><span class="__cubebtn" style="background-color: #0c0;color: #fff;line-height: 18px;cursor: pointer;" class="fr">刷课</span></td>`)
				btn.find('span').data({courseStudentId, courseId})
				btn.click(shuakehandler)
				$$(item).append(btn)
			})

			//一键刷按钮
			let yijian = $$('<th><span style="background-color: #0c0;color: #fff;line-height: 18px;cursor: pointer;" class="fr">一键刷</span></th>')
			$$('.first th').last().after(yijian)
			yijian.click(async ()=>{
				let btns = $$('.__cubebtn')
				for(let el of btns)
					await shuakehandler({target: el})
			})
		}
		// 辽宁省干部培训 专业技术区 刷课
		if(/https:\/\/zyjs.lngbzx.gov.cn\/study\/yearplan\/gostudy/.test(location.href)){
			// alert('不支持"作者略"的课程')
			let errhandler = (err)=>{console.log(err);alert(`${err.toString()}\r\n请刷新页面后重试！`);return false;}

			async function ajaxshuke(formdata){
				let spos = "1618454.09"
				let {id:cid, len, percent, postion: position, root, source, timespace} = formdata.data
					, page = formdata.page
					, url_target = root + page
					, rkey = formdata.rkey
				// console.log({cid, len, percent, position, root, source, timespace, page, rkey})
				/* this ajax get historyId */
				let postdata;

				if(/saveview/i.test(page)){
					postdata = {cid, source, position, percent}
					postdata = $qs.stringify({json: JSON.stringify(postdata)})
				}else if(/saveTssView/i.test(page)){
					postdata = {cid, source, position, percent}
				}

				let data = await $axios.post(url_target, postdata).then(({data})=>{return data}).catch(errhandler)

				// return false
				if(!data) return false

				if (data.status == 0) {

					if(/saveview/i.test(page)){
						postdata = {cid, historyId: data.id, position: len, len, spos}
						postdata.sign = aes_encrypt(JSON.stringify(postdata).replace(/[\{\}"]/g,'').replace(/,/g,';'), rkey)
						postdata = $qs.stringify({json: JSON.stringify(postdata)})
					}else if(/saveTssView/i.test(page)){
						postdata = {historyId: data.id, position: len, len, cid}
						postdata.sign = aes_encrypt(JSON.stringify(postdata).replace(/[\{\}"]/g,'').replace(/,/g,';'), rkey)
					}

					return $axios.post(url_target, postdata).then(({data})=>{
						if(!data) {return false}
						if (data.status == 0) {
							return true
						}
						if (data.status == 1) {
							alert("进度记录失败，请刷新页面重试！")
						} else if (data.status == 2) {
							alert("不能同时学习多门课程")
						} else if (data.status == 3) {
							alert("请正常提交参数！")
						} else if (data.status == 4) {
							alert("登陆信息错误！")
						} else {
							console.log(data)
							alert("未知错误,请联系开发者 错误代码: 0x2")
						}
						return false
					}).catch(errhandler)
				}
				if (data.status == 1) {
					alert("获得初始进度失败，请刷新页面重试！");
				}
				alert("未知错误,请联系开发者 错误代码: 0x1\n其实联系也没用,开发者也不知道啥意思")
				return false
			}
			// 得到课程信息
			// cid/*课程id*/, historyId, position/*进度,timespace的倍数*/, length/*时长*/, spos/*播放器精细进度X1000*/
			async function shuakehandler(e){
				let el = e.target
				let {cid, scid} = $$(el).data()
				let {data} = await $axios.get(`https://zyjs.lngbzx.gov.cn/study/resource/info/${cid}/${scid}`).catch(errhandler)

				let $content = $$(data)
					, cpath = '/study'/*$content.find('#cpath').val()*/
					, page = ''
					, formtable = ''
					, uri = ''
					, handler_parseArg = ''

				/* this ajax return {status: 0, message: null, position: "", percent: "0", source: null} */
				data = await $axios.post(cpath + '/resource/position/' + cid).then(({data})=>{return data}).catch(errhandler)

				if($content.find('#read').length!=0){

					formtable = $content.find('#readform')
					uri = cpath + "/xml/normal"
					page = '/resource/saveview'
					handler_parseArg = function(id, source, postion, percent, root, timespace/*int*/, len, spos){return {id, source, postion, percent, root, timespace/*int*/, len, spos}}

				}else if($content.find('#readvideo').length!=0){

					formtable = $content.find('#readvideoform')
					uri = cpath + "/xml/video"
					page = '/resource/saveview'
					handler_parseArg = function(id, source, postion, percent, root, timespace/*int*/, len, spos){return {id, source, postion, percent, root, timespace/*int*/, len, spos}}

				}else if($content.find('#readtss').length!=0){

					formtable = $content.find('#readvideoform')
					uri = cpath + "/xml/tss"
					page = '/resource/saveTssView' //post object for example {historyId, position, len, cid, sign}
					handler_parseArg = function(id, source, postion, percent, len, root, timespace){return {id, source, postion, percent, len, root, timespace}}
					// "historyId:" + historyId + ";position:" + position + ";len:" + len + ";cid:" + cid

				}

				let formdata = $qs.parse(formtable.serialize())
				formdata.percent = data.percent
				formdata.position = data.position
				formdata.source = /gostudy\/1/.test(location.href)?10:(/gostudy\/2/.test(location.href)?11:undefined)


				data = await $axios.post(uri, $qs.stringify(formdata)).then(({data})=>{return data}).catch(errhandler)
				let rkey = $$(data).find('#rkey').val()
				rkey = rkey.substring(16)

				formdata.page = page
				formdata.rkey = rkey

				try{
					formdata.data = handler_parseArg.apply(this,eval('[' + data.match(/readAssist\((.+)\)/im)[1] + ']'))
				}catch(e){
					return errhandler(e)
				}

				let ret = false
				ret = await ajaxshuke(formdata)

				if(ret)
					$$(el).parent().prev().children('span.fr').text('完成1000.0%')
				return ret;
			}
			// 添加单独刷课按钮
			$$('#theform dd.teach.cl > .fr').each((_,item)=>{
				let data = $$(item).attr('onclick').match(/(\d+),'(\w+)'/).slice(1,3)
				let shuake = $$(item).clone().text('刷课').removeAttr('onclick').removeAttr('id').data({cid: data[0], scid: data[1], isover: false}).click(shuakehandler)
				shuake.attr('style', 'margin-top: 2px;background: green;').addClass('__cubebtn')
				$$(item).after(shuake)
			})

			$$('<a href="#" style="background: green;" class="active"><i class="icon iconfont"></i>隐藏已刷课程</a>').click(function(e){
				let textEl = $$(this).children('i')[0].nextSibling.textContent
				if(textEl==='隐藏已刷课程'){
					$$(this).children('i')[0].nextSibling.textContent='显示已刷课程'
				}else{
					$$(this).children('i')[0].nextSibling.textContent='隐藏已刷课程'
				}

				$$('#theform dd.time.cl > span.fr').each((_,el)=>{
					if(el.innerText.indexOf('100')!==-1){
						$$(el).parents('dl').toggle()
					}
				})
			}).appendTo(".w_btn3")

			let yijianshua = $$('<a href="#" title="注意,仅刷当前页课程" style="background: green;" class="active"><i class="icon iconfont"></i>一键刷课</a>')
			yijianshua.click(async e=>{
				for(let el of $$('#theform dd.time.cl > span.fr')){
					if(el.innerText.indexOf('100')!==-1){
					}else{
						let btn = $$(el).parent().next().find('.__cubebtn')[0]
						await shuakehandler({target: btn})
					}
				}
			}).appendTo(".w_btn3")
			/*
			// 添加批量删课
			let deldx = $$('<a href="#" class="active"><i class="icon iconfont"></i>删除显示的课程</a>')
			deldx.click(e=>{
				$$('#theform dd.teach.cl > .fr[id]').each((_,item)=>{
					let data = $$(item).attr('onclick').match(/(\d+),'(\w+)'/).slice(1,3)[0]
					$$.post("https://zyjs.lngbzx.gov.cn/study/yearplan/changeReqCourse",`type=1&score=1&id=${data}`).then(res=>{
						if(res.status==0){
							$$(item).parents('dl.fl').toggle()
						}
					})
				})
			}).appendTo(".w_btn3")
			*/
		}
		// 酷我音乐
		if(/kuwo.cn/.test(location.host)){
			(function(){
				let btn = $$('#__layout > div > div.playControl i.prev.iconfont.icon-bar_icon_download_'),
					bak = btn.clone()
				bak.click(e=>{
					let {name, musicrid, artist} = $$('#__layout > div > div.playControl')[0].__vue__.currentSong,
						url = `http://bd.kuwo.cn/url?format=mp3&rid=${musicrid}&response=url&type=convert_url3&br=128kmp3&from=web&t=${new Date().getTime()}`
						e.stopPropagation()
						$$.getJSON(url).then(res=>{
							if(res.url){
								console.log(res.url)
								GM_download(res.url, `${name}-${artist}`)
							}
						}).catch(e=>{
							alert(e)
						})
				})
				btn.replaceWith(bak)
			})()
			if(/play_detail\/\d+$/.test(location.href)){
				(function(){
					let {artist, artistId, musicName, rid } = $qs.parse($url.parse($$("#xiuchang-jsonp")[0].src).query),
						url = `http://antiserver.kuwo.cn/anti.s?response=url&rid=MUSIC_${rid}&format=mp3|aac&type=convert_url`
					url = `http://bd.kuwo.cn/url?format=mp3&rid=${rid}&response=url&type=convert_url3&br=128kmp3&from=web&t=${new Date().getTime()}`
					let btn = $$("#__layout > div > div.container > div > div.content > div.info_l > div:nth-child(4) > a"),
						bak = btn.clone().click(e=>{
							e.stopPropagation()
							$$.getJSON(url).then(res=>{
								if(res.url){
									console.log(res.url)
									GM_download(res.url, `${musicName}-${artist}`)
								}
							}).catch(e=>{
								alert(e)
							})
						})
					btn.replaceWith(bak)
				})()
			}else if(/playlist_detail\/\d+$/.test(location.href)){
				(function(){
					$$("ul.album_list").data('find', false).parents().each((i,a)=>{
						if('__vue__' in a && !$$("ul.album_list").data('find')){
							$$("ul.album_list").data('find', true)
							let list = a.__vue__.list
							$$("ul .icon-bar_icon_download_").each((i,a)=>{
								let {name, musicrid, artist} = list[i],
									url = `http://bd.kuwo.cn/url?format=mp3&rid=${musicrid}&response=url&type=convert_url3&br=128kmp3&from=web&t=${new Date().getTime()}`
								let bak = $$(a).clone().click(e=>{
									e.stopPropagation()
									$$.getJSON(url).then(res=>{
										if(res.url){
											console.log(res.url)
											GM_download(res.url, `${name}-${artist}`)
										}
									}).catch(e=>{
										alert(e)
									})
									console.log(name, musicrid, artist)
								})
								$$(a).replaceWith(bak)
							})

						}
					})
				})()
			}

		}
		// MD文件拖拽到浏览器,直接显示效果
		if(/(md|MD)$/.test(location.href)){
			console.log('markdown')
			let text = $$("pre").text()
			$$("body").html($markdown(text))
			$addcss("file:///J:/Users/Cube/Documents/%E8%87%AA%E5%AD%A6/JavaScript/markdown%E7%BC%96%E8%BE%91%E5%99%A8/bootstrap.min.css")
		}
		// 解锁网页复制功能,道客88
		if (/www.doc88.com/.test(location.href)){
			console.warn('解锁复制功能')

			function copyCheck() {
				return true
			}

			setInterval(function(){
				try{
					unsafeWindow.Config.vip = 1
					unsafeWindow.Config.logined = 1
					// unsafeWindow.document.body.copyCheck = copyCheck
					// unsafeWindow.u_v = 1
				}catch(e){console.err(e)}
			},1000)
		}
		// 解锁网页复制功能360个人图书馆
		if(/www.360doc.com/.test(location.href)){
			function oncopy() {
				return true;
			}
			setInterval(function(){
				unsafeWindow.document.body.oncopy = oncopy //360doc
			},1000)
		}
		// 吾爱破解样式修改,签到不跳转
		if(/www.52pojie.cn/.test(location.href)){
			console.log('吾爱破解样式修改')
			let onloadfun = debounce(function (){
					var iframeDocument = document.getElementById('myiframe').contentDocument || document.getElementById('myiframe').contentWindow.document;
					// 确保iframe内容完全加载完成
					if (iframeDocument.readyState === 'complete') {
						// 执行你需要的操作
						console.log('Iframe content is loaded and JavaScript has executed.');
						alert('iframe全部加载完毕')
					}
				},5000)
			// 自动签到1
			let autoqiandao1 = function(){
				let f = $$('<iframe id="myiframe" hidden src="https://www.52pojie.cn/home.php?mod=task&do=apply&id=2&referer=%2Fforum.php%3Fmod%3Dguide%26view%3Dhot">')
				f[0].onload = onloadfun
				f.appendTo('body')
			}

			// 自动签到2 失效
			let autoqiandao2 = function(){
				$ajax.get('https://www.52pojie.cn/home.php?mod=task&do=apply&id=2').then(res=>{
					if(res.status==200){
						let text = res.data
						if(/请开启JavaScript并刷新该页/.test(text)){
							let cb = GM_openInTab('https://www.52pojie.cn/home.php?mod=task&do=apply&id=2', {active: false,insert:true})
							cb.onclose = ()=>{
								this.innerText = "已经签到"
								$$(this).attr('src','https://static.52pojie.cn/static/image/common/wbs.png')
							}
							setTimeout(()=>{cb.close()}, 3000)
						}else{
							this.innerText = "已经签到"
							$$(this).attr('src','https://static.52pojie.cn/static/image/common/wbs.png')
						}
					}
				})
			}

			// 加载下一页
			let loadd_nextpage = function(nextpage_url){
				$ajax.get(nextpage_url).then(function(res){
					// 帖子内
					$$("#postlist > div[id^='post_']").last().after($$(res.data).find("#postlist > div[id^='post_']"))
					// 版块内
					$$("#threadlisttableid > tbody[id^=normalthread_]").last().after($$(res.data).find("#threadlisttableid > tbody[id^=normalthread_]"))
				})
			}
			//loadd_nextpage()
			// 美化签到
			$$("#um > p:nth-child(3) img").click(function(e){
				e.stopPropagation()
				e.preventDefault()
				let state = !($$(this).attr('src')=='https://static.52pojie.cn/static/image/common/qds.png')
				// console.log(state,this)
				if(!state){
					autoqiandao1()
					this.innerText = "已经签到"
					$$(this).attr('src','https://static.52pojie.cn/static/image/common/wbs.png')
				}else{
					alert('已经签到')
				}
			})
			// return;
			// 美化,增加折叠框
			// $$("#separatorline").prevAll("tbody").each((i,item)=>{
			//     try{toggle_collapse(item.id)}catch(e){}
			// })

			$$("[id^=stickthread]").toggle()
			let tt = $$('#ct > div > div.bm.bml.pbn > div.bm_h.cl > span.o').clone()
			.appendTo('#threadlist > div.th > table > tbody > tr > td:nth-child(4)').css('float','right')
			.find('img').click(function(e){
				e.stopPropagation()
				e.preventDefault()
				this.src = this.src.indexOf('_yes.gif') == -1 ? this.src.replace(/_no\.gif/, '_yes\.gif') : this.src.replace(/_yes\.gif/, '_no\.gif');
				$$("[id^=stickthread]").toggle()
			}).removeAttr('onclick').removeAttr('id').css('cursor','pointer').attr('src','https://static.52pojie.cn/static/image/common/collapsed_yes.gif')
			// 删除签名图片
			$$(".plc.plm").remove()
		}
		if(/www.9ku.com/.test(location.href)){
			console.log('九酷音乐')
			// 关键词相关
			let url = 'http://baidu.9ku.com/suggestions/?kw=%E7%AB%A5%E8%AF%9D%E9%95%87&callback=jQuery18307211322179627329_1600660703788&_=1600661567220'
			$$.ajax({
				type: "get",
				async: false,
				url: url,
				dataType: "jsonp",
				jsonp: "callback",
				success: callbackfun
			});
			// 搜索页
			// http://baidu.9ku.com/song/通话
			let hehe = function(id){
				$$.get(`http://www.9ku.com/html/playjs/${Math.floor(id/1000)+1}/${id}.js`,function(res){
					let data = eval(res)
					window.open(data.wma)
				})
			}
			unsafeWindow.hehe = hehe
		}
		// github添加快速置顶按钮
		if(/github/.test(location.host)){
			$$("body > div.application-main > div > main > div.container-lg.clearfix.new-discussion-timeline.p-responsive").css({"max-width":"100%"})
			let btn = $totop().data('speed',200).appendTo("body")
			try{
				let v = $$("#rename-field").val();
				$("#options_bucket > div.Box.Box--danger > ul > li:nth-child(4) > details > details-dialog > div.Box-body.overflow-auto > form > p > input").val(v);
			}catch(e){}
		}
		// 美化博客园
		if(/www.cnblogs.com/.test(location.host)){
			console.log('美化博客园')
			try{
				// 针对table布局 举例:https://www.cnblogs.com/yaoxiao/archive/2011/05/04/2036490.html
				$$("pre").css({'max-width':'auto'})
				$$(".LeftCell").hide();
				$$(".cnblogs_code").css({"max-width":"100%"})
				$$('#sideBar').hide();
				$$('#sidebar').hide();
				$$("#leftcontent").hide();
				$$("#leftmenu").hide();
				$$("#main").css({"padding-left":"2em","padding-right":"1em"})
				$$("#content").css({"margin":"0 0"});
				//$$("#mainContent").css({"margin":"0 0","width":"100%"});
				$$("#mainContent").css({"margin":"0 0"});
				$$("#mainContent .forFlow").css({"margin":"0 0"});
				$$("#mainContent .forFlow .postBody").css({"white-space": "pre-wrap"})
				$$("#post_next_prev").clone(true).attr("id","UserAdd_").prependTo($$("#cnblogs_post_body"));//上一页下一页 复制到文章开头
				$$("#post_next_prev").clone(true).attr("id","UserAdd_").prependTo($$("#mytopmenu"));//上一页下一页 复制到文章开头
				$$("#UserAdd_").css({"text-shadow": "1px 1px 3px #b1d161"});
			}catch(e){
				alert('脚本错误');
			}
		}
		if(/zhidao.baidu/.test(location.href)){
			return
			console.log('zhidao')
			$insertcode(unsafeWindow)
			$$("#body").css({"padding":"2em"});
			// $$("#ihome-header > div > div > a.zhidao-logo.grid, #ihome-header > div > div > a, #userbar > ul > li.shop-entrance").remove()
			// $$("#ihome-header > div > div").css({'flex-direction': 'row-reverse','justify-content': 'flex-end'})
			// $$("#userbar").css("position", "unset")
		}
		if(/blog.csdn.net/.test(location.host)){
			console.log('csdn')
			//删除代码背景色
			// $$("code").css('background-color','white')
			//移除侧边栏
			$$("aside").remove()
			$$(".csdn-side-toolbar").remove();
			// 页面重新布局
			$$("body").css({"min-width":"100%","width":"100%"})
			$$(".main_father").css({"padding":"0"})
			$$("#mainBox").css({"width":"100%","margin-left":"0px"})
			$$("main").css({"width":"100%"})
			$$("code").css({"white-space":"pre-wrap"})
			// 个别页面特殊布局
			$$("textarea").css({"width":"100%","resize":"auto"})
			// 阅读更多,隐藏阅读更多按钮
			$$("div.article_content").removeAttr("style")
			$$(".hide-article-box").hide()
			// 显示更多评论 var cube = new window.csdn.Comments
			$$(".comment-list-box").removeAttr("style")
			// 解除禁用复制功能
			if (typeof(mdcp)!="undefined" && 'copyCode' in mdcp){
				$$("code").attr("onclick","mdcp.copyCode(event)")
			}else if (typeof(hljs)!="undefined" && 'copyCode' in hljs){
				$$(".hljs-button").attr("onclick","hljs.copyCode(event)")
			}
		}
		if(/bbs.csdn.net/.test(location.host)){
			$$("#bbs_detail_wrap").css({"height":"","overflow":""});
			$$(".hide_topic_box").hide();
			$$("dt.topic_l").css({"width":"10px"});
			$$("dt.topic_l").hide();
		}
		// 慕课
		if(/imooc/.test(location.href)){
			console.log('慕课网')
			var l = $$("div.section-list");
			var li = $$(".course-menu.course-video-menu.clearfix.js-course-menu li")[2];
			$$(li).after('<li class="course-menu-item"><a href="javascript:void(0)" id="ismenu">开启右侧目录</a></li>');
			$$("#ismenu").click(function(){
				l.toggle();
			});
		}
		// 普法答题
		if(/pfjs.annihui.com/.test(location.host)){
			console.log('普法答题')
			window._czc = []
			window.setTimeout = function(callback,timeout){
				console.log(callback)
				console.log(timeout)
			}
		}
		// 乙烯食堂登录
		if(/st2.pjchat.com/.test(location.host)){
		// } else if(/st2.pjchat.com\/caidan.php\?type=1/.test(location.host)){
			// 乙烯食堂登录cookie
			'dcst=10;mima=6f63605a89b31e32ca752a05d3dd9ab7;dcy=13504272173'.split(';').forEach(function(a){
				document.cookie = a
			})
			console.log('乙烯食堂13504272173 cookie已经安装')
		}
		// 亚洲会所
		if(/www.sis001.com\/forum\/forum/.test(location.href) || /38.103.161.143/.test(location.host) || /23.225.255.95/.test(location.host) || /23.225.172.95/.test(location.host)){
			console.log('亚洲会所')
			console.log('<a href="https://en.1pondo.tv/movies/110120_001/">一本道</a>')
			$$('<span>')
			.css({
				"position": "fixed",
				"top": 0,
				"padding": "8px 24px",
				"box-sizing": "border-box",
				"font-weight": 700,
				"font-size": 20,
				"color": "#fff",
				"border-radius": 4,
				"background-color": "#4898d5",
				"z-index": 9999,
				"cursor": "pointer",
			})
			.text('purge')
			// .hover(function(){ $$(this).animate({top: 0}) })
			// .mouseleave(function(){$$(this).animate({top: 0})})
			.click(function(){
				$$('*').removeClass('noSelect')
				//删掉国产
				$$('table tr > th.common').each((i,item)=>{
					if(/国产/g.test(item.innerText)){
						$$(item).parent().remove()
					}
				})

				let cite = $$("tr > td.author > cite")
				cite = document.getElementsByTagName("cite")
				$$(cite).each(function(index, el){
					try{
						let m = $$(el),
							n = m.children("img")[0].nextSibling.textContent
						if(parseInt(n)<6){
							m.parent().parent().toggle()
						}
					}catch(e){}
				})
			})
			.appendTo(document.body)
			/*
			setTimeout(function(){
				$$('*').removeClass('noSelect')
				let cite = $$("tr > td.author > cite")
				cite.children("a,img").toggle();
				cite.each(function(index,el){
					if(el.innerText<10){
						$$(el).parent().parent().toggle()
					}
				})
				cite.children("a,img").toggle();
			},4000)
			*/
		}
		// 免登陆复制
		if(/segmentfault.com/.test(location.host)){
			$$("<div></div>").attr("id","SFUserId").appendTo("body")
			console.log("segmentfault解锁免登陆复制快捷键Ctrl+C")
		}
		// 喜马拉雅听美化
		if(/ximalaya.com/.test(location.host)){
			console.log('喜马拉雅听美化')
			$$("#rootHeader > div").css({"width":"auto","display": "flex","flex-direction": "row-reverse"})
		}
		// 樱花动漫
		if(/http:\/\/www.imomoe.ai\/player\//.test(location.href)){
			console.log('樱花动漫')
			$$('.movurls li a').each(function(i,a){a.target = "_top"})
		}
		// golang中文网
		if(/studygolang.com/.test(location.host)){
			console.log('golang中文网')
			$$(".sidebar").hide().parents(".row").children("div:first").css({width:"100%"})
		}
		if(/cdn.jsdelivr.net/.test(location.host)) {
			console.log('jsdelivr CDN')
			const toast = $$('<span>')
			.css({
				"position": "fixed",
				"right": 0,
				"top": 0,
				"width": "60%",
				"padding": "8px 24px",
				"box-sizing": "border-box",
				"color": "#fff",
				"border-radius": 4,
				"background-color": "#68686899",
				"z-index": 9999,
				"cursor": "pointer",
				"display": "none"
			}).dblclick(function(){
				$$(this).hide()
			}).appendTo(document.body)

			$$('<span>')
			.css({
				"position": "fixed",
				"top": -35,
				"padding": "8px 24px",
				"box-sizing": "border-box",
				"font-weight": 700,
				"font-size": 20,
				"color": "#fff",
				"border-radius": 4,
				"background-color": "#4898d5",
				"z-index": 9999,
				"cursor": "pointer",
			})
			.text('purge')
			.hover(function(){ $$(this).animate({top: 0}) })
			.mouseleave(function(){$$(this).animate({top: -35})})
			.click(function(){$$.getJSON(location.href.replace(location.host, 'purge.jsdelivr.net')).then(res=>{toast[0].innerText = JSON.stringify(res).replaceAll(',',',\n'); toast.show()})})
			.appendTo(document.body)

		}
		// 集团门禁系统
		if(/https:\/\/10.10.54.18\/acs\/app\/events\/inAndOutHistory/.test(location.href)){
			console.log('门禁系统自动刷新进出记录', 'https://10.10.54.18/acs/app/events/inAndOutHistory')
			自动刷新进出记录()
		}
		//注册安全工程师,修改准考证和成绩
		if(/https:\/\/zg.cpta.com.cn\/examfront\/admission\/lookzkzForLogin.htm/.test(location.href)||
			 /https:\/\/zg.cpta.com.cn\/examfront\/score\/query_new.htm/.test(location.href)
			){
			let fun1 = async function(){
				let {data} = await $axios.get('https://zg.cpta.com.cn/examfront/menu/bar.htm?myrandom=')
				let person = data.includes('刘远鑫')
				$$("#form > div > div > div > div.ibox.float-e-margins > div > table > tbody > tr > td:nth-child(2) > table > tbody > tr:nth-child(3) > td > table > tbody > tr:nth-child(2) > td > table").html(`<tbody><tr><td style="width:318px"><div align="center">考试科目</div></td><td style="width:126px"><div align="center">准考证号</div></td><td width="201px"><div align="center">考试时间</div></td><td width="50px"><div align="center">考场</div></td><td style="width:55px;"><div align="center">座位号</div></td></tr><tr><td><div align="center">安全生产法律法规</div></td><td nowrap=""><div align="center">121110102016</div></td><td><div align="center">2024-10-26 09:00-11:30</div></td><td><div align="center">020</div></td><td><div align="center">16</div></td></tr><tr><td><div align="center">安全生产管理</div></td><td nowrap=""><div align="center">121110102016</div></td><td><div align="center">2024-10-26 14:00-16:30</div></td><td><div align="center">046</div></td><td><div align="center">30</div></td></tr><tr><td><div align="center">安全生产技术基础</div></td><td nowrap=""><div align="center">121110102016</div></td><td><div align="center">2024-10-27 09:00-11:30</div></td><td><div align="center">035</div></td><td><div align="center">13</div></td></tr><tr><td><div align="center">安全生产专业实务（化工安全）</div></td><td nowrap=""><div align="center">121110102016</div></td><td><div align="center">2024-10-27 14:00-16:30</div></td><td><div align="center">051</div></td><td><div align="center">09</div></td></tr></tbody>`)
				if(person && /2023/.test($$('body > div > div > div > div > div.ibox-content > div:nth-child(1)').text())){
					$$('body > div > div > div > div > div.ibox-content > table').html(`<tbody><tr><th colspan="4" style="text-align: center;background: aliceblue">考 生 信 息</th></tr><tr><td>姓  名：</td><td><span class="spz_class">刘远鑫</span></td><td>证件号码：</td><td>210682198909304237</td></tr><tr><td>报名省市：</td><td>辽宁省</td><td>报名地市：</td><td>辽宁省盘锦市</td></tr><tr><th colspan="3" width="65%" style="text-align: center;background: aliceblue">科 目 名 称</th><th style="text-align: center;background: aliceblue">成 绩</th></tr><tr><td colspan="3" style="text-align: center;">安全生产法律法规</td><td style="text-align: center;">51</td></tr><tr><td colspan="3" style="text-align: center;">安全生产管理</td><td style="text-align: center;">32</td></tr><tr><td colspan="3" style="text-align: center;">安全生产技术基础</td><td style="text-align: center;">36</td></tr><tr><td colspan="3" style="text-align: center;">安全生产专业实务（化工安全）</td><td style="text-align: center;">41</td></tr></tbody>`)
				}
				else if(person && /2024/.test($$('body > div > div > div > div > div.ibox-content > div:nth-child(1)').text())){
					$$('body > div > div > div > div > div.ibox-content > table').html(`<tbody><tr><th colspan="4" style="text-align: center;background: aliceblue">考 生 信 息</th></tr><tr><td>姓  名：</td><td><span class="spz_class">刘1远鑫</span></td><td>证件号码：</td><td>210682198909304237</td></tr><tr><td>报名省市：</td><td>辽宁省</td><td>报名地市：</td><td>辽宁省盘锦市</td></tr><tr><th colspan="3" width="65%" style="text-align: center;background: aliceblue">科 目 名 称</th><th style="text-align: center;background: aliceblue">成 绩</th></tr><tr><td colspan="3" style="text-align: center;">安全生产法律法规</td><td style="text-align: center;">49</td></tr><tr><td colspan="3" style="text-align: center;">安全生产管理</td><td style="text-align: center;">34</td></tr><tr><td colspan="3" style="text-align: center;">安全生产技术基础</td><td style="text-align: center;">31</td></tr><tr><td colspan="3" style="text-align: center;">安全生产专业实务（化工安全）</td><td style="text-align: center;">36</td></tr></tbody>`)
				}
			}
			fun1();
			let t1 = setInterval(fun1, 500)
		}
		if(/10.10.15.125/.test(location.href)){
			console.log('定位系统,删除警告')
			setInterval(()=>{
				$$('.warning-overlay').remove()
			},1000)
		}
		// 快看66 视频播放 父页面
		if(/kuaikan\d+.com/.test(location.host) ||/zhuijuku.com/.test(location.host)|| /kk6080.cn/.test(location.host)){
			console.log('快看66 视频播放 父页面')
			/* 处理头部悬浮 */
			let h = $$('<div id="kkwarp">').append($$("#header")).append($$(".bread-crumb-nav.bread-crumb-nav-play")).prependTo("body").height()

			let headStyle = `
				<style>
					#kkwarp{
						position: fixed;
						width: 100%;
						z-index: 5;
						padding-bottom: 20px;
						top: -${h}px;
						transition: top 0.7s ease-in-out, padding-bottom 1s, background 1s, opacity 1s;
						opacity: 0;
					}
					#kkwarp:hover{
						top:0px;
						padding-bottom: 0px;
						background: white;
						opacity: 1;
					}
				</style>`
			$$("head").append(headStyle)

			/* 集数布局 */
			// $$('.play-list a').css({'width':'16%'})
			// $$('.play-list-box').css({'padding': '0px'})
			// $$('#detail-list .play-list').css({'width': '100%', 'display': 'flex', 'flex-wrap': 'wrap', 'padding': '8px'})
			// $$('.p10idt, #content').width('100%')
			// $$('.publicbox, .play-list-box, .content').width('100%')

			$$("#topper > div.layout.fn-clear").remove()
			$$("#play-focus > div.layout").css('width','95vw');
			$$("#zanpiancms_player").css('height', '95vh');
			let func_text = `
			console.log("父页面已监听message")
			window.addEventListener('message',e=>{
				console.warn(e.data)
				// if(e.origin != "https://api.longdidi.top")return;
				if(e.data.status==100){
					console.log('下一集')
					$.post('//127.0.0.1:8080/cube/?a=参数', "action=nextpage").then(res=>{
						console.log(res)
					}).catch(e=>{
						console.log('下一集服务未开启')
						$("#play-focus td.prev-next > a:nth-child(2)")[0].click()
					})
				}else if(e.data.status==200){
					console.log('可以播放了')
					$.post('//127.0.0.1:8080/cube/?a=参数', "action=autoplay").then(res=>{
						console.log(res)
					}).catch(e=>{
						console.log('自动播放服务未开启')
					})
				}else if(e.data.status==300){
					$.post('//127.0.0.1:8080/cube/?a=参数', "action=shutdown").then(res=>{
						console.log(res)
					}).catch(e=>{
						console.log('关机服务未开启')
					})
				}else if(e.data.status==400){
					let data;
					if(e.data.msg=='set'){
					} else if(e.data.msg=='get'){
						data = localStorage.getItem('dplayer-skip-remember-value')||'{}'
						data = JSON.parse(data)
						let postdata = {}
						postdata = {src: location.href, value:(data[location.href] || 0)}
						//e.source.postMessage({status:401, msg:postdata}, event.origin)
						e.source.postMessage({status:401, msg:location.href}, event.origin)
					}
				}
			},false)
`
			addscript(func_text)
		}
	})
})();

/*
$$(window).resize(function(){
	console.log(window.outerWidth,screen.width)
	console.log(window.outerWidth,screen.width)
})
*/
function ClearChromeHistoryByConsole(){
	for (let i of document.getElementById("history-app").$.history.$["infinite-list"].children){
		try{
			i.$.checkbox.click()
		}catch(e){}
	}
}

unsafeWindow.addButton = addButton

/*
酷狗音乐
function hehe(res){
	console.log(res.data.play_url)
}
(()=>{
	let Hash = JSON.parse($0.getAttribute('data')).Hash
	let mid = $cryptojs.MD5('').toString()

	let data = {
		hash: Hash,
		// album_id: global.features[0].album_id,
		// mid: mid,
		// platid: 4
	}
	let url = 'https://wwwapi.kugou.com/yy/index.php?r=play/getdata&' + $qs.stringify(data)
	$jsonp(url,{
	name: 'hehe'
	})
})()
*/

/* 2025年更新 */
async function 批量刷(e){
	if(e.target?.running!=undefined){
		$swal.fire(e.target.running)
		return;
	}

	let _ajax = $axios.create({headers:{Signature:'adfasfsdaffsdafsdafaj'}})

	// 定期发送心跳包,维持登录状态
	let keepping = function(_ajax){
		let t = new Date().toLocaleTimeString()
		let tid_ = setInterval(async function(){
			console.warn(`${new Date().toLocaleTimeString()} 心跳一次`)
			let ret = _ajax.get('https://zyjs.lngbzx.gov.cn/trainee/api/login/keep_live')
			ret = await _ajax.post('https://zyjs.lngbzx.gov.cn/trainee/login/status?userInfo=',{})
			if(ret.data.data?.realname==undefined){
				console.error(new Date().toLocaleTimeString())
				clearInterval(tid)
				alert(`${t} 挂机\r\n${new Date().toLocaleTimeString()} 掉线`)
			}
		},10*60*1000)
	}
	keepping(_ajax)

	// 获取课程列表
	let sss = await _ajax.post('https://zyjs.lngbzx.gov.cn/trainee/api/course/uncompleted?currentPage=1&pageSize=50&year=2025',{})
	// let courses = $$('.is_cont > div').last()[0].__vue__.course_list.courses
	courses = sss.data.data.courses
	console.info('所有课程:', courses)
	alert(`共计${courses.length}个课程\r\n开始学习`)

	// 遍历课程列表,逐个刷课
	let m_ajaxs = [], ajax_data_list = [], progress_index = 0
	for(let {id, is_completed, course_name} of courses){

		//更新进度
		$$(e.target).text(`进度${progress_index}/${courses.length}`)
		$$(e.target).attr({title: course_name})

		let lis = courses.map((item, index, _this)=>{
			if(index<progress_index){
				return `<li style="color:green;">${item.course_name}</li>`
			}else if(index==progress_index){
				return `<li style="font-weight: bold;">${item.course_name}</li>`
			}else{
				return `<li>${item.course_name}</li>`
			}
		})

		e.target.running = {
			title: `当前进度${progress_index}/${courses.length}`,
			html: `
				<div style="padding-left: 22px;">
					<ol style="list-style-type: decimal;text-align: left;max-height: 400px;font-family: fangsong;">
					${lis.join('')}
					</ol>
				</div>
			`
		}

		progress_index++;

		// console.log({id,is_completed,course_name})
		if(is_completed){
			continue
		}
		let ret, data;
		let playCourse, user_course_id, lesson_location, session_time;

		// 获取playCourse
		ret = await _ajax.get(`https://zyjs.lngbzx.gov.cn/trainee/api/course/play/${id}`)
		data = ret.data
		/*data = {
			"code": 0,
			"message": "操作成功",
			"data": {
			"playCourse": "04829a88cc284e3a907aa1be0f675764"
			}
		}*/

		playCourse = data.data.playCourse

		// 获取课程信息
		ret = await _ajax.get(`https://zyjs.lngbzx.gov.cn/trainee/api/course/detail/${id}`)
		data = ret.data
		/*data = {
			"code": 0,
			"message": "操作成功",
			"data": {
			"course": {
				"id": 5132,
				"course_name": "习近平总书记的青年时期",
				"course_no": "ln20240555",
				"cover_image": "https://kczytest.lngbzx.gov.cn/course_image/ln20240555logo.png",
				"online_date": "2024-07-26",
				"lecturer": "毛赟美",
				"lecturer_introduction": "中央团校党委委员、党群工作部部长",
				"duration": 13,
				"learning_hour": "0.50",
				"completed_count": 79391,
				"rating_score": "4.8",
				"learning_progress": "0.00",
				"is_completed": 0,
				"is_test": 0,
				"play_type": 4,
				"courseware_url": "/course/ln20240555/sco1/1.mp4",
				"keyword": "习近平总书记的青年时期",
				"introduction": "",
				"is_favorite": 0,
				"rating_detail": "[{\"score\":\"4.8\",\"option\":\"1\"},{\"score\":\"4.8\",\"option\":\"2\"},{\"score\":\"4.8\",\"option\":\"3\"},{\"score\":\"4.8\",\"option\":\"4\"},{\"score\":\"4.8\",\"option\":\"5\"}]",
				"is_rating": 0,
				"manifest": "[{\"sco_id\":\"item01\",\"course_id\":\"5132\",\"sco_name\":\"1.习近平总书记的青年时期\",\"url\":\"https://kczytest.lngbzx.gov.cn/course/ln20240555/sco1/1.mp4\",\"url_fluent\":null,\"url_HD\":null,\"sn\":1,\"identifier\":\"item01\",\"identifierref\":\"res01\",\"children\":[]}]",
				"is_file": null,
				"user_course_id": 37322610,
				"sco": "",
				"lecturer_avatar": null,
				"lecturer_details": null
			}
			}
		}*/

		user_course_id = data.data.course.user_course_id

		let d = {"playCourse":"d1badf044b5c4c4a8c14537ccf14328b","user_course_id":14747131,"scormData":[{"sco_id":"res01","lesson_location":"30","session_time":30}]}
		let dd = d.scormData[0]

		d.playCourse = playCourse
		d.user_course_id = user_course_id
		dd.lesson_location = 60*60
		dd.session_time = 60*60

		/* 函数内周期刷课,刷完返回*/
		async function shuakehandler(d) {

			return new Promise(function(resolve, reject) {

				async function inhandler(d) {
					let tid = setTimeout(function() {
						inhandler(d)
					}, 5*60*1000)
					// let _ajax = $axios.create({ headers: { Signature: 'adfasfsdaffsdafsdafaj' } })
					let ret = await _ajax.post('https://zyjs.lngbzx.gov.cn/trainee/index/user_course', d)
					ret = ret.data
					if (ret.code != 0) {
						console.error(`${course_name} 错误`, d)
						reject(`${course_name} 错误`, d)
						clearTimeout(tid)
					} else {
						if ('cheat' in ret.data) {
							console.log(`${new Date().toLocaleTimeString()} %c${ret.data.learning_progress}%c ${course_name} ${ret.data.message}`,'color:red;font-weight: bold;','color:black')
						} else {
							if (ret.data.learning_progress >= 100 || ret.data.learning_progress == undefined) {
								clearTimeout(tid)
								console.log(`${new Date().toLocaleTimeString()} %c完成%c ${course_name}`,'color:red;font-weight: bold;','color:black')
								resolve(`${new Date().toLocaleTimeString()} %c完成%c ${course_name}`,'color:red;font-weight: bold;','color:black')
							}else{
								console.log(`${new Date().toLocaleTimeString()} %c${ret.data.learning_progress}%c ${course_name} ${ret.message}`,'color:red;font-weight: bold;','color:black')
							}
						}
					}
				}

				// start
				inhandler(d)
			})
		}
		await shuakehandler(d)
		// ajax_data_list.push(d)
		// m_ajaxs.push(_ajax.post('https://zyjs.lngbzx.gov.cn/trainee/index/user_course', d))
	}
	$swal.fire(`完成${courses.length}个课程`)
	//let errhandler = (err)=>{alert("网络繁忙,或网址错误，请稍后刷新页面重试！");return false;}
	//let ret = await $axios.all(m_ajaxs).catch(errhandler)
	//console.log(ret)
}