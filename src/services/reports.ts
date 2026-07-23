import axiosServices from 'utils/axios';
import { ReportI } from 'types/report';

export const getEmployeeReport = (data: ReportI) => {
    return axiosServices({ method: 'POST', url: `/api/v3/employee-reports/`, data: data });
};

export const getPerformanceReport = (data: ReportI) => {
    return axiosServices({ method: 'POST', url: `/api/v3/performance-reports/`, data: data });
};

export const getRevenueReport = (data: ReportI) => {
    return axiosServices({ method: 'POST', url: `/api/v3/revenue-reports/`, data: data });
};

export const getPaymentReport = (data: ReportI) => {
    return axiosServices({ method: 'POST', url: `/api/v3/payment-reports/`, data: data });
};
