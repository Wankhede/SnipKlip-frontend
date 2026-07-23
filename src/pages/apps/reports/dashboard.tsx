import { ReactElement, useEffect, useState } from 'react';

// material-ui
import { useTheme } from '@mui/material/styles';
import { Button, Grid, Stack, Typography } from '@mui/material';
import { getDashboardDetails } from 'services/dashboard';
// project import
import Layout from 'layout';
import Page from 'components/Page';
import IncomeChart from 'sections/dashboard/IncomeChart';
import SalesChart from 'sections/dashboard/SalesChart';
import RevenueChart from 'sections/dashboard/RevenueChart';
import PaymentChart from 'sections/dashboard/PaymentChart';
import AnalyticEcommerce from 'components/cards/statistics/AnalyticEcommerce';
import { useUserProfile } from '../user-provider';

// ==============================|| INVOICE - DASHBOARD ||============================== //
type Slot = 'week' | 'month' | 'year';

const status = [
  {
    value: 'today',
    label: 'Today'
  },
  {
    value: 'month',
    label: 'This Month'
  },
  {
    value: 'year',
    label: 'This Year'
  }
];
const Dashboard: any = () => {
  const [slot, setSlot] = useState<Slot>('week');
  const theme = useTheme();
  const [activeChart, setActiveChart] = useState<number>(0);
  const [bookingData, setBookingData] = useState("0");
  const [incomeData, setIncomeData] = useState("0");
  const [orderData, setOrderData] = useState("0");
  const [salesData, setSalesData] = useState("0");
  const { userData, loading } = useUserProfile();

  useEffect(() => {
    if (!loading && userData) {
      getDashboardDetails(userData)
        .then(response => {
          if (response && response.data) {
            setBookingData(response.data.data.todaysBooking);
            setIncomeData(response.data.data.todaysIncome);
            setOrderData(response.data.data.todaysWalkInBooking);
            setSalesData(response.data.data.todaysOnlineBooking);
          }
        })
    }
  }, [loading, userData]);
  const widgetData = [
    {
      title: 'Total',
      count: '£5678.09',
      percentage: 20.3,
      isLoss: true,
      invoice: '3',
      color: theme.palette.warning
    },
    {
      title: 'Paid',
      count: '£5678.09',
      percentage: -8.73,
      isLoss: true,
      invoice: '5',
      color: theme.palette.error
    },
    {
      title: 'Pending',
      count: '£5678.09',
      percentage: 10.73,
      isLoss: false,
      invoice: '20',
      color: theme.palette.success
    },
    {
      title: 'Overdue',
      count: '£5678.09',
      percentage: -4.73,
      isLoss: true,
      invoice: '5',
      color: theme.palette.primary
    }
  ];

  const [series, setSeries] = useState([
    {
      name: 'TEAM A',
      type: 'column',
      data: [23, 11, 22, 27, 13, 22, 37, 21, 44, 22, 30, 25]
    },
    {
      name: 'TEAM B',
      type: 'line',
      data: [30, 25, 36, 30, 45, 35, 64, 52, 59, 36, 39, 35]
    }
  ]);

  const handleSeries = (index: number) => {
    setActiveChart(index);
    switch (index) {
      case 1:
        setSeries([
          {
            name: 'TEAM A',
            type: 'column',
            data: [10, 15, 8, 12, 11, 7, 10, 13, 22, 10, 18, 4]
          },
          {
            name: 'TEAM B',
            type: 'line',
            data: [12, 18, 15, 17, 12, 10, 14, 16, 25, 17, 20, 8]
          }
        ]);
        break;
      case 2:
        setSeries([
          {
            name: 'TEAM A',
            type: 'column',
            data: [12, 11, 22, 27, 13, 22, 37, 21, 44, 22, 30, 25]
          },
          {
            name: 'TEAM B',
            type: 'line',
            data: [17, 25, 36, 30, 45, 35, 64, 52, 59, 36, 39, 35]
          }
        ]);
        break;
      case 3:
        setSeries([
          {
            name: 'TEAM A',
            type: 'column',
            data: [1, 2, 3, 5, 1, 0, 2, 0, 6, 1, 5, 3]
          },
          {
            name: 'TEAM B',
            type: 'line',
            data: [5, 3, 5, 6, 7, 0, 3, 1, 7, 3, 5, 4]
          }
        ]);
        break;
      case 0:
      default:
        setSeries([
          {
            name: 'TEAM A',
            type: 'column',
            data: [23, 11, 22, 27, 13, 22, 37, 21, 44, 22, 30, 25]
          },
          {
            name: 'TEAM B',
            type: 'line',
            data: [34, 25, 36, 30, 45, 35, 64, 52, 59, 36, 39, 35]
          }
        ]);
    }
  };
  const [value, setValue] = useState('today');
  return (
    <Page title="Default Dashboard">
      <Grid container spacing={2.5}>
        {/* <Grid item xs={12} sx={{ mb: -2.25 }}>
          <Typography variant="h5">Dashboard</Typography>
        </Grid> */}
        <Grid item xs={12} sm={6} md={4} lg={3}>
          <AnalyticEcommerce title="Today's Booking" count={bookingData} />
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={3}>
          <AnalyticEcommerce title="Today's Income" count={incomeData} />
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={3}>
          <AnalyticEcommerce title="Today's WalkIn Booking" count={orderData} />
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={3}>
          <AnalyticEcommerce title="Today's Online Booking" count={salesData} />
        </Grid>
        {/* <Grid item xs={12} lg={9}>
          <MainCard>
            <Grid container spacing={2}>
              {widgetData.map((data: any, index: number) => (
                <Grid item xs={12} sm={6} md={3} key={index}>
                  <Box onClick={() => handleSeries(index)} sx={{ cursor: 'pointer' }}>
                    <InvoiceWidgetCard
                      title={data.title}
                      count={data.count}
                      percentage={data.percentage}
                      isLoss={data.isLoss}
                      invoice={data.invoice}
                      color={data.color.main}
                      isActive={index === activeChart}
                    />
                  </Box>
                </Grid>
              ))}
              <Grid item xs={12}>
                <InvoiceIncomeAreaChart series={series} />
              </Grid>
            </Grid>
          </MainCard>
        </Grid>
        <Grid item xs={12} lg={3}>
          <InvoiceCard />
        </Grid>
        <Grid item sm={6} md={4} xs={12}>
          <InvoiceUserList />
        </Grid>
        <Grid item sm={6} md={4} xs={12}>
          <InvoicePieChart />
        </Grid>
        <Grid item sm={12} md={4} xs={12}>
          <InvoiceNotificationList />
        </Grid> */}
        <Grid item xs={12} md={7} lg={6}>
          <Grid container alignItems="center" justifyContent="space-between">
            <Grid item>
              <Typography variant="h5">Bookings vs Months Report</Typography>
            </Grid>
            <Grid item>
              <Stack direction="row" alignItems="center" spacing={0}>
                <Button
                  size="small"
                  onClick={() => setSlot('month')}
                  color={slot === 'month' ? 'primary' : 'secondary'}
                  variant={slot === 'month' ? 'outlined' : 'text'}
                >
                  Month
                </Button>
                <Button
                  size="small"
                  onClick={() => setSlot('week')}
                  color={slot === 'week' ? 'primary' : 'secondary'}
                  variant={slot === 'week' ? 'outlined' : 'text'}
                >
                  Week
                </Button>
              </Stack>
            </Grid>
          </Grid>
          <IncomeChart slot={slot} />
        </Grid>
        <Grid item xs={12} md={7} lg={6}>
          <Grid container alignItems="center" justifyContent="space-between">
            <Grid item>
              <Typography variant="h5">Income vs Employee Report</Typography>
            </Grid>
            <Grid item>
              <Stack direction="row" alignItems="center" spacing={0}>
                <Button
                  size="small"
                  onClick={() => setSlot('month')}
                  color={slot === 'month' ? 'primary' : 'secondary'}
                  variant={slot === 'month' ? 'outlined' : 'text'}
                >
                  Month
                </Button>
                <Button
                  size="small"
                  onClick={() => setSlot('week')}
                  color={slot === 'week' ? 'primary' : 'secondary'}
                  variant={slot === 'week' ? 'outlined' : 'text'}
                >
                  Week
                </Button>
              </Stack>
            </Grid>
          </Grid>
          <SalesChart slot={slot} />
        </Grid>
        <Grid item xs={12} md={7} lg={6}>
          <Grid container alignItems="center" justifyContent="space-between">
            <Grid item>
              <Typography variant="h5">Revenue vs Month Report</Typography>
            </Grid>
            <Grid item>
              <Stack direction="row" alignItems="center" spacing={0}>
                <Button
                  size="small"
                  onClick={() => setSlot('month')}
                  color={slot === 'month' ? 'primary' : 'secondary'}
                  variant={slot === 'month' ? 'outlined' : 'text'}
                >
                  Month
                </Button>
                <Button
                  size="small"
                  onClick={() => setSlot('week')}
                  color={slot === 'week' ? 'primary' : 'secondary'}
                  variant={slot === 'week' ? 'outlined' : 'text'}
                >
                  Week
                </Button>
              </Stack>
            </Grid>
          </Grid>
          <RevenueChart slot={slot} />
        </Grid>
        <Grid item xs={12} md={7} lg={6}>
          <Grid container alignItems="center" justifyContent="space-between">
            <Grid item>
              <Typography variant="h5">Payment Mode</Typography>
            </Grid>
            <Grid item>
              <Stack direction="row" alignItems="center" spacing={0}>
                <Button
                  size="small"
                  onClick={() => setSlot('month')}
                  color={slot === 'month' ? 'primary' : 'secondary'}
                  variant={slot === 'month' ? 'outlined' : 'text'}
                >
                  Month
                </Button>
                <Button
                  size="small"
                  onClick={() => setSlot('week')}
                  color={slot === 'week' ? 'primary' : 'secondary'}
                  variant={slot === 'week' ? 'outlined' : 'text'}
                >
                  Week
                </Button>
              </Stack>
            </Grid>
          </Grid>
          <PaymentChart slot={slot} />
        </Grid>
        {/* <Grid item xs={12} md={7} lg={8}>
          <Stack spacing={3}>
            <LabelledTasks />
            <ReaderCard />
          </Stack>
        </Grid>
        <Grid item xs={12} md={5} lg={4}>
          <AcquisitionChannels />
        </Grid> */}
      </Grid>
    </Page>
  );
};

Dashboard.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

export default Dashboard;