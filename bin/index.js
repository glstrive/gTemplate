#!/usr/bin/env node

/*
 * @Author: gonglong
 * @Date: 2023-10-17 09:55:16
 * @LastEditors: gonglong gongl@troy.cn
 * @LastEditTime: 2023-11-19 16:09:43
 * @Description: 
 * 
 * Copyright (c) 2023 by , All Rights Reserved. 
 */

 const List  = require('../lib/list')
 const Edit  = require('../lib/edit')
 const Utils = require('../lib/createUtils')

 function start(){
   new List();
   new Edit();
   new Utils();
 }
 start()