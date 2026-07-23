export interface Invoice {
    id?: number;
    customer_name?: string;
    added_by_id?: string | number | undefined;
    added_by_name?: string;
    added_on?: string;
    username: string;
    email: string;
}
