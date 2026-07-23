import { useMemo, MouseEvent, ReactElement } from 'react';

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
import { editExpense, listExpense } from 'services/expenses';
import CustomTable from 'components/custom-table';
import { getTableRowsDataI } from 'types/common';
import formatDate from 'utils/date-format';
import IconButton from 'components/@extended/IconButton';

// assets
import { CloseOutlined, PlusOutlined, EyeTwoTone, EditTwoTone } from '@ant-design/icons';
import { FormattedMessage } from 'react-intl';
import { Expense } from 'types/expenses';
import { EssentialMethods } from 'utils/essentialMethods';
import { EssentialComponents } from 'components/essentialComponents';
import { apps } from 'data/apps';
import { useSession } from 'next-auth/react';
import NumberFormat from 'react-number-format';
import { useUserProfile } from '../user-provider';
import { ExpenseC } from 'models/expense';
import useListRefresh from 'hooks/useListRefresh';

// ==============================|| EXPESNE - MANAGE ||============================== //

const LSPTenderMappingList = () => {
    const theme = useTheme();
    const router = useRouter();
    const { refreshKey } = useListRefresh('/apps/expenses/manage-expenses');
    const paginationData = { pageIndex: 0, pageSize: 10 }
    const { userData, loading } = useUserProfile();
    const demo_account = localStorage.getItem('demo_account');
    const demoAccount = demo_account === 'true' ? true : false;
    const BulkUploadButton =
        <>
            {<EssentialComponents.uploadButton
                acceptType=".csv"
                bulkUploadApi={EssentialMethods.uploadFile}
                template={apps['expense']['template']}
            />}

            {<EssentialComponents.downloadSampleExcel template={apps['expense']['template']}
            />}
        </>
    const getTableRows = async (tableParams: getTableRowsDataI) => {
        const mergedParams = { ...tableParams, ...userData };
        if (demoAccount) {
            return listExpense(mergedParams, true)
        }
        return listExpense(mergedParams)
    }
    const updateTableRows = (expenseData: Expense) => {
        return editExpense(expenseData)
    }
    const AddButton: JSX.Element = <Button variant="contained" startIcon={<PlusOutlined />} onClick={() => router.push('/apps/expenses/add-expenses')}>Add Expense</Button>

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
                                    onClick={(e: MouseEvent<HTMLButtonElement>) => {
                                        // e.stopPropagation();
                                        router.push(`/apps/expenses/view/${row.original.id}`)
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
                                        router.push(`/apps/expenses/edit/${row.original.id}`)
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
                Header: <FormattedMessage id="desc" />,
                accessor: 'description',
                dataType: 'text'
            },
            {
                Header: <FormattedMessage id="amount" />,
                accessor: 'amount',
                dataType: 'text',
                Cell: ({ value }: { value: number }) => <NumberFormat value={value} displayType="text" thousandSeparator prefix="₹ " />
            },
            {
                Header: 'Added On',
                accessor: 'date',
                Cell: ({ value }: { value: string }) => {
                    const formattedDateTime = formatDate(value, 'EEE, dd MMM yyyy HH:mm');
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
        <Page title="Expenses List">
            <MainCard content={false}>
                {!loading && userData && (
                    <ScrollX>
                        <CustomTable columns={columns} updateTableValues={updateTableRows} editable={false} paginationData={paginationData} columnResize={true} rowSelection={true} getTableRows={getTableRows} addButton={AddButton} filename='expenses.csv'
                            searchColumns={Object.getOwnPropertyNames(new ExpenseC)}
                            refreshKey={refreshKey}
                        />
                    </ScrollX>
                )}
            </MainCard>
        </Page>
    );
};

LSPTenderMappingList.getLayout = function getLayout(page: ReactElement) {
    return <Layout>{page}</Layout>;
};

export default LSPTenderMappingList;
