// ==UserScript==
// @name         AudioDownloader
// @version      2.0
// @author       by Cube.L
// @namespace    undefined
// @description  download audio from www.kugou.com
// @homepageURL  http://www.kugou.com

// @content      www.kugou.com
// @content      antiserver.kuwo.cn

// @match        http://www.kugou.com/song/*
// @match        http://www.kugou.com/share/*
// @match        http://www.kugou.com/yy/special/single/*
// @match        http://www.kugou.com/yy/html/rank.html
// @match        http://www.kugou.com/yy/rank/home/*

// @match        http://www.kuwo.cn/yinyue/*
// @match        http://bd.kuwo.cn/yinyue/*
// @match        http://bd.kuwo.cn/play_detail/*
// @match        http://antiserver.kuwo.cn/anti.s*
// @match        http://sou.kuwo.cn/ws/NSearch?type=music*
// @match        http://sou.kuwo.cn/ws/NSearch?type=all*
// @match        http://www.kuwo.cn/bang*
// @match        http://www.kuwo.cn/artist/content*
// @match        http://www.kuwo.cn/mingxing*
// @match        http://www.kuwo.cn/album*

// @match        http://www.5nd.com/ting*

// @match        http://www.bxktv.com/

// @match        http://kg.qq.com/*
// @match        http://node.kg.qq.com/*

// @match        https://y.qq.com/portal/player.html
// @grant        GM_xmlhttpRequest
// @run-at       document-end
// ==/UserScript==

