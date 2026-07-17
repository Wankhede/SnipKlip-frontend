import { ReactElement } from 'react';

// project import
import Layout from 'layout';
import Page from 'components/Page';
import Dashboard from './dashboard';

// ==============================|| DASHBOARD - DEFAULT ||============================== //

const DashboardDefault = () => {
  return (
    <Page title="Default Dashboard">
      <Dashboard/>
    </Page>
  );
};

DashboardDefault.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

export default DashboardDefault;
