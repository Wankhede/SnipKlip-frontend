import { MouseEvent, ReactElement, useMemo } from 'react';

// netx
import { useRouter } from 'next/router';
import { useSession } from "next-auth/react";
// material-ui
import {
    Button,
    Chip,
    Grid,
    Stack,
    Tooltip,
} from '@mui/material';
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
import { CloseOutlined, EditTwoTone, EyeTwoTone, PlusOutlined } from '@ant-design/icons';
import { FormattedMessage } from 'react-intl';
import { Booking } from 'types/bookings';
import { EssentialMethods } from 'utils/essentialMethods';
import { useUserProfile } from '../user-provider';
import { BookingC } from 'models/booking';

// ==============================|| REACT TABLE ||============================== //

const JobApplicantionList = () => {
    const theme = useTheme();
    const router = useRouter();
    const paginationData = { pageIndex: 0, pageSize: 10 } // Here pageSize means row count.
    const { data: session } = useSession();
    const { userData, loading } = useUserProfile();
    const getTableRows = async (tableParams: getTableRowsDataI) => {
        try {
            const mergedParams = { ...tableParams, ...userData };
            return listBooking(mergedParams);
        } catch (error) {
            console.error('Error retrieving employee data:', error);
            return [];
        }
    }
    const AddButton: JSX.Element = <Button variant="contained" startIcon={<PlusOutlined />} onClick={() => router.push('/apps/job/add-job-post')}>Add Job Post</Button>
    const updateTableRows = (bookingData: Booking) => {
        return editBooking(bookingData)
    }

    const columns = useMemo(
        () => [
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
                                        router.push(`/apps/bookings/view/${row.original.id}`)
                                    }}
                                >
                                    {collapseIcon}
                                </IconButton>
                            </Tooltip>
                            <Tooltip title="Edit">
                                <IconButton
                                    color="primary"
                                    onClick={(e: MouseEvent<HTMLButtonElement>) => {
                                        // e.stopPropagation();
                                        router.push(`/apps/bookings/edit/${row.original.invoice_id}`)
                                    }}
                                >
                                    <EditTwoTone twoToneColor={theme.palette.primary.main} />
                                </IconButton>
                            </Tooltip>
                        </Stack>
                    );
                }
            },
            {
                Header: <FormattedMessage id="applicant-name" />,
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
                Cell: ({ value }: { value: any }) => {
                    return `₹${value}`
                }
            },
            {
                Header: <FormattedMessage id="staff" />,
                accessor: 'staff_assigned',
                Cell: ({ value }: { value: any }) => {
                    return value.map((emp: any) => {
                        return <Chip key={emp.mobile} color="success" label={emp.first_name} size="small" variant="light" />
                    })
                }
            },
            {
                Header: <FormattedMessage id="booking-status" />,
                accessor: 'booking_status',
                Cell: ({ value }: { value: boolean }) => {
                    switch (value) {
                        case false:
                            return <Chip color="error" label="Pending" size="small" variant="light" />;
                        case true:
                            return <Chip color="success" label="Availed" size="small" variant="light" />;
                        default:
                            return <Chip color="info" label="Booked" size="small" variant="light" />;
                    }
                }
            },
            {
                Header: <FormattedMessage id="payment-status" />,
                accessor: 'isPaid',
                Cell: ({ value }: { value: boolean }) => {
                    switch (value) {
                        case false:
                            return <Chip color="error" label="Not Paid" size="small" variant="light" />;
                        case true:
                            return <Chip color="success" label="Paid" size="small" variant="light" />;
                        default:
                            return <Chip color="info" label="Pending" size="small" variant="light" />;
                    }
                }
            },
            {
                Header: <FormattedMessage id='added-on' />,
                accessor: 'createdAt',
                dataType: 'text',
                Cell: ({ value }: { value: string }) => {
                    const formattedDateTime = formatDate(value, 'EEE, dd MMM yyyy HH:mm');
                    return <span>{formattedDateTime}</span>;
                },
                width: '250'
            },
        ] as Column[],
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [theme]
    );

    return (
        <Page title="Job Applications List">
            <MainCard content={false}>
                <ScrollX>
                    <CustomTable columns={columns} paginationData={paginationData} updateTableValues={updateTableRows} editable={false} getTableRows={getTableRows} addButton={AddButton} filename='Bookings.csv'
                        searchColumns={Object.getOwnPropertyNames(new BookingC)}
                    />
                </ScrollX>
            </MainCard>
        </Page>
    );
};

JobApplicantionList.getLayout = function getLayout(page: ReactElement) {
    return <Layout>{page}</Layout>;
};

export default JobApplicantionList;
