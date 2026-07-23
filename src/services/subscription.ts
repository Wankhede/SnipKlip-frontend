import axiosServices from 'utils/axios'
import { Subscription } from 'types/subscription';
import { getSessionDataI, getTableRowsDataI } from 'types/common';

export const addSubscription = (subscription: Subscription) => {
  return axiosServices({ 'method': 'POST', 'data': subscription, 'url': '/api/v3/subscription/' });
};

export const getSubscriptionType = async(data:any) => {
  return axiosServices({ 'method': 'GET', 'params':data , 'url': `/api/v3/get-subscription-type/` });
};

export const editSubscription = (subscription: Subscription) => {
  return axiosServices({ 'method': 'PUT', 'data': subscription, 'url': `/api/v3/subscription/` });
};

export const listSubscription = async (queryParams: getTableRowsDataI | getSessionDataI) => {
  return axiosServices({ method: 'GET', params: queryParams, url: `/api/v3/subscription/` });
};