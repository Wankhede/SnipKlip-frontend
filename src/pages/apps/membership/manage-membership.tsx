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
import { Membership } from 'types/membership';
import { editMembership, listMembership } from 'services/membership';
import AddMembership from './add-membership';
import { useUserProfile } from '../user-provider';
import { BookingC } from 'models/booking';
import { title } from 'process';
// ==============================|| REACT TABLE ||============================== //

const MembershipList = () => {
    const theme = useTheme();
    const router = useRouter();
    const { data: session } = useSession();
    const [id, setId] = useState<any>(null);
    const [accessibility, setAccessibility] = useState(true);
    const [title, setTitle] = useState('Add Membership')
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
    //             template={apps['membership']['template']}
    //         />}

    //         {<EssentialComponents.downloadSampleExcel template={apps['membership']['template']}
    //         />}
    //     </>
    const getTableRows = async (tableParams: getTableRowsDataI) => {
        const mergedParams = { ...tableParams, ...userData };
        return listMembership(mergedParams)
    }
    const updateTableRows = (expenseData: Membership) => {
        return editMembership(expenseData)
    }
    const AddButton: JSX.Element = <Button variant="contained" startIcon={<PlusOutlined />} onClick={() => {
        handleDrawerOpen();
        setTitle('Add Membership');
        setAccessibility(true);
    }}>Add Membership</Button>

    const columns = useMemo(
        () => [
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
                                        // e.stopPropagation();
                                        setTitle('View Membership');
                                        setAccessibility(false);
                                        setId(row.original.id);
                                        handleDrawerOpen();
                                        // router.push(`/apps/membership/view/${row.original.id}`)
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
                                        // e.stopPropagation();
                                        setTitle('Edit Membership');
                                        setAccessibility(true);
                                        setId(row.original.id);
                                        handleDrawerOpen();
                                        // router.push(`/apps/membership/edit/${row.original.id}`)
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
                Header: <FormattedMessage id="customer" />,
                accessor: 'customer_name',
                dataType: 'text'
            },
            {
                Header: <FormattedMessage id="discount_percent" />,
                accessor: 'discount_percent',
                dataType: 'text'
            },
            {
                Header: 'Expiry Date',
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
        <Page title="Membership List">
            <MainCard content={false}>
                {!loading && userData && (
                    <ScrollX>
                        <AddMembership open={openDrawer} accessibility={accessibility} handleDrawerOpen={handleDrawerOpen} title={title} id={id} />
                        <CustomTable key={refreshData} columns={columns} updateTableValues={updateTableRows} editable={false} paginationData={paginationData} columnResize={true} rowSelection={true} getTableRows={getTableRows} addButton={AddButton} filename='membership.csv'
                            searchColumns={Object.getOwnPropertyNames(new BookingC)}
                        />

                    </ScrollX>
                )}
            </MainCard>
        </Page>
    );
};

MembershipList.getLayout = function getLayout(page: ReactElement) {
    return <Layout>{page}</Layout>;
};

export default MembershipList;
