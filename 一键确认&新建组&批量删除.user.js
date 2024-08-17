// ==UserScript==
// @name         一键确认&新建组&批量删除
// @namespace    http://tampermonkey.net/
// @version      2024-08-17
// @description  必须在document加载完成后执行,依赖main.js
// @author       You
// @match        http://10.10.15.32/Home/MainView
// @match        https://10.10.54.18/iportal/config
// @match        https://10.10.54.18/portal/config
// @match        http://10.10.10.20/*
// @match        https://www.baomi.org.cn/*
// @match        http://10.10.10.10/appsystem/classify/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=15.32
// @require      https://cdnjs.cloudflare.com/ajax/libs/jsencrypt/3.3.2/jsencrypt.js
// @grant        none
// @run-at       document-idle
// ==/UserScript==

// (function() {
//     'use strict';

function 公共引入(){
	const urls = ['https://cdnjs.cloudflare.com/ajax/libs/sweetalert2/11.11.0/sweetalert2.all.js']
	const importScript = function(src){
		let script = document.createElement('script')
		script.src = src
		window.document.body.appendChild(script)
	}
	for(let url of urls){
		importScript(url)
	}
}
公共引入()

/* 综合管理平台中筛选制度用 */
function 筛选制度() {
    let style = document.createElement('style')
    style.innerText = `
    #btn1:hover {
        right: 0px;
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
    btn.id = 'btn1'

    document.body.appendChild(btn)
    document.head.appendChild(style)

    btn.style = `color: white;background: #006158; border-radius: 3px; width: 76px; height: 34px; right: 0px; bottom: 30px; position: absolute; z-index: 99999; border: #cecfcf solid 1px; `
    btn.innerText = '一键确认'
    btn.addEventListener('click',async function(){
        let t = localStorage.getItem('search')
        const { value: text } = await Swal.fire({
            input: 'textarea',
            // text: '默认值:' + (t==null?'':t),
            inputLabel: '粘贴',
            inputPlaceholder: '粘贴到这里...',
            inputAttributes: {
                'aria-label': 'Type your message here'
            },
            showCancelButton: true
        })

        if(text==undefined)return;

        if(text.trim()==''){
            alert('不能为空')
            return
        }
        localStorage.setItem('search', text)

        let tds = $$('table.table-list > tbody > tr > td:nth-child(1)')
        tds.each((id,item)=>{
            if(!(new RegExp(text,'g').test(item.innerText))){
                $$(item.parentElement).toggle()
            }
        })
    })
}


/**
 * 异步登录OA
 * @param  {String} login_username OA账号
 * @param  {String} login_password OA密码
 * @return 登录成功则返回instance,失败则返回false
 */
async function loginOA(login_username = "liuyuanxin", login_password = "Aa@123456"){
	const instance = $axios.create()

	instance.interceptors.response.use(res=>{
		return res;
	}, err=>{
		// debugger
		if(err.response.status === 302) {
			console.log(err.response.headers.location)
		}
		Promise.reject(err)
	})

	let postdata = {
		authorization: "",
		"login.timezone": "GMT+8:00",
		province: "辽宁省",
		city: "盘锦市",
		rectangle: "121.8879139,41.01570488;122.2503877,41.26985593",
		login_username,
		trustdo_type: "",
		login_password,
		login_validatePwdStrength: 4,
		random: "",
		fontSize: 12,
		screenWidth: 1920,
		screenHeight: 1080
	}

	let res = await instance.post('http://10.10.10.20/seeyon/main.do?method=login', $qs.stringify(postdata), {maxRedirects: 0})

	res = await instance.get('http://10.10.10.20/seeyon/main.do')
	res = res.data
	res = res.match(/loginResult(.+)/)[1].replace(/[=;\s]/g,'').trim()
	if(/无效/.test(res)){
		console.log(res)
		alert(res)
		return false
	}
	if(/锁/.test(res)){
		console.log(res)
		alert(res)
		return false
	}

	console.log('登录成功', res)
	return instance
}

function des_encrypt(text, _SecuritySeed = '-2101020450'){
	let us = $cryptojs.enc.Utf8.parse(text)
	return $cryptojs.DES.encrypt(us, _SecuritySeed).toString()
}

