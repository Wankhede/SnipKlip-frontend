
import { useRouter } from 'next/router';
import { ReactElement, useEffect, useState } from 'react';
import { FormikProvider, useFormik } from 'formik';
import * as yup from 'yup';
import { isToday, addDays } from 'date-fns';
// material-ui
import {
    Autocomplete,
    Button,
    Dialog,
    FormControl,
    FormHelperText,
    Grid,
    InputLabel,
    Link,
    MenuItem,
    Select,
    Stack,
    TextField,
    Typography,
} from '@mui/material';

import MainCard from 'components/MainCard';
import Page from 'components/Page';
import Layout from 'layout';
// assets
import AnimateButton from 'components/@extended/AnimateButton';
import { PopupTransition } from 'components/@extended/Transitions';
import { getCustomers, getStaff, getServices } from 'services/metadata';
import { MetaDataTypeI } from 'types/common';
import { EssentialMethods } from 'utils/essentialMethods';
import { DesktopDatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { errorColor } from 'config';
import AddCustomer from '../customers/add-customer';
import CustomButton from 'components/custom-button';
import formatDate from 'utils/date-format';
import { useUserProfile } from '../user-provider';
import { Booking } from 'types/bookings';
import { FormattedMessage } from 'react-intl';

// ==============================|| BOOKING - ADD ||============================== //

const validationSchema = yup.object({
    customer_name: yup.string().required('Customer Name is required'),
    booking_platform: yup.string().required('Booking type is required'),
    booking_date: yup.date().when('booking_platform', {
        is: 'WALK IN',
        then: yup.date().nullable(),
        otherwise: yup.date()
            .required('Booking date is required')
    }),
    start_time: yup.string().required('Booking time is required'),

});
// ==============================|| MASTER - RESOURCE - ADD NEW LSP MASTER ||============================== //
interface BookingProps {
    accessibility?: boolean;
    id: any;
    title?: string;
    formData: Booking;
    next: (arg0: Booking) => void;
}

const AddBooking = (props: BookingProps) => {
    const router = useRouter();
    const { accessibility = true, id, title = "Add Booking" } = props
    const [customers, setCustomers] = useState<MetaDataTypeI[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [staff, setStaff] = useState<MetaDataTypeI[]>([]);
    const [services, setServices] = useState<MetaDataTypeI[]>([]);
    const [add, setAdd] = useState<boolean>(false);
    const [customer, setCustomer] = useState(null);
    const [formData, setFormData] = useState(props.formData)
    const { userData, loading } = useUserProfile();
    const nextPage = (values: Booking) => {
        if (values) {
            props.next(values);
        } else {
            EssentialMethods.showSnackbar('something-went-wrong-tender-no-not-passed', errorColor)
        }
    }

    const handleAddCustomer = () => {
        setAdd(!add);
        if (customer && !add) setCustomer(null);
    };

    const onComplete = async () => {
        getCustomers(await userData)
            .then(response => {
                let metadata: MetaDataTypeI[] = response.data.data.rows.map((item: any) => {
                    return {
                        element: item.customer_name,
                        id: item.id
                    };
                });
                setCustomers(metadata);
            })
            .catch(error => console.log(error))
    }

    const fetchMetadata = () => {
        console.log(userData);
        try {
            getCustomers({ ...userData, status: 'Active' })
                .then(response => {
                    let metadata: MetaDataTypeI[] = response.data.data.rows.map((item: any) => {
                        return {
                            element: item.customer_name,
                            id: item.customer_id
                        };
                    });
                    setCustomers(metadata);
                })
                .catch(error => console.log(error))

            getStaff({ ...userData, status: 'Active' })
                .then(response => {
                    let metadata: MetaDataTypeI[] = response.data.data.rows[0].staff_assigned.map((item: any) => {
                        return {
                            element: item.first_name + ' ' + item.last_name,
                            id: item.id
                        };
                    });
                    setStaff(metadata);
                })
                .catch(error => console.log(error))

            getServices({ ...userData, status: 'Active' })
                .then(response => {
                    let metadata: any = response.data.data.rows[0].service.map((item: any) => {
                        return {
                            element: item.name,
                            id: item.id
                        };
                    });
                    setServices(metadata);
                })
                .catch(error => console.log(error));

        } catch (error) {
            console.error('Error retrieving metadata:', error);
        }
    };
    useEffect(() => {
        if (!loading && userData) {
            fetchMetadata();
        }
    }, [loading, userData, router]);


    const formik = useFormik({
        initialValues: formData,
        enableReinitialize: true,
        validationSchema,
        onSubmit: async (values) => {
            let modifiedValues: any = structuredClone(values)
            if (modifiedValues.booking_date) {
                const formattedDateTime = formatDate(modifiedValues.booking_date, 'MMM dd, yyyy')
                modifiedValues.booking_date = formattedDateTime
            }
            console.log(modifiedValues);
            nextPage(modifiedValues);
        },
    });

    const handleFormSubmit = () => {
        formik.handleSubmit();
    };

    const current_time = new Date()
    const booking_date = new Date(formik.values.booking_date);
    const is_Today = booking_date.toDateString() === current_time.toDateString();

    return (
        <Page title={title}>
            <MainCard title={title}>
                <FormikProvider value={formik}>
                    <form onSubmit={formik.handleSubmit}>
                        <Grid container spacing={3}>
                            <Grid item xs={12} md={3}>
                                <Stack spacing={1}>
                                    <InputLabel htmlFor="customer_name">Customer Name<span style={{ color: 'red' }}>*</span></InputLabel>
                                    <FormControl sx={{ m: 1, minWidth: 120 }}>
                                        <Autocomplete
                                            id="customer_name"
                                            value={formik.values.customer_name}
                                            onChange={(event: any, newValue: any | null) => {
                                                if (newValue) {
                                                    const selectedCustomer = customers.find(
                                                        (customer: any) => customer.element === newValue
                                                    );
                                                    formik.setFieldValue('customer_name', newValue);
                                                    formik.setFieldValue('customer_id', selectedCustomer ? selectedCustomer.id : '');
                                                } else {
                                                    formik.setFieldValue('customer_name', '');
                                                    formik.setFieldValue('customer_id', '');
                                                }
                                            }}
                                            options={customers.map((item: any) => item.element)}
                                            renderOption={(props, option) => (
                                                <li {...props} key={option}>
                                                    {option}
                                                </li>
                                            )}
                                            getOptionLabel={(option) => option || ''}
                                            disabled={!accessibility}
                                            renderInput={(params) => (
                                                <TextField {...params} placeholder="Please Select Customer Name" />
                                            )}
                                        />

                                        {formik.touched.customer_name && formik.errors.customer_name && (
                                            <FormHelperText error id="standard-weight-helper-text-email-login">
                                                <FormattedMessage id={formik.errors.customer_name} />
                                            </FormHelperText>
                                        )}

                                        {accessibility && (
                                            <Button variant="contained" onClick={handleAddCustomer} sx={{ mt: 1 }}>
                                                Add New Customer
                                            </Button>
                                        )}
                                        <Dialog
                                            maxWidth="sm"
                                            TransitionComponent={PopupTransition}
                                            keepMounted
                                            fullWidth
                                            onClose={handleAddCustomer}
                                            open={add}
                                            sx={{ '& .MuiDialog-paper': { p: 0 }, transition: 'transform 225ms' }}
                                            aria-describedby="alert-dialog-slide-description"
                                        >
                                            <AddCustomer customer={customer} handleCancel={handleAddCustomer} accessibility={true} onComplete={onComplete} />
                                        </Dialog>
                                    </FormControl>
                                </Stack>
                            </Grid>
                            <Grid item xs={12} md={3}>
                                <Stack spacing={1}>
                                    <InputLabel htmlFor="name">Booking Type<span style={{ color: 'red' }}>*</span>
                                    </InputLabel>
                                    <FormControl sx={{ m: 1, minWidth: 120 }}>
                                        <Select id="booking_platform" {...formik.getFieldProps('booking_platform')} disabled={!accessibility} displayEmpty defaultValue="Active">
                                            <MenuItem value="BOOK APPOINTMENT">Book Appointment</MenuItem>
                                            <MenuItem
                                                value="WALK IN"
                                                onClick={() => {
                                                    // Get the current date
                                                    const today = new Date();
                                                    const formattedDate = today.toISOString().split('T')[0];

                                                    // Set the booking_date field in Formik to the current date
                                                    formik.setFieldValue('booking_date', formattedDate);
                                                }}
                                            >
                                                Walk-In
                                            </MenuItem>
                                        </Select>
                                        {formik.touched.booking_platform && formik.errors.booking_platform && (
                                            <FormHelperText error id="standard-weight-helper-text-email-login">
                                                {formik.errors.booking_platform}
                                            </FormHelperText>
                                        )}
                                    </FormControl>
                                </Stack>
                            </Grid>
                            {
                                formik.values.booking_platform === "BOOK APPOINTMENT"
                                &&
                                <Grid item xs={12} md={3}>
                                    <Stack spacing={1}>
                                        <InputLabel htmlFor="name">Booking Date<span style={{ color: 'red' }}>*</span>
                                        </InputLabel>
                                        <LocalizationProvider dateAdapter={AdapterDateFns}>
                                            <Stack spacing={3}>
                                                <DesktopDatePicker
                                                    inputFormat="yyyy-MM-dd"
                                                    value={formik.values.booking_date}
                                                    onChange={(booking_date: any) => {
                                                        formik.setFieldValue('booking_date', booking_date);
                                                    }}
                                                    renderInput={(props) => (
                                                        <TextField
                                                            name="booking_date"
                                                            fullWidth
                                                            {...props}
                                                            placeholder="Valid From"
                                                            error={formik.touched.booking_date && Boolean(formik.errors.booking_date)}
                                                            helperText={formik.touched.booking_date && formik.errors.booking_date}
                                                        />
                                                    )}
                                                    minDate={id ? undefined : isToday(new Date()) ? new Date() : addDays(new Date(), 1)}
                                                    maxDate={undefined} // No maximum date restriction
                                                />
                                            </Stack>
                                        </LocalizationProvider>
                                    </Stack>
                                </Grid>}
                            <Grid item xs={12} md={3}>
                                <Stack spacing={1}>
                                    <InputLabel htmlFor="name">Booking Time<span style={{ color: 'red' }}>*</span>
                                    </InputLabel>
                                    <Select id="start_time" {...formik.getFieldProps('start_time')} disabled={!accessibility} displayEmpty>

                                        {current_time.getHours() >= 12 && is_Today ? null : (
                                            <MenuItem value="07:00 AM - 12:00 Noon">Morning (07:00 AM - 12:00 Noon)</MenuItem>
                                        )}
                                        {current_time.getHours() >= 18 && is_Today ? null : (
                                            <MenuItem value="12:00 Noon - 18:00 PM">Afternoon (12:00 Noon - 18:00 PM)</MenuItem>
                                        )}
                                        {current_time.getHours() >= 23 && is_Today ? null : (
                                            <MenuItem value="18:00 PM - 23:00 PM">Evening (18:00 PM - 11:00 PM)</MenuItem>
                                        )}
                                        <MenuItem value="23:00 PM - 07:00 AM">Others (11:00 PM - 07:00 AM)</MenuItem>
                                    </Select>
                                    {formik.touched.start_time && formik.errors.start_time && (
                                        <FormHelperText error id="standard-weight-helper-text-email-login">
                                            {formik.errors.start_time}
                                        </FormHelperText>
                                    )}
                                </Stack>
                            </Grid>
                            <Grid item xs={12} md={4}>
                                <Stack spacing={1}>
                                    <InputLabel htmlFor="name">Staff<span style={{ color: 'red' }}>*</span>
                                    </InputLabel>
                                    <Autocomplete
                                        id="staff_assigned"
                                        multiple={true}
                                        value={formik.values.staff_assigned}
                                        onChange={
                                            (event: any, newValue: any | null) =>
                                                formik.setFieldValue('staff_assigned', newValue)
                                        }
                                        options={staff.map((item) => ({ attribute_id: item.id!, attribute_name: item.element }))}
                                        renderOption={(props, option) => <li {...props} key={option.attribute_id}>{option.attribute_name}</li>}
                                        getOptionLabel={(option) => (option.attribute_name)}
                                        isOptionEqualToValue={(option, value) => value?.attribute_id === undefined || option?.attribute_id === value?.attribute_id}
                                        disabled={"accessibility" in props ? !accessibility : false}
                                        renderInput={(params) => (
                                            <TextField
                                                {...params}
                                                placeholder="Please Select Stylist"
                                            />
                                        )}
                                    />
                                    <Typography variant="body2" component="div" sx={{ mt: 1 }}>
                                        <Link
                                            component="button"
                                            onClick={() => {
                                                router.push('/apps/employees/add-employees');
                                            }}
                                            underline="hover"
                                            sx={{ cursor: 'pointer' }}
                                        >
                                            Click here to add staff
                                        </Link>
                                    </Typography>
                                </Stack>
                            </Grid>
                            <Grid item xs={12} md={4}>
                                <Stack spacing={1}>
                                    <InputLabel htmlFor="name">Services<span style={{ color: 'red' }}>*</span>
                                    </InputLabel>
                                    <Autocomplete
                                        id="service"
                                        multiple={true}
                                        value={formik.values.service}
                                        onChange={
                                            (event: any, newValue: any | null) => {
                                                formik.setFieldValue('service', newValue)
                                            }
                                        }
                                        options={services.map((item) => ({ attribute_id: item.id!, attribute_name: item.element }))}
                                        renderOption={(props, option) => <li {...props} key={option.attribute_id}>{option.attribute_name}</li>}
                                        getOptionLabel={(option) => (option.attribute_name)}
                                        isOptionEqualToValue={(option, value) => value?.attribute_id === undefined || option?.attribute_id === value?.attribute_id}
                                        disabled={"accessibility" in props ? !accessibility : false}
                                        renderInput={(params) => (
                                            <TextField
                                                {...params}
                                                placeholder="Please Select Services"
                                            />
                                        )}
                                    />
                                    <Typography variant="body2" component="div" sx={{ mt: 1 }}>
                                        <Link
                                            component="button"
                                            onClick={() => {
                                                router.push('/apps/services/add-service');
                                            }}
                                            underline="hover"
                                            sx={{ cursor: 'pointer' }}
                                        >
                                            Click here to add service
                                        </Link>
                                    </Typography>
                                </Stack>
                            </Grid>
                            <Grid item xs={12}>
                                <Stack direction="row" spacing={1} justifyContent="flex-end">
                                    <Button color="error" onClick={() => router.back()}>
                                        {accessibility ? 'Cancel' : 'Back'}
                                    </Button>
                                    {accessibility && (
                                        <AnimateButton>
                                            <CustomButton
                                                loading={isSubmitting}
                                                title={accessibility && id ? 'update' : 'next'}
                                                onclick={handleFormSubmit}
                                            />
                                        </AnimateButton>
                                    )}
                                </Stack>
                            </Grid>
                        </Grid>
                    </form>
                </FormikProvider>
            </MainCard>
        </Page >
    );
}

AddBooking.getLayout = function getLayout(page: ReactElement) {
    return <Layout>{page}</Layout>;
};

export default AddBooking;
