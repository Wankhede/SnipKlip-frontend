import axiosServices from "utils/axios";

export const postContact = (formData: any) => {
	return axiosServices({ 'method': 'POST', 'url': '/api/v3/contact-us/', 'data': formData });
};
