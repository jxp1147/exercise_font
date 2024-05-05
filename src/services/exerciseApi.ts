import request from "./request";

export const getExercisesByPageDataApi = async () => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    return await request('/api/exercise/getExercisesByPageData', {
        method: 'post',
        data: {
            pageData:{
                currentPage: 1,
                pageSize: 10,
            },
            id: user.id
        },
    });
};