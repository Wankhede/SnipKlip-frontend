export interface Salary {
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
}
