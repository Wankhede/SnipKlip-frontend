import axiosServices, { axiosServicesFrontend } from 'utils/axios';
import { Review } from 'types/reviews';
import { getSessionDataI, getTableRowsDataI } from 'types/common';

export const addReview = (columnValue: any, transaction: any) => {
    return axiosServices({ method: 'POST', data: columnValue, url: `/api/v3/reviews/${transaction}/` });
};

export const getReview = (columnValue: any) => {
    return axiosServices({ method: 'POST', data: columnValue, url: `/api/v3/reviews/` });
};

export const editReview = (expense: Review) => {
    return axiosServices({ method: 'PUT', data: expense, url: `/api/v3/reviews/` });
};

export const listReview = (queryParams: getTableRowsDataI | getSessionDataI, demoAccpint?: boolean) => {
    if (demoAccpint) {
        return axiosServicesFrontend({ method: 'GET', params: queryParams, url: `/api/expense/get-reviews/` });
    }
    return axiosServices({ method: 'GET', params: queryParams, url: `/api/v3/reviews/` });
};
