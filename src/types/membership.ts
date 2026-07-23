export interface Membership {
    id?: number;
    customer_name: string;
    customer_id: number;
    amount: string;
    description: string;
    expiry_date: string;
    discount_percent: number | null;
    membership_number: number | null;
    status: string;
}
