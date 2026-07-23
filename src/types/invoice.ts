// ==============================|| INVOICE - SLICE ||============================== //

import { MetaDataAttributeI } from './common';

export interface InfoType {
    name: string;
    address: string;
    phone: string;
    email: string;
}

export interface CountryType {
    code: string;
    label: string;
    currency: string;
}

export interface Items {
    id: string | number;
    service: MetaDataAttributeI;
    staff: MetaDataAttributeI[];
    description: string;
    qty: number;
    price: string | number;
}

export interface InvoiceProps {
    isOpen: boolean;
    isCustomerOpen: boolean;
    open: boolean;
    mode_of_payment: string[];
    lists: Invoice[];
    list: Invoice | null;
    error: object | string | null;
    alertPopup: boolean;
}

export interface Invoice {
    id: number;
    tax_added: number;
    invoice_id: number;
    tax_percentage: number | null;
    discount_percentage: number | null;
    date_created?: string;
    date: Date | string;
    due_date: Date | string;
    quantity: number;
    actual_amount: number | null;
    price_cut_by_coupon_code: number | 0;
    status: string;
    payment_received: number | null;
    coupon_code: string | null;
    invoice_detail: Items[];
    cashierInfo: InfoType;
    discount: number | null;
    tax: number | null;
    customerInfo: InfoType;
    notes: string;
    customer_name: string;
    total?: string;
    discount_added?: string;
    email?: string;
    due_payment?: number | null;
    appointment_date?: Date | string;
    price_cut_by_membership?: number;
    mode_of_payment: string;
}

export interface InvoiceDetail {
    id: number | string;
    service: MetaDataAttributeI;
    staff: MetaDataAttributeI[];
    qty: number;
    description: string;
    price: number;
}
