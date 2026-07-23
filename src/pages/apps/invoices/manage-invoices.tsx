import { MouseEvent, ReactElement, useCallback, useMemo } from 'react';

// material-ui
import { Button, Chip, Stack, Tooltip } from '@mui/material';
import { useTheme } from '@mui/material/styles';

// third-party
import { Column, Row } from 'react-table';

// project import
import IconButton from 'components/@extended/IconButton';
import MainCard from 'components/MainCard';
import Page from 'components/Page';
import ScrollX from 'components/ScrollX';
import CustomTable from 'components/custom-table';
import Layout from 'layout';

// Next Js Routing
import { useRouter } from 'next/router';

import { CheckOutlined, CloseOutlined, EditTwoTone, EyeTwoTone, PlusOutlined } from '@ant-design/icons';

// import interfaces';
import { getTableRowsDataI } from 'types/common';
import { FormattedMessage } from 'react-intl';
import { listInvoice, sendReviewNotification } from 'services/invoices';
import { Invoice } from 'types/invoice';
import formatDate from 'utils/date-format';
import { useSession } from 'next-auth/react';
import NumberFormat from 'react-number-format';
import { useUserProfile } from '../user-provider';
import { errorColor, successColor } from 'config';
import { EssentialMethods } from 'utils/essentialMethods';
import { ExpenseC } from 'models/expense';
import useListRefresh from 'hooks/useListRefresh';


