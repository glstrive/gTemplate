/*
 * @Author: gonglong
 * @Date: 2023-10-17 10:45:55
 * @LastEditors: gonglong gongl@troy.cn
 * @LastEditTime: 2023-10-19 11:10:26
 * @Description:
 *
 * Copyright (c) 2023 by ${git_name}, All Rights Reserved.
 */

const Axios = require('axios')
 
class Api {
  constructor() {
    this._listApiData = "";
    this._editData = "";
  }
  get listApiData() {
    return this._listApiData;
  }
  set listApiData(x) {
    this._listApiData = x;
  }
  async getListApi(requestUrl, regUrl) {
    try {
      const res = await Axios({
        url: requestUrl,
        method: "get",
      });
      const { paths } = res.data;
      const currentPageObj = paths[regUrl]?.get || {};
      console.log('currentPageObj',currentPageObj)
      this.listApiData = currentPageObj;
    } catch (error) {
      console.log(error);
    }
  }

  get editData() {
    return this._editData;
  }
  set editData(x) {
    this._editData = x;
  }

  async getEditApi(requestUrl, regUrl) {
    try {
      const res = await Axios({
        url: requestUrl,
        method: "GET",
      });
      const { paths } = res.data;
      const currentObj = paths[regUrl]?.post || {};
      this.editData = currentObj;
    } catch (e) {
      console.log(e);
    }
  }
}


module.exports = Api
