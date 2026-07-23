// project import
import axios from 'utils/axios';
import { dispatch } from 'store';
import axiosServices from 'utils/axios';

// third-party
import { createSlice } from '@reduxjs/toolkit';

// types
import { Invoice, InvoiceProps } from 'types/invoice';

const initialState: InvoiceProps = {
    isOpen: false,
    isCustomerOpen: false,
    open: false,
    lists: [],
    list: null,
    error: null,
    alertPopup: false,
    mode_of_payment: []
};

// ==============================|| INVOICE - SLICE ||============================== //

const invoice = createSlice({
    name: 'invoice',
    initialState,
    reducers: {
        // review invoice popup
        reviewInvoicePopup(state, action) {
            state.isOpen = action.payload.isOpen;
        },

        // is customer open
        customerPopup(state, action) {
            state.isCustomerOpen = action.payload.isCustomerOpen;
        },

        // handler customer form popup
        toggleCustomerPopup(state, action) {
            state.open = action.payload.open;
        },

        hasError(state, action) {
            state.error = action.payload.error;
        },

        // get all invoice list
        getLists(state, action) {
            state.lists = action.payload;
        },

        // get invoice details
        getSingleList(state, action) {
            state.list = action.payload;
        },

        // create invoice
        createInvoice(state, action) {
            let newEvent = action.payload;
            state.lists = [...state.lists, newEvent];
        },

        // update invoice
        UpdateInvoice(state, action) {
            const { NewInvoice } = action.payload;
            const InvoiceUpdate = state.lists.map((item: any) => {
                if (item.id === NewInvoice.id) {
                    return NewInvoice;
                }
                return item;
            });
            state.lists = InvoiceUpdate;
        },

        // delete invoice
        deleteInvoice(state, action) {
            const { invoiceId } = action.payload;
            const deleteInvoice = state.lists.filter((list: any) => list.id !== invoiceId);
            state.lists = deleteInvoice;
        },

        //alert popup
        alertPopupToggle(state, action) {
            state.alertPopup = action.payload.alertToggle;
        }
    }
});

export default invoice.reducer;

export const { reviewInvoicePopup, customerPopup, toggleCustomerPopup, getLists, alertPopupToggle } = invoice.actions;

export function getInvoiceList() {
    return async () => {
        try {
            const response = await axios.get('/api/invoice/list');
            dispatch(invoice.actions.getLists(response.data.invoice));
        } catch (error) {
            dispatch(invoice.actions.hasError(error));
        }
    };
}

export function getInvoiceInsert(NewLists: Invoice) {
    return async () => {
        try {
            const response = await axios.post('/api/invoice/insert', { list: NewLists });
            dispatch(invoice.actions.createInvoice(response.data));
        } catch (error) {
            dispatch(invoice.actions.hasError(error));
        }
    };
}

export function getInvoiceUpdate(NewList: any) {
    return async (dispatch: any) => {
        try {
            const response = await axios.put('/api/v3/billings/', NewList);
            dispatch(invoice.actions.UpdateInvoice(response.data));
            return response.data; // Return the response data
        } catch (error) {
            dispatch(invoice.actions.hasError(error));
            throw error; // Rethrow the error for handling later if needed
        }
    };
}

export const editBilling = (newLists: any) => {
    return axiosServices({ method: 'PUT', data: newLists, url: '/api/v3/billings/' });
};

export function getInvoiceSingleList(invoiceId: any) {
    return async () => {
        try {
            const response = await axios.post('/api/v3/get-a-invoice/', { id: invoiceId });
            // TODO: check the response and convert it to InvoiceList object - Alex
            dispatch(invoice.actions.getSingleList(response.data));
        } catch (error) {
            dispatch(invoice.actions.hasError(error));
        }
    };
}
