import Layout from 'layout';
import { useDispatch } from 'store';

// next
import { useRouter } from 'next/router';

import { ReactElement, useEffect, useState } from 'react';

import AddEmployee from '../add-employees';

import { openSnackbar } from 'store/reducers/snackbar';

// Services
import { getEmployee } from 'services/employees';


function ViewEmployee() {
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
        getEmployee('id', id!.toString())
            .then(response => {
                setApiResponse({ ...response.data.data.rows[0] });

                var snackbarType = response.data.status ? 'success' : 'error';

                showSnackbar(true, response.data.message, 'alert', snackbarType, false);
            })
            .catch(error => {
                // Handle the exception here
                console.error('API call failed:', error);
                // You can show an error message or take any other appropriate action
                showSnackbar(true, 'API call failed', 'alert', 'error', false);

                router.push('/apps/employee/manage-employees')
            });
    }, [id]);

    return apiResponse ? <AddEmployee data={apiResponse} accessibility={false} id={id} title="View Form" /> : null
}

ViewEmployee.getLayout = function getLayout(page: ReactElement) {
    return <Layout>{page}</Layout>;
};

export default ViewEmployee;

