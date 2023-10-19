/*
 * @Author: gonglong
 * @Date: 2023-10-17 09:55:16
 * @LastEditors: gonglong gongl@troy.cn
 * @LastEditTime: 2023-10-19 21:13:44
 * @Description: 
 * 
 * Copyright (c) 2023 by ${git_name}, All Rights Reserved. 
 */
 const List  = require('./lib/list')
 const Edit  = require('./lib/edit')

 function start(){
   new List();
   new Edit();
 }
 start()