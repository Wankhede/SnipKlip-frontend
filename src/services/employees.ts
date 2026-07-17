import axiosServices, { axiosServicesFrontend } from 'utils/axios'
import { Employee } from 'types/employees';
import { getSessionDataI, getTableRowsDataI } from 'types/common';
import { getSession } from 'next-auth/react';

export const addEmployee = (employee: Employee) => {
  return axiosServices({ 'method': 'POST', 'data': employee, 'url': '/api/v3/employees/' });
};

export const getEmployee = (columnName: string, columnValue: string, queryParams?: getTableRowsDataI | getSessionDataI) => {
  return axiosServices({ 'method': 'GET', 'params': queryParams, 'url': `/api/v3/employees/${columnName}/${columnValue}/` });
};

export const editEmployee = (values: any) => {
  return axiosServices({ 'method': 'PUT', 'data': values, 'url': `/api/v3/employees/` });
};

export const listEmployee = async (queryParams: getTableRowsDataI | getSessionDataI,demoAccpint? : boolean) => {
  if(demoAccpint){
    return  axiosServicesFrontend({ method: 'GET', 'params': queryParams, url: `/api/employee/get-employees/` });
  }
  return axiosServices({ method: 'GET', 'params': queryParams, url:  `/api/v3/employees/` });
};
