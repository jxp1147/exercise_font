import request from './request';

export interface Industry {
    id?: number;
    industryName: string;
}

export const getAllIndustriesApi = async () => {
    return await request('/api/industry/getAllIndustries', {
        method: 'get',
    });
};

export const addIndustryApi = async (industry: Industry) => {
    return await request('/api/industry/addIndustry', {
        method: 'post',
        data: industry,
    });
};

export const getIndustryByIdApi = async (id: string) => {
    return await request('/api/industry/' +id , {
        method: 'get',
    });
};

export const updateIndustryApi = async (industry: Industry) => {
    return await request('/api/industry/updateIndustry' , {
        method: 'put',
        data: industry
    });
};


