// ==UserScript==
// @name         小说阅读处理
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://www.pomowx.com/*
// @match        https://m.pomowx.com/*
// @grant        none
// @require      https://cdn.staticfile.org/jquery/3.4.0/jquery.min.js
// @run-at       document-end
// ==/UserScript==

// const $ = (selector)=>{
// 	return document.querySelectorAll(selector);
// }

// $.on = (elm, type, fn)=>{
// 	elm.addEventListener(type, fn);
// }

// RegExp.prototype.test_location = (s)=>{
// 	if (arguments.length >0)
// 		return this.test(s)
// 	else
// 		return this.test(location.href)
// }

function AddCss(t) {
	let e = $("<link>").attr({
		href: t,
		rel: "stylesheet"
	});
	$("head").append(e[0])
}
function AddStyle(t) {
	let e = $("<style>").text(t)
	$("head").append(e[0])
}


(function() {
    'use strict';
	if(/www.pomowx/.test(location.href)){
		let container = $("#content")[0];
		$(".ywtop")[0].parentElement.remove()
		$(".con_top")[0].remove();
		$(".read-titlelinke")[0].remove();
		$(".tjlist")[0].remove();
		container.innerText = container.innerText.replace(/\n\n/g,'\n');
		container.style.setProperty("line-height", '2em');
		container.style.setProperty('user-select', 'none');
		container.addEventListener('contextmenu', function(e){
			e.preventDefault();
			document.querySelector("#box_con > div.bottem > a:nth-child(4)").click();
		});
		container.addEventListener('dblclick', function(e){
			e.preventDefault();
			document.querySelector("#box_con > div.bottem > a:nth-child(4)").click();
		})
		document.onclick = null;
	} else if(/m.pomowx/.test(location.href)){
		$(".nr_set, .nr_page:first").hide()
        AddStyle(`
        p {
            user-select: none;
        }
        .nr_title {
            font-size: 18px !important;
            font-weight: bold !important;
            cursor: pointer !important;
        }
        .nr_page:last {
            position: fixed !important;
            bottom: 0px !important;
            width: 100% !important;
        }`)
		let scrollHandle = function(e){
			if ($(window).height() + $(window).scrollTop() >= $(document).height()*8/9) {
				$(window).off('scroll')
				let current_href = $("#pb_next")[0].href
				$.get(current_href).then(res=>{
					let a = res
					let title = $(a).find(".nr_title"),
						content = $(a).find(".nr_nr"),
						pb_prev = $(a).find("#pb_prev"),
						pb_next = $(a).find("#pb_next")
					$('.nr_nr').last().after(title)
					content.insertAfter(title)
					$('#pb_next')[0].href = pb_next[0].href
					$('#pb_prev')[0].href = pb_prev[0].href
					setTimeout(()=>{$(window).on('scroll', scrollHandle)},2000)
					title.click(()=>{
						location.href = current_href; //pb_prev[0].href
					})
					console.log(title.text(), pb_next[0].href)
				})
			}
		}
		setTimeout(()=>{$(window).on('scroll', scrollHandle)},500)
	}

    // Your code here...
})();









		// document.onkeydown = e => {
		// 	let event = e || window.event
		// 	if (event.keyCode == 37) $('#pb_prev').click()
		// 	if (event.keyCode == 39) $('#pb_next').click()
		// 	if (event.keyCode == 13) $('#pb_mulu').click()
		// }