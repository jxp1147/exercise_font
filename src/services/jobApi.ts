import request from "./request";

export interface Job {
  id?: string;
  jobName: string;
  industryId: number;
}

export const getJobsByIndustryIdApi = async (id: string) => {
  return await request('/api/job/getJobsByIndustryId/' + id, {
        method: 'get',
    });
}

export const addJobApi = async (job: Job) => {
    return await request('/api/job/addJob', {
        method: 'post',
        data: job,
    });
}

export const updateJobApi = async (job: Job) => {
    return await request('/api/job/updateJob', {
        method: 'put',
        data: job,
    });
}

export const deleteJobApi = async (id: string) => {
    return await request('/api/job/' + id, {
        method: 'delete',
    });
}
