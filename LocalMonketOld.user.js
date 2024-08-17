/* eslint-disable no-undef */
/* eslint-disable no-eval */
// ==UserScript==
// @name         LocalMonketTest
// @namespace    http://tampermonkey.net/
// @version      1.5.5
// @description  relayout pages on browsing webpages
// @author       Cube
// @match        *://*/*
// @match        http://192.168.1.102:1020/*
// @match        http://10.10.10.83/*
// @match        http://10.10.10.20/*
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
// @require      file:///J:/Users/Cube/Documents/自学/JavaScript/tampermonkey/dist/main.js

// @run-at       document-start
// @grant        unsafeWindow
// @grant        GM_download
// @grant        GM_openInTab
// ==/UserScript==
// 如果grant使用unsafeWindow,则window对象会被包装,使用unsafeWindow访问原生window.使用none则不然

// 猴子文档地址
// https://www.tampermonkey.net/documentation.php?version=4.11&ext=dhdg
// jquery更换标识符:  $j = $.noConflict()

// jq 获取事件函数的方法 来自:https://blog.csdn.net/zlllxl2002/article/details/46804117
// jq 1.x 元素的jqueryxxxxxxx属性对应着$.cache[属性值]
// jq 2.x cache被闭包处理,无法直接得到,所以可以用$._data(元素)
// jq 3.x 同2.x, 也可以直接通过元素.jqueryxxxxxxxx得到

// 鼠标选中,控制台输入window.getSelection().toString()

// 查找指定子元素的vue对象
// $$($0).data('find', false).parents().each((i,a)=>{
//     if('__vue__' in a && !$$($0).data('find')){
//         console.log($$(a))
//         $$($0).data('find', true)
//     }
// })


// 83平台
// 杨孝
// cookiestxtuser=lhshrl; cookiestxtpwd=774f2ad691509600; ASPSESSIONIDACRBTTAB=NGAIEAJAANEHGINGIEPOPMIK; usrid=434; cookiesname=%D1%EE%D0%A2; logoid=587292

// 王彦军
// cookiestxtpwd=224a08b570d10b63; cookiestxtuser=wyj; ASPSESSIONIDACRDSTBA=BMHJFNOBPPPAIMNPGMBJHBBL; usrid=39; cookiesname=%CD%F5%D1%E5%BE%FC; logoid=587270


// let c = 'cookiestxtpwd=224a08b570d10b63; cookiestxtuser=wyj; ASPSESSIONIDACRDSTBA=BMHJFNOBPPPAIMNPGMBJHBBL; usrid=39; cookiesname=%CD%F5%D1%E5%BE%FC; logoid=587270'.replaceAll(/ +/g,'')
// let d = c.split(';')
// for(let item of d){
	// console.log(item)
	// document.cookie = item
// }

// let c = 'cookiestxtpwd=224a08b570d10b63; cookiestxtuser=wyj; ASPSESSIONIDACRDSTBA=BMHJFNOBPPPAIMNPGMBJHBBL; usrid=39; cookiesname=%CD%F5%D1%E5%BE%FC; logoid=587270'.replaceAll(/ +/g,'')
// for(let item of d){
	// console.log(item)
	// $cookies.set.apply(window, item.split('='))
// }




// $$("#mainFrame1").load(function(){.....}) 等待frame加载
// framedocument = document.getElementById('mainFrame1').contentDocument || $("#mainFrame1")[0].contentDocument || document.frames['mainFrame1'].document;


// 全民K歌曲
// $ajax.get('https://node.kg.qq.com/cgi/fcgi-bin/kg_ugc_get_homepage',{
//   params:{
//     jsonpCallback: 'cube',
//     type:'get_uinfo',
//     start: 1,
//     num: 15,
//     share_uid: '6a959f842424338b'
//   }
// }).then(function(res){
// let cube = function(data){
//   console.log(data.data.ugclist)
// }
// eval(res.data)
// })

