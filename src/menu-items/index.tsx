// project import
import applications from './applications';
// import applications from './applications';
// import widget from './widget';
// import formsTables from './forms-tables';
// import chartsMap from './charts-map';
// import other from './other';
// import pages from './pages';

// types
import { NavItemType } from 'types/menu';
import { FormattedMessage } from 'react-intl';
// assets
import {
  DashboardOutlined
} from '@ant-design/icons';
import pages from './pages';
const icons = {
  DashboardOutlined,
};
// ==============================|| MENU ITEMS ||============================== //
const dashboardM: NavItemType = {
  id: 'group-dashboard',
  title: <FormattedMessage id="dashboard" />,
  type: 'group',
  icon: 'dashboardOutlined',
  children: [
    {
      id: 'dashboard',
      title: <FormattedMessage id="dashboard" />,
      type: 'item',
      icon:  icons.DashboardOutlined,
      url: '/dashboard/default',
      breadcrumbs: false,
      accessKey: 'WEB_HEADER_DASHBOARD'
    },
  ]
};
const menuItems: { items: NavItemType[] } = {
  items: [dashboardM, applications, pages]
};

export default menuItems;
