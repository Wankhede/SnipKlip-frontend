import { getSessionDataI, getTableRowsDataI } from 'types/common';
import axiosServices from 'utils/axios';

export const getMetaData = (type: string) => {
    const queryParams = {
        type: type
    };
    return axiosServices({ method: 'GET', params: queryParams, url: '/api/v3/master/metadata-master' });
};

export const getCustomers = async (queryParams: getTableRowsDataI | getSessionDataI) => {
    return axiosServices({ method: 'GET', params: queryParams, url: '/api/v3/customers/' });
};

export const getStaff = async (queryParams: getTableRowsDataI | getSessionDataI) => {
    return axiosServices({ method: 'GET', params: queryParams, url: '/api/v3/get-employees/' });
};

export const getServices = (queryParams: getTableRowsDataI | getSessionDataI) => {
    return axiosServices({ method: 'GET', params: queryParams, url: '/api/v3/get-services/' });
};

export const getStylistAvailability = (queryParams: any) => {
    return axiosServices({ method: 'POST', data: queryParams, url: `/api/v3/get-available-staff/` });
};
