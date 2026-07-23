import { MetaDataAttributeI } from './common';

export interface Booking {
    id?: number;
    customer_id: number;
    customer_name: string;
    email: string;
    booking_date: string;
    start_time: string;
    booking_platform: string;
    isPaid: boolean;
    service: MetaDataAttributeI[];
    staff_assigned: MetaDataAttributeI[];
    slot: StaffAvailability[];
    invoice_id: number;
    booking_status?: string;
    payment_status?: boolean;
}

export interface StaffAvailability {
    name: string;
    details: Availability[];
}

export interface Availability {
    id: number | string;
    time: string;
    staff: string;
    status: boolean | string;
    description: string;
}
