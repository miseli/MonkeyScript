// ==UserScript==
// @name         登录安全生产管理信息系统
// @namespace    http://tampermonkey.net/
// @version      2024-08-16
// @description  try to take over the world!
// @author       You
// @match        http://10.10.15.32/
// @require      http://10.10.15.32/Scripts/Web/jquery.min.js
// @icon         https://www.google.com/s2/favicons?sz=64&domain=15.32
// @grant        none
// ==/UserScript==

(function() {
    'use strict';
	let data = {userName: 20421,password: 'Hjjt@123456'},
		data1 = {Name: 20421, Password: 'Hjjt@123456'}
    debugger
	$.post('http://10.10.15.32/Home/CheckLoginInfo',data).then(res=>{
		if(res!=""){
			alert(res)
			return false;
		}
		$.post('http://10.10.15.32/Home/PortalIndex', data1).then(res=>{
			$.get('http://10.10.15.32/Home/PortalEnter').then(res=>{
				location.href = 'http://10.10.15.32/Home/MainView'
			})
		})
	})

    // Your code here...
})();