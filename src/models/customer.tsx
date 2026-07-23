import { Customer } from 'types/customers';
export class CustomerC implements Customer {
    id?: number;
    added_on?: string;
    added_by_id?: string;
    first_name: string;
    last_name: string;
    mobile: string;
    gender: string;
    dob: string;
    email: string;
    username: string;
    status: string;

    constructor(data: Partial<Customer> = {}) {
        this.id = data.id;
        this.added_on = data.added_on;
        this.added_by_id = data.added_by_id;
        this.first_name = data.first_name || '';
        this.last_name = data.last_name || '';
        this.mobile = data.mobile || '';
        this.gender = data.gender || '';
        this.dob = data.dob || '';
        this.email = data.email || '';
        this.username = data.username || '';
        this.status = data.status || '';
    }
}
