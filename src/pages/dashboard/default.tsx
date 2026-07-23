import { ReactElement } from 'react';
import { useRouter } from 'next/router';

// project import
import Layout from 'layout';
import Page from 'components/Page';
import Calendar from 'pages/apps/calendar';
import { Button, Grid, Stack, Typography } from '@mui/material';
import { BOOKING_NEXT_PATH } from 'utils/onboarding-navigation';
// ==============================|| DASHBOARD - DEFAULT ||============================== //

const DashboardDefault = () => {
  const router = useRouter();

  return (
    <Page title="Default Dashboard">
      <Grid container rowSpacing={4.5} columnSpacing={2.75}>
        <Grid item xs={12}>
          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            spacing={2}
            alignItems={{ xs: 'stretch', sm: 'center' }}
            justifyContent="space-between"
            sx={{
              p: 2.5,
              borderRadius: 2,
              bgcolor: 'primary.lighter',
              border: '1px solid',
              borderColor: 'primary.light'
            }}
          >
            <Stack spacing={0.5}>
              <Typography variant="h4">Ready for the next booking?</Typography>
              <Typography variant="body2" color="text.secondary">
                Jump straight into the Booking Next workflow without hunting through the menu.
              </Typography>
            </Stack>
            <Button
              variant="contained"
              color="primary"
              size="large"
              onClick={() => router.push(BOOKING_NEXT_PATH)}
              sx={{ minWidth: 180, whiteSpace: 'nowrap' }}
            >
              Booking Next
            </Button>
          </Stack>
        </Grid>
        <Grid item md={8} sx={{ display: { sm: 'none', md: 'block', lg: 'none' } }} />
        <Grid item xs={12} md={7} lg={12}>
          <Calendar />
        </Grid>
      </Grid>
    </Page>
  );
};

DashboardDefault.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

export default DashboardDefault;
