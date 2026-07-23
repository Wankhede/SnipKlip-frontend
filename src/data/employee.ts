import { demoDataInterface } from "types/common";

export let employees:demoDataInterface[] = [{
    "data": {
        "count": 6,
        "rows": [
            {
                "id": 11,
                "user": {
                    "id": 35,
                    "first_name": "qq",
                    "last_name": "qq",
                    "email": "qq@gmail.com",
                    "mobile": "9890414698",
                    "date_joined": "2023-11-30T22:20:14.813466+05:30",
                    "is_active": true,
                    "group": "Staff"
                },
                "first_name": "qq",
                "last_name": "qq",
                "customer_name": "qq qq",
                "email": "qq@gmail.com",
                "mobile": "9890414698",
                "employee_type": "Staff",
                "status": true,
                "created": "2023-11-30T22:20:14.817108+05:30",
                "product_incentive": 130,
                "service_incentive": 110,
                "base_salary": 100001
            },
            {
                "id": 10,
                "user": {
                    "id": 34,
                    "first_name": "yeeee",
                    "last_name": "feeee",
                    "email": "t@gmail.ccom",
                    "mobile": "9890414941",
                    "date_joined": "2023-11-26T11:16:09.638473+05:30",
                    "is_active": true,
                    "group": "Staff"
                },
                "first_name": "yeeee",
                "last_name": "feeee",
                "customer_name": "yeeee feeee",
                "email": "t@gmail.ccom",
                "mobile": "9890414941",
                "employee_type": "Staff",
                "status": true,
                "created": "2023-11-26T11:16:09.645090+05:30",
                "product_incentive": 30,
                "service_incentive": 10,
                "base_salary": 10000
            },
		]
	},
    "message": "Successfully retrieved all employee(s).",
    "status": 200
}]