/* 使用账号密码更改本人的密码 */
async function changePWD(login_username = "liuyuanxin", login_password = "Aa@123456", new_password = "Aa@123456"){
	let ret = loginOA(login_username, login_password)

	if(!ret){
		alert('登录失败')
		return
	}
	if(new_password == undefined || new_password=="" || new_password==null){
		new_password = login_password
		alert('新旧密码相同')
		return;
	}

	ret = await $axios.get('http://10.10.10.20/seeyon/individualManager.do?method=managerFrame&forcemodify=true')
	ret = ret.data
	let _SecuritySeed = $$(ret).find('input#_SecuritySeed').val()
	debugger
	let postdata = {
		nowpassword: des_encrypt(new_password, _SecuritySeed),
		individualName: des_encrypt(login_username, _SecuritySeed),
		formerpassword: des_encrypt(login_password, _SecuritySeed),
	}

	ret = await $axios.post('http://10.10.10.20/seeyon/individualManager.do?method=modifyIndividual', $qs.stringify(postdata))
	ret = ret.data
	console.log(ret)
}

function generateRandom5DigitNumber() {
  // 生成一个0到99999之间的整数
  let num = Math.floor(Math.random() * 100000);
  // 如果需要确保是5位数（即包括00000），则这一步其实是不必要的，
  // 因为Math.floor(Math.random() * 100000)已经涵盖了0到99999的范围
  // 但如果你想要确保结果总是以非零开头，可以稍微调整逻辑
  // 例如，通过 num = num % 90000 + 10000; 但这会排除00000到09999

  // 直接返回结果，因为已经涵盖了00000到99999
  return num.toString().padStart(5, '0'); // 使用padStart确保总是5位数
}

async function change_password_by_admin(login_name, newpassword = "Aa@123456", admin_user, admin_password) {
	let data = await findByLoginName(login_name)
	debugger
	if (data.length==0) return {code: 1, msg: `${login_name}查无此人`}
	let dict_obj = {"added": {"passwordhide": "","extRoleIds": "","extWorkScopeValue": "","isChangePWD": "true","isLoginNameModifyed": "true","isNewLdap": "false","isNewMember": "false","checkOnlyLoginName": "false","i18nEnable": "false","ldapSetType": null,"ldapUserCodes": "","selectOU": "","extRoles": "","description": "","province": null,"city": null,"district": null,"workLocalCode": "","workLocalName": "","search_province": null,"search_city": null,"search_district": null,"search_workLocalCode": "","search_workLocalName": "","extAccountName": "","sortIdtype1": "0","sortIdtype2": null,"extprimaryPost": "","extlevelName": "","extWorkScope": "","workspace": "","workLocal": "","extgender": "-1","extbirthday": "","extdescription": ""},"deleted": {"v3xOrgPrincipal": "com.seeyon.ctp.organization.bo.V3xOrgPrincipal@69d3bbfc","realSortId": "12017","blog": "","reporterDeptTitle": "安全环保处","customerAddressBooklist": "[]","entityType": "Member","degree": "","isAdmin": "false","customerProperties": "[]","v5External": "false","isAssignedStatus": "1","pinyin": "zhuyupeng","isAssigned": "true","weixin": "","eduBack": -1,"preName": "","guest": "false","pinyinhead": "zyp","isVirtual": "false","visitor": "false","status": "1","externalType": "0","politics": -1,"postAddress": "","valid": "true","screenGuest": "false","isDeleted": "false","weibo": "","postalcode": "","second_post": "[]","i18nNameWithLocale": "朱宇鹏","website": "","address": "","dataI18nCategoryName": "organization.member.name","isValid": "true","vJoinExternal": "false","fullName": "朱宇鹏","updateTime": "2024-08-12","extPostLevel": "","isLoginable": "true","concurrent_post": "[]","createTime": "2024-07-01","allDeptRoles": "部门主管,部门分管领导,部门管理员,部门公文收文员,部门公文送文员","location": "","defaultGuest": "false","idnum": "","properties": "{birthday=, politics=-1, website=, address=, imageid=, gender=-1, degree=, postAddress=, emailaddress=, reporter=-3438727471620601180, blog=, hiredate=, extPostLevel=, weixin=, weibo=, telnumber=, postalcode=, eduBack=-1, officenumber=, location=, idnum=}"}}

	let {id, loginName, code, name, levelName, postName, sortId, departmentName} = data[0];
	let assign_obj = {deptName: departmentName, primaryPost: postName, code, levelName}
	let postdata = {
		managerMethod: "viewOne",
		arguments: `["${id}"]`
	}
	let ret = await $axios.post('http://10.10.10.20/seeyon/ajax.do?method=ajaxAction&managerName=memberManager&rnd=' + generateRandom5DigitNumber(), $qs.stringify(postdata))
	ret = ret.data

	for(let key in dict_obj.deleted){
		delete ret[key]
	}

	ret.password = newpassword
	ret.password2 = newpassword
	ret.enabled = true
	ret = [{...ret, ...dict_obj.added, ...assign_obj}]

	postdata = {
		managerMethod: "updateMember",
		arguments: JSON.stringify(ret)
	}
	debugger
	ret = await $axios.post('http://10.10.10.20/seeyon/ajax.do?method=ajaxAction&managerName=memberManager&rnd=' + generateRandom5DigitNumber(), $qs.stringify(postdata))
	if(id == ret.data)
		return {code: 0, msg: `${id}`}
	else
		return {code: 1, msg: `${login_name}修改失败`}
}

