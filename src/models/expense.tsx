import { Expense } from "types/expenses";

export class ExpenseC implements Expense {
    id?: number;
    amount: string;
    description: string;
    date: string;
    status: string;

    constructor(data: Partial<Expense> = {}) {
        this.id = data.id;
        this.amount = data.amount || '';
        this.description = data.description || '';
        this.date = data.date || '';
        this.status = data.status || '';
    }
}
