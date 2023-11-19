/*
 * @Author: gonglong
 * @Date: 2023-10-24 22:38:58
 * @LastEditors: gonglong gongl@troy.cn
 * @LastEditTime: 2023-11-19 16:19:57
 * @Description:
 *
 * Copyright (c) 2023 by ${git_name}, All Rights Reserved.
 */
const CreateSetting = require("../createSetting");
function getBaseFileUrl() {
  const settings = CreateSetting.data || {};
  const { baseUrl, fileName } = settings;
  return getUrl(baseUrl, fileName);
}
function getUtilFileUrl() {
  const settings = CreateSetting.data || {};
  const { utils = {} } = settings;
  const { baseUrl, fileName } = utils;
  return getUrl(baseUrl, fileName);
}

function getUtilReplaceFileUrl() {
  const settings = CreateSetting.data || {};
  const { baseUrl, fileName } = utils;
  const res = getUrl(baseUrl, fileName);
  return res.replace(/src/g, "@");
}

function getUrl(baseUrl, fileName) {
  let url = "";
  if (baseUrl) url += baseUrl + "/";
  return url + fileName;
}

module.exports = {
  getBaseFileUrl,
  getUtilReplaceFileUrl,
  getUtilFileUrl,
};