const InvoiceList = () => {
    const theme = useTheme();
    const router = useRouter();
    const { refreshKey } = useListRefresh('/apps/invoices/manage-invoices');
    const paginationData = { pageIndex: 0, pageSize: 10 } // Here pageSize means row count.
    const { data: session } = useSession();
    const { userData, loading } = useUserProfile();
    const demo_account = localStorage.getItem('demo_account');
    const demoAccount = demo_account === 'true' ? true : false;
    const getTableRows = async (tableParams: getTableRowsDataI) => {
        const mergedParams = { ...tableParams, ...userData };
        if (demoAccount) {
            return listInvoice(mergedParams, true)
        }
        return listInvoice(mergedParams)
    }

    const AddButton = (
        <Button variant="contained" startIcon={<PlusOutlined />} onClick={() => router.push('/apps/invoices/add-invoices')}>
            Add Invoice
        </Button>
    );

    const subscription_name = localStorage.getItem('subscription_name');

    const sendForReview = useCallback(async (id: number, _customer_name: string) => {
        try {
            const formData = {
                invoice_id: id,
                customer_name: _customer_name,
            };
            const response = await sendReviewNotification(formData);
            if (response.data.status === 200) {
                console.log('Review notification sent successfully!');
                EssentialMethods.showSnackbar(response.data.message, successColor);
            } else {
                console.error('Failed to send review notification');
                EssentialMethods.showSnackbar(response.data.message, errorColor);
            }
        } catch (error) {
            console.error('An error occurred while sending review notification:', error);
        }
    }, []);

    const columns = useMemo(() => {
        const baseColumns = [
            {
                Header: 'Actions',
                className: 'cell-center',
                disableSortBy: true,
                Cell: ({ row }: { row: Row<Invoice> }) => {
                    const collapseIcon = row.isExpanded ? (
                        <CloseOutlined style={{ color: theme.palette.error.main }} />
                    ) : (
                        <EyeTwoTone twoToneColor={theme.palette.secondary.main} />
                    );
                    return (
                        <Stack direction="row" alignItems="center" justifyContent="center" spacing={0}>
                            <Tooltip title="View">
                                <IconButton
                                    color="secondary"
                                    onClick={(e: MouseEvent<HTMLButtonElement>) => {
                                        router.push(`/apps/invoices/view/${row.original.id}`);
                                    }}
                                >
                                    {collapseIcon}
                                </IconButton>
                            </Tooltip>
                            {row.original.status !== 'CANCELLED' &&
                                <Tooltip title="Edit">
                                    <IconButton
                                        color="primary"
                                        onClick={(e: MouseEvent<HTMLButtonElement>) => {
                                            router.push(`/apps/invoices/edit/${row.original.id}`);
                                        }}
                                    >
                                        <EditTwoTone twoToneColor={theme.palette.primary.main} />
                                    </IconButton>
                                </Tooltip>
                            }
                        </Stack>
                    );
                },
            },
            // {
            //     Header: 'Send Notification To Whatsapp',
            //     accessor: 'send_notification',
            //     className: 'cell-center',
            //     disableSortBy: true,
            //     show: subscription_name === 'PREMIUM',
            //     dataType: 'action',
            //     disableFilters: true,
            //     Cell: ({ row }: { row: Row<Invoice> }) => {
            //         const collapseIcon = row.isExpanded ? (
            //             <CloseOutlined style={{ color: theme.palette.error.main }} />
            //         ) : (
            //             <EyeTwoTone twoToneColor={theme.palette.secondary.main} />
            //         );
            //         return (
            //             <Stack direction="row" alignItems="center" justifyContent="center" spacing={0}>
            //                 <Tooltip title="Send Notification">
            //                     <IconButton
            //                         color="success"
            //                         onClick={(e) => {
            //                             e.stopPropagation();
            //                             const { id, customer_name } = row.original
            //                             sendForReview(id!, customer_name!)
            //                         }}
            //                     >
            //                         <CheckOutlined />
            //                     </IconButton>
            //                 </Tooltip>
            //             </Stack>
            //         );
            //     },
            // },
            {
                Header: <FormattedMessage id="customer-name" />,
                accessor: 'customer_name',
            },
            {
                Header: <FormattedMessage id="invoice-date" />,
                accessor: 'date_created',
                Cell: ({ value }: { value: string }) => {
                    const formattedDateTime = formatDate(value, 'EEE, dd MMM yyyy HH:mm');
                    return <span>{formattedDateTime}</span>;
                },
                width: '250'
            },
            {
                Header: <FormattedMessage id="amount" />,
                accessor: 'actual_amount',
                Cell: ({ value }: { value: number }) => <NumberFormat value={value} displayType="text" thousandSeparator prefix="Rs " />,
            },
            {
                Header: <FormattedMessage id="payment-due" />,
                accessor: 'due_payment',
                Cell: ({ value }: { value: number }) => <NumberFormat value={value} displayType="text" thousandSeparator prefix="₹ " />,
            },
            {
                Header: <FormattedMessage id="mode-of-payment" />,
                accessor: 'mode_of_payment',
                Cell: ({ value }: { value: string }) => (
                    <Chip
                        color="success"
                        label={value === 'CASH' || value === 'CARD' || value === 'UPI' ? value : 'OTHERS'}
                        size="small"
                        variant="light"
                    />
                ),
            },
            {
                Header: <FormattedMessage id="status" />,
                accessor: 'status',
                Cell: ({ value }: { value: string }) => {
                    switch (value) {
                        case 'Cancelled':
                            return <Chip color="info" label="Cancelled" size="small" variant="light" />;
                        case 'Unpaid':
                            return <Chip color="error" label="Not Paid" size="small" variant="light" />;
                        case 'Paid':
                            return <Chip color="success" label="Paid" size="small" variant="light" />;
                        default:
                            return <Chip color="info" label="Pending" size="small" variant="light" />;
                    }
                }
            },
        ] as Column[];

        // Filter out columns based on the show property
        return baseColumns;
    }, [theme, subscription_name]);

    return (
        <Page title="Invoices List">
            <MainCard content={false}>
                {!loading && userData && (
                    <ScrollX>
                        <CustomTable columns={columns} paginationData={paginationData} getTableRows={getTableRows} addButton={AddButton} searchColumns={Object.getOwnPropertyNames(new ExpenseC)} refreshKey={refreshKey} />
                    </ScrollX>
                )}
            </MainCard>
        </Page>
    );
};

InvoiceList.getLayout = function getLayout(page: ReactElement) {
    return <Layout>{page}</Layout>;
};

export default InvoiceList;