(function() {
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    //①酷狗
    if(/www.kugou.com\/(song|share)\/.*/.test(location.href))
	{
        console.log('kugou');
        $("a.btnDownloadClient").hide();
        $("div").click(function(){
            var u = $("audio#myAudio").attr('src');
            console.log(u);
            var a = $("a#pb_download");
            $(a).attr('href',u);
            $(a).attr('download','');
        });
    }
	// else if(/www.kugou.com\/yy\/rank\/home.*/.test(location.href)||/www.kugou.com\/yy\/html\/rank\.ht.*/.test(location.href))
	// {
        // var sp = $("span.pc_temp_tips_r a[title='下载']");
        // for(var i=0; i<sp.length; i++){
            // $(sp[i]).removeAttr('data-index');
            // $(sp[i]).removeAttr('data-active');
            // $(sp[i]).attr('onclick','alert("进入试听页面下载");');
        // }
    // }
	// else if(/www.kugou.com\/yy\/special\/single.*/.test(location.href))
	// {
        // var songs = $("div#songs li a");
        // for(var i=0;i<songs.length;i++){
            // (function(e){
                // var tmp = $(e).attr('data').replace(/\|.*/,'');
                // var u = 'http://www.kugou.com/yy/index.php?r=play/getdata&hash=' + tmp + '&album_id=0&_=' + new Date().getTime();
                // GM_xmlhttpRequest({
                    // method: 'GET',
                    // url:u,
                    // onload: function(r){
                        // var st = JSON.parse(r.responseText).data.play_url;
                        // console.log(st);
                        // $(e).removeAttr('data');
                        // $(e).attr('target','_blank');
                        // $(e).attr('href',st);
                        // $(e).attr('download',st);
                    // }
                // });
            // })(songs[i]);
        // }
    // }
    //酷我
    else if(/(www|bd).kuwo.cn\/(yinyue|play_detail)\/\d*/.test(location.href))
    {
        console.log('酷我');
        var d = 'MUSIC_' + /\d*/.exec(location.href.replace(/[^\d]*/,''));
        //var d = 'MUSIC_' + location.href.replace('http://www.kuwo.cn/yinyue/','');
        console.log(d);
        var u = 'http://antiserver.kuwo.cn/anti.s?response=url&rid=' + d +  '&format=mp3|aac&type=convert_url';
        var down = $('#sinlesDownBtn');
        //$.get(url,function(e){down.attr("data-down",e);});
        GM_xmlhttpRequest({
            method:'GET',
            url:u,
            onload:function(e){
                $(down).after('<a download="'+new Date().getTime() + '.mp3'+'" href="'+e.responseText+'"><span class="icon"></span><span>免费下载这首歌</span></a>');
                $(down).hide();
            }
        });
    }
    //酷我搜索
    else if(/sou.kuwo.cn\/ws\/NSearch\?type=music/.test(location.href)||/sou.kuwo.cn\/ws\/NSearch\?type=all*/.test(location.href))
    {
        console.log('酷我搜索');
        $("body").after("<script>var showDownMusic2014=null;</script>");
    }
    //酷我榜单
    else if(/www.kuwo.cn\/bang/.test(location.href))
    {
        console.log('酷我榜单');
    }
    //酷我歌手/明星
    else if(/www.kuwo.cn\/artist\/content/.test(location.href)||/www.kuwo.cn\/mingxing\/content/.test(location.href))
    {
        console.log('酷我歌手/明星');
        $("li#tab_music span").click(function(){
            var lis = $("div#song li");
            for(var i=0;i<lis.length;i++){
                //console.log(lis[i]);
                console.log($(lis[i]).find('[data-down="http://down.kuwo.cn/mbox/kwmusic_web_3.exe"]'));
            }
        });

    }
    //酷我专辑
    else if(/www.kuwo.cn\/album\/\d*/.test(location.href))
    {
        console.log('酷我专辑');

    }
    //5nd音乐网
    else if(/www.5nd.com\/ting.*/.test(location.href))
    {
        console.log('5nd音乐网');
        let a = $("li.songOtherDown.songOtherBg a");//下载按钮
        a.hide();
        let pop = $("div.songL span.songPlay.fr a");//弹出播放按钮
        pop.hide();

        let d = $("audio#jp_audio_0");
        let url = d.attr("src");
        if(!url){
            d = $("div#kuPlayer");
            url = d.attr("data-play");
            url = 'http://mpge.5nd.com/' + url;
        }
        pop.show();
        pop.text("下载歌曲");
        pop.attr("href",url);
        pop.removeAttr("target");
        pop.attr("download",new Date().getTime());

        a.show();
        a.attr("href",url);
        a.removeAttr("target");
        a.attr("download",a.attr("title") + '.mp3');
    }
    //冰雪ktv
    else if(/www.bxktv.com.*/.test(location.href))
    {
        var st = location.href;
        $('body div.content').hide();//隐藏广告位
        $('#L1EVER').hide();//隐藏广告
        $('#bdshare').hide();//隐藏分享栏
        if('http://www.bxktv.com/'!=st && !(/message/.test(st))){
            console.log(location.href);
            var music_id,playing,ktvmp3={};
            playing = $('td.bxktv_Com_dh a')[0];//正在播放的曲目
            music_id = playing.href.match(/\d+/)[0];
            $(playing).attr('href','javascript:void(0)');
            playing.href = "javascript:void(0)";
            var posturl = 'http://www.bxktv.com/MP3/PlayList.ashx?id='+ music_id;
            $.get(posturl,function(result,state){
                if(state!='success')return;
                let mp3Url = $(result).find('m').attr('src');
                ktvmp3 = {'url': mp3Url, 'id':music_id};
                $(playing).attr('href',ktvmp3.url);
                $(playing).attr('download','filename');
            });
        }
    }
    //全面K歌
    //else if(/kg.qq.com\/node\/play\?/.test(location.href))
    else if(/node.kg.qq.com/.test(location.href)||/kg.qq.com/.test(location.href))
    {
        console.log('全民K歌');
        let t = $('.btn_barrage');
        $(t).hide();
        $(t).after('<a href="" id="audiodownload" download="1" class="btn_strong" title="下载歌曲"><span class="icon icon_download"></span></a>');
        $('body').after("<script>var u = window.__DATA__.detail.playurl_video?window.__DATA__.detail.playurl_video:window.__DATA__.detail.playurl; $('#audiodownload').attr('href',u)");
    }
})();


//百度:http://play.baidu.com/data/music/songlink
//post参数:songIds=490468%2C290008&type=m4a%2Cmp3