import axiosServices, { axiosServicesFrontend } from 'utils/axios';
import { Invoice } from 'types/invoice';
import { getSessionDataI, getTableRowsDataI } from 'types/common';

export const sendInvoiceNotification = (invoice: any) => {
    return axiosServices({ method: 'POST', data: invoice, url: '/api/v3/send-invoice-notification/' });
};

export const sendReviewNotification = (data: any) => {
    return axiosServices({ method: 'POST', data: data, url: '/api/v3/send-review-notification-to-customer/' });
};

export const addInvoice = (invoice: any) => {
    return axiosServices({ method: 'POST', data: invoice, url: '/api/v3/billings/' });
};

export const getInvoice = (columnName: string, columnValue: string, queryParams?: getTableRowsDataI | getSessionDataI) => {
    return axiosServices({ method: 'GET', params: queryParams, url: `/api/v3/billings/${columnName}/${columnValue}` });
};

export const getInvoiceById = (invoice: any) => {
    return axiosServices({ method: 'POST', data: invoice, url: `/api/v3/get-a-invoice/` });
};

export const editInvoice = (invoice: Invoice) => {
    return axiosServices({ method: 'PUT', data: invoice, url: '/api/v3/billings/' });
};

export const listInvoice = (queryParams: getTableRowsDataI | getSessionDataI, demoAccpint?: boolean) => {
    if (demoAccpint) {
        return axiosServicesFrontend({ method: 'GET', params: queryParams, url: `/api/invoice/get-billings` });
    }
    return axiosServices({ method: 'GET', params: queryParams, url: `/api/v3/billings/` });
};
