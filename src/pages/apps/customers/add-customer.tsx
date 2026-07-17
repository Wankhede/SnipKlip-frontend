import { useRouter } from 'next/router';
import { ReactElement, useEffect, useMemo, useState } from 'react';
// next
// third-party
import { useFormik } from 'formik';
import * as yup from 'yup';
// material-ui
import {
    Box,
    Button,
    Chip,
    Divider,
    FormControl,
    FormHelperText,
    Grid,
    ListItemText,
    MenuItem,
    OutlinedInput,
    Select,
    SelectChangeEvent,
    Stack,
    TextField,
    Typography,
    useTheme,
} from '@mui/material';
// project import
import MainCard from 'components/MainCard';
import Page from 'components/Page';
import Layout from 'layout';
import { EssentialMethods } from 'utils/essentialMethods';
import { errorColor, successColor } from 'config';
import { addCustomer, editCustomer } from 'services/customers';
import { Customer } from 'types/customers';
import AnimateButton from 'components/@extended/AnimateButton';
import CustomButton from 'components/custom-button';
import ScrollX from 'components/ScrollX';
import CustomTable from 'components/custom-table';
import { listBooking } from 'services/bookings';
import { getTableRowsDataI } from 'types/common';
import { useSession } from 'next-auth/react';
import { FormattedMessage } from 'react-intl';
import { Column } from 'react-table';
import { useUserProfile } from '../user-provider';
import { BookingC } from 'models/booking';
// ==============================|| ADD NEW EMPLOYEE - MAIN ||============================== //
const validationSchema = yup.object().shape({
    first_name: yup.string().required('First name is required').matches(/^[A-Za-z]+$/, 'First Name should contain only alphabets'),
    // email: yup.string()
    //     .required('Email is required')
    //     .email('Invalid email format'),
    gender: yup.string()
        .required('Gender is required')
        .oneOf(['Male', 'Female', 'Other'], 'Invalid Gender'),
    mobile: yup.string()
        .required('Mobile is required')
        .matches(/^\d{10}$/, 'Mobile number must be 10 digits'),
});

const initialFormValues: Customer = {
    added_on: EssentialMethods.getCurrentDateTime(),
    mobile: "",
    last_name: "",
    email: "",
    first_name: "",
    gender: "Male",
    dob: "",
    username: "",
    status: "Active"
}
const allGender = ['Male', 'Female', 'Other'];

