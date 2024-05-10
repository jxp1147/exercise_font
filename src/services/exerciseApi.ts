import request from "./request";


export interface IExercise {
    id?: string;
    exerciseContent?: string;
    ownerId?: string;
    exerciseAnswer?: string;
    industryId?: number;
    jobId?: number;
}

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

export const addExerciseApi = async (exercise: IExercise) => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    exercise.ownerId = user.id;
    exercise.industryId = user.industryId;
    exercise.jobId = user.jobId;
    return await request('/api/exercise/addExercise', {
        method: 'post',
        data: exercise,
    });
};

export const getExerciseByIdApi = async (id: string) => {
    return await request('/api/exercise/' + id, {
        method: 'get',
    });
};

export const answerExerciseApi = async (answerForm: FormData) => {
    return await request('/api/exercise/answer', {
        method: 'post',
        data: answerForm,
        requestType: 'form',
    });
};
