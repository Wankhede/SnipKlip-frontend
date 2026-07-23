import { useRouter } from 'next/router';
import { ChangeEvent, ReactElement, useEffect, useMemo, useState } from 'react';
import { MouseEvent } from 'react';
// next
// third-party
import { useFormik } from 'formik';
import * as yup from 'yup';
// material-ui
import {
    Autocomplete,
    Box,
    Button,
    Chip,
    Divider,
    FormControl,
    FormHelperText,
    Grid,
    IconButton,
    InputLabel,
    MenuItem,
    Select,
    Stack,
    TextField,
    Tooltip,
    Typography,
    useTheme
} from '@mui/material';
// project import
import MainCard from 'components/MainCard';
import Page from 'components/Page';
import Layout from 'layout';
// assets
import AnimateButton from 'components/@extended/AnimateButton';

// types
import { Employee } from 'types/employees';

import { addEmployee, editEmployee } from 'services/employees';
import { EssentialMethods } from 'utils/essentialMethods';
import { errorColor, successColor } from 'config';
import CustomButton from 'components/custom-button';
import { Salary } from 'types/salary';
import { listSalary } from 'services/salary';
import ScrollX from 'components/ScrollX';
import CustomTable from 'components/custom-table';
import { useSession } from 'next-auth/react';
import { getTableRowsDataI } from 'types/common';
import { FormattedMessage } from 'react-intl';
import { Column, Row } from 'react-table';
import { CloseOutlined, EditTwoTone, EyeTwoTone } from '@ant-design/icons';
import NumberFormat from 'react-number-format';
import { useUserProfile } from '../user-provider';
import { listBooking } from 'services/bookings';
import { BookingC } from 'models/booking';

// ==============================|| ADD NEW EMPLOYEE - MAIN ||============================== //

const validationSchema = yup.object().shape({
    first_name: yup
        .string()
        .required('First Name is required')
        .min(4, 'First Name must be at least 4 characters')
        .max(50, 'First Name can be at most 50 characters')
        .matches(/^[A-Za-z]+$/, 'First Name should contain only alphabets'),
    last_name: yup
        .string()
        .required('Last Name is required')
        .max(50, 'Last Name can be at most 50 characters'),
    // email: yup.string().email('Invalid email').required('Email is required'),
    mobile: yup
        .string()
        .required('Mobile is required')
        .matches(/^\d{10}$/, 'Mobile number must be 10 digits'),
    employee_type: yup.string().required('Employee Type is required').oneOf(['Staff', 'Manager'], 'Invalid Employee Type'),
    service_incentive: yup.number().required('Service Incentive is required').min(0, 'Service Incentive must be non-negative'),
    product_incentive: yup.number().required('Product Incentive is required').min(0, 'Product Incentive must be non-negative'),
    base_salary: yup.number().required('Basic Salary is required').min(0, 'Basic Salary must be non-negative')
});

// ==============================|| MASTER - RESOURCE - ADD NEW EMPLOYEE ||============================== //

