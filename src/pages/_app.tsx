import { useEffect, ReactElement, ReactNode } from 'react';

// scroll bar
import 'simplebar/src/simplebar.css';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { useRouter } from 'next/router';
// apex-chart
import 'styles/apex-chart.css';
import 'styles/react-table.css';
// next
import { NextPage } from 'next';
import { SessionProvider } from 'next-auth/react';
import type { AppProps } from 'next/app';

// third-party
import { Provider as ReduxProvider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';

// project import
import ThemeCustomization from 'themes';

import Locales from 'components/Locales';
import ScrollTop from 'components/ScrollTop';
import RTLLayout from 'components/RTLLayout';
import Snackbar from 'components/@extended/Snackbar';
import Notistack from 'components/third-party/Notistack';

import { ConfigProvider } from 'contexts/ConfigContext';
import { store, persister, dispatch } from 'store';
import { fetchDashboard } from 'store/reducers/menu';
import AccessControlProvider from './apps/access-provider';
import UserProvider from './apps/user-provider';

// types
type LayoutProps = NextPage & {
  getLayout?: (page: ReactElement) => ReactNode;
};

interface Props {
  Component: LayoutProps;
  pageProps: any;
}

// ==============================|| APP - THEME, ROUTER, LOCAL  ||============================== //
export default function App({ Component, pageProps }: AppProps & Props) {
  const getLayout = Component.getLayout ?? ((page: any) => page);
  const router = useRouter();

  // Prefetch menu/dashboard in the background — never block first paint.
  useEffect(() => {
    dispatch(fetchDashboard()).catch(() => undefined);
  }, []);


  const updateCurrentPage = () => {
    const current_page = router.asPath
    if (current_page.startsWith('/apps/employees/')) {
      localStorage.setItem('current_page', 'WEB_HEADER_EMPLOYEE');
    } else if (current_page.startsWith('/dashboard/default/')) {
      localStorage.setItem('current_page', 'WEB_HEADER_DASHBOARD');
    } else if (current_page.startsWith('/apps/invoices/')) {
      localStorage.setItem('current_page', 'WEB_HEADER_BILLING');
    } else if (current_page.startsWith('/apps/reports/')) {
      localStorage.setItem('current_page', 'WEB_HEADER_REPORT');
    } else if (current_page.startsWith('/apps/customers/')) {
      localStorage.setItem('current_page', 'WEB_HEADER_CUSTOMER');
    } else if (current_page.startsWith('/apps/e-commerce/')) {
      localStorage.setItem('current_page', 'WEB_HEADER_INVENTORY');
    } else if (current_page.startsWith('/apps/expenses/')) {
      localStorage.setItem('current_page', 'WEB_HEADER_EXPENSE');
    } else if (current_page.startsWith('/apps/coupon/')) {
      localStorage.setItem('current_page', 'WEB_HEADER_COUPON');
    } else if (current_page.startsWith('/apps/membership/')) {
      localStorage.setItem('current_page', 'WEB_HEADER_MEMBERSHIP');
    } else if (current_page.startsWith('/apps/reviews/')) {
      localStorage.setItem('current_page', 'WEB_HEADER_REVIEW');
    } else if (current_page.startsWith('/apps/bookings/')) {
      localStorage.setItem('current_page', 'WEB_HEADER_BOOKING');
    }
  };

  useEffect(() => {
    // Update localStorage based on the current path
    updateCurrentPage();

    // Function to handle the visibility change event
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        updateCurrentPage();
      }
    };

    // Add event listeners
    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Cleanup event listeners on component unmount
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [router.asPath]);



  return (
    <ReduxProvider store={store}>
      <PersistGate loading={null} persistor={persister}>
        <ConfigProvider>
          <ThemeCustomization>
            <RTLLayout>
              <Locales>
                <ScrollTop>
                  <SessionProvider session={pageProps.session} refetchInterval={0} refetchOnWindowFocus={false}>
                    <UserProvider>
                      <AccessControlProvider>
                        <>
                          <Notistack>
                            <Snackbar />
                            {getLayout(<Component {...pageProps} />)}
                          </Notistack>
                        </>
                      </AccessControlProvider>
                    </UserProvider>
                  </SessionProvider>
                </ScrollTop>
              </Locales>
            </RTLLayout>
          </ThemeCustomization>
        </ConfigProvider>
      </PersistGate>
    </ReduxProvider>
  );
}