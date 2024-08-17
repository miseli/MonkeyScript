/* eslint-disable no-undef */
/* eslint-disable no-eval */
// ==UserScript==
// @name         替换vue
// @namespace    http://tampermonkey.net/
// @version      1.5.5
// @description  relayout pages on browsing webpages
// @author       Cube
// @match        *://*/*
// @license      MIT
// @run-at       document-start
// @grant        unsafeWindow
// @grant        GM_webRequest
// ==/UserScript==
(function() {
	'use strict';
	//// @require      file:///J:/Users/Cube/Documents/自学/JavaScript/tampermonkey/dist/main.js
	//// @webRequest   {"selector":{"include":"*://*vue.min.js", "exclude": "*://purge.jsdelivr.net/*"},"action":{"redirect":"https://cn.vuejs.org/js/vue.js"}}
	// 如果grant使用unsafeWindow,则window对象会被包装,使用unsafeWindow访问原生window.使用none则不然
	debugger
	console.log(GM_info.script.webRequest)
	GM_webRequest([
		// { selector: '*cancel.me/*', action: 'cancel' },
		// { selector:"*://*app.aad7db47.js", action: 'cancel'},
		// { selector: { include: '*', exclude: 'http://exclude.me/*' }, action: { redirect: 'http://new_static.url' } },
		// { selector: { match: '*://match.me/*' }, action: { redirect: { from: '([^:]+)://match.me/(.*)',  to: '$1://redirected.to/$2' } } }
	], function(info, message, details) {
		console.log(info, message, details);
	});
	// Your code here...
	(async () => {
		const rules = [
			// error on the background page
			{ selector: "https://httpbin.org/anything?key=1" },
			// works but never calls the listener
			{ selector: "https://httpbin.org/anything?key=2", action: {} },
			// always redirects to the static URL
			{ selector: "https://httpbin.org/anything?key=3", action: {
				redirect: {
					from: "https://httpbin.org/anything\\?(.*)",
					to: "https://httpbin.org/anything/redirect?mode=dynamic&$1",
					url: "https://httpbin.org/anything/redirect?mode=static",
				},
			} },
		];

		console.log("start");
		for (let i = 0; i < rules.length; i++) {
			try {
				let [action, message, details] = await new Promise((resolve, reject) => {
					GM.webRequest([rules[i]], (...args) => resolve(args))
						.then(() => fetch(`https://httpbin.org/anything?key=${i+1}`))
						.finally(() => setTimeout(reject, 500, "timeout"));
				});
				console.log(i+1, details.description || message, details.redirect_url || details.url);
			} catch (ex) {
				console.log(i+1, ex, rules[i]);
			}
		}
		console.log("done");
	})();
})();