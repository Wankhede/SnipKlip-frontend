import axiosServices from 'utils/axios';
import { Customer } from 'types/customers';
import { getSessionDataI, getTableRowsDataI } from 'types/common';

export const addCustomer = (customer: Customer) => {
    return axiosServices({ method: 'POST', data: customer, url: '/api/v3/customers/' });
};

export const getCustomer = async (columnName: string, columnValue: string) => {
    return axiosServices({ method: 'GET', params: [], url: `/api/v3/customers/${columnName}/${columnValue}/` });
};

export const editCustomer = (customer: Customer) => {
    return axiosServices({ method: 'PUT', data: customer, url: `/api/v3/customers/` });
};

export const listCustomer = (queryParams: getTableRowsDataI | getSessionDataI) => {
    return axiosServices({ method: 'GET', params: queryParams, url: `/api/v3/customers/` });
};
