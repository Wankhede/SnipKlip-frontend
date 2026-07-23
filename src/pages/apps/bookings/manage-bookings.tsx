import { MouseEvent, ReactElement, useMemo, useState } from 'react';

// netx
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import AlertBookingAvail from './avail-booking';

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
import Layout from 'layout';
import CustomTable from 'components/custom-table';
import { editBooking, listBooking } from 'services/bookings';
import { getTableRowsDataI } from 'types/common';
import formatDate from 'utils/date-format';

// assets
import { CloseOutlined, EditTwoTone, EyeTwoTone, PlusOutlined, CheckOutlined } from '@ant-design/icons';
import { FormattedMessage } from 'react-intl';
import { Booking } from 'types/bookings';
import AlertBookingDelete from './delete-booking';
import NumberFormat from 'react-number-format';
import { useUserProfile } from '../user-provider';
import { BookingC } from 'models/booking';

// ==============================|| MANAGE BOOKING ||============================== //

const BookingList = () => {
    const theme = useTheme();
    const router = useRouter();
    const paginationData = { pageIndex: 0, pageSize: 10 };
    const { data: session } = useSession();
    const [open, setOpen] = useState<boolean>(false);
    const [availopen, setOpenAvail] = useState<boolean>(false);
    const [bookingDeleteId, setBookingDeleteId] = useState<any>('');
    const [bookingId, setBookingId] = useState<any>('');
    const { userData, loading } = useUserProfile();
    const demo_account = localStorage.getItem('demo_account');
    const demoAccount = demo_account === 'true' ? true : false;
    const tableRefresh = () => {
        setRefresh(refresh + 1);
    };
    const [refresh, setRefresh] = useState(0);
    const handleClose = () => {
        setOpen(!open);
    };

    const handleCloseAvail = () => {
        setOpenAvail(!availopen);
    };

    const getTableRows = async (tableParams: getTableRowsDataI) => {
        try {
            console.log(loading, userData);
            const mergedParams = { ...tableParams, ...userData, no_filter: false, 'category': 'Service' };
            if (demoAccount) {
                return listBooking(mergedParams, true);
            }
            return listBooking(mergedParams);
        } catch (error) {
            console.error('Error retrieving employee data:', error);
            return [];
        }
    };

    const AddButton: JSX.Element = (
        <Button variant="contained" startIcon={<PlusOutlined />} onClick={() => router.push('/apps/bookings/add-bookings')}>
            Add Booking
        </Button>
    );
    const updateTableRows = (bookingData: Booking) => {
        return editBooking(bookingData);
    };

    const columns = useMemo(
        () =>
            [
                {
                    Header: 'Actions',
                    className: 'cell-center',
                    disableSortBy: true,
                    dataType: 'action',
                    disableFilters: true,
                    Cell: ({ row }: { row: Row<Booking> }) => {
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
                                            // e.stopPropagation();
                                            router.push(`/apps/bookings/view/${row.original.invoice_id}`);
                                        }}
                                    >
                                        {collapseIcon}
                                    </IconButton>
                                </Tooltip>
                                {row.original.booking_status === 'Booked' &&
                                    <Tooltip title="Edit">
                                        <IconButton
                                            color="primary"
                                            onClick={(e: MouseEvent<HTMLButtonElement>) => {
                                                // e.stopPropagation();
                                                router.push(`/apps/bookings/edit/${row.original.invoice_id}`);
                                            }}
                                        >
                                            <EditTwoTone twoToneColor={theme.palette.primary.main} />
                                        </IconButton>
                                    </Tooltip>
                                }
                                <Tooltip title="Cancel Booking">
                                    <IconButton
                                        color="error"
                                        onClick={(e: MouseEvent<HTMLButtonElement>) => {
                                            e.stopPropagation();
                                            handleClose();
                                            setBookingDeleteId(row.original.id);
                                        }}
                                    >
                                        <CloseOutlined />
                                    </IconButton>
                                </Tooltip>
                                {row.original.booking_status !== 'Availed' &&
                                    <Tooltip title="Done">
                                        <IconButton
                                            color="success"
                                            onClick={(e: MouseEvent<HTMLButtonElement>) => {
                                                e.stopPropagation();
                                                handleCloseAvail();
                                                setBookingId(row.original.invoice_id);
                                            }}
                                        >
                                            <CheckOutlined />
                                        </IconButton>
                                    </Tooltip>
                                }
                            </Stack>
                        );

                    }
                },
                {
                    Header: <FormattedMessage id="customer-name" />,
                    accessor: 'customer_name',
                    dataType: 'text'
                },
                {
                    Header: <FormattedMessage id="booking-date" />,
                    accessor: 'booking_date',
                    dataType: 'text'
                },
                {
                    Header: <FormattedMessage id="start-time" />,
                    accessor: 'start_time',
                    dataType: 'text'
                },
                {
                    Header: <FormattedMessage id="end-time" />,
                    accessor: 'end_time',
                    dataType: 'text'
                },
                {
                    Header: <FormattedMessage id="amount" />,
                    accessor: 'price',
                    dataType: 'text',
                    Cell: ({ value }: { value: number }) => <NumberFormat value={value} displayType="text" thousandSeparator prefix="₹ " />
                },
                {
                    Header: <FormattedMessage id="staff" />,
                    accessor: 'staff_assigned',
                    Cell: ({ value }: { value: any }) => {
                        return value.map((emp: any) => {
                            return <Chip key={emp.mobile} color="success" label={emp.customer_name} size="small" variant="light" />;
                        });
                    }
                },
                {
                    Header: <FormattedMessage id="booking-status" />,
                    accessor: 'booking_status',
                    Cell: ({ value }: { value: string }) => {
                        switch (value) {
                            case 'Booked':
                                return <Chip color="info" label="Booked" size="small" variant="light" />;
                            case 'Availed':
                                return <Chip color="success" label="Availed" size="small" variant="light" />;
                            case 'Cancelled by salon':
                                return <Chip color="error" label="Cancelled By Salon" size="small" variant="light" />;
                            case 'Cancelled by user':
                                return <Chip color="error" label="Cancelled By user" size="small" variant="light" />;
                            default:
                                return <Chip color="primary" label="Pending" size="small" variant="light" />;
                        }
                    }
                },
                {
                    Header: <FormattedMessage id="payment-status" />,
                    accessor: 'payment_status',
                    Cell: ({ value }: { value: string }) => {
                        switch (value) {
                            case 'Not Paid':
                                return <Chip color="error" label="Not Paid" size="small" variant="light" />;
                            case 'Paid':
                                return <Chip color="success" label="Paid" size="small" variant="light" />;
                            default:
                                return <Chip color="info" label="Pending" size="small" variant="light" />;
                        }
                    }
                },
                {
                    Header: <FormattedMessage id="added-on" />,
                    accessor: 'createdAt',
                    dataType: 'text',
                    Cell: ({ value }: { value: string }) => {
                        const formattedDateTime = formatDate(value, 'EEE, dd MMM yyyy HH:mm');
                        return <span>{formattedDateTime}</span>;
                    },
                    width: '250'
                }
            ] as Column[],
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [theme]
    );

    return (
        <Page title="Bookings List">
            <MainCard content={false}>
                {!loading && userData && (
                    <ScrollX>
                        <CustomTable
                            key={refresh}
                            columns={columns}
                            paginationData={paginationData}
                            updateTableValues={updateTableRows}
                            editable={false}
                            getTableRows={getTableRows}
                            addButton={AddButton}
                            filename="Bookings.csv"
                            searchColumns={Object.getOwnPropertyNames(new BookingC)}
                        />
                        <AlertBookingDelete title={bookingDeleteId} open={open} handleClose={handleClose} tableRefresh={tableRefresh} />
                        <AlertBookingAvail title={bookingId} open={availopen} handleClose={handleCloseAvail} tableRefresh={tableRefresh} />
                    </ScrollX>
                )}
            </MainCard>
        </Page>
    );
};

BookingList.getLayout = function getLayout(page: ReactElement) {
    return <Layout>{page}</Layout>;
};

export default BookingList;
