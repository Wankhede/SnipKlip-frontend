// material-ui
import {
    Box,
    Button,
    Drawer,
    Grid,
    Typography,
    TextField,
    Divider,
    InputLabel,
    Stack,
    Tooltip,
    FormControl,
    Select,
    MenuItem,
    FormHelperText,
} from '@mui/material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';

// third party
import * as yup from 'yup';
import { useFormik } from 'formik';

import AnimateButton from 'components/@extended/AnimateButton';
import IconButton from 'components/@extended/IconButton';
import { CloseOutlined } from '@ant-design/icons';
import { Membership } from 'types/membership';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { addMembership, editMembership, getMembership } from 'services/membership';
import { EssentialMethods } from 'utils/essentialMethods';
import { errorColor, successColor } from 'config';
import { getCustomers } from 'services/metadata';
import { MetaDataTypeI } from 'types/common';
import { useUserProfile } from '../user-provider';

const validationSchema = yup.object().shape({
    amount: yup.string()
        .required('Amount is required')
        .matches(/^\d+(\.\d{1,2})?$/, 'Amount must be a valid number with up to 2 decimal places'),
});


const AddMembership = (props: any) => {
    const initialFormValues: Membership = {
        customer_name: "",
        customer_id: 0,
        amount: "",
        description: "",
        expiry_date: "",
        discount_percent: null,
        membership_number: null,
        status: "Active"
    }
    const [customers, setCustomers] = useState<MetaDataTypeI[]>([]);
    const { userData, loading } = useUserProfile();
    const router = useRouter();
    const [formData, setFormData] = useState(initialFormValues)
    const { open, handleDrawerOpen, data, accessibility = true, id, title } = props

    useEffect(() => {
        if (id != undefined) {
            getMembership('id', id!.toString())
                .then(response => {
                    setFormData({ ...response.data.data.rows[0] });
                })
                .catch(error => {
                    console.error('API call failed:', error);
                });
        }
    }, [id]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const formik = useFormik({
        initialValues: formData,
        enableReinitialize: true,
        onSubmit: async (values) => {
            var response;
            if (accessibility && id) {
                values.id = id;
                console.log("response")
                response = await editMembership(values);
            } else {
                response = await addMembership(values);
            }
            if (response.data.status === 200) {
                setIsSubmitting(true);
                EssentialMethods.showSnackbar(response.data.message, successColor)
                handleDrawerOpen();
            } else {
                setIsSubmitting(false);
                EssentialMethods.showSnackbar(response.data.message, errorColor)
            }
        },
    });
    const handleCancel = () => {
        router.back();
    };
    const fetchMetadata = () => {
        try {
            getCustomers(userData)
                .then(response => {
                    let metadata: MetaDataTypeI[] = response.data.data.rows.map((item: any) => {
                        return {
                            element: item.customer_name,
                            id: item.customer_id
                        };
                    });
                    setCustomers(metadata);
                })
                .catch(error => console.log(error))

        } catch (error) {
            console.error('Error retrieving metadata:', error);
        }
    };
    useEffect(() => {
        if (!loading && userData) {
            fetchMetadata();
        }
    }, [loading, userData, router]);
    console.log(customers);
    return (
        <Drawer
            sx={{
                ml: open ? 3 : 0,
                flexShrink: 0,
                zIndex: 1200,
                overflowX: 'hidden',
                width: { xs: 320, md: 450 },
                '& .MuiDrawer-paper': {
                    height: '100vh',
                    width: { xs: 320, md: 450 },
                    position: 'fixed',
                    border: 'none',
                    borderRadius: '0px'
                }
            }}
            variant="temporary"
            anchor="right"
            open={open}
            ModalProps={{ keepMounted: true }}
            onClose={handleDrawerOpen}
        >
            {open && (
                <>
                    <Box sx={{ p: 3 }}>
                        <Stack direction="row" alignItems="center" justifyContent="space-between">
                            <Typography variant="h4">{title}</Typography>
                            <Tooltip title="Close">
                                <IconButton color="secondary" onClick={handleDrawerOpen} size="small" sx={{ fontSize: '0.875rem' }}>
                                    <CloseOutlined />
                                </IconButton>
                            </Tooltip>
                        </Stack>
                    </Box>
                    <Divider />
                    <Box sx={{ p: 3 }}>
                        <form onSubmit={formik.handleSubmit}>
                            <LocalizationProvider dateAdapter={AdapterDateFns}>
                                <Grid container spacing={2.5}>
                                    <Grid item xs={12}>
                                        <Stack spacing={1}>
                                            <InputLabel>Name</InputLabel>
                                            <FormControl sx={{ m: 1, minWidth: 120 }}>
                                                <Select id="customer_id" name="customer_id" value={formik.values.customer_name} onChange={(event, child: any) => { formik.setFieldValue('customer_id', child!.props.value); formik.setFieldValue('customer_name', child!.props.children) }} disabled={!accessibility} displayEmpty renderValue={(selected) => {
                                                    if (selected === undefined || selected.length === null) {
                                                        return <span>Select Customer</span>;
                                                    }

                                                    return selected;
                                                }}>
                                                    <MenuItem value="">
                                                        <em>Select Customer</em>
                                                    </MenuItem>

                                                    {customers.map((item, index) => <MenuItem key={index} value={item.id}>{item.element}</MenuItem>)}
                                                </Select>
                                                {formik.touched.customer_id && formik.errors.customer_id && (
                                                    <FormHelperText error id="standard-weight-helper-text-email-login">
                                                        {' '}{formik.errors.customer_id}{' '}
                                                    </FormHelperText>
                                                )}
                                            </FormControl>
                                        </Stack>
                                    </Grid>
                                    <Grid item xs={12}>
                                        <Stack spacing={1}>
                                            <InputLabel>Expiry Date</InputLabel>
                                            <DesktopDatePicker
                                                value={formik.values.expiry_date}
                                                inputFormat="dd/MM/yyyy"
                                                onChange={(expiry_date) => {
                                                    formik.setFieldValue('expiry_date', expiry_date);
                                                }}
                                                renderInput={(props) => (
                                                    <TextField
                                                        name="date"
                                                        fullWidth
                                                        {...props}
                                                        placeholder="Date"
                                                        error={formik.touched.expiry_date && Boolean(formik.errors.expiry_date)}
                                                        helperText={formik.touched.expiry_date && formik.errors.expiry_date}
                                                    />
                                                )}
                                            />
                                        </Stack>
                                    </Grid>
                                    <Grid item xs={12}>
                                        <Stack spacing={1}>
                                            <InputLabel>Discount Percent</InputLabel>
                                            <TextField
                                                fullWidth
                                                id="discount_percent"
                                                name="discount_percent"
                                                value={formik.values.discount_percent}
                                                onChange={formik.handleChange}
                                                error={formik.touched.discount_percent && Boolean(formik.errors.discount_percent)}
                                                helperText={formik.touched.discount_percent && formik.errors.discount_percent}
                                            />
                                        </Stack>
                                    </Grid>
                                    {id !== undefined ? (
                                        <Grid item xs={12}>
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
                                        <AnimateButton>
                                            <Button fullWidth variant="contained" type="submit">
                                                Save
                                            </Button>
                                        </AnimateButton>
                                    </Grid>
                                </Grid>
                            </LocalizationProvider>
                        </form>
                    </Box>
                </>
            )}
        </Drawer>
    );
};
export default AddMembership;
