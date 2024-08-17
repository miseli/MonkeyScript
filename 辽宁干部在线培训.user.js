/* eslint-disable no-undef */
/* eslint-disable no-eval */
// ==UserScript==
// @name         辽宁干部在线培训
// @namespace    http://tampermonkey.net/
// @description  目前仅支持 "专业技术人才" 与 "公务员" 刷课
// @version      0.1.0
// @author       Menglong
// @match        *://*/*
// @license      MIT
// @require      https://cdnjs.cloudflare.com/ajax/libs/jquery/3.7.1/jquery.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/axios/1.5.1/axios.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/qs/6.11.2/qs.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/crypto-js/4.1.1/crypto-js.min.js
// @run-at       document-end
// ==/UserScript==

(function() {
    'use strict';
    $(function(){
		const $$ = $.noConflict()
		const $axios = axios
		const $qs = Qs
		const $cryptojs = CryptoJS
		window.axios = axios

		let wrapEncrypt = function(text, rkey){
		    let encrypt = $cryptojs.AES.encrypt(text, $cryptojs.enc.Utf8.parse(rkey), {
		        mode: $cryptojs.mode.ECB,
		        padding: $cryptojs.pad.Pkcs7
		    }).toString();
		    return encrypt
		}

		// studyCourse = function(id, fl){
		// 	location.href = "/study/resource/info/"+id+"/"+fl
		// }

		if(/http:\/\/gwy.lngbzx.gov.cn\/student\/mycourse.do/.test(location.href)){
			// 辽宁省干部培训 公务员区 刷课
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
		else if(/https:\/\/zyjs.lngbzx.gov.cn\/study\/yearplan\/gostudy/.test(location.href)){
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
						postdata.sign = wrapEncrypt(JSON.stringify(postdata).replace(/[\{\}"]/g,'').replace(/,/g,';'), rkey)
						postdata = $qs.stringify({json: JSON.stringify(postdata)})
					}else if(/saveTssView/i.test(page)){
						postdata = {historyId: data.id, position: len, len, cid}
						postdata.sign = wrapEncrypt(JSON.stringify(postdata).replace(/[\{\}"]/g,'').replace(/,/g,';'), rkey)
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
			// 添加批量删课
			// let deldx = $$('<a href="#" class="active"><i class="icon iconfont"></i>删除显示的课程</a>')
			// deldx.click(e=>{
			// 	$$('#theform dd.teach.cl > .fr[id]').each((_,item)=>{
			// 		let data = $$(item).attr('onclick').match(/(\d+),'(\w+)'/).slice(1,3)[0]
			// 		$$.post("https://zyjs.lngbzx.gov.cn/study/yearplan/changeReqCourse",`type=1&score=1&id=${data}`).then(res=>{
			// 			if(res.status==0)
			// 				$$(item).parents('dl.fl').toggle()
			// 		})
			// 	})
			// }).appendTo(".w_btn3")
		}
    })
})();