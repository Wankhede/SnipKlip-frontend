import Layout from 'layout';
import { ReactElement, useEffect, useState } from 'react';

// material-ui
import { Button } from '@mui/material';

import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import Typography from '@mui/material/Typography';
import { Booking } from 'types/bookings';
import AddBooking from './add-booking-initate';
import AddBookingSlot from './add-slot';
import AddBookingConfirmation from './add-confirmation';

export const initialFormValues: Booking = {
    customer_name: "",
    customer_id: 0,
    email: "",
    booking_date: String(new Date()),
    start_time: '09:00 AM - 12:00 Noon',
    booking_platform: "BOOK APPOINTMENT",
    isPaid: true,
    service: [],
    staff_assigned: [],
    slot: [],
    invoice_id: 0,
}

const AddBookingPlan = (props: any) => {
    const steps = ['New Booking Initiate', 'Slot Selection', 'Review & Confirmation'];
    const [activeStep, setActiveStep] = useState(0);
    const [formData, setFormData] = useState(initialFormValues)
    const [loading, setLoading] = useState(true);
    const [bookingNo, setBookingNo] = useState('');
    function forcePageChange(formData?: Booking) {
        if (formData) {
            setFormData(formData);
        }
        else {
            setFormData(initialFormValues);
        }
        setActiveStep(activeStep + 1);
    }

    function _handleBack(formData?: Booking) {
        if (formData) {
            setFormData(formData);
        }
        else {
            setFormData(initialFormValues);
        }
        setActiveStep(activeStep - 1);
    }

    useEffect(() => {
        if (props.data) {
            setFormData({ ...props.data })
            setLoading(false);
            setBookingNo(props.data.id);
            setActiveStep(0);
        }
    }, [])

    function _renderStepContent(step: number) {
        switch (step) {
            case 0:
                if (props.data) {
                    return <AddBooking next={forcePageChange} id={bookingNo} formData={props.data} />;
                } else {
                    return <AddBooking next={forcePageChange} id={bookingNo} formData={formData} />;
                }
            case 1:
                return <AddBookingSlot next={forcePageChange} back={_handleBack} id={bookingNo} formData={formData} />;
            case 2:
                return <AddBookingConfirmation back={_handleBack} id={bookingNo} formData={formData} />;
            default:
                return <div>Not Found</div>;
        }
    }

    const handleReset = () => {
        setActiveStep(0);
    };

    return (
        <>
            <Stepper activeStep={activeStep}>
                {steps.map(label => (
                    <Step key={label} >
                        <StepLabel>{label}</StepLabel>
                    </Step>
                ))}
            </Stepper>
            <>
                {activeStep === steps.length ? (
                    <>
                        <Typography sx={{ mt: 2, mb: 1 }}>
                            All steps completed - you&apos;re finished
                        </Typography>
                        <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
                            <Box sx={{ flex: '1 1 auto' }} />
                            <Button onClick={handleReset}>Reset</Button>
                        </Box>
                    </>
                ) : (
                    props.editingForm && loading ?
                        null :
                        <Box my={3}>
                            {_renderStepContent(activeStep)}
                        </Box>
                )}

            </>
        </>
    );
};

AddBookingPlan.getLayout = function getLayout(page: ReactElement) {
    return <Layout>{page}</Layout>;
};

export default AddBookingPlan;