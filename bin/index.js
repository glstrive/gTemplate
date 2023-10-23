#!/usr/bin/env node

/*
 * @Author: gonglong
 * @Date: 2023-10-17 09:55:16
 * @LastEditors: gonglong gongl@troy.cn
 * @LastEditTime: 2023-10-23 22:58:45
 * @Description: 
 * 
 * Copyright (c) 2023 by , All Rights Reserved. 
 */

 const List  = require('../lib/list')
 const Edit  = require('../lib/edit')

 function start(){
   new List();
   new Edit();
 }
 start()