const AddCustomer = (props: any) => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState(initialFormValues)
    const { data, accessibility = true, id, handleCancel } = props
    const router = useRouter();
    useEffect(() => {
        if (props && data != undefined) {
            setFormData({ ...data })
        }
    }, [])
    const formik = useFormik({
        initialValues: formData,
        enableReinitialize: true,
        validationSchema,
        onSubmit: async (values) => {
            var response;
            if (accessibility && data) {
                response = await editCustomer(values);
            } else {
                response = await addCustomer(values);
            }
            if (response && response.data.status === 200) {
                EssentialMethods.showSnackbar(response.data.message, successColor)
                handleCancel ? handleCancel() : router.push('/apps/customers/manage-customers');
            } else {
                EssentialMethods.showSnackbar(response.data.message, errorColor)
            }
        },
    });

    const { data: session } = useSession();
    const { userData, loading } = useUserProfile();
    const getTableRows = async (tableParams: getTableRowsDataI) => {
        try {
            const { id } = router.query
            const mergedParams = { ...tableParams, ...userData, customer_id: id!.toString(), no_filter: false };
            return listBooking(mergedParams);
        } catch (error) {
            // Handle any errors that occur during the API call
            console.error('Error retrieving employee data:', error);
            return [];
        }
    }

    const updateTableRows = (customerData: Customer) => {
        return editCustomer(customerData)
    }

    const theme = useTheme();
    const columns = useMemo(
        () => [
            {
                Header: <FormattedMessage id="service" />,
                accessor: 'service',
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
                        return <Chip key={emp.mobile} color="success" label={emp.first_name} size="small" variant="light" />
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
    const paginationData = { pageIndex: 0, pageSize: 10 }
    return (
        <Page title="Add Customer">
            <MainCard>
                <form onSubmit={formik.handleSubmit}>
                    <Box>
                        <Grid container spacing={3}>
                            <Grid item xs={12} md={4}>
                                <Stack spacing={1.25}>
                                    {/* <InputLabel htmlFor="first_name">First Name</InputLabel> */}
                                    <TextField
                                        fullWidth
                                        id="first_name"
                                        placeholder="Enter First Name"
                                        value={formik.values.first_name}
                                        onChange={formik.handleChange}
                                        disabled={"accessibility" in props ? !accessibility : false}
                                        error={Boolean(formik.touched.first_name && formik.errors.first_name)}
                                        helperText={formik.touched.first_name && formik.errors.first_name}
                                    />
                                </Stack>
                            </Grid>
                            <Grid item xs={12} md={4}>
                                <Stack spacing={1.25}>
                                    {/* <InputLabel htmlFor="name">Last Name</InputLabel> */}
                                    <TextField
                                        fullWidth
                                        id="last_name"
                                        placeholder="Enter Last Name"
                                        value={formik.values.last_name}
                                        onChange={formik.handleChange}
                                        disabled={"accessibility" in props ? !accessibility : false}
                                        error={Boolean(formik.touched.last_name && formik.errors.last_name)}
                                        helperText={formik.touched.last_name && formik.errors.last_name}
                                    />
                                </Stack>
                            </Grid>
                            <Grid item xs={12} md={4}>
                                <Stack spacing={1.25}>
                                    {/* <InputLabel htmlFor="gender">Gender</InputLabel> */}
                                    <FormControl fullWidth>
                                        <Select
                                            id="gender"
                                            displayEmpty
                                            value={formik.values.gender}
                                            onChange={(event: SelectChangeEvent<string>) => formik.setFieldValue('gender', event.target.value as string)}
                                            input={<OutlinedInput id="select-column-hiding" placeholder="Sort by" />}
                                            renderValue={(selected) => {
                                                if (!selected) {
                                                    return <Typography variant="subtitle1">Select Gender</Typography>;
                                                }

                                                return <Typography variant="subtitle2">{selected}</Typography>;
                                            }}
                                        >
                                            {allGender.map((column: any) => (
                                                <MenuItem key={column} value={column}>
                                                    <ListItemText primary={column} />
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                    {formik.touched.gender && formik.errors.gender && (
                                        <FormHelperText error id="standard-weight-helper-text-email-login" sx={{ pl: 1.75 }}>
                                            {formik.errors.gender}
                                        </FormHelperText>
                                    )}
                                </Stack>
                            </Grid>
                            <Grid item xs={12} md={4}>
                                <Stack spacing={1.25}>
                                    {/* <InputLabel htmlFor="email">Email</InputLabel> */}
                                    <TextField
                                        fullWidth
                                        id="email"
                                        placeholder="Enter Email"
                                        value={formik.values.email}
                                        onChange={formik.handleChange}
                                        disabled={"accessibility" in props ? !accessibility : false}
                                        error={Boolean(formik.touched.email && formik.errors.email)}
                                        helperText={formik.touched.email && formik.errors.email}
                                    />
                                </Stack>
                            </Grid>
                            <Grid item xs={12} md={4}>
                                <Stack spacing={1.25}>
                                    {/* <InputLabel htmlFor="mobile_number">Mobile Number</InputLabel> */}
                                    <TextField
                                        fullWidth
                                        id="mobile"
                                        placeholder="Enter Mobile Number"
                                        type="number"
                                        value={formik.values.mobile}
                                        onChange={(e) => {
                                            let value = e.target.value;
                                            if (/^[0-9]*$/.test(value) && value.length <= 10) {
                                                formik.handleChange(e);
                                            }
                                        }}
                                        disabled={"accessibility" in props ? !accessibility : false}
                                        error={Boolean(formik.touched.mobile && formik.errors.mobile)}
                                        helperText={formik.touched.mobile && formik.errors.mobile}
                                    />
                                </Stack>
                            </Grid>
                            {id !== undefined ? (
                                <Grid item xs={12} md={4}>
                                    <Stack spacing={1.25}>
                                        <Select
                                            id="status"
                                            {...formik.getFieldProps('status')}
                                            disabled={!accessibility}
                                            displayEmpty
                                            defaultValue={formik.values.status}
                                        >
                                            <MenuItem value="Active">Active</MenuItem>
                                            <MenuItem value="Inactive">Inactive</MenuItem>
                                        </Select>
                                        {formik.touched.status && formik.errors.status && (
                                            <FormHelperText error id="standard-weight-helper-text-email-login">
                                                {formik.errors.status}
                                            </FormHelperText>
                                        )}
                                    </Stack>
                                </Grid>
                            ) : null}
                            <Grid item xs={12}>
                                <Stack direction="row" spacing={1} justifyContent="flex-end">
                                    <Button color="error" onClick={() => handleCancel()}>
                                        {accessibility ? 'Cancel' : 'Back'}
                                    </Button>
                                    {accessibility && (
                                        <AnimateButton>
                                            <CustomButton loading={isSubmitting} title={accessibility && id ? 'update' : 'submit'} onclick={() => formik.submitForm()} />
                                        </AnimateButton>
                                    )}
                                </Stack>
                            </Grid>
                        </Grid>
                    </Box>
                    {!accessibility && id && !loading && userData && (
                        <>
                            <Divider flexItem sx={{ borderStyle: 'solid', my: 5 }} />
                            <Typography variant='h2'>Booking Details</Typography>
                            <Box my={2}>
                                <Grid item xs={12} md={12}>
                                    <ScrollX>
                                        <CustomTable
                                            columns={columns}
                                            paginationData={paginationData}
                                            updateTableValues={updateTableRows}
                                            rowSelection={true}
                                            editable={false}
                                            getTableRows={getTableRows}
                                            filename='booking.csv'
                                            searchColumns={Object.getOwnPropertyNames(new BookingC)}
                                        />
                                    </ScrollX>
                                </Grid>
                            </Box>
                        </>
                    )}

                </form>
            </MainCard>
        </Page >
    );
}

AddCustomer.getLayout = function getLayout(page: ReactElement) {
    return <Layout>{page}</Layout>;
};

export default AddCustomer;
