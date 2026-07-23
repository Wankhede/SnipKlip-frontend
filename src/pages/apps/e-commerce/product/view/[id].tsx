import Layout from 'layout';
import { useDispatch } from 'store';

// next
import { useRouter } from 'next/router';

import { ReactElement, useEffect, useState } from 'react';

import { openSnackbar } from 'store/reducers/snackbar';

import AddProduct from '../add-product';
import { getProduct } from 'services/product';
import { getApiFirstRow } from 'utils/api-list';

function ViewProduct() {

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
    getProduct('id', id!.toString())
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
      });
  }, [id]);

  return apiResponse ? <AddProduct data={apiResponse} accessibility={false} id={id} title="View Form" /> : null
}

ViewProduct.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

export default ViewProduct;

