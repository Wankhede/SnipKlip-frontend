import { ReactElement, useState } from 'react';

// project import
import Layout from 'layout';
import Page from 'components/Page';
import Calendar from 'pages/apps/calendar';
import { Grid } from '@mui/material';
// ==============================|| DASHBOARD - DEFAULT ||============================== //

const DashboardDefault = () => {

  return (
    <Page title="Default Dashboard">
      <Grid container rowSpacing={4.5} columnSpacing={2.75}>
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
