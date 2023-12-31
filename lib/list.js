const  Api = require("./api");
const Create = require("./create");
const  CreateSetting = require("./createSetting")
const {getBaseFileUrl}  = require('./utils/index')
class List extends Api {
  constructor() {
    super();
    this.setting = CreateSetting.data;
    this.create = new Create();
    this.start();
  }

  async start() {
    // console.log(this.setting)
    if(!this.setting) return console.log("暂无数据");
    this.create.createFolder(getBaseFileUrl())
    const { apiFoxApi,list={} } = this.setting;
    await super.getListApi(apiFoxApi,list.api);
    this.generateTsFile();
    this.generateMainFile();
  }
  getTsParams() {
    const { responses = {} } = super.listApiData;
    let properties =
      responses["200"]?.content?.["application/json"]?.schema?.properties
        ?.data || {};
    if (this.setting?.list?.isPage) {
      properties = properties?.properties?.records?.items?.properties || {};
    } else {
      properties = properties.items?.properties;
    }
    return properties;
  }
  generateTsStream() {
    const r = this.getTsParams();
    const keys = Object.keys(r);
    const values = Object.values(r);

    let dy = values.map((i, index) => {
      return `
             /**
              * ${i.title}
              */
             ${keys[index]}:${i.type};
         `;
    });
    dy = dy.join(" ");
    dy = `export interface RecordItem{
             ${dy}
          }
        `;
    return dy;
  }
  generateTsFile() {
    const t = this.generateTsStream();
    console.log('getBaseFileUrl',getBaseFileUrl())
    this.create.createFile(getBaseFileUrl()+"/index.d.ts", t);
  }
  generateMainFile(){
    const t = this.generateTemplate();
    this.create.createFile(getBaseFileUrl()+"/index.tsx", t);
  }
  getColumns() {
    const { parameters = [], responses = {} } = super.listApiData;
    const {list = {}} = this.setting
    const {pageExclude = [],isPage = true, columns:c= [] } = list 

    if(c.length) return c

    // console.log(resData,"Data")
    //剔除 并 返回
    const newP = [];
    parameters.forEach((i) => {
      if (!pageExclude.includes(i.name)) {
        newP.push(i.name);
      }
    });
    //column 参数
    //    console.log(responses['200']?.content,"ccccc")

    let properties = {};
    if (isPage) {
      properties =
        responses["200"]?.content?.["application/json"]?.schema?.properties
          ?.data?.properties?.records?.items?.properties || {};
    } else {
      properties =
        responses["200"]?.content?.["application/json"]?.schema?.properties
          ?.data?.items?.properties;
    }
    const keys = Object.keys(properties);
    //    console.log(keys,"keys")
    const resKeys = keys.filter((i)=>  !pageExclude.includes(i))
    const values = Object.values(properties).map((i) => i.title);
    //    console.log(keys,values,"---------");
    const columns = resKeys.map((i, index) => {
      return {
        title: values[index],
        dataIndex: i,
        hideInSearch: !newP.includes(i),
        ellipsis: true,
      };
    });

    return columns;
  }
  addBtn() {
      return `<Button type="primary" key="add" onClick={()=> {
                setStashItem({})
                setIsView(false)
                setVisible(true)
              }}>
            新增
        </Button>`;
   
  }
  // 生成导出按钮
  exportBtn() {
    const {list = {}} = this.setting
    const {exportUrl } = list 
      return `<Button type="primary" key="export" onClick={()=> exportFile('${exportUrl}',requestParams)}>
        导出
    </Button>`;
  }

  //生成批量删除按钮
  batchDeleteBtn(){
    const {list = {}} = this.setting
    const {deleteUrl } = list 
    return `<Button key="exportBatch" onClick={()=> deletePublicHandle({url: "/api${deleteUrl}",data:{ids:checkList},actionRef})}>
          批量删除
      </Button>`
  }

  //生成getList函数后置option
  getGetListParams() {
    const {list = {}} = this.setting
    const {exportUrl } = list 
    if (exportUrl) {
      return `{callbackParams: (p:Record<string,any>)=> setRequestParams(p)}`;
    }
    return "";
  }
  // 生成操作表格按钮
  resOperate() {
    const {list = {},edit={}} =this.setting
    const {deleteUrl } = list 
    const {submitUrl} = edit
    const isDelete = deleteUrl
      ? `<Button type="link" size="small"  onClick={()=> deletePublicHandle({url: "/api${deleteUrl}",id:record.id,actionRef})}>删除</Button>`
      : "";
    const isEdit = submitUrl
      ? `<Button type="link" size="small" onClick={()=>editHandle(record,false)}>编辑</Button>`
      : "";

    return {
      title: "操作",
      dataIndex: "option",
      hideInSearch: true,
      width: 120,
      render: `(text,record)=>{return <div>${isEdit}${isDelete}<Button type="link" size="small"  onClick={()=> editHandle(record,true)}>查看</Button></div>}`,
    };
  }
  // 生成弹窗
  isEditModal() {
    const {edit={}} = this.setting
    const {submitUrl} = edit
    if (submitUrl) {
      return `<Modal
        width={800}
        open={visible}
        title={title}
        footer={null}
        destroyOnClose={true}
        onCancel={() => setVisible(false)}
      >
        <Edit disabled={isView} refresh={()=> actionRef.current?.reload()} onCancel={()=> setVisible(false)} defaultInfo={stashItem}/>
      </Modal>`;
    }
    return "";
  }

