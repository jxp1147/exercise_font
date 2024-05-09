import React, { useState } from 'react';
import { Layout, Modal } from 'antd';
import { Outlet } from 'umi';
import UserDialog from '@/components/userDialog';
import './basicLayout.less';
import { loginApi, registerApi, updateUserApi, User } from '@/services';
import BasicLayoutSider from '@/components/sider';
import { BindDialog } from '@/components/bindDialog';

const { Header, Content, Footer, Sider } = Layout;
const BasicLayout: React.FC = () => {
    const [loginDialogVisible, setLoginDialogVisible] = useState(false);
    const [bindDialogVisible, setBindDialogVisible] = useState(false);
    const openLoginDialog = () => {
        setLoginDialogVisible(true);
    }

    const openBindDialog = () => {
        setBindDialogVisible(true);
    }

    const login = async (userParams: User) => {
        const response = await loginApi(userParams as User);
        if (response.code === 200) {
            const { token, user} = response.data;
            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(user));
            setLoginDialogVisible(false);
        }
    };

    const register = async (user: User) => {
        const response = await registerApi(user);
        if (response.code === 200) {
            login({
                userName: user.userName,
                password: user.password
            })
        }   
    };

    const bind = async (user: User) => {
        const response = await updateUserApi(user);
        console.log(response);
      
    };

    return (
        <>
            <Layout className='basic-layout'>
                <Sider>
                    <BasicLayoutSider></BasicLayoutSider>
                </Sider>
                <Layout>
                    <Header>
                        <div className='flex flex-row'>
                            <div className='color-white cursor-pointer mr-10' onClick={openLoginDialog}>login</div>
                            <div className='color-white cursor-pointer' onClick={openBindDialog}>bind</div>
                        </div>
                    </Header>
                    <Content>
                        <Outlet />
                    </Content>
                    <Footer>Footer</Footer>
                </Layout>
            </Layout>
            <Modal title="登录 / 注册" open={loginDialogVisible} footer={null} width={600} onCancel={() => setLoginDialogVisible(false)}>
                <UserDialog login = {login} register = {register} />
            </Modal>
            <Modal title="bind" open={bindDialogVisible} footer={null} width={600} onCancel={() => setBindDialogVisible(false)}>
                <BindDialog bind= {bind} />
            </Modal>
        </>

    );
};

export default BasicLayout;