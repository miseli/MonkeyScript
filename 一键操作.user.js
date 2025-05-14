// ==UserScript==
// @name         一键操作
// @namespace    http://tampermonkey.net/
// @version      2024-08-17
// @description  必须在document加载完成后执行,依赖main.js
// @author       You
// @match        http://10.10.15.32/Home/MainView
// @match        https://10.10.54.18/iportal/config
// @match        https://10.10.54.18/portal/config
// @match        https://10.10.54.18/acs/app/events/inAndOutHistory
// @match        http://10.10.10.20/*
// @match        http://10.10.15.130/*
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

/*
*把一个整数t随机分成n份,每份相加之和等于t
*/
function splitIntegerRandomly(t, n) {
    if (n > t || n < 1) {
        throw new Error('Invalid n: n must be between 1 and t');
    }

    // 初始化结果数组，先预分配最小份1
    let result = new Array(n).fill(1);
    let remaining = t - n; // 剩余需要分配的数

    // 如果剩余为0，则无需进一步分配
    if (remaining === 0) {
        return result;
    }

    // 随机选择n-1个分割点
    for (let i = 0; i < n - 1 && remaining > 0; i++) {
        // 随机选择一个介于1和remaining之间的整数（包含1，不包含remaining+1）
        // 加上1保证至少分配1给当前份
        let add = Math.floor(Math.random() * remaining) + 1;
        result[i] += add; // 增加当前份
        remaining -= add; // 更新剩余量
    }

    // 如果还有剩余（理论上不应该有，除非n=1且t>1，但这种情况在开始时已排除），全部加到最后一份
    if (remaining > 0) {
        result[n - 1] += remaining;
    }

    return result;
}
/*
*js把一个整数t随机分成n份,使每一份相加之和等于t,每一份是等概率的,每一份都不大于50
*/
function splitIntegerRandomlyWithinLimit(t, n, maxPerPart = 50) {
    if (n > t || n < 1) {
        throw new Error('Invalid n: n must be between 1 and t');
    }
    if (t / n > maxPerPart) {
        throw new Error('Cannot distribute t evenly without exceeding maxPerPart');
    }

    // 计算每份的基本数量（向下取整）
    let base = Math.floor(t / n);
    let remainder = t % n; // 计算分配后剩余的数

    // 初始化结果数组
    let result = new Array(n).fill(base);

    // 随机选择remainder个位置来增加1（以保持等概率）
    let indices = Array.from({ length: n }, (_, i) => i);
    for (let i = 0; i < remainder; i++) {
        // 随机选择一个索引（Fisher-Yates shuffle的一个简单版本）
        let j = Math.floor(Math.random() * (indices.length - i));
        let index = indices[j];
        indices.splice(j, 1); // 从索引数组中移除已选索引

        // 检查增加后是否超过maxPerPart
        if (result[index] + 1 <= maxPerPart) {
            result[index]++;
        } else {
            // 如果超过maxPerPart，则重新选择（这可能会稍微破坏等概率，但很少见）
            i--; // 重试当前循环
        }
    }

    return result;
}

/**
 * 生成随机日期
 * 不传递任何参数则返回当前月的随机日期
 * 传递year,month参数,则返回指定年月中的随机日期
 */
function getRandomDate(year, month, day = 6) {

	let today = new Date()

	if(year == undefined){
	  month = today.getMonth()
	  year = today.getFullYear()
	}else{
	  month -= 1
	}

	// 创建一个表示月份第一天的Date对象
	let date = new Date(year, month, 1);

	// 获取该月份的天数
	// 注意getMonth()返回的是0-11的月份
	let daysInMonth = new Date(year, month + 1, 0).getDate();

	//计算生成去掉day天的当月天数
	daysInMonth -= daysInMonth>day?day:0

	// 1至daysInMonth范围内生成一个随机天数
	let randomDay = Math.floor(Math.random() * daysInMonth) + 1;

	// 设置date对象为月份内的随机一天
	date.setDate(randomDay);

	// 格式化日期为YYYY-MM-DD
	// let formattedDate = date.getFullYear() + '-' + ('0' + (date.getMonth() + 1)).slice(-2) + '-' + ('0' + date.getDate()).slice(-2);
	let formattedDate = (date.getMonth() + 1) + '月' + ('0' + date.getDate()).slice(-2) + '日';
	return formattedDate;
}

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