// hex转string
// let hex="74 6F 3A E4 B8 AD E5 BF 83 E6 9C BA E6 88 BF 32 30 30 30 2D 47 45 31 2F 30 2F 35";
// decodeURIComponent(hex.replace(/(\w+)[\s]*/g, '%$1'))
// 限流
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
// 防抖
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

	let addscript = function(func_text){
		let s = unsafeWindow.document.createElement('script')
		s.text = func_text
		unsafeWindow.document.body.appendChild(s)
		console.log(s)
	}

	// unsafeWindow['cube'] = $BreakOn(unsafeWindow,'XM_SERVER_CLOCK')
	// if(location.host == 'github.com'){
	//     location.href = location.href.replace("https://github.com", "https://hub.fastgit.org")
	// }

	$$(function(){
		console.log('日志',location.href)
		//jq.css不支持添加important样式,要么用jq.attr,要么用原生.
		if(location.host != 'github1s.com'&&location.host != '192.168.1.102:8080'&&location.host != 'winmicr-3ne6125:8080'){
			$$("body")[0].style.setProperty("background","#CCE8CC","important")
			$$("body")[0].style.setProperty("background-color","#CCE8CC","important")
		}
		if(/218\.60\.153\.94:8020\/shtx/.test(location.href)){
			let settings = $$('#app > div > div.sidebar > ul > li').last()
			let a = settings.clone()
			$$(settings).after(a)
		}
		else if(/mp.weixin.qq.com/.test(location.href)){
			$$('#js_pc_qr_code > div > div').remove()
			$$("#meta_content").remove()
		}
		else if(/www.vue3js.cn/.test(location.href)){
			console.log('vue3官网')
			setTimeout(()=>{$$("#ad").remove()},3000)
		}
		else if(/10.10.10.10\/platform\/console\/home.ws/.test(location.href)){
			let uid = $$('input[name="CYEAR"]').val()
			console.log(uid)
			//alert(uid)
		}
		//获取行政公文
		else if(/10.10.10.20\/seeyon\/govdoc\/list.do/.test(location.href)){
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
		else if(/10\.10\.10\.83\/main.asp/.test(location.href)){
			let names = '大迪,大男,大燚,大博,大郝,大鑫'.split(',')
			names = '殷客松,殷客松,殷客松,殷客松,殷客松,殷客松'.split(',')
			$$('body > table > tbody > tr:nth-child(1) > td:nth-child(3) > p > font, body > table > tbody > tr:nth-child(4) > td > font').text(names[Math.floor(Math.random()*6)])
		}
		//查工资
		else if(/10.10.10.24:8080\/WebReport\/ReportServer/.test(location.href)){
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
		else if(/baidu.com/.test(location.href)){
			$$("#content_left").css('padding-left','1em');
		}
		else if(/\d+\.\d+\.\d+\.\d+.+\/seeyon\/main.do\?method=main/.test(location.href)){
			setTimeout(()=>{
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
">双击</p></div>
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
				//             alert('双击任何位置关闭系统提示\n\n只要不点确定')
				//             $(".layui-layer-shade").remove()
				//             $("#pwdMessageBox_mask").remove()
				//             $("#layui-layer1").remove()
				//             $("#pwdMessageBox").remove()
			},500)
		}
		//国家中小学智慧教育
		//国家中小学智慧教育
		else if(/basic.smartedu.cn\/teacherTraining\/courseDetail/.test(location.href)){
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
		else if(/admin.nhrdc.cn:8100\/Home\/User\/course/.test(location.href)){
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
		else if(/http:\/\/gwy.lngbzx.gov.cn\/student\/mycourse.do/.test(location.href)){
			// 辽宁省干部培训 公务员区 刷课
			showAlert = function(){}
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
				let ret = await $axios.all(req_generate(2)).catch(errhandler)
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
		//专业技术人员 刷课
		else if(/https:\/\/zyjs.lngbzx.gov.cn\/study\/yearplan\/gostudy/.test(location.href)){
			// alert('不支持"作者略"的课程')
			let wrapEncrypt = function(text, rkey){
				let encrypt = $cryptojs.AES.encrypt(text, $cryptojs.enc.Utf8.parse(rkey), {
					mode: $cryptojs.mode.ECB,
					padding: $cryptojs.pad.Pkcs7
				}).toString();
				return encrypt
			}
			let $instance = $axios.create()
			$instance.defaults.transformRequest = [function (data, headers) {
				return $qs.stringify({json: JSON.stringify(data)})
				// return $qs.stringify({json: JSON.stringify(data)})
			}]
			let errhandler = (err)=>{alert("网络繁忙,或网址错误，请稍后刷新页面重试！");return false;}
			async function ajaxshuke(formdata, rkey, bixuan = true){
				let cid = formdata.id,
					source = bixuan?10:11,
					position = ''+formdata.position.split('|')[0],
					percent = formdata.percent,
					len = formdata.length
				let data = await $instance.post('/study/resource/saveview', {cid, source, position, percent}).then(({data})=>{return data}).catch(errhandler)
				if(!data) return false
				if (data.status == 0) {

					let historyId = ''+data.id

					position = '1620'
					// position = ''+Math.floor(len/180)*180
					let postData = {cid, historyId, position, len, spos: "395141.11"}
					let sign = wrapEncrypt("cid:" + cid + ";historyId:" + historyId + ";position:" + position + ";len:" + len + ";spos:" + "395141.11", rkey)
					postData = {...postData, sign}
					// return false
					return $instance.post('/study/resource/saveview', postData).then(({data})=>{
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

			// 得到课程信息,和rkey(AES加密)
			// cid/*课程id*/, historyId, position/*进度,timespace的倍数*/, length/*时长*/, spos/*播放器精细进度X1000*/
			// {cid,source: bixuan?10:11,position: "",percent: 10}
			async function shuakehandler(e){
				let el = e.target
				let {cid, scid} = $$(el).data()
				let {data} = await $axios.get(`https://zyjs.lngbzx.gov.cn/study/resource/info/${cid}/${scid}`).catch(errhandler)

				let $content = $$(data)
					, uri = '/study'/*$content.find('#cpath').val()*/
					, page = '/resource/'
					, formtable = $content.find('#readvideoform')

				if($content.find('#read').length!=0){
					formtable = $content.find('#readform')
					uri += "/xml/normal"
					page += 'saveview'
				}else if($content.find('#readvideo').length!=0){
					uri += "/xml/video"
					page += 'saveview'
				}else if($content.find('#readtss').length!=0){
					uri += "/xml/tss"
					page += 'saveTssView'
				}

				let formdata = $qs.parse(formtable.serialize())
				data = await $axios.post('/study/resource/position/' + cid, formtable.serialize()).then(({data})=>{return data}).catch(errhandler)
				formdata.percent = data.percent
				formdata.position = data.position

				if(/gostudy\/1/.test(location.href)){ // 必修课
					formdata.source = "10"
				}else if(/gostudy\/2/.test(location.href)){ // 选修课
					formdata.source = "11"
				}

				data = await $axios.post(uri, $qs.stringify(formdata)).then(({data})=>{return data}).catch(errhandler)
				let rkey = $$(data).find('#rkey').val()
				console.log('rkey',rkey)
				rkey = rkey.substring(16)
				console.log('rkey',rkey)

				console.log('assist', data.match(/readAssist\((.+)\)/gim))

				return false
				let ret = false
				if(/gostudy\/1/.test(location.href)){ // 必修课
					ret = await ajaxshuke(formdata, rkey, true)
					ret = await ajaxshuke(cid, len)
				}else if(/gostudy\/2/.test(location.href)){ // 选修课
					ret = await ajaxshuke(formdata, rkey, false)
				}
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

			let yijianshua = $$('<a href="#" style="background: green;" class="active"><i class="icon iconfont"></i>一键刷课</a>')
			yijianshua.click(async e=>{
				for(let el of $$('#theform dd.time.cl > span.fr')){
					if(el.innerText.indexOf('100')!==-1){
					}else{
						let btn = $$(el).parent().next().find('.__cubebtn')[0]
						await shuakehandler({target: btn})
					}
				}
			}).appendTo(".w_btn3")
			// 添加批量删课
			// let deldx = $$('<a href="#" class="active"><i class="icon iconfont"></i>删除显示的课程</a>')
			// deldx.click(e=>{
			//  $$('#theform dd.teach.cl > .fr[id]').each((_,item)=>{
			//      let data = $$(item).attr('onclick').match(/(\d+),'(\w+)'/).slice(1,3)[0]
			//      $$.post("https://zyjs.lngbzx.gov.cn/study/yearplan/changeReqCourse",`type=1&score=1&id=${data}`).then(res=>{
			//          if(res.status==0)
			//              $$(item).parents('dl.fl').toggle()
			//      })
			//  })
			// }).appendTo(".w_btn3")


		}
		else if(/m.rr.tv/.test(location.host)){
			$$("body").css('max-width', 'max-content')
			setTimeout(function(){
				$$(".video-wrap").css({'display': 'flex', 'justify-content': 'center', 'align-items': 'center', 'width': '95%', 'z-index':999, 'margin': '0 2%', 'height': '800px'})
				// $$("video").css('height','auto')
				let vm = $$("video").parent()[0],
					url = $$("video")[0].src
				new DPlayer({
					container: vm,
					autoplay: true,
					theme: '#1f87cb',
					hotkey: true,
					video: {url,}
				})
			},2000)
		}
		else if(/kuwo.cn/.test(location.host)){
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
		else if(/(md|MD)$/.test(location.href)){
			console.log('markdown')
			let text = $$("pre").text()
			$$("body").html($markdown(text))
			$addcss("file:///J:/Users/Cube/Documents/%E8%87%AA%E5%AD%A6/JavaScript/markdown%E7%BC%96%E8%BE%91%E5%99%A8/bootstrap.min.css")
		}
		else if(/maoke123.com/.test(location.href)){
			console.log('猫课')
			$$("#head > div").css({width:'auto'})
			$$("body > div.coursedetail-main-box > div").css({width:'auto'})
			$$("body > div.coursedetail-main-box > div > div.content-left > div.lower > div.chapter-box > div.course-box > ul > li").css({display:'inline-flex'})
		}
		else if(/rzlib.net/.test(location.href)){
			console.log('rzlib')
			$$("#chapter").css('width','unset').find('.header,.nav,.navbox,.chapter_top').remove()
			$$(".chapter_action").css('width','unset')
		}
		else if (/www.sublimetext.cn/.test(location.href)) {
			console.log('sublime 文档')
			let btn = $totop().data('speed',200).appendTo("body")
		}
		else if (/www.doc88.com/.test(location.href) || /www.360doc.com/.test(location.href)){
			console.warn('解锁复制功能')
			function oncopy() {
				return true;
			}
			setInterval(function(){
				try{
					unsafeWindow.logined = 1
					unsafeWindow.u_v = 1
					document.body.oncopy = oncopy //360doc
				}catch(e){console.log(e)}
			},1000)
		}
		else if(/www.52pojie.cn/.test(location.href)){
			console.log('吾爱破解样式修改')
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
				}else{
					alert('已经签到')
				}
			})
			// return;
			// 美化,增加折叠框
			// $$("#separatorline").prevAll("tbody").each((i,item)=>{
			//  try{toggle_collapse(item.id)}catch(e){}
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
		else if(/www.9ku.com/.test(location.href)){
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
		else if(/github/.test(location.host)){
			$$("body > div.application-main > div > main > div.container-lg.clearfix.new-discussion-timeline.p-responsive").css({"max-width":"100%"})
			let btn = $totop().data('speed',200).appendTo("body")
			try{
				let v = $$("#rename-field").val();
				$("#options_bucket > div.Box.Box--danger > ul > li:nth-child(4) > details > details-dialog > div.Box-body.overflow-auto > form > p > input").val(v);
			}catch(e){}
		}else if(/www.cnblogs.com/.test(location.host)){
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
		else if(/zhidao.baidu/.test(location.href)){
			console.log('zhidao')
			$insertcode(unsafeWindow)
			$$("#body").css({"padding":"2em"});
			// $$("#ihome-header > div > div > a.zhidao-logo.grid, #ihome-header > div > div > a, #userbar > ul > li.shop-entrance").remove()
			// $$("#ihome-header > div > div").css({'flex-direction': 'row-reverse','justify-content': 'flex-end'})
			// $$("#userbar").css("position", "unset")
		}
		else if(/blog.csdn.net/.test(location.host)){
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
		}else if(/bbs.csdn.net/.test(location.host)){
			$$("#bbs_detail_wrap").css({"height":"","overflow":""});
			$$(".hide_topic_box").hide();
			$$("dt.topic_l").css({"width":"10px"});
			$$("dt.topic_l").hide();
		}else if(/慕课/.test(location.href)){
			console.log('慕课网')
			var l = $$("div.section-list");
			var li = $$(".course-menu.course-video-menu.clearfix.js-course-menu li")[2];
			$$(li).after('<li class="course-menu-item"><a href="javascript:void(0)" id="ismenu">开启右侧目录</a></li>');
			$$("#ismenu").click(function(){
				l.toggle();
			});
		} else if(/pfjs.annihui.com/.test(location.host)){
			console.log('普法答题')
			window._czc = []
			window.setTimeout = function(callback,timeout){
				console.log(callback)
				console.log(timeout)
			}
		} else if(/st2.pjchat.com\/caidan.php\?type=1/.test(location.host)){
			//乙烯食堂登录cookie
			// 'dcst=10;mima=6f63605a89b31e32ca752a05d3dd9ab7;dcy=13504272173'.split(';').forEach(function(a){
			//     document.cookie = a
			// })
			// console.log('乙烯食堂13504272173 cookie已经安装')
		} else if(/www.sis001.com\/forum\/forum/.test(location.href) || /38.103.161.143/.test(location.host) || /23.225.255.95/.test(location.host) || /23.225.172.95/.test(location.host)){
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

			// setTimeout(function(){
			//     $$('*').removeClass('noSelect')
			//     let cite = $$("tr > td.author > cite")
			//     cite.children("a,img").toggle();
			//     cite.each(function(index,el){
			//         if(el.innerText<10){
			//             $$(el).parent().parent().toggle()
			//         }
			//     })
			//     cite.children("a,img").toggle();
			// },4000)
		} else if(/segmentfault.com/.test(location.host)){
			$$("<div></div>").attr("id","SFUserId").appendTo("body")
			console.log("segmentfault解锁免登陆复制快捷键Ctrl+C")
		} else if(/ximalaya.com/.test(location.host)){
			$$("#rootHeader > div").css({"width":"auto","display": "flex","flex-direction": "row-reverse"})
		} else if(/http:\/\/www.imomoe.ai\/player\//.test(location.href)){
			console.log('樱花动漫')
			$$('.movurls li a').each(function(i,a){a.target = "_top"})
		} else if(/studygolang.com/.test(location.host)){
			console.log('golang中文网')
			$$(".sidebar").hide().parents(".row").children("div:first").css({width:"100%"})
		} else if(/cdn.jsdelivr.net/.test(location.host)) {
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

		} else if(/m.yy233.com/.test(location.host)){
			$$(".player_title").remove()
			$$("#zanpiancms_player, #zanpiancms_player > div").css({width: '100vh', height: '95vh'})
		} else if(/kuaikan\d+.com/.test(location.host) ||/zhuijuku.com/.test(location.host)|| /kk6080.cn/.test(location.host)){
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

// $$(window).resize(function(){
//     console.log(window.outerWidth,screen.width)
//     console.log(window.outerWidth,screen.width)
// })

function ClearChromeHistoryByConsole(){
	for (let i of document.getElementById("history-app").$.history.$["infinite-list"].children){
		try{
			i.$.checkbox.click()
		}catch(e){}
	}
}





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