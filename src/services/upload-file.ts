import axiosServices from 'utils/axios'


export const uploadFileAPI = (formData: FormData) => {
  return axiosServices({
    'method': 'POST', 'url': '/api/v3/upload-file/', 'data': formData,
    headers: {
      "Content-Type": "multipart/form-data",
    }, 'responseType': 'blob'
  });
};

export const downloadFileAPI = (template: string) => {
  return axiosServices({ 'method': 'GET', 'url': '/api/v3/download-template-file/', 'params': { 'template': template }, 'responseType': 'blob' });
};