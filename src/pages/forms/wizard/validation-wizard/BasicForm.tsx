// material-ui
import { Button, Grid, InputLabel, Stack, Typography, TextField, Select, MenuItem } from '@mui/material';

// third-party
import { useFormik } from 'formik';
import * as yup from 'yup';
import React, { useState } from 'react';


// project imports
import AnimateButton from 'components/@extended/AnimateButton';
import { ChangeEvent } from 'react';

const validationSchema = yup.object({
  salonName: yup.string().required('Salon Name is required'),
  address: yup.string().required('address is required'),
  contactNumber: yup
    .string()
    .required('Contact Number is required')
    .matches(/^\d{10}$/, 'Mobile number must be 10 digits'),
  city: yup.string().required('City is required'),
  state: yup.string().required('State is required'),
  pinCode: yup
    .string()
    .required('Pincode is required')
    .matches(/^\d{6}$/, 'Pin Code must be 6 digits')
});


// ==============================|| VALIDATION WIZARD - ADDRESS  ||============================== //

// TODO: Keep only necessary files for now - Amitabh
export type BasicData = {
  salonName?: string;
  contactNumber?: string;
  address?: string;
  locality?: string;
  city?: string;
  state?: string;
  pinCode?: string;
  latitude?: number;
  longitude?: number;
};

interface BasicFormProps {
  basicData: BasicData;
  setBasicData: (d: BasicData) => void;
  handleNext: () => void;
  setErrorIndex: (i: number | null) => void;
}

const BasicForm = ({ basicData, setBasicData, handleNext, setErrorIndex }: BasicFormProps) => {
  const [selectedState, setSelectedState] = useState<string>('');

  // Define the list of states in India
  const statesInIndia: string[] = [
    'Andhra Pradesh',
    'Arunachal Pradesh',
    'Assam',
    'Bihar',
    'Chhattisgarh',
    'Goa',
    'Gujarat',
    'Haryana',
    'Himachal Pradesh',
    'Jharkhand',
    'Karnataka',
    'Kerala',
    'Madhya Pradesh',
    'Maharashtra',
    'Manipur',
    'Meghalaya',
    'Mizoram',
    'Nagaland',
    'Odisha',
    'Punjab',
    'Rajasthan',
    'Sikkim',
    'Tamil Nadu',
    'Telangana',
    'Tripura',
    'Uttar Pradesh',
    'Uttarakhand',
    'West Bengal',
    'Andaman and Nicobar Islands',
    'Chandigarh',
    'Dadra and Nagar Haveli and Daman and Diu',
    'Delhi',
    'Lakshadweep',
    'Puducherry',
  ];

  // Handle change in the dropdown selection
  const handleStateChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedState(event.target.value);
  };
  const formik = useFormik({
    initialValues: {
      salonName: basicData.salonName || '',
      contactNumber: basicData.contactNumber || '',
      address: basicData.address || '',
      locality: basicData.locality || '',
      city: basicData.city || '',
      state: basicData.state || '',
      pinCode: basicData.pinCode || '',
      latitude: basicData.latitude || 0,
      longitude: basicData.longitude || 0
    },
    validationSchema,
    onSubmit: (values) => {
      setBasicData({
        salonName: values.salonName,
        contactNumber: values.contactNumber,
        address: values.address,
        locality: values.locality,
        city: values.city,
        state: values.state,
        pinCode: values.pinCode,
        latitude: values.latitude,
        longitude: values.longitude
      });
      handleNext();
    }
  });

  return (
    <>
      <Typography variant="h5" gutterBottom sx={{ mb: 2 }}>
        Basic Details
      </Typography>
      <form onSubmit={formik.handleSubmit} id="validation-forms">
        <Grid container spacing={1}>
          <Grid item xs={12} sm={12}>
            <Stack spacing={1}>
              <InputLabel>Branch Name *</InputLabel>
              <TextField
                id="salonName"
                name="salonName"
                placeholder="Salon Name"
                fullWidth
                autoComplete="Salon-name"
                value={formik.values.salonName}
                onChange={formik.handleChange}
                error={formik.touched.salonName && Boolean(formik.errors.salonName)}
                helperText={formik.touched.salonName && formik.errors.salonName}
              />
            </Stack>
          </Grid>
          <Grid item xs={12}>
            <Stack spacing={1}>
              <InputLabel>Branch Contact Number</InputLabel>
              <TextField
                id="contactNumber"
                name="contactNumber"
                placeholder="Contact Number"
                fullWidth
                autoComplete="Contact-Number"
                value={formik.values.contactNumber}
                onChange={(e: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
                  const value = e.target.value;
                  if (/^[0-9]*$/.test(value) && value.length <= 10) {
                    formik.handleChange(e);
                  }
                }}
                error={formik.touched.contactNumber && Boolean(formik.errors.contactNumber)}
                helperText={formik.touched.contactNumber && formik.errors.contactNumber}
              />
            </Stack>
          </Grid>
          <Grid item xs={12}>
            <Stack spacing={1}>
              <InputLabel>Address</InputLabel>
              <TextField
                id="address"
                name="address"
                placeholder="Address"
                fullWidth
                autoComplete="address"
                value={formik.values.address}
                onChange={formik.handleChange}
                error={formik.touched.address && Boolean(formik.errors.address)}
                helperText={formik.touched.address && formik.errors.address}
              />
            </Stack>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Stack spacing={1}>
              <InputLabel>Enter City</InputLabel>
              <TextField
                id="city"
                name="city"
                placeholder="City"
                fullWidth
                autoComplete="City"
                value={formik.values.city}
                onChange={(e: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
                  const value = e.target.value;
                  if (/\D/.test(value)) {
                    formik.handleChange(e);
                  }
                }}
                error={formik.touched.city && Boolean(formik.errors.city)}
                helperText={formik.touched.city && formik.errors.city}
              />
            </Stack>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Stack spacing={1}>
              <InputLabel>Enter State</InputLabel>
              <TextField
                id="state"
                name="state"
                placeholder="State/Province/Region"
                fullWidth
                value={formik.values.state}
                onChange={(e: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
                  const value = e.target.value;
                  if (/\D/.test(value)) {
                    formik.handleChange(e);
                  }
                }}
                error={formik.touched.state && Boolean(formik.errors.state)}
                helperText={formik.touched.state && formik.errors.state}
              />
            </Stack>
          </Grid>

          <Grid item xs={12} sm={10}>
            <Stack spacing={0.5}>
              <InputLabel>Enter Pin Code *</InputLabel>
              <TextField
                id="pinCode"
                name="pinCode"
                placeholder="Pin Code"
                fullWidth
                value={formik.values.pinCode}
                onChange={(e: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
                  const value = e.target.value;
                  if (/^[0-9]*$/.test(value) && value.length <= 6) {
                    formik.handleChange(e);
                  }
                }}
                error={formik.touched.pinCode && Boolean(formik.errors.pinCode)}
                helperText={formik.touched.pinCode && formik.errors.pinCode}
              />
            </Stack>
          </Grid>
          <Grid item xs={12}>
            <Stack direction="row" justifyContent="flex-end">
              <AnimateButton>
                <Button variant="contained" sx={{ my: 3, ml: 1 }} type="submit" onClick={() => setErrorIndex(0)}>
                  Next
                </Button>
              </AnimateButton>
            </Stack>
          </Grid>
        </Grid>
      </form>
    </>
  );
};

export default BasicForm;