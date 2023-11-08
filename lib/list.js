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
    const {pageExclude = [],isPage = true } = list 
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

    const values = Object.values(properties).map((i) => i.title);
    //    console.log(keys,values,"---------");
    const columns = keys.map((i, index) => {
      return {
        title: values[index],
        dataIndex: i,
        hideInSearch: !newP.includes(i),
        ellipsis: true,
      };
    });

    return columns;
  }
  isAddBtn() {
    const {edit= {} } = this.setting
    const {submitUrl} = edit 
    if (submitUrl) {
      return `<Button type="primary" key="add" onClick={()=> {
                setStashItem({})
                setIsView(false)
                setVisible(true)
              }}>
            新增
        </Button>`;
    }
    return "";
  }
  // 生成导出按钮
  isExportBtn() {
    const {list = {}} = this.setting
    const {exportUrl } = list 
    if (exportUrl) {
      return `<Button type="primary" key="export" onClick={()=> exportFile('${exportUrl}',requestParams)}>
        导出
    </Button>`;
    }
    return "";
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
        <Edit isViewed={isView} typeList={typeList} refresh={()=> actionRef.current?.reload()} onCancel={()=> setVisible(false)} defaultInfo={stashItem}/>
      </Modal>`;
    }
    return "";
  }
  //  生成columns  模版
  generateTemplate() {
    let columns = this.getColumns();
    const { list = {},edit= {}}  = this.setting
    const { submitUrl }  = edit
    const { deleteUrl  } = list
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
    if(this.isAddBtn()) setting.push(this.isAddBtn())
    if(this.isExportBtn()) setting.push(this.isExportBtn())

    return `
    import React, {useEffect, useRef, useState} from "react
    import {Button, message, Modal,Image, Space} from "antd";
    import {ActionType, ProColumns, ProTable} from "@ant-design/pro-components";
    import {getList,exportFile, getDicData} from "@/utils";
    ${submitUrl ? 'import Edit from "./edit";': ''}
    ${deleteUrl ? 'import {deletePublicHandle} from "@/utils/base";' : ''}
    import {RecordItem} from "./index.d";
    
    export default function Index(){
      const actionRef = useRef<ActionType>(null)
      ${this.isEditModal() ? 'const [visible,setVisible] = useState(false)' : ''}
      ${this.isExportBtn()? `
        const [typeList,setTypeList] = useState<any[]>([])
        const [requestParams,setRequestParams] = useState<Record<string,any>>({})
      ` : ''}  
      ${submitUrl ? `
        const [isView,setIsView] = useState(false)
        const [stashItem,setStashItem] = useState({})
        const [title,setTitle] = useState('')
      `:''}
     
    
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
          <ProTable
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
          />
          ${this.isEditModal()}
        </div>
      )
    }
    `;
  }
}
module.exports= List
