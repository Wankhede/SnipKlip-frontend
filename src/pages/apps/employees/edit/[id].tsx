import Layout from 'layout';
import { useDispatch } from 'store';

// next
import { useRouter } from 'next/router';

import { ReactElement, useEffect, useState } from 'react';

import AddEmployee from '../add-employees';

import { openSnackbar } from 'store/reducers/snackbar';

// Services
import { getEmployee } from 'services/employees';
import { getApiFirstRow } from 'utils/api-list';


function EditEmployee() {
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

                router.push('/apps/employee/manage-employees')
            });
    }, [id]);

    return apiResponse ? <AddEmployee data={apiResponse} accessibility={true} id={id} title="Edit Form" /> : null
}

EditEmployee.getLayout = function getLayout(page: ReactElement) {
    return <Layout>{page}</Layout>;
};

export default EditEmployee;

