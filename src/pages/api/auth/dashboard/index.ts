// next
import { NextApiRequest, NextApiResponse } from 'next';

// types
import { NavItemType } from 'types/menu';

// ==============================|| MENU ITEMS - DASHBOARD  ||============================== //

const dashboard: NavItemType = {
  id: 'group-dashboard',
  title: 'dashboard',
  type: 'group',
  icon: 'dashboardOutlined',
  children: [
    {
      id: 'dashboard',
      title: 'dashboard',
      type: 'collapse',
      icon: 'dashboardOutlined',
      children: [
        {
          id: 'default',
          title: 'default',
          type: 'item',
          url: '/dashboard/default',
          breadcrumbs: false
        },
        {
          id: 'analytics',
          title: 'analytics',
          type: 'item',
          url: '/dashboard/analytics',
          breadcrumbs: false
        }
      ]
    },
    {
      id: 'components',
      title: 'components',
      type: 'item',
      url: '/components-overview/buttons',
      icon: 'goldOutlined',
      target: true,
      chip: {
        label: 'new',
        color: 'primary',
        size: 'small',
        variant: 'combined'
      }
    }
  ]
};

// ==============================|| MOCK SERVICES ||============================== //

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  res.status(200).json({ dashboard: dashboard });
}
