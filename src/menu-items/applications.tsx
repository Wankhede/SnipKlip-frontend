// third-party
import { FormattedMessage } from 'react-intl';

// assets
import {
    AppstoreAddOutlined,
    AppstoreTwoTone,
    BuildOutlined,
    CalendarOutlined,
    CustomerServiceOutlined,
    FileDoneOutlined,
    FileTextOutlined,
    MessageOutlined,
    SettingTwoTone,
    ShoppingCartOutlined,
    BlockOutlined,
    TeamOutlined,
    CarOutlined,
    CopyOutlined,
    UserOutlined,
    ControlOutlined,
    AppstoreOutlined,
    ProjectOutlined,
    HomeOutlined,
    PlusOutlined,
    CalculatorOutlined,
    UnorderedListOutlined,
    QuestionOutlined
} from '@ant-design/icons';

// type
import { NavActionType, NavItemType } from 'types/menu';

// icons
const icons = {
    BuildOutlined,
    CalendarOutlined,
    CustomerServiceOutlined,
    MessageOutlined,
    ShoppingCartOutlined,
    UserOutlined,
    AppstoreAddOutlined,
    FileTextOutlined,
    FileDoneOutlined,
    SettingTwoTone,
    AppstoreTwoTone,
    BlockOutlined,
    TeamOutlined,
    CarOutlined,
    CopyOutlined,
    ControlOutlined,
    AppstoreOutlined,
    ProjectOutlined,
    HomeOutlined,
    PlusOutlined,
    CalculatorOutlined,
    UnorderedListOutlined,
    QuestionOutlined
};

// ==============================|| MENU ITEMS - APPLICATIONS ||============================== //

