import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { Tabs, Card } from 'antd';
import { createForm, Field, FormPathPattern, GeneralField, onFieldReact } from '@formily/core';
import {
    Input,
    Form,
    FormItem,
    Submit,
    Select
} from '@formily/antd'
import { action } from '@formily/reactive'
import { createSchemaField } from '@formily/react';
import { Password } from '@formily/antd';
import { User } from '@/services/userApi';
import { useEffect, useState } from 'react';
import { getAllIndustriesApi, Industry } from '@/services/industryApi';
import { getJobsByIndustryIdApi, Job } from '@/services/jobApi';

const SchemaField = createSchemaField({
    components: {
        FormItem,
        Input,
        Password,
        Select
    },
})
const loginForm = createForm();
const useAsyncGetJobsByIndustryId = (
    pattern: FormPathPattern,
    service: (field: Field) => Promise<{ label: string; value: number }[]>
  ) => {
    onFieldReact(pattern, (field: any) => {
      field.loading = true
      service(field).then(
        action.bound((data) => {
          field.dataSource = data
          field.loading = false
        })
      )
    })
  }
const registerForm = createForm({
    effects: () => {
        useAsyncGetJobsByIndustryId('jobId', async (field) => { 
            const industryId = field.query('industryId').get('value');
            if (!industryId) return []
            return new Promise((resolve) => {
                getJobsByIndustryIdApi(industryId).then((res) => {
                    resolve(res.data.map((job: Job) => ({
                        label: job.jobName,
                        value: job.id
                    })))
                })
            })
        })
    }
});

const UserDialog = (props: {
    login: (loginForm: User) => Promise<void>;
    register: (registerForm: User) => Promise<void>;
}) => {
    const [industries, setIndusties] = useState<Industry[]>([]);
    const { login, register } = props;
    useEffect(() => {
        getAllIndustriesApi().then(res => {
            console.log(res);
            setIndusties(res.data);
        })
    }, [])
    return (
        <Card>
            <Tabs style={{ overflow: 'visible', marginTop: -10 }}>
                <Tabs.TabPane key="1" tab="登录">
                    <Form
                        form={loginForm}
                        onAutoSubmit={login}
                        labelCol={4}
                    >
                        <SchemaField>
                            <SchemaField.String
                                name="userName"
                                title="用户名"
                                required
                                x-decorator="FormItem"
                                x-component="Input"
                                x-validator={{
                                    required: true,
                                }}
                                x-component-props={{
                                    prefix: <UserOutlined className="site-form-item-icon" />,
                                    placeholder: '请输入用户名',
                                }}
                            />
                            <SchemaField.String
                                name="password"
                                title="密码"
                                required
                                x-decorator="FormItem"
                                x-component="Input"
                                x-component-props={{
                                    prefix: <LockOutlined className="site-form-item-icon" />,
                                    placeholder: '请输入密码',
                                }}
                            />
                        </SchemaField>
                        <Submit block size="large">
                            登录
                        </Submit>
                    </Form>
                </Tabs.TabPane>
                <Tabs.TabPane key="2" tab="注册">
                    <Form
                        form={registerForm}
                        onAutoSubmit={register}
                        labelCol={4}
                    >
                        <SchemaField>
                            <SchemaField.String
                                name="userName"
                                title="用户名"
                                required
                                x-decorator="FormItem"
                                x-component="Input"
                                x-validator={{
                                    required: true,
                                }}
                                x-component-props={{
                                    prefix: <UserOutlined className="site-form-item-icon" />,
                                    placeholder: '请输入用户名',
                                }}
                            />
                            <SchemaField.String
                                name="password"
                                title="密码"
                                required
                                x-decorator="FormItem"
                                x-component="Password"
                                x-component-props={{
                                    prefix: <LockOutlined className="site-form-item-icon" />,
                                    placeholder: '请输入密码',
                                }}
                            />
                            <SchemaField.String
                                name="industryId"
                                title="行业"
                                required
                                x-decorator="FormItem"
                                x-component="Select"
                                enum={industries.map((industry) => ({
                                    label: industry.industryName,
                                    value: industry.id,
                                }))}
                            />
                             <SchemaField.String
                                name="jobId"
                                title="岗位"
                                required
                                x-decorator="FormItem"
                                x-component="Select"
                            />
                        </SchemaField>
                        <Submit block size="large">
                            注册
                        </Submit>
                    </Form>
                </Tabs.TabPane>
            </Tabs>
        </Card>
    );
}
export default UserDialog;
