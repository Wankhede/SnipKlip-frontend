import { Employee } from "types/employees";

export class EmployeeC implements Employee {
    id?: number;
    base_salary: number;
    start_date: string;
    end_date: string;
    employee_type: string;
    status: string;
    service_incentive: number;
    product_incentive: number;
    first_name: string;
    last_name: string;
    email: string;
    mobile: string;

    constructor(data: Partial<Employee> = {}) {
        this.id = data.id;
        this.base_salary = data.base_salary || 0;
        this.start_date = data.start_date || '';
        this.end_date = data.end_date || '';
        this.employee_type = data.employee_type || '';
        this.status = data.status || '';
        this.service_incentive = data.service_incentive || 0;
        this.product_incentive = data.product_incentive || 0;
        this.first_name = data.first_name || '';
        this.last_name = data.last_name || '';
        this.email = data.email || '';
        this.mobile = data.mobile || '';
    }
}
