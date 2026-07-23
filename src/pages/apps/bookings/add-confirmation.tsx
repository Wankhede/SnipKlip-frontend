import { useRouter } from 'next/router';
import { ReactElement, useEffect, useState } from 'react';
import { FormikProvider, useFormik } from 'formik';
import { useSession } from 'next-auth/react';
// material-ui
import { Button, Grid, InputLabel, Stack, TextField } from '@mui/material';

import MainCard from 'components/MainCard';
import Page from 'components/Page';
import Layout from 'layout';
// assets
import AnimateButton from 'components/@extended/AnimateButton';

import { addBooking, editBooking } from 'services/bookings';
import { EssentialMethods } from 'utils/essentialMethods';
import { successColor, errorColor } from 'config';
import CustomButton from 'components/custom-button';
import formatDateIST from 'utils/date-format-gmt';

// ==============================|| BOOKING - CONFIRMATION ||============================== //

const AddBookingConfirmation = (props: any) => {
    const router = useRouter();
    const { data, accessibility = true, id, title = "Add Booking" } = props
    const [isSubmitting, setIsSubmitting] = useState(false);
    const session = useSession()
    const [formData, setFormData] = useState(props.formData)

    const previousPage = () => {
        if (formik.values) {
            props.back(formik.values);
        } else {
            EssentialMethods.showSnackbar('something-went-wrong-tender-no-not-passed', errorColor)
        }
    }
    const nextPage = () => {
        if (formik.values) {
            props.next(formik.values);
        } else {
            EssentialMethods.showSnackbar('something-went-wrong-tender-no-not-passed', errorColor)
        }
    }

    useEffect(() => {
        if (props) {
            setFormData({ ...props.formData })
        }
    }, [])

    const formik = useFormik({
        initialValues: formData,
        enableReinitialize: true,
        onSubmit: async (values) => {
            let modifiedValues: any = structuredClone(values)
            if (modifiedValues.booking_date) {
                const formattedDateTime = formatDateIST(values.booking_date, 'yyyy-MM-dd HH:mm:ss')
                modifiedValues.booking_date = formattedDateTime
            }
            if (modifiedValues.start_time) {
                const formattedDateTime = formatDateIST(values.start_time, 'yyyy-MM-dd HH:mm:ss')
                modifiedValues.start_time = formattedDateTime
            }
            var response;
            if (accessibility && id) {
                values.id = id;
                response = await editBooking(values);
            } else {
                response = await addBooking(modifiedValues)
            }
            if (response && response.data.status === 200) {
                setIsSubmitting(true);
                EssentialMethods.showSnackbar(response.data.message, successColor)
                if (modifiedValues.booking_platform === "BOOK APPOINTMENT") {
                    router.push(`/apps/bookings/manage-bookings`);
                } else {
                    router.push(`/apps/invoices/edit/${response?.data.data.invoice_id}`, undefined, { shallow: true });
                }
            } else {
                EssentialMethods.showSnackbar(response.data.message, errorColor)
            }
        },
    });

    const handleFormSubmit = () => {
        formik.handleSubmit();
    };

    const handleCancel = () => {
        router.push('/apps/bookings/manage-bookings', undefined, { shallow: true });
    };

    return (
        <Page title={title}>
            <MainCard title={title}>
                <FormikProvider value={formik}>
                    <form onSubmit={formik.handleSubmit}>
                        <Grid container spacing={3}>
                            <Grid item xs={12} md={3}>
                                <Stack spacing={1}>
                                    <InputLabel htmlFor="trucker_user_id">Customer Name</InputLabel>
                                    <TextField
                                        fullWidth
                                        value={formik.values.customer_name}
                                        id="customer_name"
                                        placeholder="Please Enter Tender No"
                                        disabled={true}
                                    />
                                </Stack>
                            </Grid>
                            <Grid item xs={12} md={3}>
                                <Stack spacing={1}>
                                    <InputLabel htmlFor="trucker_user_id">Booking Type</InputLabel>
                                    <TextField
                                        fullWidth
                                        value={formik.values.booking_platform}
                                        id="booking_platform"
                                        placeholder="Please Enter Tender No"
                                        disabled={true}
                                    />
                                </Stack>
                            </Grid>
                            {
                                formik.values.booking_platform === "BOOK APPOINTMENT"
                                &&
                                <Grid item xs={12} md={3}>
                                    <Stack spacing={1}>
                                        <InputLabel htmlFor="trucker_user_id">Booking Date</InputLabel>
                                        <TextField
                                            fullWidth
                                            value={formik.values.booking_date}
                                            id="booking_date"
                                            placeholder="Please Enter Tender No"
                                            disabled={true}
                                        />
                                    </Stack>
                                </Grid>}
                            <Grid item xs={12} md={3}>
                                <Stack spacing={1}>
                                    <InputLabel htmlFor="trucker_user_id">Booking Time</InputLabel>
                                    <TextField
                                        fullWidth
                                        value={formik.values.start_time}
                                        id="start_time"
                                        placeholder="Please Enter Tender No"
                                        disabled={true}
                                    />
                                </Stack>
                            </Grid>
                            <Grid item xs={12}>
                                <Stack direction="row" spacing={1} justifyContent="flex-end">
                                    <Button color="error" onClick={() => router.back()}>
                                        {accessibility ? 'Cancel' : 'Back'}
                                    </Button>
                                    <AnimateButton>
                                        <Button variant="contained" type="button" onClick={previousPage} >
                                            Go Back - Slot Selection
                                        </Button>
                                    </AnimateButton>
                                    {accessibility && (
                                        <AnimateButton>
                                            <CustomButton
                                                loading={isSubmitting}
                                                title={accessibility && id ? 'update' : 'submit'}
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

AddBookingConfirmation.getLayout = function getLayout(page: ReactElement) {
    return <Layout>{page}</Layout>;
};

export default AddBookingConfirmation;
