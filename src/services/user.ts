import { UserProfile } from 'types/user-profile';
import axiosServices from 'utils/axios'
import { getSessionDataI, getTableRowsDataI } from 'types/common';


export const getUser = async (queryParams: getTableRowsDataI | getSessionDataI) => {
  return axiosServices({ method: 'GET', params:queryParams, url: `/api/v3/get-user/` });
};

export const getUserDetails = async (queryParams: getTableRowsDataI | getSessionDataI) => {
  return axiosServices({ method: 'GET', params:queryParams, url: `/api/v3/user-details/` });
};

export const changePassword = async (values: any) =>{
  return axiosServices({ data: values, method: 'POST', url: `/api/v3/change-password/` });
}

export const editUser = async (userProfile: UserProfile) => {
  return axiosServices({
    method: 'PUT',
    data: userProfile,
    url: `/api/v3/user-details/`,
  });
};