const AddEmployee = (props: any) => {
    const initialFormValues: Employee = {
        base_salary: 10000,
        start_date: '',
        end_date: '',
        employee_type: 'Staff',
        status: 'Active',
        service_incentive: 10,
        product_incentive: 30,
        first_name: '',
        last_name: '',
        email: '',
        mobile: ''
    };

    const router = useRouter();
    const [formData, setFormData] = useState<Employee>(initialFormValues);
    const { data, accessibility = true, id, title = 'Add Employee' } = props;
    const [isSubmitting, setIsSubmitting] = useState(false);
    const emp_types = [
        { name: 'Staff', element: 'Staff' },
        { name: 'Manager', element: 'Manager' }
    ];
    const { userData, loading } = useUserProfile();
    useEffect(() => {
        if (props && data != undefined) {
            setFormData({ ...data });
        }
    }, []);

    const formik = useFormik({
        initialValues: formData,
        enableReinitialize: true,
        validationSchema,
        onSubmit: async (values, { setSubmitting }) => {
            var response;
            if (accessibility && data) {
                response = await editEmployee(values);
            } else {
                response = await addEmployee(values);
            }
            if (response.data.status === 200) {
                setIsSubmitting(true);
                EssentialMethods.showSnackbar(response.data.message, successColor);
                router.push('/apps/employees/manage-employees');
            } else {
                setIsSubmitting(false);
                EssentialMethods.showSnackbar(response.data.message, errorColor);
            }
        }
    });
    const handleCancel = () => {
        router.back();
    };
    const { data: session } = useSession();
    const getTableRows = async (tableParams: getTableRowsDataI) => {
        try {
            const { id } = router.query;
            const currentMonth = 'ALL';
            const mergedParams = { ...tableParams, ...userData, employee_id: id!.toString(), month: 'ALL' };
            return listSalary(mergedParams);
        } catch (error) {
            // Handle any errors that occur during the API call
            console.error('Error retrieving employee data:', error);
            return [];
        }
    };

    const getTableRowsBooking = async (tableParams: getTableRowsDataI) => {
        try {
            const { id } = router.query;
            const mergedParams = { ...tableParams, ...userData, employee_id: id!.toString(), no_filter: false };
            let bookings = await listBooking(mergedParams);

            // adding invoice_item field for direct access in table
            bookings.data.data.rows = bookings.data.data.rows.map((appointment: any) => {
                const invoice_item = appointment.category === 'Product' ? appointment.product : appointment.service

                return { ...appointment, invoice_item: invoice_item }

            })
            return bookings;
        } catch (error) {
            // Handle any errors that occur during the API call
            console.error('Error retrieving employee data:', error);
            return [];
        }
    };

    // const AddButton: JSX.Element = <Button variant="contained" startIcon={<PlusOutlined />} onClick={() => router.push(`/apps/salary/add-salary/${id}`)}>Add Salary</Button>
    const theme = useTheme();
    const columns = useMemo(
        () =>
            [
                {
                    Header: 'Actions',
                    className: 'cell-center',
                    disableSortBy: true,
                    dataType: 'action',
                    disableFilters: true,
                    Cell: ({ row }: { row: Row<Salary> }) => {
                        const collapseIcon = row.isExpanded ? (
                            <CloseOutlined style={{ color: theme.palette.error.main }} />
                        ) : (
                            <EyeTwoTone twoToneColor={theme.palette.secondary.main} />
                        );
                        return (
                            <Stack direction="row" alignItems="center" justifyContent="center" spacing={0}>
                                <Tooltip title="View">
                                    <IconButton
                                        color="secondary"
                                        onClick={(e: MouseEvent<HTMLButtonElement>) => {
                                            // e.stopPropagation();
                                            router.push(`/apps/salary/view/${row.original.id}`);
                                        }}
                                    >
                                        {collapseIcon}
                                    </IconButton>
                                </Tooltip>
                                <Tooltip title="Edit">
                                    <IconButton
                                        color="primary"
                                        onClick={(e: MouseEvent<HTMLButtonElement>) => {
                                            // e.stopPropagation();
                                            router.push(`/apps/salary/edit/${row.original.id}`);
                                        }}
                                    >
                                        <EditTwoTone twoToneColor={theme.palette.primary.main} />
                                    </IconButton>
                                </Tooltip>
                            </Stack>
                        );
                    }
                },
                {
                    Header: <FormattedMessage id="Salary for Month" />,
                    accessor: 'month',
                    dataType: 'text'
                },
                {
                    Header: <FormattedMessage id="Base-Salary" />,
                    accessor: 'basic',
                    Cell: ({ value }: { value: number }) => <NumberFormat value={value} displayType="text" thousandSeparator prefix="₹ " />
                },
                {
                    Header: <FormattedMessage id="service-incentive-amount" />,
                    accessor: 'service_incentive_amount',
                    Cell: ({ value }: { value: number }) => <NumberFormat value={value} displayType="text" thousandSeparator prefix="₹ " />
                },
                {
                    Header: <FormattedMessage id="product-incentive-amount" />,
                    accessor: 'product_incentive_amount',
                    Cell: ({ value }: { value: number }) => <NumberFormat value={value} displayType="text" thousandSeparator prefix="₹ " />
                },
                {
                    Header: <FormattedMessage id="deduction" />,
                    accessor: 'deduction',
                    Cell: ({ value }: { value: number }) => <NumberFormat value={value} displayType="text" thousandSeparator prefix="₹ " />
                },
                {
                    Header: <FormattedMessage id="total-salary" />,
                    accessor: 'total_salary',
                    Cell: ({ value }: { value: number }) => <NumberFormat value={value} displayType="text" thousandSeparator prefix="₹ " />
                },
                {
                    Header: <FormattedMessage id="paid" />,
                    accessor: 'paid',
                    Cell: ({ value }: { value: boolean }) => {
                        switch (value) {
                            case false:
                                return <Chip color="error" label="Not Paid" size="small" variant="light" />;
                            case true:
                                return <Chip color="success" label="Paid" size="small" variant="light" />;
                            default:
                                return <Chip color="info" label="Not Paid" size="small" variant="light" />;
                        }
                    }
                }
            ] as Column[],
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [theme]
    );
    const columnsBooking = useMemo(
        () => [
            {
                Header: <FormattedMessage id="Category" />,
                accessor: 'category',
                dataType: 'text',

            },
            {
                Header: <FormattedMessage id="Item" />,
                accessor: 'invoice_item',
                Cell: ({ value }: { value: any }) => {
                    return value.map((service: any) => {
                        return <Grid>{service.name}</Grid>
                    })
                }


            },
            {
                Header: <FormattedMessage id="booking-date" />,
                accessor: 'booking_date',
                dataType: 'text'
            },
            {
                Header: <FormattedMessage id="start-time" />,
                accessor: 'start_time',
                dataType: 'text'
            },
            {
                Header: <FormattedMessage id="end-time" />,
                accessor: 'end_time',
                dataType: 'text'
            },
            {
                Header: <FormattedMessage id="amount" />,
                accessor: 'price',
                dataType: 'text',
                Cell: ({ value }: { value: any }) => {
                    return `₹${value}`
                }
            },
            {
                Header: <FormattedMessage id="staff" />,
                accessor: 'staff_assigned',
                Cell: ({ value }: { value: any }) => {
                    return value.map((emp: any) => {
                        return <Chip key={emp.mobile} color="success" label={emp.customer_name} size="small" variant="light" />
                    })
                }
            },
            {
                Header: <FormattedMessage id="booking-status" />,
                accessor: 'booking_status',
                Cell: ({ value }: { value: boolean }) => {
                    switch (value) {
                        case false:
                            return <Chip color="error" label="Pending" size="small" variant="light" />;
                        case true:
                            return <Chip color="success" label="Availed" size="small" variant="light" />;
                        default:
                            return <Chip color="info" label="Booked" size="small" variant="light" />;
                    }
                }
            },
            {
                Header: <FormattedMessage id="payment-status" />,
                accessor: 'isPaid',
                Cell: ({ value }: { value: boolean }) => {
                    switch (value) {
                        case false:
                            return <Chip color="error" label="Not Paid" size="small" variant="light" />;
                        case true:
                            return <Chip color="success" label="Paid" size="small" variant="light" />;
                        default:
                            return <Chip color="info" label="Pending" size="small" variant="light" />;
                    }
                }
            },
        ] as Column[],
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [theme]
    );
    const paginationData = { pageIndex: 0, pageSize: 10 };

    function handleNumericInput(e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
        if (/^[0-9]*$/.test(e.target.value)) {
            formik.handleChange(e);
        }
    }
    return (
        <Page title={title}>
            <MainCard tilte={title}>
                <form onSubmit={formik.handleSubmit}>
                    <Box>
                        <Grid container spacing={3}>
                            <Grid item xs={12} md={4}>
                                <Stack spacing={1}>
                                    <InputLabel htmlFor="first_name">
                                        Employee First Name<span style={{ color: 'red' }}>*</span>
                                    </InputLabel>
                                    <TextField
                                        fullWidth
                                        id="first_name"
                                        name="first_name"
                                        placeholder="Please Enter First Name"
                                        value={formik.values.first_name}
                                        onChange={formik.handleChange}
                                        disabled={!accessibility}
                                        error={formik.touched.first_name && Boolean(formik.errors.first_name)}
                                        helperText={formik.touched.first_name && formik.errors.first_name}
                                    />
                                </Stack>
                            </Grid>
                            <Grid item xs={12} md={4}>
                                <Stack spacing={1}>
                                    <InputLabel htmlFor="last_name">
                                        Employee Last Name<span style={{ color: 'red' }}>*</span>
                                    </InputLabel>
                                    <TextField
                                        fullWidth
                                        id="last_name"
                                        name="last_name"
                                        placeholder="Please Enter Last Name"
                                        value={formik.values.last_name}
                                        onChange={formik.handleChange}
                                        disabled={!accessibility}
                                        error={formik.touched.last_name && Boolean(formik.errors.last_name)}
                                        helperText={formik.touched.last_name && formik.errors.last_name}
                                    />
                                </Stack>
                            </Grid>
                            <Grid item xs={12} md={4}>
                                <Stack spacing={1}>
                                    <InputLabel htmlFor="email">
                                        Email ID
                                    </InputLabel>
                                    <TextField
                                        fullWidth
                                        id="email"
                                        name="email"
                                        placeholder="Please Enter Email ID"
                                        value={formik.values.email}
                                        onChange={formik.handleChange}
                                        disabled={!accessibility}
                                        error={formik.touched.email && Boolean(formik.errors.email)}
                                        helperText={formik.touched.email && formik.errors.email}
                                    />
                                </Stack>
                            </Grid>
                            <Grid item xs={12} md={4}>
                                <Stack spacing={1}>
                                    <InputLabel htmlFor="mobile">
                                        Phone<span style={{ color: 'red' }}>*</span>
                                    </InputLabel>
                                    <TextField
                                        fullWidth
                                        id="mobile"
                                        name="mobile"
                                        placeholder="Please Enter Mobile No"
                                        value={formik.values.mobile}
                                        onChange={(e) => {
                                            let value = e.target.value;
                                            if (/^[0-9]*$/.test(value) && value.length <= 10) {
                                                formik.handleChange(e);
                                            }
                                        }}
                                        disabled={!accessibility}
                                        error={formik.touched.mobile && Boolean(formik.errors.mobile)}
                                        helperText={formik.touched.mobile && formik.errors.mobile}
                                    />
                                </Stack>
                            </Grid>
                            <Grid item xs={12} md={4}>
                                <Stack spacing={1}>
                                    <InputLabel htmlFor="employee_type">
                                        Employee Type<span style={{ color: 'red' }}>*</span>
                                    </InputLabel>
                                    <Autocomplete
                                        id="employee_type"
                                        value={formik.values.employee_type}
                                        onChange={(event: any, newValue: string | null) => {
                                            formik.setFieldValue('employee_type', newValue);
                                        }}
                                        options={emp_types.map((item) => item.element)}
                                        isOptionEqualToValue={(option, value) => option === value}
                                        renderInput={(params) => (
                                            <TextField
                                                {...params}
                                                placeholder="Please Select Employee Type"
                                                error={formik.touched.employee_type && Boolean(formik.errors.employee_type)}
                                                helperText={formik.touched.employee_type && formik.errors.employee_type}
                                                sx={{ '& .MuiAutocomplete-input.Mui-disabled': { WebkitTextFillColor: theme.palette.text.primary } }}
                                            />
                                        )}
                                    />
                                </Stack>
                            </Grid>
                            <Grid item xs={12} md={4}>
                                <Stack spacing={1}>
                                    <InputLabel htmlFor="service_incentive">
                                        Service Incentive<span style={{ color: 'red' }}>*</span>
                                    </InputLabel>
                                    <TextField
                                        fullWidth
                                        id="service_incentive"
                                        name="service_incentive"
                                        placeholder="Please Enter Service Incentive"
                                        value={formik.values.service_incentive}
                                        onChange={handleNumericInput}
                                        disabled={!accessibility}
                                        error={formik.touched.service_incentive && Boolean(formik.errors.service_incentive)}
                                        helperText={formik.touched.service_incentive && formik.errors.service_incentive}
                                    />
                                </Stack>
                            </Grid>
                            <Grid item xs={12} md={4}>
                                <Stack spacing={1}>
                                    <InputLabel htmlFor="product_incentive">
                                        Product Incentive<span style={{ color: 'red' }}>*</span>
                                    </InputLabel>
                                    <TextField
                                        fullWidth
                                        id="product_incentive"
                                        name="product_incentive"
                                        placeholder="Please Enter Product Incentive"
                                        value={formik.values.product_incentive}
                                        onChange={handleNumericInput}
                                        disabled={!accessibility}
                                        error={formik.touched.product_incentive && Boolean(formik.errors.product_incentive)}
                                        helperText={formik.touched.product_incentive && formik.errors.product_incentive}
                                    />
                                </Stack>
                            </Grid>
                            <Grid item xs={12} md={4}>
                                <Stack spacing={1}>
                                    <InputLabel htmlFor="base_salary">
                                        Basic Salary<span style={{ color: 'red' }}>*</span>
                                    </InputLabel>
                                    <TextField
                                        fullWidth
                                        id="base_salary"
                                        name="base_salary"
                                        placeholder="Please Enter Basic Salary"
                                        value={formik.values.base_salary}
                                        onChange={handleNumericInput}
                                        disabled={!accessibility}
                                        error={formik.touched.base_salary && Boolean(formik.errors.base_salary)}
                                        helperText={formik.touched.base_salary && formik.errors.base_salary}
                                    />
                                </Stack>
                            </Grid>
                            {id !== undefined ? (
                                <Grid item xs={12} md={4}>
                                    <Stack spacing={1}>
                                        <InputLabel htmlFor="status" shrink={!formik.values.status}>
                                            Status
                                        </InputLabel>
                                        <FormControl sx={{ m: 1, minWidth: 120 }}>
                                            <Select
                                                id="status"
                                                {...formik.getFieldProps('status')}
                                                disabled={!accessibility}
                                                displayEmpty
                                                defaultValue={formik.values.status ? 'Active' : 'Inactive'}
                                            >
                                                <MenuItem value="Active">Active</MenuItem>
                                                <MenuItem value="Inactive">Inactive</MenuItem>
                                            </Select>
                                            {formik.touched.status && formik.errors.status && (
                                                <FormHelperText error id="standard-weight-helper-text-email-login">
                                                    {formik.errors.status}
                                                </FormHelperText>
                                            )}
                                        </FormControl>
                                    </Stack>
                                </Grid>
                            ) : null}

                            <Grid item xs={12}>
                                <Stack direction="row" spacing={1} justifyContent="flex-end">
                                    <Button color="error" onClick={() => router.back()}>
                                        {accessibility ? 'Cancel' : 'Back'}
                                    </Button>
                                    {accessibility && (
                                        <AnimateButton>
                                            <CustomButton
                                                loading={isSubmitting}
                                                title={accessibility && id ? 'update' : 'submit'}
                                                onclick={() => formik.submitForm()}
                                            />
                                        </AnimateButton>
                                    )}
                                </Stack>
                            </Grid>
                        </Grid>
                    </Box>
                </form>
            </MainCard>
            {!accessibility && id && (
                <MainCard tilte={title}>
                    <Box>
                        <>
                            <Typography variant='h2'>Salary Details</Typography>
                            {/* <Divider flexItem sx={{ borderStyle: 'solid', mt: 2 }} /> */}
                            <Box my={2}>
                                <Grid item xs={12} md={12}>
                                    <ScrollX>
                                        <CustomTable
                                            columns={columns}
                                            paginationData={paginationData}
                                            // updateTableValues={updateTableRows}
                                            rowSelection={true}
                                            // addButton={AddButton}
                                            editable={false}
                                            getTableRows={getTableRows}
                                            filename="salary.csv"
                                            searchColumns={Object.getOwnPropertyNames(new BookingC)}
                                        />
                                    </ScrollX>
                                </Grid>
                            </Box>
                        </>
                    </Box>
                </MainCard>
            )}
            {!accessibility && id && (
                <MainCard tilte={title}>
                    <Box>
                        <>
                            {/* <Divider flexItem sx={{ borderStyle: 'solid', mt: 10 }} /> */}
                            <Typography variant='h2'>Booking Details</Typography>

                            <Box my={2}>
                                <Grid item xs={12} md={12}>
                                    <ScrollX>
                                        <CustomTable
                                            columns={columnsBooking}
                                            paginationData={paginationData}
                                            // updateTableValues={updateTableRowsBooking}
                                            rowSelection={true}
                                            // addButton={AddButton}
                                            editable={false}
                                            getTableRows={getTableRowsBooking}
                                            filename="salary.csv"
                                            searchColumns={Object.getOwnPropertyNames(new BookingC)}
                                        />
                                    </ScrollX>
                                </Grid>
                            </Box>
                        </>
                    </Box>
                </MainCard>
            )}
        </Page >
    );
};

AddEmployee.getLayout = function getLayout(page: ReactElement) {
    return <Layout>{page}</Layout>;
};

export default AddEmployee;
