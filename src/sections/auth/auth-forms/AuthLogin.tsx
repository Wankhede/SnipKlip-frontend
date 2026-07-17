import React from 'react';

import NextLink from 'next/link';
import { useSession, signIn } from 'next-auth/react';
import {
    Button,
    Checkbox,
    FormControlLabel,
    FormHelperText,
    Grid,
    Link,
    InputAdornment,
    InputLabel,
    OutlinedInput,
    Stack,
    Typography
} from '@mui/material';

// third party
import * as Yup from 'yup';
import { Formik } from 'formik';

import { APP_DEFAULT_PATH } from 'config';
import IconButton from 'components/@extended/IconButton';
import AnimateButton from 'components/@extended/AnimateButton';

// assets
import { EyeOutlined, EyeInvisibleOutlined } from '@ant-design/icons';
import _debounce from 'lodash/debounce';
import { useRouter } from 'next/router';

// ============================|| LOGIN ||============================ //

const AuthLogin = ({ csrfToken }: any) => {
    const [checked, setChecked] = React.useState(false);
    const [capsWarning, setCapsWarning] = React.useState(false);

    const { data: session } = useSession();
    const router = useRouter();
    const [showPassword, setShowPassword] = React.useState(false);
    const handleClickShowPassword = () => {
        setShowPassword(!showPassword);
    };

    const handleMouseDownPassword = (event: React.SyntheticEvent) => {
        event.preventDefault();
    };

    const onKeyDown = (keyEvent: any) => {
        if (keyEvent.getModifierState('CapsLock')) {
            setCapsWarning(true);
        } else {
            setCapsWarning(false);
        }
    };
    const handleDebouncedSubmit = _debounce((values, { setErrors, setSubmitting }) => {
        signIn('login', {
            redirect: false,
            email: values.username,
            password: values.password,
            callbackUrl: APP_DEFAULT_PATH
        }).then((res: any) => {
            if (res?.error) {
                setErrors({ submit: 'Verify Your Username & Password' });
                setSubmitting(false);
            } else {
                router.push(APP_DEFAULT_PATH);
                setSubmitting(false);
            }
        });
    }, 500);

    return (
        <>
            <Formik
                initialValues={{
                    username: '',
                    password: '',
                    submit: null
                }}
                validationSchema={Yup.object().shape({
                    username: Yup.string().required('Username is required'),
                    password: Yup.string().max(255).required('Password is required')
                })}
                onSubmit={(values, formikBag) => {
                    handleDebouncedSubmit(values, formikBag);
                }}
            >
                {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values }) => (
                    <form noValidate onSubmit={handleSubmit}>
                        <input name="csrfToken" type="hidden" defaultValue={csrfToken} />
                        <Grid container spacing={3}>
                            <Grid item xs={12}>
                                <Stack spacing={1}>
                                    <InputLabel htmlFor="email-login">Email Id</InputLabel>
                                    <OutlinedInput
                                        id="email-login"
                                        type="text"
                                        value={values.username}
                                        name="username"
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        placeholder="Enter Your Username"
                                        fullWidth
                                        error={Boolean(touched.username && errors.username)}
                                    />
                                    {touched.username && errors.username && (
                                        <FormHelperText error id="standard-weight-helper-text-email-login">
                                            {errors.username}
                                        </FormHelperText>
                                    )}
                                </Stack>
                            </Grid>
                            <Grid item xs={12}>
                                <Stack spacing={1}>
                                    <InputLabel htmlFor="password-login">Password</InputLabel>
                                    <OutlinedInput
                                        fullWidth
                                        color={capsWarning ? 'warning' : 'primary'}
                                        error={Boolean(touched.password && errors.password)}
                                        id="-password-login"
                                        type={showPassword ? 'text' : 'password'}
                                        value={values.password}
                                        name="password"
                                        onBlur={(event: React.FocusEvent<any, Element>) => {
                                            setCapsWarning(false);
                                            handleBlur(event);
                                        }}
                                        onKeyDown={onKeyDown}
                                        onChange={handleChange}
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
                                    {capsWarning && (
                                        <Typography
                                            variant="caption"
                                            sx={{ color: 'warning.main' }}
                                            id="warning-helper-text-password-login"
                                        >
                                            Caps lock on!
                                        </Typography>
                                    )}
                                    {touched.password && errors.password && (
                                        <FormHelperText error id="standard-weight-helper-text-password-login">
                                            {errors.password}
                                        </FormHelperText>
                                    )}
                                </Stack>
                            </Grid>

                            <Grid item xs={12} sx={{ mt: -1 }}>
                                <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={2}>
                                    <FormControlLabel
                                        control={
                                            <Checkbox
                                                checked={checked}
                                                onChange={(event) => setChecked(event.target.checked)}
                                                name="checked"
                                                color="primary"
                                                size="small"
                                            />
                                        }
                                        label={<Typography variant="h6">Stay logged in</Typography>}
                                    />
                                    <NextLink href={session ? '/auth/forgot-password' : '/forgot-password'} passHref>
                                        <Link variant="h6" color="text.primary">
                                            Forgot Password?
                                        </Link>
                                    </NextLink>
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
                                        disabled={isSubmitting}
                                        fullWidth
                                        size="large"
                                        type="submit"
                                        variant="contained"
                                        color="primary"
                                    >
                                        Login
                                    </Button>
                                </AnimateButton>
                            </Grid>
                        </Grid>
                    </form>
                )}
            </Formik>
            {/* <Divider sx={{ mt: 2 }}>
        <Typography variant="caption"> Login with</Typography>
      </Divider>
      {providers && (
        <Stack
          direction="row"
          spacing={matchDownSM ? 1 : 2}
          justifyContent={matchDownSM ? 'space-around' : 'space-between'}
          sx={{ mt: 3, '& .MuiButton-startIcon': { mr: matchDownSM ? 0 : 1, ml: matchDownSM ? 0 : -0.5 } }}
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
      )} */}
        </>
    );
};

export default AuthLogin;
