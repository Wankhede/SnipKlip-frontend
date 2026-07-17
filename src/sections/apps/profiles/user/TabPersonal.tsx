
// material-ui
import { Box, Button, Divider, FormHelperText, Grid, InputLabel, MenuItem, Select, Stack, TextField } from '@mui/material';

// third party
import * as Yup from 'yup';
import { Formik } from 'formik';

import MainCard from 'components/MainCard';
import { EssentialMethods } from 'utils/essentialMethods';
import { errorColor, successColor } from 'config';
import * as yup from 'yup';
import { useEffect, useState } from 'react';
import { editUser, getUser } from 'services/user';
import { useUserProfile } from 'pages/apps/user-provider';
// ==============================|| TAB - PERSONAL ||============================== //

const initialFormValues = {
  first_name: '',
  last_name: '',
  email: '',
  dob: null,
  contact: '',
  gender: '',
  submit: null
}
const TabPersonal = () => {
  const maxDate = new Date();
  maxDate.setFullYear(maxDate.getFullYear() - 18);
  const validationSchema = yup.object({
      first_name: Yup.string()
      .max(255)
      .matches(/^[^\d]+$/, 'First Name cannot contain numbers')
      .required('First Name is required.'),
    last_name: Yup.string()
      .max(255)
      .matches(/^[^\d]+$/, 'Last Name cannot contain numbers')
      .required('Last Name is required.'),
      email: Yup.string().email('Invalid email address.').max(255).required('Email is required.'),
      dob: Yup.date().max(maxDate, 'Age should be 18+ years and DOB format should be YYYY-MM-DD.').required('Date of birth is requird.'),
      // mobile: Yup.number()
      //   .test('len', 'Contact should be exactly 10 digit', (val) => val?.toString().length === 10)
      //   .required('Phone number is required'),
  });
  const [formData, setFormData] = useState(initialFormValues);
  const { userData, loading } = useUserProfile();
  const fetchUserData = async () => {
    try {
      const response = await getUser(userData);
      setFormData(response.data.data);
    } catch (error) {
      // Handle any error that occurs during the data fetch
      console.error('Error fetching Salon data:', error);
    }
  };
  useEffect(() => {
    if (!loading && userData) {
      fetchUserData();
    }
  }, [loading, userData]);

  return (
    <MainCard content={false} title="Personal Information" sx={{ '& .MuiInputLabel-root': { fontSize: '0.875rem' } }}>
      <Formik
        initialValues={formData}
        enableReinitialize={true}
        validationSchema={validationSchema}
        onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
          try {
            var response;
            response = await editUser(values);
            if (response.data.status) {
              EssentialMethods.showSnackbar(response.data.message, successColor)
            } else {
              EssentialMethods.showSnackbar(response.data.message, errorColor)
            }
            setStatus({ success: false });
            setSubmitting(false);
          } catch (err: any) {
            setStatus({ success: false });
            setErrors({ submit: err.message });
            setSubmitting(false);
          }
        }}
      >
        {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, setFieldValue, touched, values }) => (
          <form noValidate onSubmit={handleSubmit}>
            <Box sx={{ p: 2.5 }}>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <Stack spacing={1.25}>
                    <InputLabel htmlFor="personal-first_name">First Name</InputLabel>
                    <TextField
                      fullWidth
                      id="personal-first_name"
                      value={values.first_name}
                      name="first_name"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      placeholder="First Name"
                      autoFocus
                    />
                    {touched.first_name && errors.first_name && (
                      <FormHelperText error id="personal-first-name-helper">
                        {errors.first_name}
                      </FormHelperText>
                    )}
                  </Stack>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Stack spacing={1.25}>
                    <InputLabel htmlFor="personal-last_name">Last Name</InputLabel>
                    <TextField
                      fullWidth
                      value={values.last_name}
                      name="last_name"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      id="personal-last_name"
                      placeholder="Last Name"
                    />
                    {touched.last_name && errors.last_name && (
                      <FormHelperText error id="personal-last-name-helper">
                        {errors.last_name}
                      </FormHelperText>
                    )}
                  </Stack>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Stack spacing={1.25}>
                    <InputLabel htmlFor="personal-email">Email Address</InputLabel>
                    <TextField
                      fullWidth
                      value={values.email}
                      name="email"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      id="personal-email"
                      placeholder="Email Address"
                    />
                    {touched.email && errors.email && (
                      <FormHelperText error id="personal-email-helper">
                        {errors.email}
                      </FormHelperText>
                    )}
                  </Stack>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Stack spacing={1.25}>
                    <InputLabel htmlFor="personal-dob">Date Of Birth</InputLabel>
                    <TextField
                      type="text"
                      fullWidth
                      value={values.dob}
                      name="dob"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      id="personal-dob"
                      placeholder="Date of Birth"
                    />
                    <small>DOB format:- YYYY-MM-DD</small>
                    {touched.dob && errors.dob && (
                      <FormHelperText error id="personal-dob-helper">
                        {errors.dob as String}
                      </FormHelperText>
                    )}
                  </Stack>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Stack spacing={1.25}>
                    <InputLabel htmlFor="personal-gender">Gender</InputLabel>
                    <Select value={values.gender} name="gender" onBlur={handleBlur} onChange={handleChange}>
                      <MenuItem value="Male">Male</MenuItem>
                      <MenuItem value="Female">Female</MenuItem>
                      <MenuItem value="Other">Other</MenuItem>
                    </Select>
                    {touched.gender && errors.gender && (
                      <FormHelperText error id="personal-contact-helper">
                        {errors.gender}
                      </FormHelperText>
                    )}
                  </Stack>
                </Grid>
                <Divider />
                <Box sx={{ p: 2.5 }}>
                  <Stack direction="row" justifyContent="flex-end" alignItems="center" spacing={2} sx={{ mt: 4.5 }}>
                    <Button disabled={isSubmitting} type="submit" variant="contained">
                      Save
                    </Button>
                  </Stack>
                </Box>
              </Grid>
            </Box>
          </form>
        )}
      </Formik>
    </MainCard>
  );
};

export default TabPersonal;
