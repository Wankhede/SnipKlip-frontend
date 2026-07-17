import axiosServices from 'utils/axios'

export const addJob = (job: any) => {
  return axiosServices({ 'method': 'POST', 'data': job, 'url': '/api/v3/jobs/' });
};

export const getJob = (columnName: string, columnValue: string) => {
  return axiosServices({ 'method': 'GET', 'url': `/api/v3/jobs/${columnValue}/` });
};

export const editJob = (job: any) => {
  return axiosServices({ 'method': 'PUT', 'data': job, 'url': `/api/v3/jobs/` });
};

export const listJob = async (queryParams: any) => {
  return axiosServices({ 'method': 'GET', 'params': queryParams, url: '/api/v3/jobs/' });
};

export const deleteJob = (jobId: any) => {
  return axiosServices({
    method: 'POST',
    url: `/api/v3/delete-product/${jobId}/`,
  });
};