// 通过OA的用户ID批量修改密码
function change_password_byId(ids = [], newpassword = "Aa@123456", interface=undefined) {
	if(interface==undefined){
		interface = $axios
	}
	ids = ids.join(',') + ','
	let postdata = {
		ids,
		accountId: '1891172314314459061',
		password: newpassword,
		password2: newpassword
	}
	return interface.post('http://10.10.10.20/seeyon/organization/member.do?method=batchUpdatePwd', $qs.stringify(postdata))
}

// 批量修改密码
async function change_password(login_name, newpassword = "Aa@123456") {
	let data = await findByLoginName(login_name)

	if (data.length==0) return {code: 1, msg: `${login_name}查无此人`, data: null}
	let ids = [], users = []
	for(let i = 0; i<data.length; i++){
		let {id, loginName, code, name, levelName, postName, sortId, departmentName} = data[i];
		ids.push(id)
		users.push({姓名:name, 账号:loginName, 单位:departmentName})
	}
	let postdata = {
		ids: ids.join(',') + ',',
		accountId: '1891172314314459061',
		password: newpassword,
		password2: newpassword
	}

	await $axios.post('http://10.10.10.20/seeyon/organization/member.do?method=batchUpdatePwd', $qs.stringify(postdata))
	// {I:'-3116385039151185264',K:'刘远鑫',N:1105,C:0} 返回失败
	return {code: 0, msg: '修改结果未知', data: users}
}

