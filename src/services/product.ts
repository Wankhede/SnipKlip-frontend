import axiosServices, { axiosServicesFrontend } from 'utils/axios'
import { getSession } from 'next-auth/react';

export const addProduct = (product: any) => {
  return axiosServices({ 'method': 'POST', 'data': product, 'url': '/api/v3/products/' });
};

export const getProduct = async (columnName: string, columnValue: string) => {
  return axiosServices({ 'method': 'GET', 'params':[], 'url': `/api/v3/products/${columnName}/${columnValue}/` });
};

export const editProduct = (product: any) => {
  return axiosServices({ 'method': 'PUT', 'data': product, 'url': `/api/v3/products/` });
};

export const listProduct = async (queryParams: any , demoAccpint? : boolean) => {
  if(demoAccpint){
    return  axiosServicesFrontend({ method: 'GET', 'params': queryParams, url: `/api/product/get-products/` });
  }
  return axiosServices({ 'method': 'GET', 'params': queryParams, url: '/api/v3/products/' });
};

export const deleteProduct = (productId:any) => {
  return axiosServices({
    method: 'POST',
    url: `/api/v3/delete-product/${productId}/`, // Modify the URL to include branch_id
  });
};

