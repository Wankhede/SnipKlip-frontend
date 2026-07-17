import axiosServices, { axiosServicesFrontend } from 'utils/axios';
import { getSessionDataI, getTableRowsDataI } from 'types/common';
import { Service } from 'types/service';

export const addService = (expense: Service) => {
    return axiosServices({ method: 'POST', data: expense, url: '/api/v3/services/' });
};

export const getService = (columnName: string, columnValue: string, queryParams?: getTableRowsDataI | getSessionDataI) => {
    return axiosServices({ method: 'GET', params: queryParams, url: `/api/v3/services/${columnName}/${columnValue}/` });
};

export const editService = (expense: Service) => {
    return axiosServices({ method: 'PUT', data: expense, url: `/api/v3/services/` });
};

export const listService = (queryParams: getTableRowsDataI | getSessionDataI, demoAccpint?: boolean) => {
    if (demoAccpint) {
        return axiosServicesFrontend({ method: 'GET', params: queryParams, url: `/api/v3/get-services/` });
    }
    return axiosServices({ method: 'GET', params: queryParams, url: `/api/v3/services/` });
};

export const listServicesCustom = (queryParams: getTableRowsDataI | getSessionDataI, demoAccpint?: boolean) => {
    return axiosServices({ method: 'GET', params: queryParams, url: `/api/v3/get-services-custom/` });
};
