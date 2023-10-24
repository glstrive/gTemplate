/*
 * @Author: gonglong
 * @Date: 2023-10-24 22:38:58
 * @LastEditors: gonglong gongl@troy.cn
 * @LastEditTime: 2023-10-24 22:56:17
 * @Description: 
 * 
 * Copyright (c) 2023 by ${git_name}, All Rights Reserved. 
 */
const  CreateSetting = require("../createSetting")
function getBaseFileUrl(){
    const settings = CreateSetting.data || {};
    const { baseUrl,fileName} = settings
    let url = ''
    if(baseUrl) url+= baseUrl + '/'
    return  url + fileName
}

module.exports = {
    getBaseFileUrl
}