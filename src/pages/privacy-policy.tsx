import { ReactElement } from 'react';

// // material-ui
// import { Container, Grid } from '@mui/material';
// material-ui
import { Container, Link, List, ListItem, Paper, Stack, Typography } from '@mui/material';

// project imports
import Layout from 'layout';
import Page from 'components/Page';
import BrandName from 'components/BrandName';
import { BRAND } from 'config/branding';

// ==============================|| PRIVACY POLICY - MAIN ||============================== //

const PrivacyPolicy = () => (
    <Page title="Privacy Policy">
        <Container sx={{ paddingY: '6rem' }}>
            <Typography variant="body2">
                <Stack spacing={3}>
                    {/* Title and Last Updated */}
                    <Typography variant="h1" style={{ textAlign: 'center' }}>
                        Privacy Policy
                    </Typography>
                    <Typography variant="subtitle1" style={{ textAlign: 'center', margin: 0 }}>
                        Last Updated: <Typography variant="caption">25th December, 2023</Typography>
                    </Typography>
                    {/* Introduction */}
                    <Typography variant="body1">
                        Welcome to the <BrandName /> Salon Management System. This Privacy Policy explains how we collect, use, disclose,
                        and safeguard your personal information when you access or use our website and services. By using <BrandName />, you
                        agree to the practices described in this Privacy Policy.
                    </Typography>

                    {/* Information We Collect */}
                    <Typography>
                        <Typography variant="h3">Information We Collect</Typography>
                        <Typography variant="body1">
                            We may collect personal information that you provide directly to us when you create an account, use our
                            services, or communicate with us. This information may include your name, email address, phone number, salon
                            details, and payment information.
                        </Typography>
                    </Typography>

                    {/* How We Use Your Information */}
                    <Typography>
                        <Typography variant="h3">How We Use Your Information</Typography>
                        <Typography variant="h6">
                            We may use your personal information for various purposes, including but not limited to:
                        </Typography>
                        <ul style={{ marginTop: '0.5rem', marginBottom: 0 }}>
                            <li>
                                Providing and maintaining <BrandName /> services.
                            </li>
                            <li>Processing transactions and sending transaction notifications.</li>
                            <li>Managing your account and providing customer support.</li>
                            <li>Sending you administrative and promotional emails.</li>
                            <li>Improving our services and understanding user preferences.</li>
                            <li>Analyzing usage patterns and trends.</li>
                        </ul>
                    </Typography>

                    {/* Information Sharing */}
                    <Typography>
                        <Typography variant="h3">Information Sharing</Typography>
                        <Typography variant="h6">We may share your personal information with:</Typography>
                        <ul style={{ marginTop: '0.5rem', marginBottom: 0 }}>
                            <li>
                                Service providers who assist us in operating <BrandName /> and providing our services.
                            </li>
                            <li>Business partners and affiliates to offer joint promotions or collaborations.</li>
                            <li>Law enforcement or government agencies as required by law or to protect our rights and safety.</li>
                        </ul>
                    </Typography>

                    {/* Data Security */}
                    <Typography>
                        <Typography variant="h3">Data Security</Typography>
                        <Typography variant="body1">
                            We prioritize the security of your personal information and employ industry-standard measures to protect it from
                            unauthorized access, disclosure, alteration, or destruction. However, no method of transmission over the
                            internet or electronic storage is 100% secure, and we cannot guarantee its absolute security.
                        </Typography>
                    </Typography>

                    {/* Your Choices */}
                    <Typography>
                        <Typography variant="h3">Your Choices</Typography>
                        <Typography variant="body1">
                            You can access, update, or delete certain personal information through your <BrandName /> account settings. You
                            can also opt out of promotional emails while continuing to receive account or transaction notices.
                        </Typography>
                    </Typography>

                    {/* Children's Privacy */}
                    <Typography>
                        <Typography variant="h3">Children's Privacy</Typography>
                        <Typography variant="body1">
                            <BrandName /> is not intended for use by individuals under the age of 18. We do not knowingly collect personal
                            information from children under 18. If you believe we collected a child's information, contact us at{' '}
                            <Link href={`mailto:${BRAND.SUPPORT_EMAIL}`} underline="always">
                                {BRAND.SUPPORT_EMAIL}
                            </Link>{' '}
                            so we can take appropriate action.
                        </Typography>
                    </Typography>

                    {/* Changes to this Privacy Policy */}
                    <Typography>
                        <Typography variant="h3">Changes to this Privacy Policy</Typography>
                        <Typography variant="body1">
                            We may update this Privacy Policy to reflect changes in our practices or legal requirements. We will notify you
                            of any material changes by posting the updated policy on our website and updating the "Last Updated" date.
                        </Typography>
                    </Typography>

                    {/* Contact Us */}
                    <Typography>
                        <Typography variant="h3">Contact Us</Typography>
                        <Typography variant="body1">
                            If you have questions or requests regarding this Privacy Policy or <BrandName /> privacy practices, contact us
                            at{' '}
                            <Link href={`mailto:${BRAND.SUPPORT_EMAIL}`} underline="always">
                                {BRAND.SUPPORT_EMAIL}
                            </Link>
                            .
                        </Typography>
                    </Typography>

                    {/* Closing */}
                    <Typography variant="subtitle1">
                        Thank you for trusting <BrandName /> with your salon management needs and personal information.
                    </Typography>
                </Stack>
            </Typography>
        </Container>
    </Page>
);

PrivacyPolicy.getLayout = function getLayout(page: ReactElement) {
    return <Layout variant="simple">{page}</Layout>;
};

export default PrivacyPolicy;
