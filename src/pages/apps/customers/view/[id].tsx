import Layout from 'layout';
import { useDispatch } from 'store';

// next
import { useRouter } from 'next/router';

import { ReactElement, useEffect, useState } from 'react';

import { openSnackbar } from 'store/reducers/snackbar';

// Services
import { getCustomer } from 'services/customers';
import AddCustomer from '../add-customer';
import { getApiFirstRow } from 'utils/api-list';

function ViewCustomer() {
    const [apiResponse, setApiResponse] = useState(null);
    const router = useRouter();
    const dispatch = useDispatch();
    const { id } = router.query;

    function showSnackbar(open: any, message: any, variant: any, color: any, close: any) {
        dispatch(
            openSnackbar({
                open,
                message,
                variant,
                alert: { color },
                close
            })
        );
    }

    useEffect(() => {
        getCustomer('id', id!.toString())
            .then(response => {
                const row = getApiFirstRow(response);
                if (row) setApiResponse({ ...row });

                var snackbarType = response.data.status === 200 ? 'success' : 'error';

                showSnackbar(true, response.data.message, 'alert', snackbarType, false);
            })
            .catch(error => {
                // Handle the exception here
                console.error('API call failed:', error);
                // You can show an error message or take any other appropriate action
                showSnackbar(true, 'API call failed', 'alert', 'error', false);

                router.push('/apps/customers/manage-customers')
            });
    }, [id]);

    return apiResponse ? (
        <AddCustomer data={apiResponse} accessibility={false} id={id} title="View Form" />

    ) : null
}

ViewCustomer.getLayout = function getLayout(page: ReactElement) {
    return <Layout>{page}</Layout>;
};

export default ViewCustomer;

