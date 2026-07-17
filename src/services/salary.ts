import axiosServices from 'utils/axios'
import { Salary } from 'types/salary';
import { getTableRowsDataI,getSessionDataI } from 'types/common';

export const addSalary = (salary: Salary) => {
  return axiosServices({ 'method': 'POST', 'data': salary, 'url': `/api/v3/salary/` });
};

export const getSalary = (columnName: string, columnValue: string) => {
  return axiosServices({ 'method': 'GET', 'params':[], 'url': `/api/v3/salary/${columnName}/${columnValue}/` });
};

export const editSalary = (salary: Salary) => {
  return axiosServices({ 'method': 'PUT', 'data': salary, 'url': '/api/v3/salary/' });
};

export const listSalary = (queryParams: getTableRowsDataI | getSessionDataI) => {
  return axiosServices({ method: 'GET', 'params':queryParams, url: `/api/v3/salary/` });
};