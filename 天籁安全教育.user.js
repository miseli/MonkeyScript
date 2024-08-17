// ==UserScript==
// @name         天籁安全教育
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://www.tlsafety.com/*
// @match        https://www.cnblogs.com/aeolian/p/11083804.html
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tlsafety.com
// @require      https://www.tlsafety.com/Public/js/jquery.min.js
// @require      https://unpkg.com/sweetalert/dist/sweetalert.min.js
// @run-at       document-end
// @grant        unsafeWindow
// ==/UserScript==

(function() {
    'use strict';
// 获取视频时长
function getVideoDuration(url) {
    // IOS的微信小程序中无法触发onloadedmetadata
    // if (this.getENVIR() === 'wxapp' && this.checkIfIOS()) {
    //     return new Promise((reslove) => {
    //         let audio = new Audio(url);
    //         audio.muted = true;
    //         audio.play().then(() => audio.pause());
    //         audio.addEventListener('loadedmetadata', function() {
    //             reslove(parseInt((audio.duration * 1000).toString(), 10));
    //         });
    //         audio.muted = false;
    //     });
    // }
    return new Promise((reslove) => {
        let video = document.createElement('video');
        video.preload = 'metadata';
        video.src = url;
        video.onloadedmetadata = () => {
            reslove(parseInt((video.duration * 1000).toString(), 10));
            video = null;
        };
    });
}


function shuake(vid = undefined) {
    if (vid == undefined) {
        vid = location.href.match(/vid\=(\d+)/)[1]
    }
    return $.get('https://www.tlsafety.com/Home/Index/videoplay?vid=' + vid).then(res => {
        try{
            let mp4url = res.match(/src="(.+\.mp4)"/)[1]
            return getVideoDuration(mp4url).then(t=>{
                t = parseInt(t / 10000) * 10
                return $.post('https://www.tlsafety.com/Home/Index/updatetime',{time: t, clid: vid, remainingTime: 0})
            })
        }catch(e){
            //alert('刷课出错, 30s后再刷以防封号')
            return Promise.resolve({"status":1, "message":"30s后再刷以防封号"})
        }
    })
}

$(function() {
    let btn = $('<button>添加按钮</button>')
    btn.prependTo('body')
    btn.css({position: 'fixed', top: 0, left: 0, 'z-index': 99999})
    btn.click(function() {
        $(this).toggle()
        $('#collapse_progress tr[id]').each((id, it) => {
            let vid = $(it).find('a')[0].href.match(/vid\=(\d+)/)[1],
                progress = $(it).find('.progress div'),
                btn = $('<button class="btn">刷课</button>')
            btn.data('data', {vid, progress})
            btn.appendTo($(it).find('td')[2])
            btn.click(function() {
                let data = $(this).data('data')
                shuake(data.vid).then(res=>{
                    res.then(res=>{
                        let d = res
                        if(d.status==0){
                            swal("成功","请30秒后再刷下一课", "success")
                            data.progress.css({width:'100%'})
                            data.progress.css('background-color', '#3f56d0')
                            let i = 30, timer = setInterval(()=>{
                                if(i<=0){
                                    clearInterval(timer)
                                    setTimeout(()=>data.progress.text('100%'),200)
                                }
                                data.progress.text(i-- + '秒')
                            },1000)
                        }else{
                            swal('',"刷课出错, 请30秒后再刷",'error')
                        }
                    })
                })
            })
        })
    })
})


    // Your code here...
})();