  importDelUrl(){
    const { utils = {}} = this.setting
    const { exportFileFunction } = utils
    if(exportFileFunction){
      return `import {deletePublicHandle} from "${getUtilReplaceFileUrl()}"`
    }
    return ``
  }

  // 多选变量声明
  checkConst  (){
    const { list = {}}  = this.setting
    const {checkType  } = list 
    if(!checkType ) return ''
    if(checkType === 'checkbox')return  `const [checkList,setCheckList] = useState([])`
    return `const [checkId,setCheckId] = useState()`
  }
  // 多选函数处理

  checkFunction (){
    const { list = {}}  = this.setting
    const {checkType  } = list 
    if(!checkType ) return ''
    const isCheckBox = checkType === 'checkbox'
      return `
        const checkChange = (selectedRowKeys: React.Key[]) =>{
          ${isCheckBox ? `setCheckList(selectedRowKeys)` : `setCheckId(setCheckId?.[0])`}
      }
      `
  }

  //  生成columns  模版
  generateTemplate() {
    let columns = this.getColumns();
    const { list = {},edit= {}}  = this.setting
    const { submitUrl, }  = edit
    const { deleteUrl,checkType,exportUrl,batchDelete  } = list
    columns = [
      {
        title: "序号",
        dataIndex: "num",
        hideInSearch: true,
        width: 80,
      },
    ].concat([...columns, this.resOperate()]);
    columns = JSON.stringify(columns);
    // console.log(columns);

    const setting = [];
    if(submitUrl) setting.push(this.addBtn())
    if(exportUrl) setting.push(this.exportBtn())
    if(batchDelete) setting.push(this.batchDeleteBtn())

    return `
    import React, {useEffect, useRef, useState} from "react";
    import {Button, message, Modal,Image, Space} from "antd";
    import {ActionType, ProColumns, ProTable,ProTableProps} from "@ant-design/pro-components";
    import {getList,exportFile, getDicData} from "@/utils";
    ${submitUrl ? 'import Edit from "./edit";': ''}
    ${deleteUrl ? 'import {deletePublicHandle} from "@/utils/base"' : ''}
    import {RecordItem} from "./index.d";
    ${this.checkConst()}
    
    export default function Index(){
      const actionRef = useRef<ActionType>(null)
      ${this.isEditModal() ? 'const [visible,setVisible] = useState(false)' : ''}
      ${exportUrl? `
        const [requestParams,setRequestParams] = useState<Record<string,any>>({})
      ` : ''}  
      ${submitUrl ? `
        const [isView,setIsView] = useState(false)
        const [stashItem,setStashItem] = useState({})
        const [title,setTitle] = useState('')
      `:''}
     
      //渲染多选内容
      ${this.checkFunction()}
    
      const columns: ProColumns<RecordItem>[] = ${columns}
      
      ${submitUrl ? `
        useEffect(()=>{
          let t = '新增'
          if(isView) t = '查看'
          if(Object.keys(stashItem).length&&!isView) t = '编辑'
          setTitle(t)
        },[stashItem,isView])
  
        const editHandle = (record:RecordItem,disabled:boolean)=>{
          setStashItem(record)
          setIsView(disabled)
          setVisible(true)
        }
      ` : ''}
      return (
        <div>
          <ProTable<ProTableProps<RecordItem,any>>
            actionRef={actionRef}
            rowKey="id"
            search={{
              labelWidth: 'auto',
            }}
            toolbar={{
              settings: [${setting}]
            }}
            pagination={{
             defaultPageSize: 10
            }}
            request={
             getList<RecordItem>(
                 '/api${list.api}',${this.getGetListParams()})
             }
            columns={columns}
            ${
              checkType ? `rowSelection={{
                type: '${checkType}',
                onChange: checkChange,
              }}` : ''
            }
          />
          ${this.isEditModal()}
        </div>
      )
    }
    `;
  }
}
module.exports= List
