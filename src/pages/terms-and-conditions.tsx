import { ReactElement } from 'react';

// // material-ui
// import { Container, Grid } from '@mui/material';
// material-ui
import { Container, Stack, Typography } from '@mui/material';

// project imports
import Layout from 'layout';
import Page from 'components/Page';
import BrandName from 'components/BrandName';

// ==============================|| TERMS AND CONDITIONS - MAIN ||============================== //

const TermsAndConditions = () => (
    <Page title="Terms and Conditions">
        <Container sx={{ paddingY: '6rem' }}>
            <Typography variant="body2">
                <Stack spacing={3}>
                    {/* Title and Last Updated */}
                    <Typography variant="h1" style={{ textAlign: 'center' }}>
                        Terms and Conditions
                    </Typography>
                    <Typography variant="subtitle1" style={{ textAlign: 'center', margin: 0 }}>
                        Effective Date: <Typography variant="caption">25th December, 2023</Typography>
                    </Typography>
                    {/* Introduction */}
                    <Typography variant="body1">
                        These terms and conditions ("Agreement") govern the use of the <BrandName /> Salon Management System ("
                        <BrandName />" or "System") provided by <BrandName /> ("Provider"). By accessing or using <BrandName />, you agree
                        to comply with and be bound by these terms. If you do not agree with these terms, please refrain from using the
                        System.
                    </Typography>

                    {/* Definitions */}
                    <Typography>
                        <Typography variant="h3" gutterBottom>
                            1. Definitions
                        </Typography>
                        <Typography>
                            <strong>1.1. "User"</strong> refers to any individual or entity accessing or using <BrandName />.
                        </Typography>
                        <Typography>
                            <strong>1.2. "Salon"</strong> refers to the business or establishment utilizing <BrandName /> for salon
                            management purposes.
                        </Typography>
                    </Typography>

                    {/* User Accounts */}
                    <Typography>
                        <Typography variant="h3" gutterBottom>
                            2. User Accounts
                        </Typography>
                        <Typography>
                            <strong>2.1.</strong> To access <BrandName />, Users must create an account, providing accurate and complete
                            information.
                        </Typography>
                        <Typography>
                            <strong>2.2.</strong> Users are solely responsible for maintaining the confidentiality of their account
                            credentials and are liable for any activities that occur under their account.
                        </Typography>
                        <Typography>
                            <strong>2.3.</strong> Users must promptly inform Provider of any unauthorized use or security breaches related
                            to their account.
                        </Typography>
                    </Typography>

                    {/* System Usage */}
                    <Typography>
                        <Typography variant="h3" gutterBottom>
                            3. System Usage
                        </Typography>
                        <Typography>
                            <strong>3.1.</strong> <BrandName /> is salon management software designed to facilitate appointment scheduling,
                            employee management, inventory tracking, and customer records.
                        </Typography>
                        <Typography>
                            <strong>3.2.</strong> Users agree to use <BrandName /> in compliance with all applicable laws and regulations.
                        </Typography>
                    </Typography>

                    {/* Data and Privacy */}
                    <Typography>
                        <Typography variant="h3" gutterBottom>
                            4. Data and Privacy
                        </Typography>
                        <Typography>
                            <strong>4.1.</strong> Provider acknowledges that salon data, including customer information and business
                            operations data, will be stored on <BrandName />
                            's servers.
                        </Typography>
                        <Typography>
                            <strong>4.2.</strong> Provider will implement reasonable security measures to protect data; however, Users
                            acknowledge that no online platform is completely secure.
                        </Typography>
                        <Typography>
                            <strong>4.3.</strong> Provider will not share or sell User data to third parties for marketing purposes.
                        </Typography>
                    </Typography>
                    {/* Payment and Fees */}
                    <Typography>
                        <Typography variant="h3" gutterBottom>
                            5. Payment and Fees
                        </Typography>
                        <Typography>
                            <strong>5.1.</strong> Access to <BrandName /> may require payment of subscription fees, as outlined in the
                            pricing plan chosen by the Salon.
                        </Typography>
                        <Typography>
                            <strong>5.2.</strong> Users agree to provide accurate payment information and authorize Provider to charge the
                            specified fees.
                        </Typography>
                        <Typography>
                            <strong>5.3.</strong> Fees are non-refundable.
                        </Typography>
                    </Typography>

                    {/* Intellectual Property */}
                    <Typography>
                        <Typography variant="h3" gutterBottom>
                            6. Intellectual Property
                        </Typography>
                        <Typography>
                            <strong>6.1.</strong> <BrandName /> and all associated trademarks, copyrights, and intellectual property rights
                            are owned by Provider.
                        </Typography>
                        <Typography>
                            <strong>6.2.</strong> Users may not reproduce, modify, distribute, or create derivative works based on{' '}
                            <BrandName /> without explicit permission from Provider.
                        </Typography>
                    </Typography>

                    {/* Support and Maintenance */}
                    <Typography>
                        <Typography variant="h3" gutterBottom>
                            7. Support and Maintenance
                        </Typography>
                        <Typography>
                            <strong>7.1.</strong> Provider will offer technical support to Users for issues related to <BrandName /> usage.
                        </Typography>
                        <Typography>
                            <strong>7.2.</strong> Provider may periodically update or modify <BrandName /> to improve functionality and
                            security.
                        </Typography>
                    </Typography>

                    {/* Limitation of Liability */}
                    <Typography>
                        <Typography variant="h3" gutterBottom>
                            8. Limitation of Liability
                        </Typography>
                        <Typography>
                            <strong>8.1.</strong> Provider will not be liable for any indirect, incidental, special, or consequential
                            damages arising from the use of <BrandName />.
                        </Typography>
                        <Typography>
                            <strong>8.2.</strong> In no event shall Provider's liability exceed the amount paid by the User for{' '}
                            <BrandName /> access during the preceding three (3) months.
                        </Typography>
                    </Typography>

                    {/* Termination */}
                    <Typography>
                        <Typography variant="h3" gutterBottom>
                            9. Termination
                        </Typography>
                        <Typography>
                            <strong>9.1.</strong> Either party may terminate this Agreement for any reason upon written notice to the other
                            party.
                        </Typography>
                        <Typography>
                            <strong>9.2.</strong> Termination will result in the deactivation of the User's account and deletion of
                            associated data.
                        </Typography>
                    </Typography>

                    {/* Governing Law */}
                    <Typography>
                        <Typography variant="h3" gutterBottom>
                            10. Governing Law
                        </Typography>
                        <Typography>
                            <strong>10.1.</strong> This Agreement shall be governed by and construed in accordance with the laws of
                            Jurisdiction of Pune, without regard to its conflict of laws principles.
                        </Typography>
                    </Typography>

                    {/* Miscellaneous */}
                    <Typography>
                        <Typography variant="h3" gutterBottom>
                            11. Miscellaneous
                        </Typography>
                        <Typography>
                            <strong>11.1.</strong> This Agreement constitutes the entire agreement between the parties regarding{' '}
                            <BrandName /> and supersedes any prior agreements or understandings.
                        </Typography>
                        <Typography>
                            <strong>11.2.</strong> Any waiver of a provision of this Agreement must be in writing to be effective.
                        </Typography>
                    </Typography>

                    {/* Closing */}
                    <Typography variant="subtitle1">
                        By using <BrandName />, you acknowledge that you have read, understood, and agreed to these terms and conditions. If
                        you do not agree with these terms, please do not proceed with using the System.
                    </Typography>
                </Stack>
            </Typography>
        </Container>
    </Page>
);

TermsAndConditions.getLayout = function getLayout(page: ReactElement) {
    return <Layout variant="simple">{page}</Layout>;
};

export default TermsAndConditions;
