import { Booking, StaffAvailability } from "types/bookings";
import { MetaDataAttributeI } from "types/common";

export class BookingC implements Booking {
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

    constructor(data: Partial<Booking> = {}) {
        this.id = data.id;
        this.customer_id = data.customer_id || 1;
        this.customer_name = data.customer_name || "John Doe";
        this.email = data.email || "john@example.com";
        this.booking_date = data.booking_date || "2024-02-12";
        this.start_time = data.start_time || "10:00";
        this.booking_platform = data.booking_platform || "PlatformX";
        this.isPaid = data.isPaid === undefined ? true : data.isPaid;
        this.service = data.service || [];
        this.staff_assigned = data.staff_assigned || [];
        this.slot = data.slot || [];
        this.invoice_id = data.invoice_id || 12345;
        this.booking_status = data.booking_status || "Confirmed";
        this.payment_status = data.payment_status === undefined ? true : data.payment_status;
    }
}

