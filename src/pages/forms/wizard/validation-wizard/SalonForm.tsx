// material-ui
import {Button, Grid, InputLabel, Stack, TextField, Typography, Select, MenuItem } from '@mui/material';

// third-party
import { useFormik } from 'formik';
import * as yup from 'yup';
import { getSession } from 'next-auth/react';


// project imports
import AnimateButton from 'components/@extended/AnimateButton';

const validationSchema = yup.object({
  NoOfSeat: yup.string().required('No. of Seats is required'),
  NoOfStaff: yup.string().required('No. of Staff is required'),
  salonType: yup.string().required('Salon Type is required'),
});

// ==============================|| VALIDATION WIZARD - PAYMENT ||============================== //

export type SalonData = {
  NoOfSeat?: number; 
  NoOfStaff?: number;
  salonType?: string;
  user_id?: string;
};

interface SalonFormProps {
  salonData: SalonData;
  setSalonData: (d: SalonData) => void;
  handleNext: () => void;
  handleBack: () => void;
  setErrorIndex: (i: number | null) => void;
}

export default function SalonForm({ salonData, setSalonData, handleNext, handleBack, setErrorIndex }: SalonFormProps) {

  const formik = useFormik({
    initialValues: {
      NoOfSeat: salonData.NoOfSeat,
      NoOfStaff: salonData.NoOfStaff,
      salonType: "UNISEX",
    },
    
    validationSchema,
    onSubmit: async (values) => {
      setSalonData({
        NoOfSeat: values.NoOfSeat,
        NoOfStaff: values.NoOfStaff,
        salonType: values.salonType,
      });
      handleNext();
    }
  });

  return (
    <>
      <Typography variant="h5" gutterBottom sx={{ mb: 2 }}>
        Salon Details
      </Typography>
      <form onSubmit={formik.handleSubmit}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Stack spacing={0.5}>
              <InputLabel>No of Seats</InputLabel>
              <TextField
                id="NoOfSeat"
                name="NoOfSeat"
                value={formik.values.NoOfSeat}
                onChange={formik.handleChange}
                error={formik.touched.NoOfSeat && Boolean(formik.errors.NoOfSeat)}
                helperText={formik.touched.NoOfSeat && formik.errors.NoOfSeat}
                placeholder="No of Seats"
                fullWidth
                autoComplete="No Of Seat"
              />
            </Stack>
          </Grid>
          <Grid item xs={12} md={6}>
            <Stack spacing={0.5}>
              <InputLabel>No of Staff</InputLabel>
              <TextField
                id="NoOfStaff"
                name="NoOfStaff"
                placeholder="No of Staff"
                value={formik.values.NoOfStaff}
                onChange={formik.handleChange}
                error={formik.touched.NoOfStaff && Boolean(formik.errors.NoOfStaff)}
                helperText={formik.touched.NoOfStaff && formik.errors.NoOfStaff}
                fullWidth
                autoComplete="cc-number"
              />
            </Stack>
          </Grid>

          <Grid item xs={12}>
            <Stack spacing={0.5}>
              <InputLabel>Select Salon Type</InputLabel>
              <Select
                  id="salonType"
                  name="salonType"
                  value={formik.values.salonType}
                  onChange={formik.handleChange}
                  error={formik.touched.salonType && Boolean(formik.errors.salonType)}
                  fullWidth
                  autoComplete="salon-type"
                >
                  <MenuItem value="">
                    <em>Select Salon Type</em>
                  </MenuItem>
                  <MenuItem value="MEN">Mens</MenuItem>
                  <MenuItem value="WOMEN">Womens</MenuItem>
                  <MenuItem value="UNISEX">Unisex</MenuItem>
              </Select>
              {formik.touched.salonType && formik.errors.salonType && (
                <Typography color="error">{formik.errors.salonType}</Typography>
              )}
            </Stack>
          </Grid>

          <Grid item xs={12}>
            <Stack direction="row" justifyContent="space-between">
              <Button onClick={handleBack} sx={{ my: 3, ml: 1 }}>
                Back
              </Button>
              <AnimateButton>
                <Button variant="contained" type="submit" sx={{ my: 3, ml: 1 }} onClick={() => setErrorIndex(1)}>
                  Next
                </Button>
              </AnimateButton>
            </Stack>
          </Grid>
        </Grid>
      </form>
    </>
  );
}