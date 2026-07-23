import { ReactElement } from 'react';

// // material-ui
// import { Container, Grid } from '@mui/material';
// material-ui
import { Container, Link, Stack, Typography } from '@mui/material';

// project imports
import Layout from 'layout';
import Page from 'components/Page';
import MainCard from 'components/MainCard';
import BrandName from 'components/BrandName';
import { BRAND } from 'config/branding';

// ==============================|| ABOUT US - MAIN ||============================== //

const AboutUs = () => (
    <Page title="About Us">
        <Container sx={{ paddingY: '6rem' }}>
            <Typography variant="body2">
                <Stack spacing={3}>
                    {/* About Us */}
                    {/* <MainCard title="About Us"> */}
                    <Typography variant="h1" style={{ textAlign: 'center' }}>
                        About Us
                    </Typography>
                    <Typography variant="body1">
                        Welcome to <BrandName />! We are dedicated to improving the way salons manage their operations and serve their
                        clients. With a passion for technology and a deep understanding of the salon industry, we have developed an
                        innovative solution that empowers salon owners, managers, and staff to streamline their daily tasks, enhance
                        customer experiences, and boost overall efficiency.
                    </Typography>
                    {/* </MainCard> */}
                    {/* Our Vision */}
                    <Typography variant="h1" style={{ textAlign: 'center' }}>
                        Our Vision
                    </Typography>
                    <Typography variant="body1">
                        Our vision is to create a seamless and intuitive salon management platform that becomes an essential part of every
                        salon's success story. We envision a future where salon owners can focus on delivering exceptional services while
                        our software handles the administrative burden, ultimately leading to thriving businesses and delighted customers.
                    </Typography>
                    {/* Our Mission */}
                    <Typography variant="h1" style={{ textAlign: 'center' }}>
                        Our Mission
                    </Typography>
                    <Typography variant="body1">
                        Our mission is to provide salon professionals with a comprehensive tool that simplifies the complexities of salon
                        management. We are committed to developing user-friendly features that optimize appointment scheduling, inventory
                        tracking, employee management, and customer engagement. By doing so, we aim to contribute to the growth of the salon
                        industry by enabling salons to operate more efficiently and effectively.
                    </Typography>

                    {/* Why choose SnipKlip */}
                    <Typography variant="h1" style={{ textAlign: 'center' }}>
                        Why Choose <BrandName />?
                    </Typography>
                    <Typography variant="body1">
                        <Stack spacing={1}>
                            <div>
                                <Typography variant="h5">Tailored to Salons:</Typography>
                                <Typography variant="body1">
                                    <BrandName /> is designed specifically for the unique needs of salons. We understand the challenges you
                                    face, and our software is crafted to address them seamlessly.
                                </Typography>
                            </div>
                            <div>
                                <Typography variant="h5">User-Friendly Interface: </Typography>
                                <Typography variant="body1">
                                    We believe that technology should be accessible to everyone. That's why we've created an intuitive
                                    interface that is easy to navigate, even for users who may not be tech-savvy.
                                </Typography>
                            </div>
                            <div>
                                <Typography variant="h5">Efficiency Boost:</Typography>
                                <Typography variant="body1">
                                    <BrandName /> is built to save time and energy. Our features automate tasks, reduce manual effort, and
                                    optimize your operations.
                                </Typography>
                            </div>
                            <div>
                                <Typography variant="h5">Customer-Centric Approach:</Typography>
                                <Typography variant="body1">
                                    We understand that customer satisfaction is paramount for your business. <BrandName /> helps you provide
                                    exceptional customer experiences by keeping track of client preferences, history, and more.
                                </Typography>
                            </div>
                            <div>
                                <Typography variant="h5">Data Security:</Typography>
                                <Typography variant="body1">
                                    We take the security of your data seriously. <BrandName /> employs industry-standard security measures
                                    to ensure that your sensitive information remains safe and confidential.
                                </Typography>
                            </div>
                            <div>
                                <Typography variant="h5">Continuous Innovation:</Typography>
                                <Typography variant="body1">
                                    The world of technology is ever-evolving, and so are we. We are committed to regular updates and
                                    enhancements to keep
                                    <BrandName /> at the forefront of salon management solutions.
                                </Typography>
                            </div>
                        </Stack>
                    </Typography>

                    {/* Our Team */}

                    <Typography variant="h1" style={{ textAlign: 'center' }}>
                        Our Team
                    </Typography>
                    <Typography variant="body1">
                        Behind <BrandName /> is a dedicated team passionate about technology and the beauty industry. Our developers,
                        designers, and customer support experts work to ensure that <BrandName /> remains a reliable and indispensable tool
                        for salons of all sizes.
                    </Typography>

                    {/* Get Started */}

                    <Typography variant="h1" style={{ textAlign: 'center' }}>
                        Get Started
                    </Typography>
                    <Typography variant="body1">
                        Join the growing community of salons that have chosen <BrandName /> to streamline their operations, enhance customer
                        relationships, and boost their success. We invite you to explore our features, discover the benefits, and take the
                        first step toward transforming your salon management experience. Thank you for choosing <BrandName />. We're excited
                        to be a part of your salon's journey to excellence! For any inquiries or assistance, feel free to{' '}
                        <Link href={`mailto:${BRAND.SUPPORT_EMAIL}`} underline="always">
                            contact us
                        </Link>
                        .
                    </Typography>
                </Stack>
            </Typography>
        </Container>
    </Page>
);

AboutUs.getLayout = function getLayout(page: ReactElement) {
    return <Layout variant="simple">{page}</Layout>;
};

export default AboutUs;
