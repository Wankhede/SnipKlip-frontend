import { demoDataInterface } from "types/common";

export let bookings :demoDataInterface[]= [
    {
    "data": {
        "count": 13,
        "rows": [
            {
                "id": 42,
                "salon": {
                    "id": 1,
                    "name": "Gagandeep Arora Salon & Academy",
                    "email": "owner@snipklip.in",
                    "reg_no": "ZEELLU0BUROOURB",
                    "contact_no": "918668556622",
                    "owner_name": "Gagandeep",
                    "owner_email": "owner@snipklip.in",
                    "logo": null,
                    "user": 2
                },
                "order_id": "UPFDFUP4Y99Y",
                "customer_name": "Sharmila Satyan",
                "customer_id": "4",
                "user": {
                    "id": 4,
                    "first_name": "Sharmila",
                    "last_name": "Satyan",
                    "email": "sharmila@yahoo.com",
                    "mobile": "9890414622",
                    "date_joined": "2023-07-06T20:14:56.610694+05:30",
                    "is_active": true,
                    "group": "Customer"
                },
                "booking_date": "2024-01-05",
                "start_time": "09:10:00",
                "end_time": "09:21:00",
                "price": "111.00",
                "booking_status": "Availed",
                "payment_status": "True",
                "mode_of_payment": "",
                "createdAt": "2024-01-06T16:51:14.519093+05:30",
                "staff_assigned": [
                    {
                        "id": 1,
                        "user": {
                            "id": 3,
                            "first_name": "Neha1",
                            "last_name": "Runwal",
                            "email": "neha@gmail.com",
                            "mobile": "[1]",
                            "date_joined": "2023-07-06T20:13:56.063230+05:30",
                            "is_active": true,
                            "group": "Staff"
                        },
                        "first_name": "Neha1",
                        "last_name": "Runwal",
                        "customer_name": "Neha1 Runwal",
                        "email": "neha@gmail.com",
                        "mobile": "[1]",
                        "employee_type": "('Staff',)",
                        "status": true,
                        "created": "2023-08-25T21:15:24.698492+05:30",
                        "product_incentive": 10,
                        "service_incentive": 30,
                        "base_salary": 0
                    }
                ],
                "service": [
                    {
                        "id": 1,
                        "user": 1,
                        "name": "Bikini Line - Sugar Wax",
                        "price": "111.00"
                    }
                ],
                "discount_price": 0.0,
                "booking_platform": "BOOK APPOINTMENT",
                "invoice_id": 47
            },
            {
                "id": 41,
                "salon": {
                    "id": 1,
                    "name": "Gagandeep Arora Salon & Academy",
                    "email": "owner@snipklip.in",
                    "reg_no": "ZEELLU0BUROOURB",
                    "contact_no": "918668556622",
                    "owner_name": "Gagandeep",
                    "owner_email": "owner@snipklip.in",
                    "logo": null,
                    "user": 2
                },
                "order_id": "6XOY7HHUHJPP",
                "customer_name": "Alex Customer",
                "customer_id": "7",
                "user": {
                    "id": 7,
                    "first_name": "Alex",
                    "last_name": "Kavhar",
                    "email": "skvahar1998@gmail.com",
                    "mobile": "9890414678",
                    "date_joined": "2023-08-01T17:45:05.778459+05:30",
                    "is_active": true,
                    "group": null
                },
                "booking_date": "2024-01-02",
                "start_time": null,
                "end_time": null,
                "price": "111.00",
                "booking_status": "Availed",
                "payment_status": "True",
                "mode_of_payment": "",
                "createdAt": "2024-01-02T19:25:17.243883+05:30",
                "staff_assigned": [
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
                    }
                ],
                "service": [
                    {
                        "id": 1,
                        "user": 1,
                        "name": "Bikini Line - Sugar Wax",
                        "price": "111.00"
                    }
                ],
                "discount_price": 0.0,
                "booking_platform": "WALK IN",
                "invoice_id": 46
            },
		]
	},
    "message": "Successfully retrieved all booking(s).",
    "status": 200
}
]