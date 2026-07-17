import Layout from 'layout';
import { useDispatch } from 'store';

// next
import { useRouter } from 'next/router';

import { ReactElement, useEffect, useState } from 'react';

import AddSalary from '../add-salary';

import { openSnackbar } from 'store/reducers/snackbar';

import { getSalary } from 'services/salary';


function EditSalary() {
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
        getSalary('id', id!.toString())
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
            });
    }, [id]);

    return apiResponse ? <AddSalary data={apiResponse} accessibility={true} id={id} title="View Form" /> : null
}

EditSalary.getLayout = function getLayout(page: ReactElement) {
    return <Layout>{page}</Layout>;
};

export default EditSalary;

