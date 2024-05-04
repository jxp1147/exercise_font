import request from './request';
import md5 from 'md5';
export interface User {
    id?: number;
    userName: string;
    password: string;
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

