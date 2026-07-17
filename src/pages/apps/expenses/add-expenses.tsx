import { useRouter } from 'next/router';
import { ReactElement, useEffect, useState } from 'react';
// next
// third-party
import { useFormik } from 'formik';
import * as yup from 'yup';
// material-ui
import { Button, FormControl, FormHelperText, Grid, InputLabel, MenuItem, Select, Stack, TextField } from '@mui/material';

// project import
import MainCard from 'components/MainCard';
import Page from 'components/Page';
import Layout from 'layout';
// assets
import AnimateButton from 'components/@extended/AnimateButton';

// types
import { Expense } from 'types/expenses';

import { addExpense, editExpense } from 'services/expenses';
import { EssentialMethods } from 'utils/essentialMethods';
import { successColor, errorColor } from 'config';
import CustomButton from 'components/custom-button';

// ==============================|| ADD NEW EXPENSE - MAIN ||============================== //
const validationSchema = yup.object().shape({
    amount: yup.string()
        .required('Amount is required')
        .matches(/^\d+(\.\d{1,2})?$/, 'Amount must be a valid number with up to 2 decimal places'),
    description: yup.string()
        .required('Description is required')
        .max(255, 'Description can be at most 255 characters'),
});


const AddExpense = (props: any) => {
    const initialFormValues: Expense = {
        amount: "",
        description: "",
        date: "",
        status: "Active"
    }
    const router = useRouter();
    const [formData, setFormData] = useState(initialFormValues)
    const { data, accessibility = true, id, title = 'Add Expense' } = props
    useEffect(() => {
        if (props && data != undefined) {
            setFormData({ ...data })
        }
    }, [])
    const [isSubmitting, setIsSubmitting] = useState(false);
    const formik = useFormik({
        initialValues: formData,
        enableReinitialize: true,
        validationSchema,
        onSubmit: async (values) => {
            var response;
            if (accessibility && data) {
                values.id = id;
                response = await editExpense(values);
            } else {
                response = await addExpense(values);
            }
            if (response && response.data.status === 200) {
                setIsSubmitting(true);
                EssentialMethods.showSnackbar(response.data.message, successColor)
                handleCancel();
            } else {
                setIsSubmitting(false);
                EssentialMethods.showSnackbar(response.data.message, errorColor)
            }
        },
    });
    const handleCancel = () => {
        router.back();
    };
    return (
        <Page title={title}>
            <MainCard title={title}>
                <form onSubmit={formik.handleSubmit}>
                    <Grid container spacing={3}>
                        <Grid item xs={12} md={4}>
                            <Stack spacing={1}>
                                <InputLabel htmlFor="name">Desc<span style={{ color: 'red' }}>*</span>
                                </InputLabel>
                                <TextField
                                    fullWidth
                                    id="description"
                                    name="description"
                                    placeholder="Please Enter Description"
                                    value={formik.values.description}
                                    onChange={formik.handleChange}
                                    disabled={!accessibility}
                                    error={formik.touched.description && Boolean(formik.errors.description)}
                                    helperText={formik.touched.description && formik.errors.description}
                                    InputProps={{
                                        inputProps: { maxLength: 20 }, // Set the maximum character limit to 50
                                    }}
                                />
                            </Stack>
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <Stack spacing={1}>
                                <InputLabel htmlFor="name">Amount<span style={{ color: 'red' }}>*</span>
                                </InputLabel>
                                <TextField
                                    fullWidth
                                    id="amount"
                                    name="amount"
                                    placeholder="Please Enter Amount"
                                    value={formik.values.amount}
                                    onChange={formik.handleChange}
                                    disabled={!accessibility}
                                    error={formik.touched.amount && Boolean(formik.errors.amount)}
                                    helperText={formik.touched.amount && formik.errors.amount}
                                    InputProps={{
                                        inputProps: { maxLength: 20 }, // Set the maximum character limit to 50
                                    }}
                                />
                            </Stack>
                        </Grid>
                        {id !== undefined ? (
                            <Grid item xs={12} md={4}>
                                <Stack spacing={1}>
                                    <InputLabel htmlFor="status" shrink={!formik.values.status}>
                                        Status
                                    </InputLabel>
                                    <FormControl sx={{ m: 1, minWidth: 120 }}>
                                        <Select
                                            id="status"
                                            {...formik.getFieldProps('status')}
                                            disabled={!accessibility}
                                            displayEmpty
                                            defaultValue={formik.values.status}
                                        >
                                            <MenuItem value="Active">Active</MenuItem>
                                            <MenuItem value="Inactive">Inactive</MenuItem>
                                        </Select>
                                        {formik.touched.status && formik.errors.status && (
                                            <FormHelperText error id="standard-weight-helper-text-email-login">
                                                {formik.errors.status}
                                            </FormHelperText>
                                        )}
                                    </FormControl>
                                </Stack>
                            </Grid>
                        ) : null}
                        <Grid item xs={12}>
                            <Stack direction="row" spacing={1} justifyContent="flex-end">
                                <Button color="error" onClick={() => router.back()}>
                                    {accessibility ? 'Cancel' : 'Back'}
                                </Button>
                                {accessibility && (
                                    <AnimateButton>
                                        <CustomButton loading={isSubmitting} title={accessibility && id ? 'update' : 'submit'} onclick={() => formik.submitForm()} />
                                    </AnimateButton>
                                )}
                            </Stack>
                        </Grid>
                    </Grid>
                </form>
            </MainCard>
        </Page >
    );
}

AddExpense.getLayout = function getLayout(page: ReactElement) {
    return <Layout>{page}</Layout>;
};

export default AddExpense;
