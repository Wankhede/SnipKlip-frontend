import { useState, Fragment, ReactElement, useEffect } from 'react';
import { useTheme } from '@mui/material/styles';
import { Button, Grid, List, ListItem, ListItemIcon, ListItemText, Stack, Typography, Alert } from '@mui/material';
import { useRouter } from 'next/router';
import { signOut } from 'next-auth/react';

import Layout from 'layout';
import Page from 'components/Page';
import MainCard from 'components/MainCard';
import StandardPlusLogo from 'sections/price/StandardPlus';
import axiosServices from 'utils/axios';
import Script from 'next/script';

import useUser from 'hooks/useUser';
import { EssentialMethods } from 'utils/essentialMethods';
import { APP_DEFAULT_PATH, errorColor, successColor } from 'config';
import { BRAND } from 'config/branding';
import { getSubscriptionType } from 'services/subscription';
import { CheckOutlined } from '@ant-design/icons';
import { useUserProfile } from './apps/user-provider';

declare global {
    interface Window {
        Razorpay: any;
    }
}

const Pricing = () => {
    const theme = useTheme();
    const [timePeriod, setTimePeriod] = useState(false);
    const [alertType, setAlertType] = useState(null);
    const [alertMessage, setAlertMessage] = useState('');
    const [plans, setPlan] = useState<any>([]);
    const router = useRouter();
    const user = useUser();
    const { userData, loading } = useUserProfile();
    const [isButtonDisabled, setIsButtonDisabled] = useState(false);

    const initiatePaymentWithDebounce = (price: number, title: string) => {
        if (!isButtonDisabled) {
            setIsButtonDisabled(true);
            initiatePayment(price, title);

            setTimeout(() => {
                setIsButtonDisabled(false);
            }, 2000);
        }
    };
    const handlegetSubscription = async () => {
        try {
            const response = await getSubscriptionType(userData);
            setPlan(response.data.data);
        } catch (error) {
            console.error('Error cancelling booking', error);
        }
    };

    useEffect(() => {
        if (!loading && userData) handlegetSubscription();
    }, [loading, userData]);

    const planList = [
        'Unlimited Clients', // 0
        'Point Of Sale (POS)', // 1
        'Analytics and Reports', // 2
        'Employee Management', // 3
        'Inventory Management', // 4
        'WhatsApp Notifications' // 5
        // 'Resale Product', // 6
        // 'Separate sale of our UI Elements?' // 7
    ];

    const handleLogout = () => {
        signOut({ redirect: false });
        router.push({
            pathname: '/login',
            query: {}
        });
    };

    useEffect(() => {
        if (alertType) {
            const timer = setTimeout(() => {
                setAlertType(null);
                setAlertMessage('');
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [alertType]);

    const initiatePayment = async (amount: number, subscriptionName: string) => {
        try {
            if (user === false) {
                console.error('User is not authenticated');
                return;
            }

            const user_id = user.id;

            const subscriptionType = timePeriod ? 'monthly' : 'yearly';
            const response = await axiosServices.post('/api/v3/createPayment/', {
                amount: amount,
                userId: user_id,
                subscriptionType: subscriptionType,
                subscriptionName: subscriptionName
            });

            const { order_id, amount: razorpayAmount, currency } = response.data;

            if (response.data.status === 200) {
                EssentialMethods.showSnackbar(response.data.message, successColor);
            } else {
                EssentialMethods.showSnackbar(response.data.message, errorColor);
                return;
            }
            const razorpayKeyId = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
            if (!razorpayKeyId) {
                throw new Error('Razorpay public key is not configured');
            }
            const options = {
                key: razorpayKeyId,
                amount: razorpayAmount,
                currency,
                order_id: order_id,
                name: BRAND.COMPANY_NAME,
                description: `Subscription to ${BRAND.COMPANY_NAME}`,
                config: {
                    display: {
                        hide: [{ method: 'paylater' }, { method: 'emi' }],
                        preferences: { show_default_blocks: true }
                    }
                },
                image: `${BRAND.COMPANY_WEBSITE}${BRAND.LOGO}`,
                // order_id: id,
                handler: function (response: any) {
                    const { razorpay_payment_id, razorpay_order_id, razorpay_signature } = response;
                    axiosServices
                        .post('/api/v3/paymentCallback/', {
                            razorpay_payment_id,
                            razorpay_order_id,
                            razorpay_signature
                        })
                        .then((response) => {
                            if (response && response.data.razorpay_order_id === razorpay_order_id && response.data.status === 200) {
                                localStorage.setItem('subscription_name', response.data.subscription_name);
                                window.location.reload();
                                router.push(APP_DEFAULT_PATH);
                            } else {
                            }
                        })
                        .catch((error) => {
                            console.error(error);
                        });
                }
            };
            const rzp1 = new window.Razorpay(options);
            rzp1.open();
        } catch (error) {
            console.error(error);
            // Handle error
        }
    };

    const handleTimePeriodChange = () => {
        setTimePeriod((prevTimePeriod) => !prevTimePeriod);
    };

    const priceListDisable = {
        opacity: 0.4,
        '& >div> svg': {
            fill: theme.palette.secondary.light
        }
    };

    const handleAlertClose = () => {
        setAlertType(null);
        setAlertMessage('');
    };

    return (
        <Page title="Pricing">
            {alertType && (
                <Grid sx={{ paddingBottom: '15px' }}>
                    <Alert severity={alertType} onClose={handleAlertClose}>
                        {alertMessage}
                    </Alert>
                </Grid>
            )}
            <Grid container spacing={3} sx={{ paddingTop: '5px' }}>
                <Grid item xs={12}>
                    <MainCard>
                        <Grid container item xs={12} md={9} lg={7}>
                            <Stack spacing={2}>
                                <Stack direction="row" spacing={1.5} alignItems="center">
                                    <Typography variant="subtitle1" color={timePeriod ? 'textSecondary' : 'textPrimary'}>
                                        Billed Yearly
                                    </Typography>
                                    {/* <Switch checked={timePeriod} inputProps={{ 'aria-label': 'container' }} /> */}
                                    {/* <Typography variant="subtitle1" color={timePeriod ? 'textPrimary' : 'textSecondary'}>
                    Billed Monthly
                  </Typography> */}
                                </Stack>
                                {/* <Typography color="textSecondary">
                  Try SnipKlip free for 14 days.
                  Trendy, Stylish and Salon friendly.
                </Typography> */}
                            </Stack>
                        </Grid>
                    </MainCard>
                </Grid>
                <Grid item container spacing={3} xs={12}>
                    {plans.map((plan: any) => (
                        <Grid item xs={12} sm={6} md={4}>
                            <MainCard sx={{ pt: 1.75 }}>
                                <Grid container spacing={3}>
                                    <Grid item xs={12}>
                                        <Stack direction="row" spacing={2} textAlign="center">
                                            <StandardPlusLogo />
                                            <Typography variant="h4">{plan.title}</Typography>
                                        </Stack>
                                    </Grid>
                                    <Grid item xs={12}>
                                        <Typography>{plan.description}</Typography>
                                    </Grid>
                                    <Grid item xs={12}>
                                        <Stack direction="row" spacing={1} alignItems="flex-end">
                                            <Typography variant="h2">₹{plan.price}</Typography>
                                        </Stack>
                                    </Grid>
                                    <Grid item xs={12}>
                                        <Script id="razorpay-checkout-js" src="https://checkout.razorpay.com/v1/checkout.js" />
                                        <Button
                                            variant={plan.active ? 'contained' : 'outlined'}
                                            fullWidth
                                            onClick={() => initiatePaymentWithDebounce(plan.price, plan.title)}
                                            disabled={isButtonDisabled}
                                        >
                                            Order Now
                                        </Button>
                                    </Grid>
                                    <Grid item xs={12}>
                                        <List
                                            sx={{
                                                m: 0,
                                                p: 0,
                                                '&> li': {
                                                    px: 0,
                                                    py: 0.625,
                                                    '& svg': {
                                                        fill: theme.palette.success.dark
                                                    }
                                                }
                                            }}
                                            component="ul"
                                        >
                                            {planList.map((list, i) => (
                                                <Fragment key={i}>
                                                    <ListItem sx={!plan.permission.includes(i) ? priceListDisable : {}} divider>
                                                        <ListItemIcon>
                                                            <CheckOutlined />
                                                        </ListItemIcon>
                                                        <ListItemText primary={list} />
                                                    </ListItem>
                                                </Fragment>
                                            ))}
                                        </List>
                                    </Grid>
                                </Grid>
                            </MainCard>
                        </Grid>
                    ))}
                </Grid>
            </Grid>
        </Page>
    );
};

Pricing.getLayout = function getLayout(page: ReactElement) {
    return <Layout>{page}</Layout>;
};

export default Pricing;
function setAccess(salon_id: string | null, branch_id: string | null, group: string | null, subscription_name: string | null) {
    throw new Error('Function not implemented.');
}