async function findByLoginName(login_name){

	let postdata = {
			managerMethod: 'showByAccount',
			arguments:          `[{"page":1,"size":20},{"type":"input","condition":"loginName","value":"${login_name}","conditionVal":"eq","enabled":null,"accountId":"1891172314314459061"}]`
	}

	let ret = await $axios.post('http://10.10.10.20/seeyon/ajax.do?method=ajaxAction&managerName=memberManager&rnd=' + generateRandom5DigitNumber(), $qs.stringify(postdata))
	ret = ret.data

	if(ret == "__LOGOUT"){
		alert('管理员未登录')
	}

	return ret.data
}

async function updataScore(saveType='6'){
	let querydata = $qs.parse($url.parse(location.href).query)
	let b = {V: "V8_0SP2_220826_1108140",forceDb: true, operateType: "1"}
	let c = {...querydata,...b, size:30, page: "1"}

	let ret = await $axios.post('http://10.10.10.20/seeyon/rest/cap4/form/createOrEdit',c)
	ret = ret.data
	ret = ret.data
	ret = ret.data
	ret.content.checkNull = '1'
	ret.content.formsonNumThreshold = null
	ret.content.iSignatureProtectedData = null
	ret.content.needCheckCustom = '1' //有变化
	ret.content.operateType = '1'
	ret.content.saveType = `${saveType}` //先用6打分,然后用1完成考核
	ret.content.title = null

	console.log(ret)

	let content = ret.content
	if(content.saveType == '6'){
		delete content.formsonNumThreshold
		delete content.iSignatureProtectedData
		delete content.title
	}

	let formmain = ret.tableInfo.formmain
	let fieldInfo = formmain.fieldInfo
	let formmain_name = formmain.tableName

	let formmain_4490 = {}, 总分 = 0
	Object.keys(fieldInfo).forEach(item=>{
		formmain_4490[item] = fieldInfo[item].value
	})
	formmain_4490['field0030'] = fieldInfo['field0030'].showValue2
	formmain_4490['field0034'] = fieldInfo['field0034'].showValue2

	if(saveType*1=='1'){
		if(fieldInfo['field0037'].enums[0].enumValue == 0){
			formmain_4490['field0037'] = fieldInfo['field0037'].enums[0].id
		}else{
			formmain_4490['field0037'] = fieldInfo['field0037'].enums[1].id
		}
	}

	// 获取打分页各个项目
	let postdata = {
			formId: "-3522449047312448316",
			formMasterId: querydata.moduleId, //每个被打分人不同,是责任清单打分也获取的每个被打分人的ID
			rightId: "7095495714811035657",
			size: 30,
			page: "1",
			status: "EDIT",
			tableName: "formson_4502"
	}
	ret = await $axios.post('http://10.10.10.20/seeyon/rest/cap4/form/detail/pageData', postdata)
	ret = ret.data
	ret = ret.data
	ret = ret.data

	let pageData = ret.tableData.formson_4502.pageData.items
	let formson_4502 = pageData.map(item=>{
		Object.keys(item).forEach(k=>{
			if(/field/.test(k))
				item[k] = item[k].value
		})
		item.id = item.recordId
		delete item.recordId
		item['field0026'] = item['field0024']
		总分 += item['field0024']*1
		return item
	})

	// let formson = ret.tableInfo.formson[0]
	// let pageData = formson.pageData.items
	// let formson_name = formson.tableName

	// let formson_4502 = pageData.map(item=>{
		// Object.keys(item).forEach(k=>{
			// if(/field/.test(k))
				// item[k] = item[k].value
		// })
		// item.id = item.recordId
		// delete item.recordId
		// item['field0025'] = "7月1日" + item['field0022']
		// item['field0026'] = item['field0024']
		// 总分 += item['field0024']*1
		// return item
	// })

	formmain_4490['field0027'] = `${总分}`

	let pageInfo = {
		formson_4502: {
			page: 1,
			size: 30
		}
	}

	postdata = {
		attachments: [],
		content, formmain_4490, formson_4502, pageInfo
	}
	console.log(content, formmain_4490, formson_4502, pageInfo)

	ret = await $axios.post('http://10.10.10.20/seeyon/rest/cap4/form/saveOrUpdate', postdata)
	console.log(ret)
	Swal.fire({
		text: '成功',
		icon: "success",
		showCancelButton:false,
		showConfirmButton:true,
		buttons: true,
	})
	// location.reload()
	if(saveType*1=='1'){
		window.close()
	}
}

























