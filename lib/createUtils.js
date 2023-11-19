const  CreateSetting = require("./createSetting");
const {getUtilFileUrl}  = require('./utils/index')
const Create = require("./create");

class CreateUtil {
    constructor(){
        this.setting = CreateSetting.data;
        this.create = new Create();
        this.start()
    }
    start(){
        if(!this.setting) return console.log("暂无数据");
        const { utils = {} } = this.setting
        if(!utils.open) return console.log('未开启util生成')
        if(utils.baseUrl) this.create.createFolder(utils.baseUrl);
        const r = this.generateTemp()
        this.create.createFile(getUtilFileUrl()+'.ts',r)
    }

    generateTemp (){
        const { utils = {}} = this.setting
        const {customFunc = [],exportFileFunction} = utils || {}
        console.log('exportFileFunction',exportFileFunction)
        const customFuncString = customFunc.join('\b')
        return `
        import { request } from 'umi';
        import { message, Modal } from 'antd';
        ${ exportFileFunction ? `` : "import { exportFile } from '@/utils';"}
        interface deleteHandleType {
            /**
             * url  请求地址
             */
            url: string;
            /**
             * id  删除id
             */
            id?: number | string;
            /**
             * actionRef  table ref  主要用于刷新  重置等
             */
            actionRef?: any;
            /**
             * afterHandle  用于删除完成的 callback
             */
            afterHandle?: () => void;
            data?: any;
          }
          interface exportType {
            /**
             * url  请求地址
             */
            url: string;
            /**
             * id  请求参数
             */
            requestParams: Record<string, any>;
          }
        //table  删除
        export const deletePublicHandle = (options: deleteHandleType) => {
        const { url, id, actionRef, afterHandle, data } = options;
        Modal.confirm({
            title: '删除确认',
            content: '确定删除选中记录?',
            okText: '确定',
            okType: 'danger',
            cancelText: '取消',
            async onOk() {
            try {
                await request(url, {
                method: 'POST',
                params: data ? {} : { ids: id, id },
                data,
                requestType: 'form',
                });
                message.success('操作成功');
                if (actionRef) {
                actionRef.current?.reload();
                actionRef.current?.clearSelected && actionRef.current.clearSelected();
                }
                afterHandle && afterHandle();
            } catch (e) {
                console.error(e);
            }
            },
        });
        };
        // 导出
        export const handleExport = (props: exportType) => {
        const { url, requestParams } = props;
        Modal.confirm({
            title: '用户导出确认',
            content: '是否导出数据?',
            okText: '确定',
            okType: 'danger',
            cancelText: '取消',
            onOk() {
                ${ exportFileFunction ? exportFileFunction?.() : `exportFile(url, requestParams);` }
              
            },
            onCancel() {},
        });
        };
        ${customFuncString}
        `
    }
}

module.exports = CreateUtil