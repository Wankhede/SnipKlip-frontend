import { useRouter } from 'next/router';
import { ChangeEvent, ReactElement, useEffect, useState } from 'react';
import { FormikProvider, useFormik } from 'formik';
import * as yup from 'yup';
// material-ui
import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    Box,
    Button,
    Checkbox,
    FormControl,
    FormControlLabel,
    FormGroup,
    Grid,
    InputLabel,
    Paper,
    Stack,
    TextField,
    Typography,
} from '@mui/material';

import MainCard from 'components/MainCard';
import Page from 'components/Page';
import Layout from 'layout';
// assets
import AnimateButton from 'components/@extended/AnimateButton';

import { getStylistAvailability } from 'services/metadata';
import { EssentialMethods } from 'utils/essentialMethods';
import { errorColor } from 'config';
import CustomButton from 'components/custom-button';
import { useUserProfile } from '../user-provider';

// ==============================|| ADD NEW PRODUCT - MAIN ||============================== //
const validationSchema = yup.object({
    customer_name: yup.string().required('Customer Name is required'),
    booking_platform: yup.string().required('Booking type is required'),
    booking_date: yup.date().when('booking_platform', {
        is: 'WALK IN',
        then: yup.date(),
        otherwise: yup.date().required('Booking date is required'),
    }),
    start_time: yup.string().required('Booking time is required'),

});
// ==============================|| MASTER - RESOURCE - ADD NEW LSP MASTER ||============================== //
const AddBookingSlot = (props: any) => {
    const router = useRouter();
    const { data, accessibility = true, id, title = "Add Booking" } = props
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [expanded, setExpanded] = useState<string | false>('panel1');
    const [expandedS, setExpandedS] = useState<string | false>('');
    const [formData, setFormData] = useState(props.formData)
    const { userData, loading } = useUserProfile();
    const previousPage = () => {
        if (formik.values) {
            props.back(formik.values);
        } else {
            EssentialMethods.showSnackbar('something-went-data-not-passed', errorColor)
        }
    }

    const nextPage = () => {
        if (formik.values) {
            props.next(formik.values);
        } else {
            EssentialMethods.showSnackbar('something-went-data-not-passed', errorColor)
        }
    }
    const handleChangeCollapseS = (panel: string) => (event: React.SyntheticEvent, newExpanded: boolean) => {
        setExpandedS(newExpanded ? panel : '');
    };

    const handleChangeCollapse =
        (panel: string) => (event: React.SyntheticEvent, newExpanded: boolean) => {
            setExpanded(newExpanded ? panel : false);
        };

    const fetchMetadata = () => {
        try {
            const params = {
                'service': formik.values.service,
                'staff_assigned': formik.values.staff_assigned,
                'booking_date': formik.values.booking_date,
                'time_slot': formik.values.start_time,
                'invoice_id': id
            };
            const mergedParams = { ...params, ...userData };
            getStylistAvailability(mergedParams)
                .then(response => {
                    let metadata: any = response.data.staff_availability;
                    const groupedData: any = {};

                    metadata.forEach((item: any) => {
                        const name = item.name

                        if (!groupedData[name]) {
                            groupedData[name] = {};
                            item.details.forEach((detail: any) => {
                                const id = detail.id;
                                const staff = detail.staff;
                                if (!groupedData[name][staff]) {
                                    groupedData[name][staff] = [];
                                }
                                groupedData[name][staff].push({
                                    details: detail,
                                });
                            });
                        }
                    });
                    // if (formData.slot.length === 0){
                    setFormData({ ...formData, slot: groupedData });
                    // }
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
            setFormData({ ...formData });
            nextPage()
        },
    });

    const clearStatusValues = (details: any) => {
        for (const detail of details) {
            Object.keys(detail).forEach((key: string) => {
                if (detail[key].status !== 'not-available') {
                    detail[key].status = 'false';
                }
            });
        }
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
                                            Go Back - Booking Initiate
                                        </Button>
                                    </AnimateButton>
                                    {accessibility && (
                                        <AnimateButton>
                                            <CustomButton
                                                loading={isSubmitting}
                                                title={accessibility && id ? 'update' : 'next'}
                                                onclick={() => formik.submitForm()}
                                            />
                                        </AnimateButton>
                                    )}
                                </Stack>
                            </Grid>
                        </Grid>
                        <Stack spacing={3} marginBottom={5} marginTop={5}>
                            {formik.values.slot && Object.keys(formik.values.slot).map((sectionName: any, index: number) => {
                                const sectionValue = formik.values.slot[sectionName];
                                return (
                                    <Stack key={index}>
                                        <Box marginY={0.5}>
                                            <Accordion expanded={expanded === `panel${index}`} onChange={handleChangeCollapse(`panel${index}`)}>
                                                <AccordionSummary aria-controls={`panel${index}d-content`} id={`panel${index}d-header`}>
                                                    <Typography variant="h5">{sectionName} (Available Slots)</Typography>
                                                </AccordionSummary>
                                                <AccordionDetails>
                                                    <Paper elevation={2} sx={{ padding: '10px' }}>
                                                        <Grid container spacing={1}>
                                                            {sectionValue && Object.keys(sectionValue).map((staffName: string, staffIndex: number) => {
                                                                const sectionStaffValue = formik.values.slot[sectionName][staffName];
                                                                return (
                                                                    <Grid item xs={12} key={staffIndex} sx={{ padding: '10px' }}>
                                                                        <Accordion expanded={expandedS === `panel${index}-${staffIndex}`} onChange={handleChangeCollapseS(`panel${index}-${staffIndex}`)}>
                                                                            <AccordionSummary aria-controls={`panel${index}-${staffIndex}d-content`} id={`panel${index}-${staffIndex}d-header`}>
                                                                                <Typography variant="h5">{staffName}</Typography>
                                                                            </AccordionSummary>
                                                                            <AccordionDetails>
                                                                                <Grid container>
                                                                                    {sectionStaffValue && Object.keys(sectionStaffValue).map((value: any, idx: number) => {
                                                                                        const sectionStaffSlotValue = formik.values.slot[sectionName][staffName][value]['details'];
                                                                                        return (
                                                                                            <Grid item key={idx} xs={12} sm={6} md={2} >
                                                                                                <FormControl sx={{ m: 3 }} component="fieldset" variant="standard">
                                                                                                    <FormGroup>
                                                                                                        <FormControlLabel
                                                                                                            control={
                                                                                                                <Checkbox
                                                                                                                    name={sectionStaffSlotValue.time}
                                                                                                                    onChange={(e: ChangeEvent<HTMLInputElement>) => {
                                                                                                                        clearStatusValues(formik.values.slot[sectionName][staffName]);
                                                                                                                        formik.setFieldValue(
                                                                                                                            `slot[${sectionName}][${staffName}][${value}]['details']['status']`,
                                                                                                                            e.target.checked ? 'True' : 'false'
                                                                                                                        );
                                                                                                                    }}
                                                                                                                    disabled={sectionStaffSlotValue.status === 'not-available'}
                                                                                                                    value={JSON.stringify({
                                                                                                                        id: sectionStaffSlotValue.id,
                                                                                                                        time: sectionStaffSlotValue.time,
                                                                                                                        staff: sectionStaffSlotValue.staff,
                                                                                                                        status: sectionStaffSlotValue.status,
                                                                                                                    })}
                                                                                                                    checked={sectionStaffSlotValue.status === 'True'}
                                                                                                                />
                                                                                                            }
                                                                                                            label={sectionStaffSlotValue.description}
                                                                                                        />
                                                                                                    </FormGroup>
                                                                                                </FormControl>
                                                                                            </Grid>
                                                                                        )
                                                                                    })}
                                                                                </Grid>
                                                                            </AccordionDetails>
                                                                        </Accordion>
                                                                    </Grid>
                                                                );
                                                            })}
                                                        </Grid>
                                                    </Paper>
                                                </AccordionDetails>
                                            </Accordion>
                                        </Box>
                                    </Stack>
                                );
                            })}
                        </Stack >
                    </form >
                </FormikProvider >
            </MainCard >
        </Page >
    );
}

AddBookingSlot.getLayout = function getLayout(page: ReactElement) {
    return <Layout>{page}</Layout>;
};

export default AddBookingSlot;
