// next
import Image from 'next/image';

// material-ui
import { Container, Grid, Typography } from '@mui/material';

// project import
import MainCard from 'components/MainCard';
import { BRAND } from 'config/branding';
import Animation from './Animation';

// assets
const imgfeature1 = '/assets/images/landing/img-feature1.svg';
const imgfeature2 = '/assets/images/landing/img-feature2.svg';
const imgfeature3 = '/assets/images/landing/img-feature3.svg';

// ==============================|| LANDING - FEATURE PAGE ||============================== //

const FeatureBlock = () => (
    <Container>
        <Grid container alignItems="center" justifyContent="center" spacing={2} sx={{ mt: { md: 15, xs: 2.5 }, mb: { md: 10, xs: 2.5 } }}>
            <Grid item xs={12}>
                <Grid container spacing={1} justifyContent="center" sx={{ mb: 4, textAlign: 'center' }}>
                    <Grid item sm={10} md={6}>
                        <Grid container spacing={1} justifyContent="center">
                            <Grid item xs={12}>
                                <Typography variant="subtitle1" color="primary">
                                    Built for modern salons
                                </Typography>
                            </Grid>
                            <Grid item xs={12}>
                                <Typography variant="h2" sx={{ mb: 2 }}>
                                    Why {BRAND.COMPANY_NAME}?
                                </Typography>
                            </Grid>
                            <Grid item xs={12}>
                                <Typography variant="body1">
                                    {BRAND.COMPANY_NAME} helps salons raise customer experience and quality standards across every location.
                                </Typography>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
                <Animation
                    variants={{
                        hidden: { opacity: 0, translateY: 550 },
                        visible: { opacity: 1, translateY: 0 }
                    }}
                >
                    <MainCard contentSX={{ p: 3 }}>
                        <Grid container spacing={1}>
                            <Grid item xs={12}>
                                <Image src={imgfeature1} alt="feature" layout="fixed" width={48} height={48} />
                            </Grid>
                            <Grid item xs={12}>
                                <Typography variant="h5" sx={{ fontWeight: 600, mt: 2 }}>
                                    Booking Management
                                </Typography>
                            </Grid>
                            <Grid item xs={12}>
                                <Typography variant="body1" color="secondary">
                                    Simple dashboard for bookings and reservations, with easy automation of appointment and follow-up
                                    reminders, customized to decrease no-shows and manage time slots.
                                </Typography>
                            </Grid>
                        </Grid>
                    </MainCard>
                </Animation>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
                <Animation
                    variants={{
                        hidden: { opacity: 0, translateY: 550 },
                        visible: { opacity: 1, translateY: 0 }
                    }}
                >
                    <MainCard contentSX={{ p: 3 }}>
                        <Grid container spacing={1}>
                            <Grid item xs={12}>
                                <Image src={imgfeature2} alt="feature" layout="fixed" width={48} height={48} />
                            </Grid>
                            <Grid item xs={12}>
                                <Typography variant="h5" sx={{ fontWeight: 600, mt: 2 }}>
                                    Insightful reports and analytics
                                </Typography>
                            </Grid>
                            <Grid item xs={12}>
                                <Typography variant="body1" color="secondary">
                                    With {BRAND.COMPANY_NAME}, you can generate detailed reports on salon finances, customer behavior, and
                                    operations to make better decisions.
                                </Typography>
                            </Grid>
                        </Grid>
                    </MainCard>
                </Animation>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
                <Animation
                    variants={{
                        hidden: { opacity: 0, translateY: 550 },
                        visible: { opacity: 1, translateY: 0 }
                    }}
                >
                    <MainCard contentSX={{ p: 3 }}>
                        <Grid container spacing={1}>
                            <Grid item xs={12}>
                                <Image src={imgfeature3} alt="feature" layout="fixed" width={48} height={48} />
                            </Grid>
                            <Grid item xs={12}>
                                <Typography variant="h5" sx={{ fontWeight: 600, mt: 2 }}>
                                    Enhanced customer experience
                                </Typography>
                            </Grid>
                            <Grid item xs={12}>
                                <Typography variant="body1" color="secondary">
                                    Our software provides a seamless experience for your customers, from online appointment booking to
                                    post-service feedback, ensuring they feel valued and satisfied with your salon.
                                </Typography>
                            </Grid>
                        </Grid>
                    </MainCard>
                </Animation>
            </Grid>
        </Grid>
    </Container>
);
export default FeatureBlock;
