import axiosServices from 'utils/axios'
import { getTableRowsDataI, getSessionDataI } from 'types/common';

export const getSalonDetails = async (user_id:string) => {
  return axiosServices({ method: 'GET', url: `/api/v3/salon-details/${user_id}/` });
};

export const listSalon = (queryParams: getTableRowsDataI | getSessionDataI) => {
  return axiosServices({ method: 'GET', params: queryParams, url: `/api/v3/salon-details/` });
};

export const setSalonDetails = async (values: any) => {
  return axiosServices({ method: 'PUT', url: `/api/v3/salon-details/`, data: values });
};

export const getPersonalDetails = () => {
  return axiosServices({ 'method': 'GET', 'url': `/api/v3/personal-details/` });
};

export const getAccountDetails = () => {
  return axiosServices({ 'method': 'GET', 'url': `/api/v3/salon-details/` });
};

export const getBranchDetails = () => {
  return axiosServices({ 'method': 'GET', 'url': `/api/v3/service-details/` });
};

export const getRoleDetails = () => {
  return axiosServices({ 'method': 'GET', 'url': `/api/v3/role-details/` });
};

export const addService = () => {
  return axiosServices({ 'method': 'GET', 'url': `/api/v3/add-service/` });
};

export const addBranch = (basicData: any,salonData:any) => {
  const requestData = {
    basicData: basicData,
    salonData: salonData,
  };
  return axiosServices({ 'method': 'POST', data: requestData, 'url': `/api/v3/add-branch/` });
};

export const addSalon = (values: any) => {
  return axiosServices({ method: 'POST', data: values, url: '/api/v3/add-salon/' });
};