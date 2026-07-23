import { useState, ReactNode } from 'react';

// material-ui
import { Button, Step, Stepper, StepLabel, Stack, Typography } from '@mui/material';
import { errorColor, successColor } from 'config';
// project imports
import BasicForm, { BasicData } from './BasicForm';
import SalonForm, { SalonData } from './SalonForm';
import Review from './Review';
import MainCard from 'components/MainCard';
import AnimateButton from 'components/@extended/AnimateButton';
import { EssentialMethods } from 'utils/essentialMethods';
import { addBranch } from 'services/salon';
import { useRouter } from 'next/router';
import { signOut } from 'next-auth/react';
// step options
const steps = ['Basic Details', 'Salon Details', 'Preview details'];

const getStepContent = (
    step: number,
    handleNext: () => void,
    handleBack: () => void,
    setErrorIndex: (i: number | null) => void,
    basicData: BasicData,
    setBasicData: (d: BasicData) => void,
    salonData: SalonData,
    setSalonData: (d: SalonData) => void
) => {
    switch (step) {
        case 0:
            return (
                <BasicForm handleNext={handleNext} setErrorIndex={setErrorIndex} basicData={basicData} setBasicData={setBasicData} />
            );
        case 1:
            return (
                <SalonForm
                    handleNext={handleNext}
                    handleBack={handleBack}
                    setErrorIndex={setErrorIndex}
                    salonData={salonData}
                    setSalonData={setSalonData}
                />
            );
        case 2:
            return <Review basicData={basicData} salonData={salonData} />;
        default:
            throw new Error('Unknown step');
    }
};

// ==============================|| FORMS WIZARD - VALIDATION ||============================== //

const ValidationWizard = () => {
    const [activeStep, setActiveStep] = useState(0);
    const [basicData, setBasicData] = useState({});
    const [salonData, setSalonData] = useState({});
    const [errorIndex, setErrorIndex] = useState<number | null>(null);
    const [username, setUsername] = useState(null);
    const handleNext = () => {
        if (activeStep === steps.length - 1) {
            onboardSalon();
        } else {
            setActiveStep(activeStep + 1);
            setErrorIndex(null);
        }
    };

    const handleBack = () => {
        setActiveStep(activeStep - 1);
    };

    const router = useRouter();
    const handleLogout = () => {
        signOut({ redirect: false });
        router.push({
            pathname: '/login',
            query: {}
        });
    };

    const onboardSalon = async () => {
        try {
            // Send the form data to the backend
            const response = await addBranch(basicData, salonData)
            if (response.status === 200) {
                localStorage.setItem('branch_id', response.data.data.branch_id);
                EssentialMethods.showSnackbar(response.data.message, successColor);
                window.location.reload();
                router.push('/');
            } else {
                EssentialMethods.showSnackbar(response.data.message, errorColor)
                setErrorIndex(activeStep);
            }
        } catch (error) {
            console.error('An error occurred', error);
        }
    };
    return (
        <MainCard title="Form">
            <Stepper activeStep={activeStep} sx={{ pt: 3, pb: 5 }}>
                {steps.map((label, index) => {
                    const labelProps: { error?: boolean; optional?: ReactNode } = {};

                    if (index === errorIndex) {
                        labelProps.optional = (
                            <Typography variant="caption" color="error">
                                Error
                            </Typography>
                        );

                        labelProps.error = true;
                    }

                    return (
                        <Step key={label}>
                            <StepLabel {...labelProps}>{label}</StepLabel>
                        </Step>
                    );
                })}
            </Stepper>
            <>
                {activeStep === steps.length ? (
                    <>
                        <Typography variant="h5" gutterBottom>
                            Congratulations! Your salon account has been successfully created.
                            Login in with Username ({username}) and Password.
                        </Typography>
                        <Typography variant="subtitle1">
                            We appreciate your interest in our services. Your account is now active and you can start managing your salon with us. If you have any questions or need assistance, feel free to contact our support team.
                        </Typography>
                        <Stack direction="row" justifyContent="flex-end">
                            <AnimateButton>
                                <Button
                                    variant="contained"
                                    color="error"
                                    href="/login"
                                    sx={{ my: 3, ml: 1 }}
                                >
                                    Login
                                </Button>
                            </AnimateButton>
                        </Stack>
                    </>
                ) : (
                    <>
                        {getStepContent(activeStep, handleNext, handleBack, setErrorIndex, basicData, setBasicData, salonData, setSalonData)}
                        {activeStep === steps.length - 1 && (
                            <Stack direction="row" justifyContent={activeStep !== 0 ? 'space-between' : 'flex-end'}>
                                {activeStep !== 0 && (
                                    <Button onClick={handleBack} sx={{ my: 3, ml: 1 }}>
                                        Back
                                    </Button>
                                )}
                                <AnimateButton>
                                    <Button variant="contained" onClick={handleNext} sx={{ my: 3, ml: 1 }}>
                                        {activeStep === steps.length - 1 ? 'Submit' : 'Next'}
                                    </Button>
                                </AnimateButton>
                            </Stack>
                        )}
                    </>
                )}
            </>
        </MainCard>
    );
};

export default ValidationWizard;
