import axiosServices from 'utils/axios'
import { Coupon } from 'types/coupon';
import { getSessionDataI, getTableRowsDataI } from 'types/common';

export const addCoupon = (coupon: Coupon) => {
  return axiosServices({ 'method': 'POST', 'data': coupon, 'url': '/api/v3/coupons/' });
};

export const getCoupon = (columnName: string, columnValue: string) => {
  return axiosServices({ 'method': 'GET', 'params': [], 'url': `/api/v3/coupons/${columnName}/${columnValue}/` });
};

export const editCoupon = (coupon: Coupon) => {
  return axiosServices({ 'method': 'PUT', 'data': coupon, 'url': `/api/v3/coupons/` });
};

export const listCoupon = async (queryParams: getTableRowsDataI | getSessionDataI) => {
  return axiosServices({ method: 'GET', 'params': queryParams, url: `/api/v3/coupons/` });
};

export const checkCouponCode = async (data: any) => {
  return axiosServices({ method: 'POST', 'data': data, url: `/api/v3/check-coupon-code/` });
};