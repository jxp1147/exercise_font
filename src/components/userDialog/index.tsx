import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { Tabs, Card } from 'antd';
import { createForm  } from '@formily/core';
import {
    Input,
    Form,
    FormItem,
    Submit,
} from '@formily/antd'

import { createSchemaField } from '@formily/react';
import { Password } from '@formily/antd';
import { User } from '@/services/userApi';
import { useEffect } from 'react';
import { getAllIndustriesApi } from '@/services/industryApi';

const SchemaField = createSchemaField({
    components: {
        FormItem,
        Input,
        Password,
    },
})
const loginForm = createForm();
const registerForm = createForm();

const UserDialog = (props: {
    login: (loginForm: User) => Promise<void>;
    register: (registerForm: User) => Promise<void>;
}) => {
    const {login, register} = props;
    useEffect(()=>{
        getAllIndustriesApi().then(res=>{
            console.log(res);
        })
    }, [])
    return (
        <Card>
            <Tabs style={{ overflow: 'visible', marginTop: -10 }}>
                <Tabs.TabPane key="1" tab="登录">
                    <Form
                        form={loginForm}
                        onAutoSubmit={login}
                        labelCol={ 4 }
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
