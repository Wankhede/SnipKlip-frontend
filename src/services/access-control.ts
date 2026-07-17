import axiosServices from 'utils/axios'
import { AccessKeyAssociation } from 'types/access-control';
import { getSessionDataI, getTableRowsDataI } from 'types/common';

export const addAccessKeyAssociation = (accessKeyAssociation: AccessKeyAssociation) => {
  return axiosServices({ 'method': 'POST', 'data': accessKeyAssociation, 'url': '/api/v3/access-control-association/' });
};

export const getAccessKeyAssociation = (columnName: string, columnValue: string, queryParams?: getTableRowsDataI | getSessionDataI) => {
  return axiosServices({ 'method': 'GET', params: queryParams, 'url': `/api/v3/access-control-association/${columnValue}/` });
};

export const listAccessKeyAssociationByGroup = (accessKeyAssociation: AccessKeyAssociation) => {
  return axiosServices({ 'method': 'GET', params: accessKeyAssociation, 'url': `/api/v3/access-control-association/` });
};

export const editAccessKeyAssociation = async (accessKeyAssociation: AccessKeyAssociation) => {
  return axiosServices({ 'method': 'PUT', 'data': accessKeyAssociation, 'url': `/api/v3/access-control-association/` });
};

export const listAccessKeyAssociation = async (queryParams: getTableRowsDataI | getSessionDataI) => {
  return axiosServices({ method: 'GET', params: queryParams, url: `/api/v3/access-control-association/` });
};


