import { InfoType, Items } from "types/invoice";
import { Invoice } from "types/invoice";

export class InvoiceC implements Invoice {
    id: number;
    invoice_id: number;
    date_created?: string;
    date: Date | string;
    due_date: Date | string;
    quantity: number;
    status: string;
    invoice_detail: Items[];
    cashierInfo: InfoType;
    discount: number | null;
    tax: number | null;
    customerInfo: InfoType;
    notes: string;
    customer_name: string;
    total?: string;
    discount_added?: string;
    coupon_code: string | null;
    price_cut_by_coupon_code: number;
    payment_received: number | null;
    email?: string;
    due_payment?: number | null;
    appointment_date?: string | Date;
    actual_amount: number | null;
    tax_percentage: number | null;
    tax_added: number;
    discount_percentage: number | null;
    mode_of_payment: string;

    constructor(data: Partial<Invoice> = {}) {
        this.id = data.id || 0;
        this.invoice_id = data.invoice_id || 0;
        this.date_created = data.date_created || '';
        this.date = data.date || new Date();
        this.due_date = data.due_date || new Date();
        this.quantity = data.quantity || 0;
        this.status = data.status || '';
        this.invoice_detail = data.invoice_detail || [];
        this.cashierInfo = data.cashierInfo || { name: '', address: '', phone: '', email: '' };
        this.discount = data.discount || null;
        this.tax = data.tax || null;
        this.customerInfo = data.customerInfo || { name: '', address: '', phone: '', email: '' };
        this.notes = data.notes || '';
        this.customer_name = data.customer_name || '';
        this.total = data.total || '';
        this.discount_added = data.discount_added || '';
        this.coupon_code = data.coupon_code || '';
        this.email = data.email || '';
        this.due_payment = data.due_payment || null;
        this.appointment_date = data.appointment_date || '';
        this.price_cut_by_coupon_code = data.price_cut_by_coupon_code || 0;
        this.payment_received = data.payment_received || 0;
        this.actual_amount = data.actual_amount || 0;
        this.tax_percentage = data.tax_percentage || 0;
        this.tax_added = data.tax_added || 0;
        this.discount_percentage = data.discount_percentage || 0;
        this.mode_of_payment = data.mode_of_payment || '';
    }
}
