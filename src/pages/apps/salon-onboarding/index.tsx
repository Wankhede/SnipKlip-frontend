import { ReactElement } from 'react';
import { getUser } from 'services/user';
import { useEffect } from 'react';
import { useRouter } from 'next/router';
// next
import NextLink from 'next/link';

// material-ui
import { Grid, Link, Stack, Typography } from '@mui/material';

// project import
import Layout from 'layout';
import Page from 'components/Page';
import AuthWrapper from 'sections/auth/AuthWrapper';
import ValidationWizard from 'pages/forms/wizard/validation-wizard';
import { useUserProfile } from '../user-provider';

// ================================|| SALON ONBOARDING ||================================ //


const SalonOnboarding = () => {
    const router = useRouter();
    const { userData, loading } = useUserProfile();
    const fetchProfileData = async () => {
        try {
            const user_detail = await getUser(userData);
            if (user_detail.data.status != 200) {
                router.push('/login');
            }
        } catch (error) {
            console.error('Error fetching profile data:', error);
        }
    };

    useEffect(() => {
        if (!loading && userData) {
            fetchProfileData();
        }
    }, [loading, userData]);

    return (
        <Page title="Salon Onboarding">
            <AuthWrapper>
                <Grid container spacing={3}>
                    <Grid item xs={12}>
                        <Stack direction="row" justifyContent="space-between" alignItems="baseline" sx={{ mb: { xs: -0.5, sm: 0.5 } }}>
                            <Typography variant="h3">Salon Onboarding</Typography>
                            <NextLink href="/login" passHref>
                                <Link variant="body1" color="primary">
                                    Already have an account?
                                </Link>
                            </NextLink>
                        </Stack>
                    </Grid>
                    <Grid item xs={12}>
                        <ValidationWizard />
                    </Grid>
                </Grid>
            </AuthWrapper>
        </Page>
    )
};

SalonOnboarding.getLayout = function getLayout(page: ReactElement) {
    return <Layout variant="blank">{page}</Layout>;
};

export default SalonOnboarding;
