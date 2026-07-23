import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
// material-ui
import { useTheme } from '@mui/material/styles';
import { Button, Grid, Stack, Typography, TextField, Alert } from '@mui/material';
import { SendEmail } from 'services/forget-password';
// third-party
import OtpInput from 'react18-input-otp';

// project import
import AnimateButton from 'components/@extended/AnimateButton';
import { BRAND } from 'config/branding';

// ============================|| STATIC - CODE VERIFICATION ||============================ //

const AuthCodeVerification = () => {
    const theme = useTheme();
    const [otp_num, setOtp] = useState<string>();
    const [password, setPassword] = useState('');
    const [confirm_password, setConfirmPassword] = useState('');

    const [alertType, setAlertType] = useState('');
    const [responseStatus, setResponseStatus] = useState<string>(''); // Track response status
    const [showAlert, setShowAlert] = useState<boolean>(false);

    const router = useRouter();
    const { email } = router.query;

    const sendOtpToBackend = async () => {
        try {
            const response = await SendEmail(email, otp_num, password, confirm_password);
            setShowAlert(true); // Show the alert
            setResponseStatus(response.data.message);
            if (response.data.status === 200) {
                router.push('/login');
                setAlertType('success');
            } else {
                setAlertType('danger');
            }
            console.log(response.data); // Handle the response from the backend
        } catch (error) {
            setShowAlert(true);
            setResponseStatus('Please Enter OTP or Try Again...!'); // Reset response status
            setAlertType('danger');
            console.error('Error sending data:', error);
        }
    };

    const handleContinueClick = () => {
        sendOtpToBackend();
    };

    const borderColor = theme.palette.mode === 'dark' ? theme.palette.grey[200] : theme.palette.grey[300];

    // Extract the first part of the email (visible characters)
    const visibleEmailPart = email ? email.slice(0, 4) : '';

    // Calculate the number of asterisks needed based on the length of the hidden part
    const numAsterisks = email ? email.length - visibleEmailPart.length - 6 : 0; // Subtract 6 for the '*****' and '@gmail.com'

    // Generate a string of asterisks
    const asterisks = '*'.repeat(numAsterisks);

    // Extract the last part of the email (after '@' symbol)
    const domainPart = email ? email.slice(email.indexOf('@')) : '';

    // Combine the visible part, asterisks, and domain to form the masked email
    const maskedEmail = visibleEmailPart + asterisks + domainPart;

    useEffect(() => {
        // Use useEffect to set a timeout for hiding the alert
        if (showAlert) {
            const timeout = setTimeout(() => {
                setShowAlert(false); // Hide the alert after 3 seconds
            }, 3000);

            // Clear the timeout when the component unmounts or showAlert state changes
            return () => clearTimeout(timeout);
        }
    }, [showAlert]);

    return (
        <Grid container spacing={3}>
            <Grid item xs={12}>
                {showAlert && <Alert severity={alertType === 'success' ? 'success' : 'error'}>{responseStatus}</Alert>}

                <Grid item xs={12} sx={{ paddingBottom: '15px', paddingTop: '10px' }}>
                    <Typography>We`ve send you code on {maskedEmail}</Typography>
                </Grid>

                <TextField
                    label="Password"
                    fullWidth
                    variant="outlined"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
            </Grid>
            <Grid item xs={12}>
                <TextField
                    label="Confirm Password"
                    fullWidth
                    variant="outlined"
                    type="password"
                    value={confirm_password}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                />
            </Grid>

            <Grid item xs={12}>
                <OtpInput
                    value={otp_num}
                    onChange={(newOtp: string) => setOtp(newOtp)}
                    numInputs={4}
                    containerStyle={{ justifyContent: 'space-between' }}
                    inputStyle={{
                        width: '100%',
                        margin: '8px',
                        padding: '10px',
                        border: `1px solid ${borderColor}`,
                        borderRadius: 4,
                        ':hover': {
                            borderColor: theme.palette.primary.main
                        }
                    }}
                    focusStyle={{
                        outline: 'none',
                        boxShadow: theme.customShadows.primary,
                        border: `1px solid ${theme.palette.primary.main}`
                    }}
                />
            </Grid>
            <Grid item xs={12}>
                <AnimateButton>
                    <Button onClick={handleContinueClick} disableElevation fullWidth size="large" type="submit" variant="contained">
                        Continue
                    </Button>
                </AnimateButton>
            </Grid>
            <Grid item xs={12}>
                <Stack direction="row" justifyContent="space-between" alignItems="baseline">
                    <Typography>Did not receive the email? Check your spam filter or contact the {BRAND.COMPANY_NAME} team.</Typography>
                    {/* <Typography variant="body1" sx={{ minWidth: 85, ml: 2, textDecoration: 'none', cursor: 'pointer' }} color="primary">
            Resend code
          </Typography> */}
                </Stack>
            </Grid>
        </Grid>
    );
};

export default AuthCodeVerification;
