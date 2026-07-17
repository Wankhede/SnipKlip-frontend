import { Customer } from 'types/customers';
import { Salary } from 'types/salary';
export class SalaryC implements Salary {
    id?: string;
    employee_id?: string;
    employee: string;
    basic: string;
    total_salary: string;
    date_issued: string;
    month: string;
    service_incentive_amount: string;
    product_incentive_amount: string;
    deduction: string;
    paid: boolean | number;
    note: string;

    constructor(data: Partial<Salary> = {}) {
        this.id = data.id;
        this.employee_id = data.employee_id || '';
        this.employee = data.employee || '';
        this.basic = data.basic || '';
        this.total_salary = data.total_salary || '';
        this.date_issued = data.date_issued || '';
        this.month = data.month || '';
        this.service_incentive_amount = data.service_incentive_amount || '';
        this.product_incentive_amount = data.product_incentive_amount || '';
        this.deduction = data.deduction || '';
        this.paid = data.paid || true;
        this.note = data.note || '';
    }
}