function g(){
  let createKey = function(e=16) {
	const i = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z", "0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];
	let t = "";
	for (let s = 0; s < e; s++) {
	  const e = Math.floor(36 * Math.random());
	  t += i[e]
	}
	return t
  }

  let encrypt = function(t, e){
	  let o = new JSEncrypt({default_key_size: 2048})
	  return o.setPublicKey(t), o.encrypt(e)
  }

  let e = "MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAsqTW2SjbuLZPPpgdMrENvztC0o1AK1zL6X4llzObawgtJaYNLqw9//PvdYQ5YbiVn9ugEuuRMd0qY437iiNfed1szZq4+P/Nvj1n0NN4WMhXDwqIDUyEay13rucoZlFNPTI+M+5QXpIc18hzEyYpmohTOA1fFPLI83fV7hNhXmhAimY/rt67fD9UWxBg6Q15mlAM/5Z+Vus86eNrOot+OZYJd56DT3QoL3viaqvtxSAe5rmKgacNrH+ZnvbKrWMtCK4onL7i6VPCK22ZdDT9vwTG6IEGK6aQKOM6BJ8+3Ft8yVHOSyy5dsOTbJmnZg4GOGn4H/9NaJjFYddLJBrEQQIDAQAB"

  let i = createKey()
  let o = createKey()
  let d = {
	publicKey: e,
	keyDES: i,
	iv: o,
	aesKey: encrypt(e, i),
	aesIv: encrypt(e, o)
  }
  return d
}

async function getToken() {
	let ret = await $axios.get('/xfront-web/view/foundation')
	ret = ret.data
	return ret.match(/<meta name="token" content="([^"]+)">/)[1]
	// $$(ret.data).find('head meta[name="token"]').attr('content')
}

