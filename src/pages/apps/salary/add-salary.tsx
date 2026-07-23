import { useRouter } from 'next/router';
import { ReactElement, useEffect, useState } from 'react';
// next
// third-party
import { useFormik } from 'formik';
import * as yup from 'yup';
// material-ui
import {
    Autocomplete,
    Box,
    Button,
    FormControl,
    FormHelperText,
    Grid,
    InputLabel,
    MenuItem,
    Select,
    Stack,
    TextField,
    useTheme,
} from '@mui/material';
// project import
import MainCard from 'components/MainCard';
import Page from 'components/Page';
import Layout from 'layout';
// assets
import AnimateButton from 'components/@extended/AnimateButton';

import { addSalary } from 'services/salary';
import { EssentialMethods } from 'utils/essentialMethods';
import { errorColor, successColor } from 'config';
import CustomButton from 'components/custom-button';
import { Salary } from 'types/salary';
import { editSalary } from 'services/salary';
import { DesktopDatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { addDays, isToday } from 'date-fns';

// ==============================|| ADD NEW SALARY - MAIN ||============================== //

const validationSchema = yup.object().shape({
});

const AddSalary = (props: any) => {
    const initialFormValues: Salary = {
        employee: "",
        basic: "",
        total_salary: "",
        date_issued: "",
        month: "",
        service_incentive_amount: "",
        product_incentive_amount: "",
        deduction: "",
        paid: false,
        note: ""
    }
    const theme = useTheme();
    const router = useRouter();
    const [formData, setFormData] = useState<Salary>(initialFormValues);
    const { data, accessibility = true, id } = props
    const [isSubmitting, setIsSubmitting] = useState(false);
    const emp_types = [
        { name: "Staff", element: "Staff" },
        { name: "Manager", element: "Manager" }
    ]

    useEffect(() => {
        if (props && data != undefined) {
            setFormData({ ...data })
        }
    }, [])

    const formik = useFormik({
        initialValues: formData,
        enableReinitialize: true,
        validationSchema,
        onSubmit: async (values, { setSubmitting }) => {
            var response;
            if (accessibility && data) {
                response = await editSalary(values);
            } else {
                response = await addSalary(values);
            }
            if (response.data.status === 200) {
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
        <Page title="Add Salary">
            <MainCard>
                <form onSubmit={formik.handleSubmit}>
                    <Box>
                        <Grid container spacing={3}>
                            <Grid item xs={12} md={4}>
                                <Stack spacing={1}>
                                    <InputLabel htmlFor="name">Basic Salary<span style={{ color: 'red' }}>*</span>
                                    </InputLabel>
                                    <TextField
                                        fullWidth
                                        id="basic"
                                        name="basic"
                                        placeholder="Please Enter Basic Salary"
                                        value={formik.values.basic}
                                        onChange={formik.handleChange}
                                        disabled={!accessibility}
                                        error={formik.touched.basic && Boolean(formik.errors.basic)}
                                        helperText={formik.touched.basic && formik.errors.basic}
                                    />
                                </Stack>
                            </Grid>
                            <Grid item xs={12} md={4}>
                                <Stack spacing={1}>
                                    <InputLabel htmlFor="name">Date Issued<span style={{ color: 'red' }}>*</span>
                                    </InputLabel>
                                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                                        <Stack spacing={3}>
                                            <DesktopDatePicker
                                                inputFormat="yyyy-MM-dd"
                                                value={formik.values.date_issued}
                                                onChange={(date_issued: any) => {
                                                    formik.setFieldValue('date_issued', date_issued);
                                                }}
                                                renderInput={(props) => (
                                                    <TextField
                                                        name="date_issued"
                                                        fullWidth
                                                        {...props}
                                                        placeholder="Valid From"
                                                        error={formik.touched.date_issued && Boolean(formik.errors.date_issued)}
                                                        helperText={formik.touched.date_issued && formik.errors.date_issued}
                                                    />
                                                )}
                                                minDate={id ? undefined : isToday(new Date()) ? new Date() : addDays(new Date(), 1)}
                                                maxDate={undefined}
                                            />
                                        </Stack>
                                    </LocalizationProvider>

                                </Stack>
                            </Grid>
                            <Grid item xs={12} md={4}>
                                <Stack spacing={1}>
                                    <InputLabel htmlFor="sap-code">Employee Type<span style={{ color: 'red' }}>*</span>
                                    </InputLabel>
                                    <Autocomplete
                                        id="employee"
                                        value={formik.values.employee}
                                        onChange={(event: any, newValue: string | null) => {
                                            formik.setFieldValue('employee', newValue);
                                        }}
                                        options={emp_types.map((item) => item.element)}
                                        isOptionEqualToValue={(option, value) => option === value}
                                        renderInput={(params) => (
                                            <TextField
                                                {...params}
                                                placeholder="Please Select Employee Type"
                                                error={formik.touched.employee && Boolean(formik.errors.employee)}
                                                helperText={formik.touched.employee && formik.errors.employee}
                                                sx={{ '& .MuiAutocomplete-input.Mui-disabled': { WebkitTextFillColor: theme.palette.text.primary } }}
                                            />
                                        )}
                                    />
                                </Stack>
                            </Grid>
                            <Grid item xs={12} md={4}>
                                <Stack spacing={1}>
                                    <InputLabel htmlFor="address">Service Incentive<span style={{ color: 'red' }}>*</span>
                                    </InputLabel>
                                    <TextField
                                        fullWidth
                                        id="service_incentive_amount"
                                        name="service_incentive_amount"
                                        placeholder="Please Enter Service Incentive"
                                        value={formik.values.service_incentive_amount}
                                        onChange={formik.handleChange}
                                        disabled={true}
                                        error={formik.touched.service_incentive_amount && Boolean(formik.errors.service_incentive_amount)}
                                        helperText={formik.touched.service_incentive_amount && formik.errors.service_incentive_amount}
                                    />
                                </Stack>
                            </Grid>
                            <Grid item xs={12} md={4}>
                                <Stack spacing={1}>
                                    <InputLabel htmlFor="pan-no">Product Incentive<span style={{ color: 'red' }}>*</span>
                                    </InputLabel>
                                    <TextField
                                        fullWidth
                                        id="product_incentive_amount"
                                        name="product_incentive_amount"
                                        placeholder="Please Enter Product Incentive"
                                        value={formik.values.product_incentive_amount}
                                        onChange={formik.handleChange}
                                        disabled={true}
                                        error={formik.touched.product_incentive_amount && Boolean(formik.errors.product_incentive_amount)}
                                        helperText={formik.touched.product_incentive_amount && formik.errors.product_incentive_amount}
                                    />
                                </Stack>
                            </Grid>
                            <Grid item xs={12} md={4}>
                                <Stack spacing={1}>
                                    <InputLabel htmlFor="pan-no">Total Salary<span style={{ color: 'red' }}>*</span>
                                    </InputLabel>
                                    <TextField
                                        fullWidth
                                        id="total_salary"
                                        name="total_salary"
                                        placeholder="Please Enter Total Salary"
                                        value={formik.values.total_salary}
                                        onChange={formik.handleChange}
                                        disabled={true}
                                        error={formik.touched.total_salary && Boolean(formik.errors.total_salary)}
                                        helperText={formik.touched.total_salary && formik.errors.total_salary}
                                    />
                                </Stack>
                            </Grid>
                            {id !== undefined ? (
                                <Grid item xs={12} md={4}>
                                    <Stack spacing={1}>
                                        <InputLabel htmlFor="status">
                                            Paid
                                        </InputLabel>
                                        <FormControl sx={{ m: 1, minWidth: 120 }}>
                                            <Select
                                                id="paid"
                                                {...formik.getFieldProps('paid')}
                                                disabled={!accessibility}
                                                displayEmpty
                                                defaultValue={formik.values.paid ? 'Paid' : 'Pending'} // Set the default value based on formik.values.paid
                                            >
                                                <MenuItem value="Paid">Paid</MenuItem>
                                                <MenuItem value="Pending">Pending</MenuItem>
                                            </Select>
                                            {formik.touched.paid && formik.errors.paid && (
                                                <FormHelperText error id="standard-weight-helper-text-email-login">
                                                    {formik.errors.paid}
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
                    </Box>
                </form>
            </MainCard>
        </Page>
    );
}

AddSalary.getLayout = function getLayout(page: ReactElement) {
    return <Layout>{page}</Layout>;
};

export default AddSalary;