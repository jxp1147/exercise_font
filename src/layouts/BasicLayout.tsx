import React, { useState } from 'react';
import { Layout, Modal } from 'antd';
import { Outlet } from '@umijs/max';
import UserDialog from '@/components/userDialog';
import './basicLayout.less';
import { loginApi, User } from '@/services';
import BasicLayoutSider from '@/components/sider';

const { Header, Content, Footer, Sider } = Layout;
const BasicLayout: React.FC = () => {
    const [loginDialogVisible, setLoginDialogVisible] = useState(false)
    const openLoginDialog = () => {
        setLoginDialogVisible(true);
    }

    const login = async (user: User) => {
        const response = await loginApi(user as User);
        if (response.code === 200) {
            const { token } = response.data;
            localStorage.setItem('token', token);
            setLoginDialogVisible(false);
        }
    };

    const register = async (user: User) => {
        const response = await loginApi(user);
        if (response.code === 200) {
            const { token } = response.data;
            localStorage.setItem('token', token);
            setLoginDialogVisible(false);
        }
    };

    return (
        <>
            <Layout className='basic-layout'>
                <Sider>
                    <BasicLayoutSider></BasicLayoutSider>
                </Sider>
                <Layout>
                    <Header>
                        <div className='color-white cursor-pointer' onClick={openLoginDialog}>login</div>
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
        </>

    );
};

export default BasicLayout;