function 批量修改() {
	let style = document.createElement('style')
	style.innerText = `
	#btn1:hover {
		right: 0px;
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
	btn.id = 'btn1'

	document.body.appendChild(btn)
	document.head.appendChild(style)

	btn.style = `color: white;background: #006158; border-radius: 3px; width: 76px; height: 34px; right: 0px; bottom: 100px; position: absolute; z-index: 99999; border: #cecfcf solid 1px; `
	btn.innerText = '批量修改'

	btn.addEventListener('click', async function (){
		const { value: text } = await Swal.fire({
			input: 'textarea',
			inputLabel: '粘贴',
			inputPlaceholder: '姓名,工号,组织路径正则\n姓名,工号,组织路径正则\n...',
			inputAttributes: {
				'aria-label': 'Type your message here'
			},
			showCancelButton: true
		})

		if(text==undefined){
			alert('空')
			return
		}

		let texts = text.split('\n')

		let ret = await $axios.get('https://10.10.54.18/xfront-web/view/foundation')

		let token = ret.data.match(/<meta name="token" content="([^"]*)">/)[1]
		let persons = []

		let {aesIv, aesKey} = g()

		for(let t of texts){
			t = t.split(',')
			let phone = t[1],
				regex_str = t[2]

			let ret = await $axios.post('https://10.10.54.18/xfront-web/foundation/person/findByPage.do', {
				personName: t[0],
				casecadeSubOrganization: 1,
				pageNo: 1,
				pageSize: 100
			},{headers:{'X-Csrf-Token':token}})
			ret = ret.data.data

			for(let i = 0; i<ret.rows.length; i++){
				let p = ret.rows[i]

				let {orgIndexCode, personIndexCode} = p
				let ret1 = await $axios.post('https://10.10.54.18/xfront-web/foundation/person/findByPersonId.do', {orgIndexCode, personIndexCode}, {headers:{'X-Csrf-Token':token}})
				ret1 = ret1.data.data

				p = {
					notRefresh: true,
					oper: "modify",
					sceneId: "default",
					phone: '',
					...ret1
				}

				debugger

				if(!new RegExp(regex_str,'ig').test(p.organizationPath)){
					continue;
				}

				let {cards, fingerPrint, iris} = p
				console.log(Object.assign({aesIv, aesKey}, {cards, fingerPrint, iris}, {orgIndexCode, personIndexCode}))

				let face = {
					faceId: "",
					personIndexCode: ""
				}
				if(p.personFace.length>0){
					face.faceUrl = p.personFace[0].faceUrl
				}else{
					face.faceUrl = ""
				}

				let {certNum,certType,jobNo,notRefresh,oper,orgPath,organizationPath,personEnableEndTime,personEnableStartTime,personName,pinyin,sceneId,status} = p
				/* ====== start ===== */
				jobNo = `${phone}${i+1}`
				/* ======  end  ===== */
				p = Object.assign({certNum,certType,jobNo,notRefresh,oper,orgPath,organizationPath,personEnableEndTime,personEnableStartTime,personName,pinyin,sceneId,status}, {orgIndexCode, personIndexCode, phone:'', certType: '111'})

				// let data = Object.assign({aesIv, aesKey}, {cards, fingerPrint, iris}, {orgIndexCode, personIndexCode}, {personFace:[face], person: p})
				let data = {
					orgIndexCode,
					personIndexCode,
					aesIv,
					aesKey,
					cards,
					fingerPrint,
					iris,
					personFace:[face],
					person:p
				}
				console.log(data)

				persons.push($axios.post('https://10.10.54.18/xfront-web/foundation/person/update.do', data, {headers:{'X-Csrf-Token':token}}))
			}
		}

//         $axios.all(persons).then($axios.spread(()=>{
//             console.log('所有都成功了', arguments)
//             alert('成功')
//         }))
	})
}

function 批量删除() {
	let style = document.createElement('style')
	style.innerText = `
	#btn1:hover {
		right: 0px;
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
	btn.id = 'btn1'

	document.body.appendChild(btn)
	document.head.appendChild(style)

	btn.style = `color: white;background: #006158; border-radius: 3px; width: 76px; height: 34px; right: 0px; bottom: 150px; position: absolute; z-index: 99999; border: #cecfcf solid 1px; `
	btn.innerText = '批量删除'

	btn.addEventListener('click', async function (){
		const { value: text } = await Swal.fire({
			input: 'textarea',
			inputLabel: '粘贴',
			inputPlaceholder: '姓名\n姓名\n姓名\n...',
			inputAttributes: {
				'aria-label': 'Type your message here'
			},
			showCancelButton: true
		})

		if(text==undefined){
			alert('空')
			return
		}

		let texts = text.split('\n')

		let ret = await $axios.get('https://10.10.54.18/xfront-web/view/foundation')

		let token = ret.data.match(/<meta name="token" content="([^"]*)">/)[1]
		let persons = []
		for(let personName of texts){
			let ret = await $axios.post('https://10.10.54.18/xfront-web/foundation/person/findByPage.do', {
				personName,
				casecadeSubOrganization: 1,
				pageNo: 1,
				pageSize: 100
			},{headers:{'X-Csrf-Token':token}})
			console.log(ret.data)
			ret = ret.data.data

			for(let p of ret.rows){
				let {
					orgIndexCode,
					personIndexCode
				} = p
				persons.push({
					orgIndexCode,
					personIndexCode,
					personName
				})
			}
		}

		ret = await $axios.post('https://10.10.54.18/xfront-web/foundation/person/delete.do', {"deleteType":0, persons}, {headers:{'X-Csrf-Token':token}})
		ret = ret.data
		Swal.fire({
			text: (ret.code!=0)?ret.msg.message:'成功',
			icon: (ret.code!=0)?"error":"success",
			showCancelButton:false,
			showConfirmButton:false,
			buttons: false,
			timer: 1200,
		})
	})
}

