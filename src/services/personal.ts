import axiosServices from 'utils/axios'
import { getTableRowsDataI } from 'types/common';

export const addUserProfile = (userProfile: any) => {
  return axiosServices({ 'method': 'POST', 'data': userProfile, 'url': '/api/v3/user-profile/' });
};

export const getUserProfile = (columnName: string, columnValue: string) => {
  return axiosServices({ 'method': 'GET', 'url': `/api/v3/user-profile/${columnValue}/` });
};

export const editUserProfile = (userProfile: any) => {
  return axiosServices({ 'method': 'PUT', 'data': userProfile, 'url': `/api/v3/user-profile/` });
};

export const listUserProfile = (queryParams: getTableRowsDataI) => {
  return axiosServices({ method: 'GET', 'params': [], url: '/api/v3/user-profile/' });
};