import axiosServices from 'utils/axios'

export const getDashboardDetails = (mergedParams: any) => {
  return axiosServices({ method: 'GET', params: mergedParams, url: `/api/v3/dashboard/` });
};