function 新增组() {
	let style = document.createElement('style')
	style.innerText = `
	#btn1:hover {
		right: 0px;
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
	btn.id = 'btn1'

	document.body.appendChild(btn)
	document.head.appendChild(style)

	btn.style = `color: white;background: #006158; border-radius: 3px; width: 76px; height: 34px; right: 0px; bottom: 50px; position: absolute; z-index: 99999; border: #cecfcf solid 1px; `
	btn.innerText = '新增组'

	btn.addEventListener('click', async function (){
		const { value: text } = await Swal.fire({
			input: 'textarea',
			inputLabel: '粘贴',
			inputPlaceholder: '粘贴到这里...',
			inputAttributes: {
				'aria-label': 'Type your message here'
			},
			showCancelButton: true
		})

		if(text==undefined){
			alert('空')
			return
		}

		if(/^\d+$/.test(text)){
			Swal.fire({
				text: new Date(text*1000).toLocaleDateString(),
				// icon: (ret.code!=0)?"error":"success",
				showCancelButton:false,
				showConfirmButton:false,
				buttons: false,
				timer: 1200,
			})
			return
		}

		let ret = await $axios.get('https://10.10.54.18/xfront-web/view/foundation')

		let token = ret.data.match(/<meta name="token" content="([^"]*)">/)[1]
		let headers = {
			'Menu-Code': '0104',
			'referer': 'https://10.10.54.18/xfront-web/view/foundation',
			'X-Csrf-Token': token
		}
		let data = {
			"parentIndexCode": "7d8ab3e5279c440eb5a0ce75609a7767",
			"leaf": true,
			"auth": true,
			"orgName": text,
			"orgCode": "",
			"syncRegion": false
		}
		ret = await $axios.post('https://10.10.54.18/xfront-web/foundation/organization/add.do', data, {headers})
		ret = ret.data

		Swal.fire({
			text: (ret.code!=0)?ret.msg.message:'成功',
			icon: (ret.code!=0)?"error":"success",
			showCancelButton:false,
			showConfirmButton:false,
			buttons: false,
			timer: 1200,
		})
	})
}


function 一键确认() {
	let style = document.createElement('style')
	style.innerText = `
	#btn1:hover {
		right: 0px;
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
	btn.id = 'btn1'

	document.body.appendChild(btn)
	document.head.appendChild(style)

	btn.style = `color: white;background: #006158; border-radius: 3px; width: 76px; height: 34px; right: 0px; bottom: 30px; position: absolute; z-index: 99999; border: #cecfcf solid 1px; `
	btn.innerText = '一键确认'
	btn.addEventListener('click',function(){
		Swal.fire({
			text: '稍等片刻',
			showCancelButton:false,
			showConfirmButton:false,
			buttons: false,
			timer: 1200,
		})

		let req = []
		$$('span:contains("确认审核")').each((id,item)=>{
			let url = $$(item).parent('a').data('url')
			url.style = 'background-color: green !important'
			let parentid = url.match(/\/CommonBiz\/DTWorkBackupMainForm\/Excute\/(.+)\?op=QueRen/)[1]
			req.push($axios.post('/DTWorkBackup/BatchUpQueRen', $qs.stringify({parentid})))
		})
		$axios.all(req).then($axios.spread(()=>{
			console.log('所有都成功了', arguments)
			Swal.fire({
				text: '成功',
				icon: "success",
				showCancelButton:false,
				showConfirmButton:true,
				buttons: true,
			})
		}))
			.catch(errors => {
			// 如果任何请求失败，处理错误
			console.log('有请求失败了:', errors);
		});
	})
}

function 批量修改密码(){
	let btn = document.createElement('button')
	btn.id = 'btn1'

	document.body.appendChild(btn)

	btn.style = `color: white;background: #006158; border-radius: 3px; width: 76px; height: 34px; right: 0px; bottom: 10px; position: absolute; z-index: 99999; border: #cecfcf solid 1px; `
	btn.innerText = '批量修改密码'
	btn.addEventListener('click', async function(){
		let { value: text } = await Swal.fire({
			input: 'textarea',
			inputLabel: '粘贴',
			inputPlaceholder: '输入账号,默认修改为Aa@123456\n账号\n账号\n账号...',
			inputAttributes: {
				'aria-label': 'Type your message here'
			},
			showCancelButton: true
		})

		if(text==undefined){
			alert('空')
			return
		}
		text = text.trim().split('\n').filter(item=>item.trim()!='')

		let instance = await loginOA('liuyuanxin', 'Aa123456')

		if(instance){
			let result = []
			for(let t of text){
				result.push(change_password_by_admin(t, 'Aa@123456'))
			}
			Promise.all(result).then(res=>{
				alert(JSON.stringify(res))
			})
		}
	})
}

