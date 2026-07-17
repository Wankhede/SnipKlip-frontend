import axiosServices, { axiosServicesFrontend } from 'utils/axios'
import { Expense } from 'types/expenses';
import { getSessionDataI, getTableRowsDataI } from 'types/common';

export const addExpense = (expense: Expense) => {
  return axiosServices({ 'method': 'POST', 'data': expense, 'url': '/api/v3/expenses/' });
};

export const getExpense = (columnName: string, columnValue: string, queryParams?: getTableRowsDataI | getSessionDataI) => {
  return axiosServices({ 'method': 'GET', 'params': queryParams, 'url': `/api/v3/expenses/${columnName}/${columnValue}/` });
};

export const editExpense = (expense: Expense) => {
  return axiosServices({ 'method': 'PUT', 'data': expense, 'url': `/api/v3/expenses/` });
};

export const listExpense = (queryParams: getTableRowsDataI | getSessionDataI, demoAccpint? : boolean) => {
  if(demoAccpint){
    
    return  axiosServicesFrontend({ method: 'GET', 'params': queryParams, url: `/api/expense/get-expenses/` });
    
  }
  return axiosServices({ method: 'GET', 'params': queryParams, url: `/api/v3/expenses/` });
};