// 通过OA账号修改密码
async function change_password_by_admin(login_name, newpassword = "Aa@123456", interface = undefined) {

	let data = await findByLoginName(login_name)

	if (data.length==0) return {code: 1, msg: `${login_name}查无此人`}

	let ids = []

	for(let i = 0; i<data.length; i++){
		let dict_obj = {"added": {"passwordhide": "","extRoleIds": "","extWorkScopeValue": "","isChangePWD": "true","isLoginNameModifyed": "true","isNewLdap": "false","isNewMember": "false","checkOnlyLoginName": "false","i18nEnable": "false","ldapSetType": null,"ldapUserCodes": "","selectOU": "","extRoles": "","description": "","province": null,"city": null,"district": null,"workLocalCode": "","workLocalName": "","search_province": null,"search_city": null,"search_district": null,"search_workLocalCode": "","search_workLocalName": "","extAccountName": "","sortIdtype1": "0","sortIdtype2": null,"extprimaryPost": "","extlevelName": "","extWorkScope": "","workspace": "","workLocal": "","extgender": "-1","extbirthday": "","extdescription": ""},"deleted": {"v3xOrgPrincipal": "com.seeyon.ctp.organization.bo.V3xOrgPrincipal@69d3bbfc","realSortId": "12017","blog": "","reporterDeptTitle": "安全环保处","customerAddressBooklist": "[]","entityType": "Member","degree": "","isAdmin": "false","customerProperties": "[]","v5External": "false","isAssignedStatus": "1","pinyin": "zhuyupeng","isAssigned": "true","weixin": "","eduBack": -1,"preName": "","guest": "false","pinyinhead": "zyp","isVirtual": "false","visitor": "false","status": "1","externalType": "0","politics": -1,"postAddress": "","valid": "true","screenGuest": "false","isDeleted": "false","weibo": "","postalcode": "","second_post": "[]","i18nNameWithLocale": "朱宇鹏","website": "","address": "","dataI18nCategoryName": "organization.member.name","isValid": "true","vJoinExternal": "false","fullName": "朱宇鹏","updateTime": "2024-08-12","extPostLevel": "","isLoginable": "true","concurrent_post": "[]","createTime": "2024-07-01","allDeptRoles": "部门主管,部门分管领导,部门管理员,部门公文收文员,部门公文送文员","location": "","defaultGuest": "false","idnum": "","properties": "{birthday=, politics=-1, website=, address=, imageid=, gender=-1, degree=, postAddress=, emailaddress=, reporter=-3438727471620601180, blog=, hiredate=, extPostLevel=, weixin=, weibo=, telnumber=, postalcode=, eduBack=-1, officenumber=, location=, idnum=}"}}
		let {id, loginName, code, name, levelName, postName, sortId, departmentName} = data[i];
		ids.push(id)

		let assign_obj = {deptName: departmentName, primaryPost: postName, code, levelName};
		let postdata = {
			managerMethod: "viewOne",
			arguments: `["${id}"]`
		}
		debugger
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

}

async function findByLoginName(login_name, interface){

	if(!interface)interface = $axios

	let condition = "name"

	if(/^[a-zA-Z0-9]+$/.test(login_name)){
		condition = "loginName"
	}

	let postdata = {
		managerMethod: 'showByAccount',
		arguments: `[{"page":1,"size":200},{"type":"input","condition":"${condition}","value":"${login_name}","conditionVal":"eq","enabled":null,"accountId":"1891172314314459061"}]`
	}

	let ret = await interface.post('http://10.10.10.20/seeyon/ajax.do?method=ajaxAction&managerName=memberManager&rnd=' + generateRandom5DigitNumber(), $qs.stringify(postdata))
	ret = ret.data

	if(ret == "__LOGOUT"){
		alert('管理员未登录')
	}

	return ret.data
}

async function updataScore(saveType='6'){
    let { value: datetext } = await Swal.fire({
        input: 'textarea',
        inputLabel: '粘贴',
        inputPlaceholder: '日期:2024-08-01',
        inputAttributes: {
            'aria-label': 'Type your message here'
        },
        showCancelButton: true
    })

    if(datetext!=undefined){
        datetext = datetext.replace(/[\r\n]/g,'').trim().split(',')
        datetext = datetext.pop()
    }

	let querydata = $qs.parse($url.parse(location.href).query)
//     querydata = {
//         "method": "formContent", //固定值
//         "type": "edit", //固定值
//         "rightId": "-4408485026245754120.6282990285842105487", //修改页固定值
//         "rightId": "-4408485026245754120.724471978296298154", //查询页固定值
//         "moduleId": "-3032976671493830145", //有变化
//         "formTemplateId": "7409407267762488441", //修改页固定值
//         "columnId": "7409407267762488441", //修改页固定值
//         "moduleType": "42" //固定值
//     }

    if(querydata.type == 'browse'){
        querydata.type = 'edit'
        querydata.rightId = "-4408485026245754120.6282990285842105487"
        // await $axios.get('http://10.10.10.20/seeyon/cap4/businessTemplateController.do', $qs.stringify(querydata))
    }

	let b = {V: "V8_0SP2_220826_1108140",forceDb: true, operateType: "1"}
	let c = {...querydata,...b, size:20, page: "1"}

	let ret = await $axios.post('http://10.10.10.20/seeyon/rest/cap4/form/createOrEdit',c)
	ret = ret.data.data.data

	ret.content.checkNull = '1'
	ret.content.formsonNumThreshold = null
	ret.content.iSignatureProtectedData = null
	ret.content.needCheckCustom = '1' //有变化
	ret.content.operateType = '1'
	ret.content.saveType = `${saveType}` //6保存,1保存并关闭/下一条
	ret.content.title = null

	let content = ret.content
	if(content.saveType == '6'){ //好像不删除也行
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
	// 创建日期
    debugger
	let createDate = fieldInfo['field0030'].showValue2
    if(datetext!=undefined && datetext!=""){
        createDate = datetext
        if(createDate.length==1){
            createDate = `${new Date().getFullYear()}-0${createDate}-01`
        }else if(createDate.length==2){
            createDate = `${new Date().getFullYear()}-${createDate}-01`
        }
    }else{
        createDate = fieldInfo['field0030'].showValue2
    }
	formmain_4490['field0030'] = createDate
	// 考核日期
	let 考核日期 = new Date(createDate)
	考核日期.setMonth(考核日期.getMonth()+1)
	考核日期.setDate(-1)
	formmain_4490['field0034'] = 考核日期.format('yyyy-MM-dd')
	//formmain_4490['field0034'] = fieldInfo['field0034'].showValue2;

	if(saveType*1=='1'|| true){
		if(false && fieldInfo['field0037'].enums[0].enumValue == 0){
			// 完成
			formmain_4490['field0037'] = fieldInfo['field0037'].enums[0].id
		}else{
			// 未完成
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

	let formson_4502 = pageData
	for(let i = 0, randomItemId = $_.random(0,pageData.length-1); i<formson_4502.length; i++){
		let item = formson_4502[i]
		Object.keys(item).forEach(k=>{
			if(/field/.test(k))
				item[k] = item[k].value
		})
		item.id = item.recordId
		delete item.recordId

        debugger

		// 任务完成情况 = 当月随机日期+工作内容
        // 这里可能存在没有设置工作内容的情况
		if(item['field0025']==undefined || item['field0025'].length<2){
			let createDateObj = new Date(createDate)
			item['field0025'] = getRandomDate(createDateObj.getFullYear(),createDateObj.getMonth()+1) + item['field0022']
		}

		// 子项得分 = 子项分值
        // 这里有可能存在没有设置分值的情况
		if(i == randomItemId){
			item['field0026'] = '' + $_.random(item['field0024']<=3?0:(item['field0024']-3), item['field0024'])
		}else{
			item['field0026'] = item['field0024']
		}
        // 子项得丰 = ''
        // item['field0026'] = ''
		总分 += item['field0026']*1
	}

	// 得分
	formmain_4490['field0027'] = `${总分}`

	let pageInfo = {
		formson_4502: {
			page: 1,
			size: 30
		}
	}

	let _postdata = {
		attachments: [],
		content, formmain_4490, formson_4502, pageInfo
	}
	console.log(content, formmain_4490, formson_4502, pageInfo)

	ret = await $axios.post('http://10.10.10.20/seeyon/rest/cap4/form/saveOrUpdate', _postdata)

    await $axios.post('http://10.10.10.20/seeyon/rest/cap4/form/createOrEdit',c)
    await $axios.post('http://10.10.10.20/seeyon/rest/cap4/form/detail/pageData', postdata)
    await $axios.post('http://10.10.10.20/seeyon/rest/cap4/form/saveOrUpdate', _postdata)

	console.warn('总分'+总分)
	Swal.fire({
		text: '成功' + 总分,
		icon: "success",
		showCancelButton:false,
		showConfirmButton:true,
	})

// 	c.currentRightId = c.rightId.split('.').pop()
// 	c.formMasterId = c.moduleId
// 	c.forceDb = false
// 	delete c.page
// 	delete c.size
//     setTimeout(async function(){
//         await $axios.post('http://10.10.10.20/seeyon/rest/cap4/form/createOrEdit',c)
//     },3000)


	// location.reload()
	if(saveType*1=='1'){
		// window.close()
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
	btn.innerText = '批量修改'
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

		let instance = await loginOA('liuyuanxin', 'Aa@123456')

		if(instance){
			let result = []
			for(let t of text){
				if(/^[a-zA-Z0-9]+$/.test(t)){
					result.push(change_password_by_admin(t, 'Aa@123456'))
				}else{
					result.push(change_password(t, 'Aa@123456'))
				}
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

	btn.style = `color: white;background: #006158; border-radius: 3px; width: 76px; height: 34px; bottom: 10px; position: absolute; z-index: 99999; border: #cecfcf solid 1px; `
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
		//await updataScore(6)
		await updataScore(1)
	})
}

function 自动流程() {
	// 流程:
	// load查询作业,得到每个作业的票据ID
	// getInfoById根据票据ID获取作业信息
	// getInfo根据票据ID获取被允许的操作按钮等信息

	let ajax_ = $axios.create({
		// headers:{
		// authorization: localStorage.getItem("authorization"),
		// 'content-type': 'application/x-www-form-urlencoded;charset=UTF-8',
		// },
		transformRequest: [function(data, headers) {
			Object.assign(headers, {
				authorization: localStorage.getItem("authorization"),
				'content-type': 'application/x-www-form-urlencoded;charset=UTF-8',
			})
			return data
		}]
	})

	async function getBeanIds(filters) {
		let {
			data: rowdata
		} = await ajax_.post('http://10.10.15.130/je/workflow/currentUserTask/getTask', $qs.stringify({
			type: 'PI_PREAPPROV',
			end: 0,
			page: 1,
			limit: 100,
			totalCount: 0
		}), {
			headers: {
				authorization: localStorage.getItem("authorization")
			}
		})
		let rows = rowdata.data.data.rows
		rows = rows.map(item => {
			let {
				pkValue: beanId,
				funcCode,
				tableCode,
				title
			} = item;
			return {
				beanId,
				funcCode,
				tableCode,
				title
			}
		}).filter(item => {
			let {
				beanId,
				title
			} = item;
			// return !beanId.includes('-') && title.includes(filters)
            return title.includes(filters)
		})
		return rows
	}

	function getUser() {
		let user = localStorage.getItem('userName'),
			ret = ''
		if (user == 20421 || user == '刘远鑫') {
			ret = [{
				"nodeId": "taskiroP6DpWEOXp7bbhv6q",
				"nodeName": "安全总监",
				"assignee": "b9d5b07dc64a46488880373ababaad19",
				"assigneeName": "崔小峰"
			}]
		} else if (user == 4194 || user == '崔小峰' || user == '孔范洋' || user == 11540|| user == '乙烯管理员') {
			ret = []
		} else if(user == 27831 || user=='李忠华'){
            ret = [{
                "nodeId":"tasknyg472UuYQUvCjoJrLw",
                "nodeName":"设备总监",
                "assignee":"26fcd0b0e47448549ee05e998b206c38"
                ,"assigneeName":"孔范洋"
            }]
        }
		return JSON.stringify(ret)
	}

	async function 处理待办(action = '同意', filters = '报备') {
		let rows = await getBeanIds(filters)

		if (rows.length <= 0) {
			alert('未搜索到作业信息')
			return;
		}

		rows.forEach(async item => {
			// 查询单个作业信息，根据搜索到的TICKET_APPLICATION_ID
			// $axios.post('http://10.10.15.130/je/sp/ticket/application/getInfoById','tableCode=TICKET_APPLICATION&funcCode=TICKET_APPLICATION&pkValue='+beanId).then(res=>{})
			/* ===============审批 开始 ========================================== */
			let liucheng = true //liucheng变量控制何时结束整个循环
			let {
				beanId,
				funcCode,
				tableCode,
				title
			} = item

			let funcId;
			if (title.includes('补报')) {
				funcId = 'SBmnFCYkttZ0WNtFqnk'
			} else {
				funcId = 'Es3xHzD7rK1r0f2NHm2'
			}

			while (liucheng) {
				// 获取pdid/piid/taskId
				let res1 = await ajax_.post('http://10.10.15.130/je/workflow/processInfo/getInfo', $qs.stringify({
					funcCode,
					tableCode,
					beanId,
					prod: 'security-platform-ticket'
				}))

				let {
					buttonList
				} = res1.data.data[0]
				let btn;

				if (buttonList.length <= 0) {
					console.log('没有操作按钮\r\n不相关或已审批', item)
					liucheng = false
					break;
				} else if (buttonList.length == 1) {
					btn = buttonList[0]
				} else if (buttonList.length > 1) {
					if (action == '同意') {
						btn = buttonList[0]
					} else if (action == '拒绝') {
						btn = buttonList[1]
					}
				}

				const {
					pdid,
					piid,
					taskId
				} = btn

				let target_ = await ajax_.post('http://10.10.15.130/je/workflow/processInfo/getSubmitOutGoingNode', $qs.stringify({
					taskId,
					pdid,
					beanId,
					tableCode,
					prod: "security-platform-ticket"
				}))
				target_ = target_.data.data[0].target

				let operatedata = {
					pdid,
					piid,
					beanId,
					taskId,
					operationId: "",
					tableCode,
					funcCode,
					funcId,
					prod: "security-platform-ticket",
				}

				if (btn.code == 'receiveBtn') { //领取
					operatedata.operationId = 'taskClaimOperation'
					let {
						data: resdata
					} = await ajax_.post('http://10.10.15.130/je/workflow/button/operate', $qs.stringify(operatedata))
					console.log('领取', item, resdata)
				} else if (btn.code == 'submitBtn') { //同意
					operatedata.operationId = 'taskSubmitOperation'
					operatedata = Object.assign(operatedata, {
						"comment": "同意",
						"target": target_, // "lineLnoThYUMG0sPyWAcuMX",
						"isJump": 0,
						"assignee": [],
						"sequentials": []
					})

					// 只有补报才需要判断用户,并决定下一流程
					if (title.includes('补报')) {
						operatedata.assignee = getUser()
					}

					let {
						data: resdata
					} = await ajax_.post('http://10.10.15.130/je/workflow/button/operate', $qs.stringify(operatedata))
					console.log('同意', item, resdata)
					liucheng = false
					break
				} else if (btn.code == 'dismissBtn') { //拒绝
					operatedata.operationId = 'taskSubmitOperation'
					operatedata = Object.assign(operatedata, {
						"comment": "不同意",
						"target": "lineEVjFObyruftzUAIpEHi",
						"isJump": 0,
						"assignee": [],
						"sequentials": []
					})
				} else {
					alert('出现未知按钮')
					console.log('出现未知按钮', item)
					liucheng = false
					break;
				}

				// 发送操作,如领取,同意,拒绝
				// let {data: resdata} = await ajax_.post('http://10.10.15.130/je/workflow/button/operate',$qs.stringify(operatedata))
				// console.log(item, resdata)
			}
			/* ===============审批 开始 ========================================== */
		})
	}

    (function(){
        let btn = document.createElement('button')
        btn.id = 'btn1'
        document.body.appendChild(btn)
        btn.style = `color: white;background: #006158; border-radius: 3px; width: 76px; height: 34px; right: 0px; top: 260px; position: absolute; z-index: 99999; border: #cecfcf solid 1px; `
        btn.innerText = '报备确认'
        btn.addEventListener('click', e=>{
            处理待办('同意','报备')
        })
    })();

    (function(){
        let btn = document.createElement('button')
        btn.id = 'btn2'
        document.body.appendChild(btn)
        btn.style = `color: white;background: #006158; border-radius: 3px; width: 76px; height: 34px; right: 0px; top: 220px; position: absolute; z-index: 99999; border: #cecfcf solid 1px; `
        btn.innerText = '补报确认'
        btn.addEventListener('click', e=>{
            处理待办('同意','补报')
        })
    })()

	// 遍历当前页作业项目的rowid,即:beanId
	// $$('#app > div.je-panel.je-admin-layout-main > div > div.je-panel-wrapper > div.je-panel-item.je-panel-item-region-default > div > div > div > div > div > div > div > div > div > div > div > div > div > div > div > div.je-panel-wrapper > div > div > div > div > div.je-panel-item.je-panel-item-region-default > div > div.vxe-table--render-wrapper > div.vxe-table--main-wrapper > div.vxe-table--body-wrapper.body--wrapper').find('tr[rowid]').each((id,item)=>{
	// console.log($$(item).attr('rowid'))
	// })
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

function 导出考核表(){
	let btn = document.createElement('button')
	btn.id = 'btn1'

	document.body.appendChild(btn)

	btn.style = `color: white;background: #006158; border-radius: 3px; width: 76px; height: 34px; right: 0px; bottom: 120px; position: absolute; z-index: 99999; border: #cecfcf solid 1px; `
	btn.innerText = '导出'
	btn.addEventListener('click', 导出责任制考核表)
}

async function 导出责任制考核表(){
    let postdata = {
        "formId": "-3522449047312448316",
        "formTemplateId": "3484544434552916574",
        "init": "0",
        "userConditions": [
            {
                "aliasTableName": "formmain_4490",
                "fieldName": "field0017",
                "fieldValue": [
                    "Account|1891172314314459061"
                ],
                "leftChar": "(",
                "operation": "Equal",
                "rightChar": ")",
                "rowOperation": "and",
                "fieldType": "VARCHAR",
                "inputType": "account"
            }
        ],
        "userOrderBy": [],
        "dataConditions": [],
        "bussId": "-5057417996438581887",
        "appId": "3484544434552916574",
        "_t": "1725502718240",
        "isShowCondition": true,
        "schlogId": null,
        "preview": null,
        "conditionId": null,
        "templateId": null,
        "isMobile": false,
        "print": false,
        "bizId": "-5057417996438581887",
        "platform": "1",
        "page": "1",
        "pageSize": "30000"
    }
    // postdata.userConditions = []
    let d = await $axios.post('http://10.10.10.20/seeyon/rest/cap4/form/getCAPFormUnFlowList', postdata)

    let fieldnames = d.data.data.data.fields
    let datas = d.data.data.data.datas
    let total = d.data.data.data.total
    let xlsheader = ['序号'], xlscontent = []
    for(let i = 0; i<fieldnames.length; i++){
        let fieldname = fieldnames[i]
        xlsheader.push(fieldname.display)
        let k = fieldname.fieldName, v = []
        for(let j = 0; j<datas.length; j++){
            v.push(datas[j][k].value)
        }
        xlscontent.push({[fieldname.display]: v})
    }
    xlsheader = [xlsheader.join(',')]
    // for(let a of xlscontent){
    //     let k = Object.keys(a).join()
    //     a[k] = a[k].slice(0,3)
    // }

    let rows = []
    // 遍历每个数组，按索引组合数据
    for (let i = 0; i < total; i++) {
        let row = [i+1];
        // 遍历每个对象
        for (const obj of xlscontent) {
            let key = Object.keys(obj)[0]; // 假设每个对象只有一个key
            let value = obj[key][i] || ''; // 如果索引超出数组长度，则使用空字符串
            row.push(value);
        }
        debugger
        row.push()
        // 将当前行添加到结果数组中
        rows.push(row.join(','));

    }
    // 将结果数组转换为字符串，并添加表头
    let result = xlsheader.concat(rows).join('\n');
    console.log(result);

    $saveas(new Blob([result], {type: "text/plain;charset=utf-8"}), `责任考核清单.csv`)
}


if(/10\.10\.54\.18/.test(location.href)){
	// 新增组()
	// 批量删除()
	// 批量修改()
}
else if (/10\.10\.15\.32/.test(location.href)) {
	// 一键确认()

}else if(/10.10.10.20\/seeyon\/common\/cap4\/template\/display\/pc\/form\/dist\/index.htm/.test(location.href)){
	// 批量复制()
}else if(/10.10.10.20/.test(location.href)){
	//登录OA()
	//批量修改密码()
	//打分()
    // 导出考核表()
}else if(/10.10.10.10\/appsystem\/classify\/*/.test(location.href)){
	筛选制度()
}else if(/www.baomi.org.cn/.test(location.href)){
	保密刷课()
}else if(/10.10.15.130/.test(location.href)){
    自动流程()
}



// })();