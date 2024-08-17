# <center>[MonkeyScript 主页](https://miseli.github.io/MonkeyScript/index.html)</center>

## 说明
将在Tampermonkey上所开发管理的脚本文件汇总到当前的MonkeyScript中。

篡改猴 ([TamperMonkey](http://tampermonkey.net/)) 是拥有 超过 1000 万用户 的最流行的浏览器扩展之一。

要使用脚本，您首先需要安装一个用户脚本管理器([TamperMonkey](http://tampermonkey.net/))。

您可以根据当前使用的浏览器来选择一个用户脚本管理器。

+ Chrome: [Tampermonkey](https://chromewebstore.google.com/detail/dhdgffkkebhmkfjojejmpbldmpobfkfo) 或 [Violentmonkey](https://chrome.google.com/webstore/detail/violent-monkey/jinjaccalgkegednnccohejagnlnfdag)
+ Firefox: [Greasemonkey](https://addons.mozilla.org/firefox/addon/greasemonkey/) 、 [Tampermonkey](https://addons.mozilla.org/firefox/addon/tampermonkey/) 或 [Violentmonkey](https://addons.mozilla.org/firefox/addon/violentmonkey/)
+ Safari: [Tampermonkey](http://tampermonkey.net/?browser=safari) 或 [Userscripts](https://apps.apple.com/app/userscripts/id1463298887)
+ Microsoft Edge: [Tampermonkey](https://microsoftedge.microsoft.com/addons/detail/tampermonkey/iikmkjmpaadaobahmlepeloendndfphd) 或 [Violentmonkey](https://microsoftedge.microsoft.com/addons/detail/violentmonkey/eeagobfjdenkkddmbclomhiblgggliao)
+ Opera: [Tampermonkey](https://addons.opera.com/extensions/details/tampermonkey-beta/) 或 [Violentmonkey](https://violentmonkey.github.io/get-it/)
+ Maxthon: [Violentmonkey](http://extension.maxthon.com/detail/index.php?view_id=1680)
+ AdGuard: [AdGuard](https://adguard.com/) （不需要其他软件）



## 安装脚本
以下大部分脚本需要[main.js](https://miseli.github.io/MonkeyScript/main.js)支持

main.js一个工具包,集成了多种工具类,需要在LocalMonkey.user.js中引入,请自行配置路径
``` js
// @require      file:///D:/Dist/main.js
// @run-at       document-start
// @grant        unsafeWindow
```
###### 脚本列表

+ [LocalMonket](https://miseli.github.io/MonkeyScript/LocalMonket.user.js) - 集成多种功能，包括网页美化、功能修改、刷课等等
+ [一键确认&新建组&批量删除](https://miseli.github.io/MonkeyScript/一键确认&新建组&批量删除.user.js) - 作业报备自动确认/门禁管理新建组/OA批量修改密码/责任制批量打分
+ [天籁安全教育](https://miseli.github.io/MonkeyScript/天籁安全教育.user.js) - 天籁安全教育刷课,可集成到**一键确认&新建组&批量删除**
+ [改名](https://miseli.github.io/MonkeyScript/改名.user.js) - 海洋王系统批量改名
+ [登录安全生产管理信息系统](https://miseli.github.io/MonkeyScript/登录安全生产管理信息系统.user.js) - 自动登录安全生产管理信息系统
+ [小说阅读处理](https://miseli.github.io/MonkeyScript/小说阅读处理.user.js)
+ [临时测试](https://miseli.github.io/MonkeyScript/临时测试.user.js)
+ [丹东教师信息2.0](https://miseli.github.io/MonkeyScript/丹东教师信息2.0.user.js)
+ [替换vue](https://miseli.github.io/MonkeyScript/替换vue.user.js)
+ [模态提示框Swal](https://miseli.github.io/MonkeyScript/模态提示框Swal.user.js)
+ [答题器](https://miseli.github.io/MonkeyScript/答题器.user.js)
+ [~~AudioDownloader~~](https://miseli.github.io/MonkeyScript/AudioDownloader.user.js) - ~~音频下载器,使用到的api已过期或废止~~ **已经作废**
+ [~~辽宁干部在线培训~~](https://miseli.github.io/MonkeyScript/辽宁干部在线培训.user.js) - ~~辽宁干部在线培训刷课(公务员/技术人员)~~  **已经作废**



## 更新说明
```
clone git@github.com:miseli/MonkeyScript.git
```