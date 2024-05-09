import request from './request';
import md5 from 'md5';
export interface User {
    id?: number;
    userName?: string;
    password?: string;
    industryId?: number;
    jobId?: number;
    userTypeId?: number;
}
export const loginApi = async (user: User) => {
    return await request('/api/user/login', {
            method: 'post',
            data: {
                userName: user.userName,
                password: md5(user.password),
            },
        }
    );
};

export const getUsers = async () => {
    return await request('/api/user/getUsers', {
        method: 'post',
        data: {
            currentPage: 1,
            pageSize: 10,
        },
    });
};

export const registerApi = async (user: User) => {
    if (user.password) {
        user.password = md5(user.password);
    }
    return await request('/api/user/register', {
        method: 'post',
        data: user,
    });
};

export const updateUserApi = async (user: User) => {
    if (user.password) {
        user.password = md5(user.password);
    }
    const userLocal = JSON.parse(localStorage.getItem('user') || '{}');
    user.id = userLocal.id;
    return await request('/api/user/update', {
        method: 'put',
        data: user,
    });
};

