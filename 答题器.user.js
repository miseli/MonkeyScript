// ==UserScript==
// @name         答题器
// @namespace    http://tampermonkey.net/
// @version      0.6
// @Date         2021年1月22日15:55:40
// @description  quick answer for train.lnsafety.com datiqi zuobiqi liuyuanxin
// @author       You
// @license      MIT
// @updateURL    https://openuserjs.org/meta/xaojoe126.com/答题器.meta.js
// @connect      cube123.cn
// @match        *://train.lnsafety.com/*
// @match        *://218.60.144.59/*
// @require      http://apps.bdimg.com/libs/jquery/2.1.4/jquery.min.js
// @grant        GM_xmlhttpRequest
// @grant        unsafeWindow
// @run-at       document-start

// ==/UserScript==

(function () {
  $(document).ready(function () {
    console.log("开始运行" + location.href);
    var body = $("body");
    if (body.length === 0) return;
    body.removeAttr('onselectstart');
    body.removeAttr('oncontextmenu');
    body.removeAttr('ondrag');

    let li = $("input[value='对']:first").parents('ul').parent('div').find('li');
    let old = 0;
    if (li.length < 100) return;

    alert("如果工具失效或漏题，只能祝你好运了!");
    alert("脚本使用后记得删除，右上角黑色图标，右键删除！");
    alert("完成后有提示");

    for (let i = 0; i < li.length; i++) {
      try {
        let timu = li[i].innerText.split('\n')[0];
        console.log(timu);
        timu = timu.replace(/^[\d ]*、/, '');
        //timu = timu.substr(3,15);
        GM_xmlhttpRequest({
          method: 'post',
          url: "http://cube123.cn/kaoshi/xspx/exam_2018_9_10.asp",
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          },
          data: 'action=query&id=' + i + "&timu=" + timu.replace(/%/g, '%25'),
          onload: function (r) {
            console.log(r.responseText);
            //console.log(JSON.parse(r.responseText));
            old++;
            if (old == 100) {
              console.log('完成');
              alert('完成,别交卷太快.');
              alert('可以删除插件了,右上角黑色图标，右键删除！');
            }
            let s = null
            try {
              s = JSON.parse(r.responseText);
              if (s.action == "query") {
                let tid = s.data.id;
                s = s.data.a;
                if (/对/.test(s)) {
                  $(li[tid]).find("input[value='对']").click();
                }
                else if (/错/.test(s)) $(li[tid]).find("input[value='错']").click();
                else if (/A/.test(s)) $(li[tid]).find("input[value='A']").click();
                else if (/B/.test(s)) $(li[tid]).find("input[value='B']").click();
                else if (/C/.test(s)) $(li[tid]).find("input[value='C']").click();
                else if (/D/.test(s))
                  //$($(li[tid]).find("input")[3]).attr("checked",true);
                  $(li[tid]).find("input[value='D']").click();
                else console.log('题库中此题目答案缺失<===>' + li[tid].innerText.split('\n')[0]);
              }
              else if (s.action == 'err') console.log('题库中未找到<===>' + li[tid].innerText.split('\n')[0]);
            }
            catch (e) {
              console.log(s.data.id, "网络错误or服务器错误or题目异常", r.responseText);
            }
          }
        });
      }
      catch (e) {}
    }
  });
})();
/*
        var fileref=document.createElement('script');
        fileref.setAttribute("type","text/javascript");
        fileref.setAttribute("src", 'http://ajax.microsoft.com/ajax/jquery/jquery-1.4.min.js');
        document.getElementsByTagName("head")[0].appendChild(fileref);
        //li = $(window.parent.frames["mainFrame1"].document).find("#RightExam ul li");
*/
