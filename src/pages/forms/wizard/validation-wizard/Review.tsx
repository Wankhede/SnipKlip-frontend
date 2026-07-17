// material-ui
import { Grid, Typography } from '@mui/material';

// ==============================|| VALIDATION WIZARD - REVIEW  ||============================== //
export default function Review({basicData,salonData}: any) {
  return (
    <>
      <Typography variant="h5" gutterBottom sx={{ mb: 2 }}>
        Summary
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
            Basic Info
          </Typography>
          <Typography gutterBottom>{basicData.salonName}</Typography>
        </Grid>
        <Grid item container direction="column" xs={12} sm={6}>
          <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
            Salon Info
          </Typography>
          <Typography gutterBottom>{salonData.salonType}</Typography>
        </Grid>
      </Grid>
    </>
  );
}
