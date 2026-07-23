import { useRouter } from 'next/router';
import { ReactElement, useEffect, useState } from 'react';
// next
// third-party
import { useFormik } from 'formik';
import * as yup from 'yup';
// material-ui
import { Button, Grid, InputLabel, Stack, TextField } from '@mui/material';

// project import
import MainCard from 'components/MainCard';
import Page from 'components/Page';
import Layout from 'layout';
// assets
import AnimateButton from 'components/@extended/AnimateButton';

// types
import { Service } from 'types/service';

import { addService, editService } from 'services/services';
import { EssentialMethods } from 'utils/essentialMethods';
import { successColor, errorColor } from 'config';
import CustomButton from 'components/custom-button';

// ==============================|| ADD NEW EXPENSE - MAIN ||============================== //
const validationSchema = yup.object().shape({
    price: yup.string()
        .required('Amount is required')
        .matches(/^\d+(\.\d{1,2})?$/, 'Amount must be a valid number with up to 2 decimal places'),
    description: yup.string()
        .required('Description is required')
        .max(120, 'Description can be at most 120 characters'),
    category: yup.string()
        .required('Category is required')
        .max(100, 'Category can be at most 100 characters'),
});


const AddService = (props: any) => {
    const initialFormValues: Service = {
        name: "",
        description: "",
        time_for_each_service: 30,
        price: 0,
        category: ""
    }
    const router = useRouter();
    const [formData, setFormData] = useState(initialFormValues)
    const { data, accessibility = true, id, title = 'Add Service' } = props
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
                response = await editService(values);
            } else {
                response = await addService(values);
            }
            if (response && response.data.status === 200) {
                setIsSubmitting(true);
                EssentialMethods.showSnackbar(response.data.message, successColor)
                router.push('/apps/services/manage-service');
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
                                <InputLabel htmlFor="name">Name<span style={{ color: 'red' }}>*</span>
                                </InputLabel>
                                <TextField
                                    fullWidth
                                    id="name"
                                    name="name"
                                    placeholder="Please Enter Service Name"
                                    value={formik.values.name}
                                    onChange={formik.handleChange}
                                    disabled={!accessibility}
                                    error={formik.touched.name && Boolean(formik.errors.name)}
                                    helperText={formik.touched.name && formik.errors.name}
                                    InputProps={{
                                        inputProps: { maxLength: 50 },
                                    }}
                                />
                            </Stack>
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <Stack spacing={1}>
                                <InputLabel htmlFor="name">Description For Service<span style={{ color: 'red' }}>*</span>
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
                                        inputProps: { maxLength: 120 },
                                    }}
                                />
                            </Stack>
                        </Grid>

                        <Grid item xs={12} md={4}>
                            <Stack spacing={1}>
                                <InputLabel htmlFor="name">Enter Category For Service<span style={{ color: 'red' }}>*</span>
                                </InputLabel>
                                <TextField
                                    fullWidth
                                    id="category"
                                    name="category"
                                    placeholder="Please Enter Category"
                                    value={formik.values.category}
                                    onChange={formik.handleChange}
                                    disabled={!accessibility}
                                    error={formik.touched.category && Boolean(formik.errors.category)}
                                    helperText={formik.touched.category && formik.errors.category}
                                    InputProps={{
                                        inputProps: { maxLength: 100 }, // Set the maximum character limit to 100
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
                                    id="price"
                                    name="price"
                                    placeholder="Please Enter Amount"
                                    value={formik.values.price}
                                    onChange={formik.handleChange}
                                    disabled={!accessibility}
                                    error={formik.touched.price && Boolean(formik.errors.price)}
                                    helperText={formik.touched.price && formik.errors.price}
                                    InputProps={{
                                        inputProps: { maxLength: 20 }, // Set the maximum character limit to 50
                                    }}
                                />
                            </Stack>
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <Stack spacing={1}>
                                <InputLabel htmlFor="name">Time (in Mins)<span style={{ color: 'red' }}>*</span>
                                </InputLabel>
                                <TextField
                                    fullWidth
                                    id="time_for_each_service"
                                    name="time_for_each_service"
                                    placeholder="Please Enter Time in Minutes"
                                    value={formik.values.time_for_each_service}
                                    onChange={formik.handleChange}
                                    disabled={!accessibility}
                                    error={formik.touched.time_for_each_service && Boolean(formik.errors.time_for_each_service)}
                                    helperText={formik.touched.time_for_each_service && formik.errors.time_for_each_service}
                                    InputProps={{
                                        inputProps: { maxLength: 20 }, // Set the maximum character limit to 50
                                    }}
                                />
                            </Stack>
                        </Grid>
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

AddService.getLayout = function getLayout(page: ReactElement) {
    return <Layout>{page}</Layout>;
};

export default AddService;
