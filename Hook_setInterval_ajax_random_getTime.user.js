// ==UserScript==
// @name         Hook_setInterval_ajax_random_getTime
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        *://*/*
// @run-at       document-start
// @require      file:///E:/Users/Cube/Desktop/www/vue3test/exam-test/public/js/ajaxhook.min.js
// @grant        none
// ==/UserScript==

(function() {
    'use strict';
    window.setInterval = function(){
        console.log('interval',arguments)
    }
    window.setTimeout = function(){
        console.log('timeout',arguments)
    }
	window.Math.random = function() {
	    let a = 0.5594356056193446
		console.log('random', a)
	    return a
	}
	window.Date.prototype.getTime = function(){
		let d = 1651552041549
		console.log('time', d)
		return d
	}

	ah.proxy({
		onResponse: (res, handler) => {
			if (res.config.url === '/Home/Course/getCourseDetails') {
				console.log(res.response)
				handler.next(res)
			} else {
				handler.next(res)
			}
		},
		onRequest: (config, handler) => {
			if(config.url == '/Home/Course/getCourseDetails')
				console.log(config)
			if(config.url == '/Home/Course/getClassRecommendCourse')
				console.log(config)
			handler.next(config)
		}
	})

    // Your code here...
})();