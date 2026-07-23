import axiosServices, { axiosServicesFrontend } from 'utils/axios'
import { Booking } from 'types/bookings';
import { getSessionDataI, getTableRowsDataI } from 'types/common';

export const addBooking = (booking: Booking) => {
  return axiosServices({ 'method': 'POST', 'data': booking, 'url': '/api/v3/bookings/' });
};

export const getBooking = (columnName: string, columnValue: string) => {
  return axiosServices({ 'method': 'GET', params: [], 'url': `/api/v3/bookings/${columnName}/${columnValue}/` });
};

export const editBooking = async (booking: Booking) => {
  return axiosServices({ 'method': 'PUT', 'data': booking, 'url': `/api/v3/bookings/` });
};

export const listBooking = async (queryParams: getTableRowsDataI | getSessionDataI, demoAccpint? : boolean) => {
  if(demoAccpint){
    
    return  axiosServicesFrontend({ method: 'GET', 'params': queryParams, url: `/api/booking/get-bookings/` });
    
  }
  return axiosServices({ method: 'GET', params: queryParams, url: `/api/v3/bookings/` });
};

export const deleteBooking = (queryParams: getTableRowsDataI | getSessionDataI) => {
  return axiosServices({ method: 'DELETE', params: queryParams, url: `/api/v3/bookings/` });
};

export const availBooking = (queryParams: getTableRowsDataI | getSessionDataI) => {
  return axiosServices({ method: 'POST', params: queryParams, url: `/api/v3/availed-booking/` });
};


export const getCustomerBooking = (queryParams: getTableRowsDataI | getSessionDataI,id:any) => {
  return axiosServices({ method: 'GET', params: queryParams, url:  `/api/v3/customer_booking_history/${id}` });
};
