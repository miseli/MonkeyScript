// ==UserScript==
// @name         临时测试
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://haokan.baidu.com/v?vid=8941643469786597668
// @icon         https://www.google.com/s2/favicons?domain=baidu.com
// @grant        none
// @run-at       document-start
// ==/UserScript==

(function() {
    'use strict';
	let tmpo = {}
	window.__PRELOADED_STATE__ = tmpo
	Object.defineProperty(window, '__PRELOADED_STATE__', {
		get(){
			return tmpo
		},
		set(v){
			tmpo = v
			console.log(v)
		}
	})

		if(/10.10.15.32/.test(location.href)){
			$$('#mainframe_windows').bind('DOMNodeInserted', function(){
                debugger
				let trs = $$('.editor-label:contains("整改附件")').next().find('tr')
				// trs.shift()
				console.log(trs)
			})
		}
// (function(){
//     let vid = '8941643469786597668'// 当前视频的vid

//     async function getnextpage(mthid, ctime){
//         return await $$.getJSON(`https://haokan.baidu.com/web/author/listall?app_id=${mthid}&ctime=${ctime}&rn=10&_api=1`)
//     }

//     $$.getJSON(`https://haokan.baidu.com/videoui/api/videoauthor?vid=${vid}`, res=>{
//         let mthid = res.data.response.author.mthid
//         $$.get(`https://haokan.baidu.com/author/${mthid}`, async res=>{
//             let data = JSON.parse($$(res)[21].innerText.match(/\{.*}/)[0]),
//                 ctime = data.video.ctime,
//                 results = data.video.results
//             console.log(results)
//             //这里遍历results,与当前vid比对,得到下一集的vid
//             //如果没有,则继续获取下一页
//             if(data.video.has_more){
//                 console.log((await getnextpage(mthid, ctime)).data)
//             }
//         })
//     })
// })()
    // Your code here...
})();