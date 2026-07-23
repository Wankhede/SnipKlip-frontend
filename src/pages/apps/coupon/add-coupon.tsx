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

import { useFormik } from 'formik';

import AnimateButton from 'components/@extended/AnimateButton';
import IconButton from 'components/@extended/IconButton';
import { CloseOutlined } from '@ant-design/icons';
import { Coupon } from 'types/coupon';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { addCoupon, editCoupon, getCoupon } from 'services/coupon';
import { getApiFirstRow } from 'utils/api-list';
import { EssentialMethods } from 'utils/essentialMethods';
import { errorColor, successColor } from 'config';
import formatDate from 'utils/date-format';


const AddCoupon = (props: any) => {
    const initialFormValues: Coupon = {
        coupon_code: "",
        discount_value: "",
        discount_percent: "",
        expiry_date: "",
        available_count: "",
        status: "Active"
    }
    const router = useRouter();
    const [formData, setFormData] = useState(initialFormValues)
    const { open, handleDrawerOpen, data, accessibility = true, id, title } = props

    useEffect(() => {
        if (data) {
            setFormData({ ...data });
            return;
        }
        if (id != undefined) {
            getCoupon('id', id!.toString())
                .then(response => {
                    const row = getApiFirstRow(response);
                    if (row) setFormData({ ...row });
                })
                .catch(error => {
                    console.error('API call failed:', error);
                });
        }
    }, [id, data]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const formik = useFormik({
        initialValues: formData,
        enableReinitialize: true,
        onSubmit: async (values) => {
            var response;
            if (values.expiry_date) {
                const formattedDateTime = formatDate(values.expiry_date, 'MMM dd, yyyy')
                values.expiry_date = formattedDateTime
            }
            if (accessibility && id) {
                values.id = id;
                response = await editCoupon(values);
            } else {
                response = await addCoupon(values);
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
                                            <InputLabel>Coupon Code</InputLabel>
                                            <TextField
                                                fullWidth
                                                id="coupon_code"
                                                name="coupon_code"
                                                placeholder="Coupon Code"
                                                value={formik.values.coupon_code}
                                                onChange={formik.handleChange}
                                                error={formik.touched.coupon_code && Boolean(formik.errors.coupon_code)}
                                                helperText={formik.touched.coupon_code && formik.errors.coupon_code}
                                            />
                                        </Stack>
                                    </Grid>
                                    <Grid item xs={12}>
                                        <Stack spacing={1}>
                                            <InputLabel>Expiry date</InputLabel>
                                            <DesktopDatePicker
                                                value={formik.values.expiry_date}
                                                inputFormat="dd/MM/yyyy"
                                                onChange={(date) => {
                                                    formik.setFieldValue('expiry_date', date);
                                                }}
                                                renderInput={(props) => (
                                                    <TextField
                                                        name="expiry_date"
                                                        fullWidth
                                                        {...props}
                                                        placeholder="Expiry Date"
                                                        error={formik.touched.expiry_date && Boolean(formik.errors.expiry_date)}
                                                        helperText={formik.touched.expiry_date && formik.errors.expiry_date}
                                                    />
                                                )}
                                            />
                                        </Stack>
                                    </Grid>
                                    <Grid item xs={12}>
                                        <Stack spacing={1}>
                                            <InputLabel>Count</InputLabel>
                                            <TextField
                                                fullWidth
                                                id="available_count"
                                                name="available_count"
                                                value={formik.values.available_count}
                                                onChange={formik.handleChange}
                                                error={formik.touched.available_count && Boolean(formik.errors.available_count)}
                                                helperText={formik.touched.available_count && formik.errors.available_count}
                                            />
                                        </Stack>
                                    </Grid>
                                    <Grid item xs={12}>
                                        <Stack spacing={1}>
                                            <InputLabel>Discount</InputLabel>
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
export default AddCoupon;
