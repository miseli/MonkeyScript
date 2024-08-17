// ==UserScript==
// @name         丹东教师信息2.0
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        *://study.teacheredu.cn/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=teacheredu.cn
// @grant        none
// ==/UserScript==

(function() {
	//alert_ = window.alert
	window.alert = function(s){
		console.log(s,new Date().toLocaleTimeString())
	}

	window.document.addEventListener('visibilitychange', function() {
		if (window.document.visibilityState === 'visible') {
				console.log('我回来了',this, new Date().toLocaleTimeString(), {begintime, randomTime})
		} else if (window.document.visibilityState === 'hidden') {
				console.log('我离开一会',this, new Date().toLocaleTimeString(), {begintime, randomTime})
		}
	});

	function addlognote(){
		let lognote = `<div id="lognote" style="position: absolute; background-color: rgb(133 133 133 / 48%); width: 280px; height: 400px; border-radius: 10px; white-space: pre; cursor: default; bottom: 5px; right: 5px; user-select: none;">
				1.asdffffffffffff
				2.asdfffffffffff
				3.zxcvcvvvvvvvvvv
			</div>`
		// }
		lognote = $$(lognote)[0]
		document.body.appendChild(lognote)
	}

//     window.addEventListener = window.document.addEventListener
//     window.document.addEventListener = function(){
//         console.log(this, arguments)
//         window.addEventListenner.apply(window.document, arguments)
//     }
	// Your code here...
})();