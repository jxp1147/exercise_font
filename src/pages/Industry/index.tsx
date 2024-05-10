import { addIndustryApi, getAllIndustriesApi } from "@/services/industryApi";
import { Table } from "antd";
import { useEffect, useState } from "react";
import { columns } from "./index.mate";
import {
  Input,
  Form,
  FormItem,
  Submit,
} from '@formily/antd'
import { createForm } from "@formily/core";
import { createSchemaField } from '@formily/react';
import { history } from "umi";

const SchemaField = createSchemaField({
  components: {
      FormItem,
      Input,
  },
})
const Industry: React.FC = () => {
  const [industries, setIndustries] = useState<any[]>([]);
  const [refreshIndustries, setRefreshIndustries] = useState({});
  const industryColumns = [
    ...columns,
    {
      title: '操作',
      dataIndex: 'operation',
      key: 'operation',
      render:  (text: string, record: any) => <a onClick={() => {
        history.push("./industry/" + record.id)
      }}>Detail</a>,
    }];
  const industryForm = createForm();
  useEffect(() => {
    getAllIndustriesApi().then(res => {
      if (res.code === 200) {
        setIndustries(res.data);
      }
    })
  }, [refreshIndustries])
  const addIndustry = (values: any) => {
    addIndustryApi(values).then(res => {
      if (res.code === 200) {
        setRefreshIndustries({});
      }
    })
    console.log(values);
  }
  return (
    <>
      <div className='p-4'>
        <Table dataSource={industries} columns={industryColumns} rowKey="id" />
      </div>
      <div className="w-30">
      <Form
        form={industryForm}
        onAutoSubmit={addIndustry}
        labelCol={4}
      >
        <SchemaField>
          <SchemaField.String
            name="industryName"
            title="行业名"
            required
            x-decorator="FormItem"
            x-component="Input"
            x-validator={{
              required: true,
            }}
            x-component-props={{
              placeholder: '输入行业名',
            }}
          />
        </SchemaField>
        <Submit block>
          添加
        </Submit>
      </Form>
      </div>
    
    </>
  );
};

export default Industry;
