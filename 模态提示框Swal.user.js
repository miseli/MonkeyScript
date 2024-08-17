// ==UserScript==
// @name         模态提示框Swal
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        http://218.60.153.94:8020/shtx/
// @require      file:///D:/Dist/sweetalert2.all.min.js
// @icon         https://www.google.com/s2/favicons?sz=64&domain=153.94
// @run-at       document-end
// @grant        unsafeWindow
// ==/UserScript==

(function() {
    //'use strict';
    async function aaa(){
        const { value: text } = await Swal.fire({
            input: 'textarea',
            inputLabel: '粘贴',
            inputPlaceholder: '粘贴到这里...',
            inputAttributes: {
                'aria-label': 'Type your message here'
            },
            showCancelButton: true
        })
    }
    aaa()
    // Your code here...
})();