function 登录OA(){
	let btn = document.createElement('button')
	btn.id = 'btn1'

	document.body.appendChild(btn)

	btn.style = `color: white;background: #006158; border-radius: 3px; width: 76px; height: 34px; right: 1000px; bottom: 580px; position: absolute; z-index: 99999; border: #cecfcf solid 1px; `
	btn.innerText = '登录'
	btn.addEventListener('click', async function(){
		let { value: text } = await Swal.fire({
			input: 'textarea',
			inputLabel: '粘贴',
			inputPlaceholder: '账号,密码...',
			inputAttributes: {
				'aria-label': 'Type your message here'
			},
			showCancelButton: true
		})

		if(text==undefined){
			alert('空')
			return
		}
		text = text.replace(/[\r\n]/g,'').trim().split(',')
		let user = text.shift(),
			password = text.join()
		if(password=="")
			password = 'Aa@123456'

		if(await loginOA(user,password)){
			// location.href = 'http://10.10.10.20/seeyon/indexOpenWindow.jsp'
			location.href = 'http://10.10.10.20/seeyon/cap4/businessTemplateController.do?method=capUnflowList&srcFrom=bizconfig&businessId=-5057417996438581887&moduleId=-2047746725851217690&formId=-3522449047312448316&type=baseInfo&tag=1720160521329&portalId=-7635277493528932848&_resourceCode=000_/cap4/busi_-4277609878513628596'
			window.open('http://10.10.10.20/seeyon/indexOpenWindow.jsp')
		}
	})
}

function 打分(){
	let btn = document.createElement('button')
	btn.id = 'btn1'

	document.body.appendChild(btn)

	btn.style = `color: white;background: #006158; border-radius: 3px; width: 76px; height: 34px; right: 0px; bottom: 80px; position: absolute; z-index: 99999; border: #cecfcf solid 1px; `
	btn.innerText = '打分'
	btn.addEventListener('click', async function(){
		await updataScore(6)
		await updataScore(1)
	})
}

function 保密刷课(){
	let btn = document.createElement('button')
	btn.id = 'btn1'

	document.body.appendChild(btn)

	btn.style = `color: white;background: #006158; border-radius: 3px; width: 76px; height: 34px; right: 0px; bottom: 80px; position: absolute; z-index: 99999; border: #cecfcf solid 1px; `
	btn.innerText = '刷课'
	btn.addEventListener('click', async function(){
		let hehe = function (t=0){
			let that = $$('.informationDetails')[0].__vue__
		    let e = that.playItem

		    var r = {
		        courseId: that.$route.query.id,
		        resourceId: e.resourceID,
		        resourceDirectoryId: e.SYS_UUID,
		        resourceLength: e.resourceLength,
		        studyLength: parseInt(e.studyLength),
		        studyTime: parseInt(e.studyTime),
		        startTime: (new Date).getTime(),
		        resourceName: e.name,
		        resourceType: e.resourceType,
		        resourceLibId: e.docLibId,
		        studyResourceId: e.docId,
		        orgId: that.item.orgId,
		        token: window.localStorage.getItem("webToken")
		    }
		    if(t==0){
		    	r.studyTime = 180
		    }else{
		    	r.studyLength = r.resourceLength
		    }
		    debugger
		    return r
		}
		await $axios.get("/portal/main-api/v2/studyTime/saveCoursePackage.do",{params: hehe(0)})
		await $axios.get("/portal/main-api/v2/studyTime/saveCoursePackage.do",{params: hehe(1)})
	})
}

if(/10\.10\.54\.18/.test(location.href)){
	// 新增组()
	// 批量删除()
	批量修改()
}
else if (/10\.10\.15\.32/.test(location.href)) {
	一键确认()

}else if(/10.10.10.20\/seeyon\/common\/cap4\/template\/display\/pc\/form\/dist\/index.htm/.test(location.href)){
	// 批量复制()
}else if(/10.10.10.20/.test(location.href)){
	//登录OA()
	//批量修改密码()
	//打分()
}else if(/10.10.10.10\/appsystem\/classify\/*/.test(location.href)){
	筛选制度()
}else if(/www.baomi.org.cn/.test(location.href)){
	保密刷课()
}



// })();