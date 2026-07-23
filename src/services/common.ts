import axiosServices from "utils/axios";

export const fileUpload = (formData: FormData) => {
	return axiosServices({ 'method': 'POST', 'url': '/api/v3/master/s3-upload', 'data': formData });
};

export const generatePreSignedUrl = (key: string) => {
	return axiosServices({ 'method': 'GET', 'params': { key: key }, 'url': '/api/v3/master/generate-pre-signed-url' });
};