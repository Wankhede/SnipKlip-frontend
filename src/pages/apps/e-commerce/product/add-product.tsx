import { ReactElement, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { Button, Grid, InputLabel, MenuItem, Select, Stack, TextField } from '@mui/material';
import Layout from 'layout';
import Page from 'components/Page';
import MainCard from 'components/MainCard';
import { addProduct, editProduct } from 'services/product';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { EssentialMethods } from 'utils/essentialMethods';
import { errorColor, successColor } from 'config';
import AnimateButton from 'components/@extended/AnimateButton';
import CustomButton from 'components/custom-button';

// Validation schema using Yup
const validationSchema = Yup.object().shape({
    name: Yup.string()
        .required('Product Name is required')
        .max(100, 'Product Name can be at most 100 characters'),
    description: Yup.string()
        .required('Product Description is required')
        .max(255, 'Product Description can be at most 255 characters'),
    category: Yup.string().required('Category is required'),
    price: Yup.number()
        .required('Price is required')
        .min(0, 'Price must be greater than or equal to 0')
        .max(1000000, 'Price cannot exceed 1000'),
    quantity: Yup.number()
        .required('Quantity is required')
        .integer('Quantity must be an integer')
        .min(1, 'Quantity must be greater than or equal to 1')
        .max(100, 'Quantity cannot exceed 100'),
    availablity: Yup.string().required('Status is required'),
});

const AddNewProduct = (props: any) => {
    const initialValues = {
        id: undefined,
        name: '',
        description: '',
        category: '',
        price: '',
        quantity: '1',
        availablity: true,
    };
    const { data, accessibility = true, id, title = 'Add Product' } = props
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState(initialValues)
    const router = useRouter();
    useEffect(() => {
        if (props && data != undefined) {
            setFormData({ ...data })
        }
    }, [])
    const formik = useFormik({
        initialValues: formData,
        enableReinitialize: true,
        validationSchema,
        onSubmit: async (values) => {
            var response;
            if (accessibility && data) {
                values.id = id;
                response = await editProduct(values);
            } else {
                response = await addProduct(values);
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

    const category = [
        {
            value: 'Shampoos and Conditioners',
            label: 'Shampoos and Conditioners',
        },
        {
            value: 'Hairstyling Products',
            label: 'Hairstyling Products',
        },
        {
            value: 'Hair Removal Products',
            label: 'Hair Removal Products',
        },
        {
            value: 'Manicure and Pedicure Products and Tools',
            label: 'Manicure and Pedicure Products and Tools',
        },
        {
            value: 'Hair Color Tubes',
            label: 'Hair Color Tubes',
        },
        {
            value: 'Skin Care Products',
            label: 'Skin Care Products',
        },
        {
            value: 'Facial Care Products',
            label: 'Facial Care Products',
        },
        {
            value: 'Body Wash and Shower Gels',
            label: 'Body Wash and Shower Gels',
        },
        {
            value: 'Moisturizers and Lotions',
            label: 'Moisturizers and Lotions',
        },
        {
            value: 'Makeup Products',
            label: 'Makeup Products',
        },
        {
            value: 'Essential Oils',
            label: 'Essential Oils',
        },
        {
            value: 'Fragrances and Perfumes',
            label: 'Fragrances and Perfumes',
        },
    ];


    const status = [
        {
            value: 'In Stock',
            label: 'In Stock',
        },
        {
            value: 'Out of Stock',
            label: 'Out of Stock',
        },
    ];

    const handleCancel = () => {
        router.back();
    };

    return (
        <Page title={title}>
            <MainCard title={title}>
                <form onSubmit={formik.handleSubmit}>
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                            <MainCard>
                                <Grid container spacing={1} direction="column">
                                    <Grid item xs={12}>
                                        <InputLabel sx={{ mb: 1 }}>Product Name</InputLabel>
                                        <TextField
                                            name="name"
                                            fullWidth
                                            value={formik.values.name}
                                            onChange={formik.handleChange}
                                            disabled={"accessibility" in props ? !accessibility : false}
                                            onBlur={formik.handleBlur}
                                            error={formik.touched.name && Boolean(formik.errors.name)}
                                            helperText={formik.touched.name && formik.errors.name}
                                            required
                                        />
                                    </Grid>

                                    <Grid item xs={12}>
                                        <InputLabel sx={{ mb: 1 }}>Product Description</InputLabel>
                                        <TextField
                                            name="description"
                                            fullWidth
                                            value={formik.values.description}
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            disabled={"accessibility" in props ? !accessibility : false}
                                            error={
                                                formik.touched.description &&
                                                Boolean(formik.errors.description)
                                            }
                                            helperText={
                                                formik.touched.description && formik.errors.description
                                            }
                                            required
                                        />
                                    </Grid>

                                    <Grid item xs={12}>
                                        <InputLabel sx={{ mb: 1 }}>Category</InputLabel>
                                        <Select
                                            name="category"
                                            fullWidth
                                            value={formik.values.category}
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            disabled={"accessibility" in props ? !accessibility : false}
                                            error={formik.touched.category && Boolean(formik.errors.category)}
                                            required
                                        >
                                            {category.map((option) => (
                                                <MenuItem key={option.value} value={option.value}>
                                                    {option.label}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </Grid>

                                    <Grid item xs={12}>
                                        <InputLabel sx={{ mb: 1 }}>Price</InputLabel>
                                        <TextField
                                            name="price"
                                            fullWidth
                                            type="number"
                                            value={formik.values.price}
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            disabled={"accessibility" in props ? !accessibility : false}
                                            error={formik.touched.price && Boolean(formik.errors.price)}
                                            helperText={formik.touched.price && formik.errors.price}
                                            required
                                        />
                                    </Grid>
                                </Grid>
                            </MainCard>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <MainCard>
                                <Grid container direction="column" spacing={2}>
                                    <Grid item xs={12}>
                                        <InputLabel sx={{ mb: 1 }}>Qty</InputLabel>
                                        <TextField
                                            name="quantity"
                                            fullWidth
                                            type="number"
                                            value={formik.values.quantity}
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            disabled={"accessibility" in props ? !accessibility : false}
                                            error={formik.touched.quantity && Boolean(formik.errors.quantity)}
                                            helperText={formik.touched.quantity && formik.errors.quantity}
                                            required
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <InputLabel sx={{ mb: 1 }}>Status</InputLabel>
                                        <TextField
                                            name="availablity"
                                            fullWidth
                                            select
                                            value={formik.values.availablity}
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            disabled={"accessibility" in props ? !accessibility : false}
                                            error={formik.touched.availablity && Boolean(formik.errors.availablity)}
                                            helperText={formik.touched.availablity && formik.errors.availablity}
                                            required
                                        >
                                            {status.map((option) => (
                                                <MenuItem key={option.value} value={option.value}>
                                                    {option.label}
                                                </MenuItem>
                                            ))}
                                        </TextField>
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
                            </MainCard>
                        </Grid>
                    </Grid>
                </form>
            </MainCard>
        </Page >
    );
}

AddNewProduct.getLayout = function getLayout(page: ReactElement) {
    return <Layout>{page}</Layout>;
};

export default AddNewProduct;
