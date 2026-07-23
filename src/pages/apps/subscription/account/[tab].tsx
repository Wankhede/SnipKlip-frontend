import { ReactElement, useState } from 'react';

// next
import { useRouter } from 'next/router';

// material-ui
import { Box, Tab, Tabs } from '@mui/material';

// project import
import MainCard from 'components/MainCard';
import Page from 'components/Page';
import Layout from 'layout';
import TabSubscriptions from 'pages/apps/subscription/account/TabSubscriptions';

// assets
import { SettingOutlined, TeamOutlined } from '@ant-design/icons';
import CustomerCardPage from './salons';

// ==============================|| PROFILE - ACCOUNT ||============================== //

const AccountProfile = () => {
  const router = useRouter();
  const { tab } = router.query;

  const [value, setValue] = useState(tab);
  // ==============================|| ACCOUNT PROFILE - ROLE ||============================== //

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
    router.push(`/apps/subscription/account/${newValue}`);
  };

  return (
    <Page title="Admin Profile">
      <MainCard border={false} boxShadow>
        <Box sx={{ borderBottom: 1, borderColor: 'divider', width: '100%' }}>
          <Tabs value={value} onChange={handleChange} variant="scrollable" scrollButtons="auto" aria-label="account profile tab">
            <Tab label="Salon" icon={<TeamOutlined />} value="salons" iconPosition="start" />
            <Tab label="Subscription" icon={<SettingOutlined />} value="subscriptions" iconPosition="start" />
          </Tabs>
        </Box>
        <Box sx={{ mt: 2.5 }}>
          {tab === 'salons' && <CustomerCardPage />}
          {tab === 'subscriptions' && <TabSubscriptions />}
        </Box>
      </MainCard>
    </Page>
  );
};

AccountProfile.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

export default AccountProfile;

