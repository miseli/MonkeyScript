// ==UserScript==
// @name         改名
// @namespace    http://tampermonkey.net/
// @version      2024-04-29
// @description  try to take over the world!
// @author       You
// @match        https://iot.oceansking.com.cn:18443/*
// @grant        none
// @run-at       document-end
// ==/UserScript==
window.token = ""

// (function(){
    const mappingObj = {
        "7676": "录像设备1",
        "9409": "乙烯车间",
        //"4840": "7127B",
        "7379": "录像设备2",
        "5034": "加氢抽提联合车间",
        "2032": "聚丙烯一车间",
        "0704": "录像设备4",
        "2198": "苯乙烯车间",
        "1935": "聚乙烯车间",
        "6082": "储运车间",
        "9698": "聚丙烯二车间",
        "7130": "水汽车间",
        "1877": "录像设备5",
        "0332": "录像设备3"
    }


    const mapping = {
        "1877": {
            "uid": "1000002016040410163716642O4uGalW",
            "nickName": "录像设备5",
            "devName": "录像设备5"
        },
        "1935": {
            "uid": "10000020160404101635138241RP5zMv",
            "nickName": "聚乙烯车间",
            "devName": "聚乙烯车间"
        },
        "2032": {
            "uid": "1000002016040410164003017QpM1kF9",
            "nickName": "聚丙烯一车间",
            "devName": "聚丙烯一车间"
        },
        "2198": {
            "uid": "1000002016040410163440250e13uCnT",
            "nickName": "苯乙烯车间",
            "devName": "苯乙烯车间"
        },
        // "4840": {
        //     "uid": "1000002016040410091958180V8LhvrJ",
        //     "nickName": "7127B",
        //     "devName": "7127B"
        // },
        "5034": {
            "uid": "1000002016040410163930170AjadBiq",
            "nickName": "加氢抽提联合车间",
            "devName": "加氢抽提联合车间"
        },
        "6082": {
            "uid": "1000002016040410163404126p4n6cx7",
            "nickName": "储运车间",
            "devName": "储运车间"
        },
        "7130": {
            "uid": "10000020160404101635486014kAmR2R",
            "nickName": "水汽车间",
            "devName": "水汽车间"
        },
        "7379": {
            "uid": "1000002016040410164039914l7Oj6Ph",
            "nickName": "录像设备2",
            "devName": "录像设备2"
        },
        "7676": {
            "uid": "10000020160404101641133976jcJnmN",
            "nickName": "录像设备1",
            "devName": "录像设备1"
        },
        "9409": {
            "uid": "1000002016040410163621610vf8vqwb",
            "nickName": "乙烯车间",
            "devName": "乙烯车间"
        },
        "9698": {
            "uid": "1000002016040410163849817bSiYoHK",
            "nickName": "聚丙烯二车间",
            "devName": "聚丙烯二车间"
        },
        "0332": {
            "uid": "1000002016040410163817111AsIh1Ka",
            "nickName": "录像设备3",
            "devName": "录像设备3"
        },
        "0704": {
            "uid": "10000020160404101637461490SqRw8G",
            "nickName": "录像设备4",
            "devName": "录像设备4"
        }
    }

    let style = document.createElement('style')
    style.innerText = `
    #btn1:hover {
        right: 0px;
    }

    body > div.swal2-container.swal2-center.swal2-backdrop-show > div {
        width: 830px !important;
    }

    #swal2-input {
        width: 786px !important;
        height: 409px !important;
    }

    #btn1 {
        color: white;
        cursor: pointer;
        background: rgb(0, 97, 88);
        border-radius: 3px;
        width: 76px;
        height: 34px;
        right: -66px;
        bottom: 30px;
        position: absolute;
        z-index: 99999;
        border: 1px solid rgb(206, 207, 207);
        transition: right 0.2s cubic-bezier(0.55, 0.06, 0.68, 0.19)
    }`

    let btn = document.createElement('button')
    let script = document.createElement('script')
    // script.src = 'https://192.168.0.110:443/sweetalert2.all.min.js'
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/sweetalert2/11.11.0/sweetalert2.all.js'
    window.document.body.appendChild(script)
    window.document.body.appendChild(btn)
    window.document.head.appendChild(style)
    btn.id = 'btn1'
    //btn.style = `color: white;background: #006158; border-radius: 3px; width: 76px; height: 34px; right: 0px; bottom: 30px; position: absolute; z-index: 99999; border: #cecfcf solid 1px; `
    btn.innerText = '改名'
    btn.addEventListener('click',async function(e){
        const { value: text } = await Swal.fire({
            input: 'textarea',
            inputLabel: '粘贴',
            inputPlaceholder: '粘贴到这里...',
            inputAttributes: {
                'aria-label': 'Type your message here'
            },
            showCancelButton: true
        })

        if(text!=undefined){
            if(window.token == ""){
                // token = document.body.innerHTML.match(/token=([^"]+)/g)[0].replace('token=','')
                window.token = await updata_token()
            }
            let ajax_arr = []
            text.split('\n').forEach(item=>{
                if(item.replace(/\s/g,'').length>=4){
                    let tmp_ = updata_devName.apply(this, item.split(/\s/))
                    ajax_arr = [...ajax_arr, ...tmp_]
                }
            })

            Promise.all(ajax_arr).then(values=>{
                Swal.fire({
                    title: '修改成功',
                    html: values.map(a=>`${a.search_id}-${mapping[a.search_id].devName}`).join('</br>'),
                    icon: 'success',
                    confirmButtonText: 'OK'
                });
            }).catch(e=>{
                Swal.fire({
                    title: '失败',
                    text: e.message,
                    icon: 'error',
                    confirmButtonText: 'OK'
                });
            })
        }
    })