const applications: NavItemType = {
    id: 'group-applications',
    title: <FormattedMessage id="applications" />,
    icon: icons.AppstoreAddOutlined,
    type: 'group',
    children: [
        {
            id: 'bookings',
            title: <FormattedMessage id="bookings" />,
            type: 'item',
            icon: icons.PlusOutlined,
            url: '/apps/bookings/manage-bookings',
            accessKey: 'WEB_HEADER_BOOKING',
            actions: [
                {
                    type: NavActionType.LINK,
                    label: 'Add Booking',
                    url: '/apps/bookings/add-bookings',
                    icon: icons.PlusOutlined
                }
            ]
        },
        {
            id: 'customers',
            title: <FormattedMessage id="customers" />,
            type: 'item',
            icon: icons.TeamOutlined,
            url: '/apps/customers/manage-customers',
            accessKey: 'WEB_HEADER_CUSTOMER',
            actions: [
                {
                    type: NavActionType.LINK,
                    label: 'Add Customer',
                    url: '/apps/customers/add-customer',
                    icon: icons.PlusOutlined
                }
            ]
        },
        {
            id: 'invoice',
            title: <FormattedMessage id="invoice" />,
            type: 'item',
            icon: icons.FileTextOutlined,
            url: '/apps/invoices/manage-invoices',
            accessKey: 'WEB_HEADER_BILLING',
            actions: [
                {
                    type: NavActionType.LINK,
                    label: 'Add Invoice',
                    url: '/apps/invoices/add-invoices',
                    icon: icons.PlusOutlined
                }
            ]
        },
        {
            id: 'employees',
            title: <FormattedMessage id="employees" />,
            type: 'item',
            icon: icons.UserOutlined,
            url: '/apps/employees/manage-employees',
            accessKey: 'WEB_HEADER_EMPLOYEE',
            actions: [
                {
                    type: NavActionType.LINK,
                    label: 'Add Employee',
                    url: '/apps/employees/add-employees',
                    icon: icons.PlusOutlined
                }
            ]
        },
        {
            id: 'services',
            title: <FormattedMessage id="services" />,
            type: 'item',
            icon: icons.CustomerServiceOutlined,
            url: '/apps/services/manage-service',
            accessKey: 'WEB_HEADER_SERVICE',
            actions: [
                {
                    type: NavActionType.LINK,
                    label: 'Add Service',
                    url: '/apps/services/add-service',
                    icon: icons.PlusOutlined
                }
            ]
        },
        {
            id: 'salary',
            title: <FormattedMessage id="salary" />,
            type: 'item',
            icon: icons.CalculatorOutlined,
            url: '/apps/salary/manage-salary',
            accessKey: 'WEB_HEADER_SALARY',
            actions: [
                {
                    type: NavActionType.LINK,
                    label: 'Add Salary',
                    url: '/apps/salary/add-salary',
                    icon: icons.PlusOutlined
                }
            ]
        },
        {
            id: 'kanban',
            title: <FormattedMessage id="kanban" />,
            type: 'item',
            icon: icons.BuildOutlined,
            url: '/apps/kanban/board',
            accessKey: 'WEB_HEADER_KANABN'
        },
        {
            id: 'review',
            title: <FormattedMessage id="review" />,
            type: 'item',
            icon: icons.FileDoneOutlined,
            url: '/apps/reviews/manage-reviews',
            accessKey: 'WEB_HEADER_REVIEW'
        },
        {
            id: 'reports',
            title: <FormattedMessage id="reports" />,
            type: 'item',
            icon: icons.ProjectOutlined,
            url: '/apps/reports/default',
            accessKey: 'WEB_HEADER_REPORT'
        },
        {
            id: 'inventory',
            title: <FormattedMessage id="inventory" />,
            type: 'item',
            icon: icons.ShoppingCartOutlined,
            url: '/apps/e-commerce/product/manage-product',
            accessKey: 'WEB_HEADER_INVENTORY'
        },
        {
            id: 'expenses',
            title: <FormattedMessage id="expenses" />,
            type: 'item',
            icon: icons.BuildOutlined,
            url: '/apps/expenses/manage-expenses',
            accessKey: 'WEB_HEADER_EXPENSE'
        },
        {
            id: 'membership',
            title: <FormattedMessage id="membership" />,
            type: 'item',
            icon: icons.ControlOutlined,
            url: '/apps/membership/manage-membership',
            accessKey: 'WEB_HEADER_MEMBERSHIP'
        },
        {
            id: 'coupon',
            title: <FormattedMessage id="coupon" />,
            type: 'item',
            icon: icons.FileDoneOutlined,
            url: '/apps/coupon/manage-coupon',
            accessKey: 'WEB_HEADER_COUPON'
        },
        {
            id: 'admin',
            title: <FormattedMessage id="admin" />,
            type: 'item',
            icon: icons.BuildOutlined,
            url: '/apps/subscription/account/subscriptions',
            accessKey: 'WEB_HEADER_ADMIN_DASHBOARD'
        },
        {
            id: 'listings',
            title: <FormattedMessage id="listings" />,
            type: 'collapse',
            icon: icons.UnorderedListOutlined,
            accessKey: 'WEB_HEADER_LISTING',
            children: [
                {
                    id: 'user-profile',
                    title: <FormattedMessage id="user-profile" />,
                    type: 'item',
                    url: '/apps/profiles/user/personal',
                    breadcrumbs: false,
                    accessKey: 'WEB_HEADER_LISTING_PERSONAL'
                },
                {
                    id: 'salon-profile',
                    title: <FormattedMessage id="salon-profile" />,
                    type: 'item',
                    url: '/apps/profiles/account/basic',
                    accessKey: 'WEB_HEADER_LISTING_SALON'
                }
            ]
        }
        // {
        //     id: 'chat',
        //     title: <FormattedMessage id="chat" />,
        //     type: 'item',
        //     url: '/apps/chat',
        //     icon: icons.MessageOutlined,
        //     breadcrumbs: false,
        // },
        // {
        //     id: 'hiring',
        //     title: <FormattedMessage id="hiring" />,
        //     type: 'item',
        //     icon: icons.BuildOutlined,
        //     url: '/apps/job/job-applications',
        //     accessKey: 'WEB_HEADER_HIRING',
        //     disabled: true
        // },
        // {
        //     id: 'apply-job',
        //     title: <FormattedMessage id="apply-job" />,
        //     type: 'item',
        //     icon: icons.BuildOutlined,
        //     url: '/apps/job/jobs',
        //     accessKey: 'WEB_HEADER_HIRING',
        //     disabled: true
        // },
    ]
};

export default applications;
