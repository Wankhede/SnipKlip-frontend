import axiosServices from 'utils/axios';
import { Membership } from 'types/membership';
import { getSessionDataI, getTableRowsDataI } from 'types/common';

export const addMembership = (membership: Membership) => {
    return axiosServices({ method: 'POST', data: membership, url: '/api/v3/memberships/' });
};

export const getMembership = (columnName: string, columnValue: string, queryParams?: getTableRowsDataI | getSessionDataI) => {
    return axiosServices({ method: 'GET', params: queryParams, url: `/api/v3/memberships/${columnName}/${columnValue}/` });
};

export const editMembership = (membership: Membership) => {
    return axiosServices({ method: 'PUT', data: membership, url: `/api/v3/memberships/` });
};

export const listMembership = async (queryParams: getTableRowsDataI | getSessionDataI) => {
    return axiosServices({ method: 'GET', params: queryParams, url: `/api/v3/memberships/` });
};