// }())





async function updata_token(){
    let d = await $axios.get('https://iot.oceansking.com.cn:18443/patrolDeviceControl')
    d = d.data.replace(/\s/g,'')
    let m = d.match(/token=([^"]*)"/)[1]
    window.token = m
    return m
}

function updata_devName(search_id = '0--0', devName = '0--0', desc = '0--0', reset = false){
    if(!reset){
        if(!/^\d+$/.test(search_id)){
            return [Promise.reject(new Error('必须提供设备ID'))]
        }

        if(!(search_id in mapping)){
            return [Promise.reject(new Error(`设备ID:${search_id}不属于乙烯分公司`))]
        }
    }
    desc = ''
    let ajax_updata = []
    if(!reset){
        ajax_updata.push(updataAjax(search_id, devName, desc))
        // ajax_updata.push(updata_nickName(search_id, devName, desc))
    }else{
        for(let key in mapping){
            ajax_updata.push(updataAjax(key, `${mapping[key].devName.replace('车间','')}`, desc))
            // ajax_updata.push(updata_nickName(key, `${mapping[key].devName.replace('车间','')}`, desc))
        }
    }
    return ajax_updata
}

async function updataAjax(search_id, devName, desc=''){
    if(devName == '0--0' || devName == ''){
        devName = `${mapping[search_id].devName}`
        // devName = `${mapping[search_id].devName}${' '.repeat(100)}${search_id}`
    } else {
        // devName = `${devName}${' '.repeat(100)}${search_id}`
        devName = `${devName}`
    }

    if(desc=='0--0' || desc == ''){
        let t = new Date().getTime()
        // desc = mapping[search_id].devName + ' t' + t
    }
    return new Promise(async (resolve, reject) => {
        let url = `https://iot.oceansking.com.cn:10002/uas/v1/api/smartpatrol/portal/device/list?token=${window.token}`
        let search_data = {
            endTime: "",
            name: `${search_id}`,
            pageInfo: {pageNum: 1, pageSize: 10},
            searchId: "3201002016060410152218944r9GBoXS",
            searchType: 1,
            startTime: "",
        }

        let ret = await $axios.post(url, search_data)
        ret = ret.data
        if(ret.resultCode!='00000000'){
            reject(new Error(ret.resultDesc))
        }

        ret = ret.devList[0]

        /* ================================================================= */

        url = `https://iot.oceansking.com.cn:10002/uas/v1/api/smartpatrol/portal/device/update?token=${window.token}`

        let default_data = {
            desc: "", //可以不填
            platId: "0000000000000101", //海洋王物联网平台(固定值)
        }

        default_data = {...default_data, ...ret}
        default_data.devName = devName
        default_data.desc = desc

        ret = await $axios.post(url, default_data)
        ret = ret.data

        if(ret.resultCode!='00000000'){
            return reject(new Error(ret.resultDesc))
        }

        console.log(JSON.stringify({search_id, devName, desc}))
        resolve({search_id, devName, desc})
    })
}

async function updata_nickName(devId, nickName) {

    if(nickName==undefined || nickName.replace(/\s/g,'')==''){
        nickName = `${mapping[devId].nickName}${devId}`
    }else{
        // nickName = `乙烯分公司${devId}-${nickName}`
    }

    return new Promise((resolve, reject)=>{
        let url = `https://iot.oceansking.com.cn:18443/scp/modUserInfo.json`,
        data = {
            userId: mapping[devId].uid,
            userName: nickName,
            loginName: `${devId}`,

            status: 1, //用户状态
            clientId: '3201002016060410152218944r9GBoXS',    //固定
            areaCode: "000000",    //固定
            userType: 1,    //固定
            sex: 1,    //固定
            right: 10000001,    //固定
            gisLongitude: '0.000000',    //固定
            gisLatitude: '0.000000',    //固定
            isLocked: 0,    //固定
            userExpireTag: 0,    //固定
        }
        data = $qs.stringify(data)
        $axios.post(`https://iot.oceansking.com.cn:18443/scp/modUserInfo.json`, data).then(({data: ret})=>{
            // let ret = {"resultCode":"SUCCESS","resultMessage":"操作成功","act":"reload","nextUrl":null,"baseInfo":null}
            if(ret.resultCode!='SUCCESS'){
                return reject(new Error(devId + '修改昵称:' + ret.resultMessage))
            }
            resolve({search_id: devId, nickName, desc:'修改昵称'})
            // if(ret.resultCode=='SUCCESS'){

            // }
            // application/x-www-form-urlencoded; charset=UTF-8
        })
    })
}












// list查询到的数据格式
// {
//     -createTime: "2023-07-19 16:29:42",
//     -ownerName: "华锦设备",
//     -status: 2,
//     +cameraId: "00000000000101010103000000020982",
//     +devId: "sps20230719162942730VfVBsvkT9O1p",
//     +devName: "乙烯录像设备1",
//     +devStatus: 1,
//     +devType: "4",
//     +mainDevId: "00000000000101010101000000020981",
//     +ownerId: "3201002016040410152218952p4pIqte",
//     +transType: 2,
// }

// updata提交的数据格式
// {
//     -desc: desc, //可以不填
//     -platId: "0000000000000101", //海洋王物联网平台(固定值)
//     +cameraId: "00000000000101010103000000020982",
//     +devId: "sps20230719162942730VfVBsvkT9O1p",
//     +devName: "乙烯录像设备1",
//     +devStatus: 1, // 固定值
//     +devType: 4, // 固定值
//     +mainDevId: "00000000000101010101000000020981",
//     +ownerId: "3201002016040410152218952p4pIqte",
//     +transType: 2, // 固定值
// }


// 好用的本地代理软件有：

// Shadowsocks：一款开源的代理软件，具有高度的安全性和灵活性，支持多种加密协议。
// Squid：一款成熟稳定的代理软件，可用于缓存和过滤HTTP、HTTPS和FTP等协议的流量。
// Privoxy：一款轻量级的代理软件，可用于过滤广告和保护隐私。
// Polipo：一款小巧而高效的代理软件，适用于HTTP和HTTPS代理。
// TinyProxy：一款简单易用的代理软件，适用于HTTP和HTTPS代理。

// 此外，还有四叶天、Fidd、BurpS、CyberG、Nord、Expre等代理软件。这些软件都有各自的特点和适用场景，具体选择可以根据个人需求和使用情况来决定。