import React from 'react';
import { useRouter } from 'next/router';
import { addSalon } from 'services/salon';
// material-ui
import { Button, FormHelperText, Grid, InputAdornment, InputLabel, OutlinedInput, Stack } from '@mui/material';

// third party
import * as Yup from 'yup';
import { Formik } from 'formik';

// project import
import { errorColor, successColor } from 'config';
import IconButton from 'components/@extended/IconButton';
import AnimateButton from 'components/@extended/AnimateButton';
import { strengthColor, strengthIndicator } from 'utils/password-strength';

// assets
import { EyeOutlined, EyeInvisibleOutlined } from '@ant-design/icons';

// types
import { StringColorProps } from 'types/password';
import { EssentialMethods } from 'utils/essentialMethods';

// ============================|| SALON REGISTRATION ||============================ //

const AuthRegister = () => {
    const [level, setLevel] = React.useState<StringColorProps>();
    const [showPassword, setShowPassword] = React.useState(false);
    const [confirmPassword, setConfirmPassword] = React.useState('');
    const [errorMessage, setErrorMessage] = React.useState('');

    const handleClickShowPassword = () => {
        setShowPassword(!showPassword);
    };

    const handleMouseDownPassword = (event: React.SyntheticEvent) => {
        event.preventDefault();
    };

    const changePassword = (value: string) => {
        const temp = strengthIndicator(value);
        setLevel(strengthColor(temp));
    };

    React.useEffect(() => {
        changePassword('');
    }, []);

    const router = useRouter();

    return (
        <>
            <Formik
                initialValues={{
                    name: '',
                    password: '',
                    confirmPassword: '',
                    owner_name: '',
                    owner_email: '',
                    contact_no: '',
                    submit: null
                }}
                validationSchema={Yup.object().shape({
                    name: Yup.string().max(255).required('Name is required'),
                    password: Yup.string()
                        .min(8, 'Password must be at least 8 characters')
                        .matches(
                            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/,
                            'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'
                        )
                        .required('Password is required'),
                    confirmPassword: Yup.string()
                        .oneOf([Yup.ref('password')], 'Password does not match')
                        .required('Confirm Password is required'),
                    owner_name: Yup.string().max(255, 'Owner Name must be at most 255 characters').required('Owner Name is required'),
                    owner_email: Yup.string().email('Must be a valid email').max(255).required('Owner Email is required'),
                    contact_no: Yup.string()
                        .matches(/^\d{10}$/, 'Please enter a valid 10 digit Contact Number')
                        .required('Contact Number is required')
                })}
                onSubmit={async (values, { setErrors, setSubmitting }) => {
                    try {
                        const response = await addSalon(values);
                        if (response.data.status === 200) {
                            EssentialMethods.showSnackbar(response.data.message, successColor);
                            router.push('/login');
                        } else {
                            EssentialMethods.showSnackbar(response.data.message, errorColor);
                            setErrorMessage(response.data.message);
                        }
                    } catch (error: any) {
                        console.error('Error adding salon:', error);
                        const message = error?.message || 'Unable to register salon';
                        setErrorMessage(message);
                        setErrors({ submit: message });
                    } finally {
                        setSubmitting(false);
                    }
                }}
            >
                {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values, isValid }) => (
                    <form noValidate onSubmit={handleSubmit}>
                        <Grid container spacing={3}>
                            {errorMessage && (
                                <Grid item xs={12}>
                                    <FormHelperText error>{errorMessage}</FormHelperText>
                                </Grid>
                            )}
                            <Grid item xs={12}>
                                <Stack spacing={1}>
                                    <InputLabel htmlFor="name-login">Salon Name</InputLabel>
                                    <OutlinedInput
                                        id="name-login"
                                        type="text"
                                        value={values.name}
                                        name="name"
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        placeholder="Enter your name"
                                        fullWidth
                                        error={Boolean(touched.name && errors.name)}
                                    />
                                    {touched.name && errors.name && (
                                        <FormHelperText error id="standard-weight-helper-text-name-login">
                                            {errors.name}
                                        </FormHelperText>
                                    )}
                                </Stack>
                            </Grid>
                            <Grid item xs={12}>
                                <Stack spacing={1}>
                                    <InputLabel htmlFor="owner-name-login">Owner Name</InputLabel>
                                    <OutlinedInput
                                        id="owner-name-login"
                                        type="text"
                                        value={values.owner_name}
                                        name="owner_name"
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        placeholder="Enter owner's name"
                                        fullWidth
                                        error={Boolean(touched.owner_name && errors.owner_name)}
                                    />
                                    {touched.owner_name && errors.owner_name && (
                                        <FormHelperText error id="standard-weight-helper-text-owner-name-login">
                                            {errors.owner_name}
                                        </FormHelperText>
                                    )}
                                </Stack>
                            </Grid>
                            <Grid item xs={12}>
                                <Stack spacing={1}>
                                    <InputLabel htmlFor="owner-email-login">Owner Email Address</InputLabel>
                                    <OutlinedInput
                                        id="owner-email-login"
                                        type="email"
                                        value={values.owner_email}
                                        name="owner_email"
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        placeholder="Enter owner's email address"
                                        fullWidth
                                        error={Boolean(touched.owner_email && errors.owner_email)}
                                    />
                                    {touched.owner_email && errors.owner_email && (
                                        <FormHelperText error id="standard-weight-helper-text-owner-email-login">
                                            {errors.owner_email}
                                        </FormHelperText>
                                    )}
                                </Stack>
                            </Grid>
                            <Grid item xs={12}>
                                <Stack spacing={1}>
                                    <InputLabel htmlFor="contact-no-login">Contact Number</InputLabel>
                                    <OutlinedInput
                                        id="contact-no-login"
                                        type="tel"
                                        value={values.contact_no}
                                        name="contact_no"
                                        onBlur={handleBlur}
                                        onChange={(e) => {
                                            let value = e.target.value;
                                            if (/^[0-9]*$/.test(value) && value.length <= 10) {
                                                handleChange(e);
                                            }
                                        }}
                                        placeholder="Enter contact number"
                                        fullWidth
                                        error={Boolean(touched.contact_no && errors.contact_no)}
                                    />
                                    {touched.contact_no && errors.contact_no && (
                                        <FormHelperText error id="standard-weight-helper-text-contact-no-login">
                                            {errors.contact_no}
                                        </FormHelperText>
                                    )}
                                </Stack>
                            </Grid>
                            <Grid item xs={12}>
                                <Stack spacing={1}>
                                    <InputLabel htmlFor="password-login">Password</InputLabel>
                                    <OutlinedInput
                                        fullWidth
                                        error={Boolean(touched.password && errors.password)}
                                        id="password-login"
                                        type={showPassword ? 'text' : 'password'}
                                        value={values.password}
                                        name="password"
                                        onBlur={handleBlur}
                                        onChange={(e) => {
                                            handleChange(e);
                                            changePassword(e.target.value);
                                        }}
                                        endAdornment={
                                            <InputAdornment position="end">
                                                <IconButton
                                                    aria-label="toggle password visibility"
                                                    onClick={handleClickShowPassword}
                                                    onMouseDown={handleMouseDownPassword}
                                                    edge="end"
                                                    color="secondary"
                                                >
                                                    {showPassword ? <EyeOutlined /> : <EyeInvisibleOutlined />}
                                                </IconButton>
                                            </InputAdornment>
                                        }
                                        placeholder="Enter password"
                                    />
                                    {touched.password && errors.password && (
                                        <FormHelperText error id="standard-weight-helper-text-password-login">
                                            {errors.password}
                                        </FormHelperText>
                                    )}
                                </Stack>
                            </Grid>
                            <Grid item xs={12}>
                                <Stack spacing={1}>
                                    <InputLabel htmlFor="password-confirm-login">Confirm Password</InputLabel>
                                    <OutlinedInput
                                        fullWidth
                                        error={Boolean(touched.confirmPassword && errors.confirmPassword)}
                                        id="password-confirm-login"
                                        type="password"
                                        value={confirmPassword}
                                        name="confirmPassword"
                                        onBlur={handleBlur}
                                        placeholder="Confirm password"
                                        onChange={(e) => {
                                            handleChange(e);
                                            setConfirmPassword(e.target.value);
                                        }}
                                    />
                                    {touched.confirmPassword && errors.confirmPassword && (
                                        <FormHelperText error id="standard-weight-helper-text-password-confirm-login">
                                            {errors.confirmPassword}
                                        </FormHelperText>
                                    )}
                                </Stack>
                            </Grid>
                            {errors.submit && (
                                <Grid item xs={12}>
                                    <FormHelperText error>{errors.submit}</FormHelperText>
                                </Grid>
                            )}
                            <Grid item xs={12}>
                                <AnimateButton>
                                    <Button
                                        disableElevation
                                        disabled={isSubmitting || !isValid}
                                        fullWidth
                                        size="large"
                                        type="submit"
                                        variant="contained"
                                        color="primary"
                                    >
                                        Create Account
                                    </Button>
                                </AnimateButton>
                            </Grid>
                        </Grid>
                    </form>
                )}
            </Formik>
            {/* <Divider sx={{ mt: 2 }}>
        <Typography variant="caption"> Sign up with</Typography>
      </Divider>
      {providers && (
        <Stack
          direction="row"
          spacing={matchDownSM ? 1 : 2}
          justifyContent={matchDownSM ? 'space-around' : 'space-between'}
          sx={{ mt: 9, '& .MuiButton-startIcon': { mr: matchDownSM ? 0 : 1, ml: matchDownSM ? 0 : -0.5 } }}
        >
          {Object.values(providers).map((provider: any) => {
            if (provider.id === 'login' || provider.id === 'register') {
              return;
            }
            return (
              <Box key={provider.name} sx={{ width: '100%' }}>
                {provider.id === 'google' && (
                  <Button
                    variant="outlined"
                    color="secondary"
                    fullWidth={!matchDownSM}
                    startIcon={<Image src={Google} alt="Twitter" width={16} height={16} />}
                    onClick={() => signIn(provider.id, { callbackUrl: APP_DEFAULT_PATH })}
                  >
                    {!matchDownSM && 'Google'}
                  </Button>
                )}
              </Box>
            );
          })}
        </Stack>
      )}
      {!providers && (
        <Box sx={{ mt: 3 }}>
          <FirebaseSocial />
        </Box>
      )} */}
        </>
    );
};

export default AuthRegister;
