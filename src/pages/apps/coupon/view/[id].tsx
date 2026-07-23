import Layout from 'layout';
import { ReactElement, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { Alert, Box, CircularProgress } from '@mui/material';

import AddCoupon from '../add-coupon';
import { getCoupon } from 'services/coupon';
import { EssentialMethods } from 'utils/essentialMethods';
import { errorColor, successColor } from 'config';

function ViewCoupon() {
    const router = useRouter();
    const { id } = router.query;
    const [openDrawer, setOpenDrawer] = useState(true);
    const [apiResponse, setApiResponse] = useState<Record<string, unknown> | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const handleDrawerOpen = () => {
        setOpenDrawer((prev) => {
            if (prev) {
                router.push('/apps/coupon/manage-coupon');
            }
            return !prev;
        });
    };

    useEffect(() => {
        if (!router.isReady || !id) return;

        setLoading(true);
        setError(null);
        getCoupon('id', id.toString())
            .then((response) => {
                const row = response?.data?.data?.rows?.[0];
                if (!row) {
                    setError(response?.data?.message || 'Coupon not found.');
                    EssentialMethods.showSnackbar(response?.data?.message || 'Coupon not found.', errorColor);
                    return;
                }
                setApiResponse({ ...row });
                EssentialMethods.showSnackbar(response.data.message, successColor);
            })
            .catch((err) => {
                const message = (typeof err === 'string' && err) || err?.message || 'Unable to load coupon.';
                setError(message);
                EssentialMethods.showSnackbar(message, errorColor);
            })
            .finally(() => setLoading(false));
    }, [router.isReady, id]);

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
                <CircularProgress />
            </Box>
        );
    }

    if (error) {
        return (
            <Box sx={{ p: 3 }}>
                <Alert severity="error">{error}</Alert>
            </Box>
        );
    }

    return apiResponse ? (
        <AddCoupon
            data={apiResponse}
            id={id}
            accessibility={false}
            open={openDrawer}
            handleDrawerOpen={handleDrawerOpen}
            title="View Coupon"
        />
    ) : null;
}

ViewCoupon.getLayout = function getLayout(page: ReactElement) {
    return <Layout>{page}</Layout>;
};

export default ViewCoupon;
