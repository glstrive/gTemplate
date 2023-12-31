const Api = require('./api')
const Create = require("./create");
const CreateSetting = require("./createSetting")
const {getBaseFileUrl}  = require('./utils/index')
class Edit extends Api{
    constructor(){
        super()
        this.setting = CreateSetting.data;
        this.create = new Create();
        this.start();
    }

    async start(){
        if(!this.setting) return console.log("暂无数据");
        if(!this.setting.edit.submitUrl) return console.log("暂无Url")
        this.create.createFolder(getBaseFileUrl())
        const { apiFoxApi,edit={} } = this.setting;
        await super.getEditApi(apiFoxApi,edit.submitUrl)
        this.generateFile();
    }

    generateFile(){
        const r = this.generateEditTemplate();
        this.create.createFile(getBaseFileUrl()+'/edit.tsx',r)
    }

    // 生成edit columns
    generateEditColumns (){
      const { edit = {} } = this.setting
      const {columns = []} = edit
      if(columns&&columns.length) return columns

      const schema = super.editData?.requestBody?.content?.['application/json']?.schema || {}
      const params = schema?.properties || {}
      const requiredArr = schema?.required || []
      console.log(params)
      const c =  Object.keys(params).map(key=>{
        return {
            label: params[key]?.title,
            name: key,
            type: 'input',
            span:12,
            disabled: 'disabled',
            rules: requiredArr.includes(key) ? [{ required: true }] : [],
        }
      })
      return JSON.stringify(c)
   
}
    generateEditTemplate(){
        const c = this.generateEditColumns()
        const { edit = {} } = this.setting
        const { submitUrl } = edit
        return `
        import BaseForm from '@/components/baseForm';
        import type { ColumnsType } from '@/components/baseForm/index.d';
        import { Form, message } from 'antd';
        import React, { useEffect, useState ,useRef} from 'react';
        import { request } from 'umi';
    
        interface PropType {
            refresh?: () => void;
            defaultInfo: Record<string, any>;
            onCancel?: () => void;
            disabled?: boolean;
        }
        const Edit: React.FC<PropType> = (props: PropType) => {
          const { disabled = false, defaultInfo = {} } = props;
          const [form] = Form.useForm();
          const handleSubmit = async (values: any) => {
            try {
              await request('${submitUrl}', {
                method: 'POST',
                data: {
                  id: defaultInfo?.id,
                  ...values,
                },
              });
              message.success('提交成功');
              if (props.refresh) props?.refresh();
              if (props.onCancel) props?.onCancel();
            } catch (e) {
              console.error(e);
            }
          };
          const columns:ColumnsType[] = ${c}
            return (
                <div>
                <BaseForm
                    footer={!disabled}
                    columns={columns}
                    resetProps={{
                    reset: true,
                    resetText: '取消',
                    fieldProps: {
                        onClick: () => {
                        if (props.onCancel) props.onCancel();
                        },
                    },
                    }}
                    onFinish={handleSubmit}
                    form={form}
                />
                </div>
            );
        };
        export default Edit;  
        `
    }
    
}

module.exports = Edit;