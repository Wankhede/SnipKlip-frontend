import { ReactElement } from 'react';

// material-ui
import { Grid, Link, Stack, Typography } from '@mui/material';

// project import
import Layout from 'layout';
import Page from 'components/Page';
import AuthWrapper from 'sections/auth/AuthWrapper';
import AuthRegister from 'sections/auth/auth-forms/AuthRegister';

// ================================|| REGISTER ||================================ //

const Register = () => (
    <Page title="Register">
        <AuthWrapper>
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <Stack direction="row" justifyContent="space-between" alignItems="baseline" sx={{ mb: { xs: -0.5, sm: 0.5 } }}>
                        <Typography variant="h3">Register Your Salon</Typography>
                    </Stack>
                </Grid>
                <Grid item xs={12}>
                    <AuthRegister />
                </Grid>
            </Grid>
            <Stack direction="row" alignItems="center" spacing={1}>
                <Typography variant="body1">Already have an account?</Typography>
                <Link href="/login" variant="body1" color="primary" underline="hover">
                    Login
                </Link>
            </Stack>
        </AuthWrapper>
    </Page>
);

Register.getLayout = function getLayout(page: ReactElement) {
    return <Layout variant="auth">{page}</Layout>;
};

export default Register;
