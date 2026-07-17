import axiosServices from 'utils/axios'

export const checkAvailability = (values: any) => {
  return axiosServices({ 'method': 'POST', 'data': values, 'url': '/api/v3/check-availability/' });
};

