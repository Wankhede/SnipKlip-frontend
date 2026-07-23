import { useMemo, MouseEvent, ReactElement, useState } from 'react';

// netx
import { useRouter } from 'next/router';

// material-ui
import { useTheme } from '@mui/material/styles';
import {
    Button,
    Chip,
    Stack,
    Tooltip,
} from '@mui/material';

// third-party
import {
    Column,
    Row,
} from 'react-table';

// project import
import Layout from 'layout';
import Page from 'components/Page';
import MainCard from 'components/MainCard';
import ScrollX from 'components/ScrollX';
import CustomTable from 'components/custom-table';
import { getTableRowsDataI } from 'types/common';
import formatDate from 'utils/date-format';
import IconButton from 'components/@extended/IconButton';

// assets
import { CloseOutlined, PlusOutlined, EyeTwoTone, EditTwoTone } from '@ant-design/icons';
import { FormattedMessage } from 'react-intl';
import { Expense } from 'types/expenses';
import { EssentialMethods } from 'utils/essentialMethods';
import { useSession } from 'next-auth/react';
import { Coupon } from 'types/coupon';
import { editCoupon, listCoupon } from 'services/coupon';
import AddCoupon from './add-coupon';
import NumberFormat from 'react-number-format';
import { useUserProfile } from '../user-provider';
import { EmployeeC } from 'models/employee';
// ==============================|| REACT TABLE ||============================== //

const CouponList = () => {
    const theme = useTheme();
    const router = useRouter();
    const { data: session } = useSession();
    const [id, setId] = useState<any>(null);
    const [accessibility, setAccessibility] = useState(true);
    const [title, setTitle] = useState('Add Coupon')
    const paginationData = { pageIndex: 0, pageSize: 10 } // Here pageSize means row count.
    const [openDrawer, setOpenDrawer] = useState<boolean>(false);
    const [refreshData, setRefreshData] = useState<number>(0);
    const handleDrawerOpen = () => {
        setOpenDrawer((prevState) => !prevState);
        if (openDrawer)
            setRefreshData(Date.now());
    };


    const { userData, loading } = useUserProfile();
    // const BulkUploadButton =
    //     <>
    //         {<EssentialComponents.uploadButton
    //             acceptType=".csv"
    //             bulkUploadApi={EssentialMethods.uploadFile}
    //             template={apps['coupon']['template']}
    //         />}

    //         {<EssentialComponents.downloadSampleExcel template={apps['coupon']['template']}
    //         />}
    //     </>
    const getTableRows = async (tableParams: getTableRowsDataI) => {
        const mergedParams = { ...tableParams, ...userData };
        return listCoupon(mergedParams)
    }
    const updateTableRows = (expenseData: Coupon) => {
        return editCoupon(expenseData)
    }
    const AddButton: JSX.Element = <Button variant="contained" startIcon={<PlusOutlined />} onClick={() => {
        handleDrawerOpen();
        setTitle('Add Coupon');
        setAccessibility(true);
    }}>Add Coupon</Button>

    const columns = useMemo(() => [
        {
            Header: 'Actions',
            className: 'cell-center',
            disableSortBy: true,
            dataType: 'action',
            disableFilters: true,
            Cell: ({ row }: { row: Row<Expense> }) => {
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
                                // onClick={addStory}
                                onClick={(e: MouseEvent<HTMLButtonElement>) => {
                                    router.push(`/apps/coupon/view/${row.original.id}`);
                                }}
                            >
                                {collapseIcon}
                            </IconButton>
                        </Tooltip>
                        <Tooltip title="Edit">
                            <IconButton
                                color="primary"
                                // onClick={addStory}
                                onClick={(e: MouseEvent<HTMLButtonElement>) => {
                                    router.push(`/apps/coupon/edit/${row.original.id}`);
                                }}
                            >
                                <EditTwoTone twoToneColor={theme.palette.primary.main} />
                            </IconButton>
                        </Tooltip>
                    </Stack >
                );
            }
        },
        {
            Header: <FormattedMessage id="coupon-code" />,
            accessor: 'coupon_code',
            dataType: 'text'
        },
        {
            Header: <FormattedMessage id="min-value" />,
            accessor: 'minimum_value_amount',
            dataType: 'text',
            Cell: ({ value }: { value: number }) => <NumberFormat value={value} displayType="text" thousandSeparator prefix="₹" />
        },
        {
            Header: <FormattedMessage id="discount-percent" />,
            accessor: 'discount_percent',
            dataType: 'text',
            Cell: ({ value }: { value: number }) => <NumberFormat value={value} displayType="text" thousandSeparator suffix='%' />
        },
        {
            Header: <FormattedMessage id="count" />,
            accessor: 'available_count',
            dataType: 'text',
        },
        {
            Header: <FormattedMessage id="expiry-date" />,
            accessor: 'expiry_date',
            Cell: ({ value }: { value: string }) => {
                const formattedDateTime = formatDate(value, 'EEE, dd MMM yyyy');
                return <span>{formattedDateTime}</span>;
            },
            width: EssentialMethods.setColumnWidth("added_on")
        },
        {
            Header: <FormattedMessage id="status" />,
            accessor: 'status',
            dataType: 'select',
            Cell: ({ value }: { value: string }) => {
                switch (value) {
                    case 'Inactive':
                        return <Chip color="error" label="Inactive" size="small" variant="light" />;
                    case 'Active':
                        return <Chip color="success" label="Active" size="small" variant="light" />;
                    default:
                        return <Chip color="info" label="Pending" size="small" variant="light" />;
                }
            }
        },
    ] as Column[],
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [theme]
    );

    return (
        <Page title="Coupon List">
            <MainCard content={false}>
                <ScrollX>
                    {!loading && userData && (
                        <>
                            <AddCoupon open={openDrawer} accessibility={accessibility} handleDrawerOpen={handleDrawerOpen} title={title} id={id} />
                            <CustomTable key={refreshData} columns={columns} updateTableValues={updateTableRows} editable={false} paginationData={paginationData} columnResize={true} rowSelection={true} getTableRows={getTableRows} addButton={AddButton} filename='coupons.csv'
                                searchColumns={Object.getOwnPropertyNames(new EmployeeC)}
                            />
                        </>
                    )}
                </ScrollX>
            </MainCard>
        </Page>
    );
};

CouponList.getLayout = function getLayout(page: ReactElement) {
    return <Layout>{page}</Layout>;
};

export default CouponList;
