import { useMemo, MouseEvent, ReactElement, useState } from 'react';

// material-ui
import { useTheme } from '@mui/material/styles';
import { Button, Chip, Dialog, Stack, Tooltip } from '@mui/material';

// third-party
import { Column } from 'react-table';

// project import
import Layout from 'layout';
import Page from 'components/Page';
import MainCard from 'components/MainCard';
import ScrollX from 'components/ScrollX';
import { editCustomer, listCustomer } from 'services/customers';
import CustomTable from 'components/custom-table';
import { getTableRowsDataI } from 'types/common';
import formatDate from 'utils/date-format';
import IconButton from 'components/@extended/IconButton';

// assets
import { CloseOutlined, PlusOutlined, EyeTwoTone, EditTwoTone } from '@ant-design/icons';
import { FormattedMessage } from 'react-intl';
import { PopupTransition } from 'components/@extended/Transitions';
import { EssentialComponents } from 'components/essentialComponents';
import { EssentialMethods } from 'utils/essentialMethods';
import { apps } from 'data/apps';
import { Customer } from 'types/customers';
import AddCustomer from './add-customer';
import { useRouter } from 'next/router';
import { useUserProfile } from '../user-provider';
import { CustomerC } from 'models/customer';
// ==============================|| REACT TABLE ||============================== //

const CustomerList = () => {
    const theme = useTheme();
    const paginationData = { pageIndex: 0, pageSize: 10 }; // Here pageSize means row count.
    const [add, setAdd] = useState<boolean>(false);
    const router = useRouter();
    const { userData, loading } = useUserProfile();
    const tableRefresh = () => {
        setRefresh(refresh + 1);
    };
    const [refresh, setRefresh] = useState(0);
    const handleAdd = () => {
        setAdd(!add);
    };
    const BulkUploadButton = (
        <>
            {
                <EssentialComponents.uploadButton
                    acceptType=".csv"
                    bulkUploadApi={EssentialMethods.uploadFile}
                    template={apps['customer']['template']}
                />
            }

            {<EssentialComponents.downloadSampleExcel template={apps['customer']['template']} />}
        </>
    );
    const getTableRows = async (tableParams: getTableRowsDataI) => {
        try {
            const mergedParams = { ...tableParams, ...userData };
            return listCustomer(mergedParams);
        } catch (error) {
            // Handle any errors that occur during the API call
            console.error('Error retrieving employee data:', error);
            return [];
        }
    };
    const updateTableRows = (customerData: Customer) => {
        return editCustomer(customerData);
    };
    const AddButton: JSX.Element = (
        <Button variant="contained" startIcon={<PlusOutlined />} onClick={handleAdd}>
            Add Customer
        </Button>
    );

    const columns = useMemo(
        () =>
            [
                {
                    Header: 'Actions',
                    className: 'cell-center',
                    disableSortBy: true,
                    dataType: 'action',
                    disableFilters: true,
                    Cell: ({ row }: { row: any }) => {
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
                                            router.push(`/apps/customers/view/${row.original.id}`);
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
                                            router.push(`/apps/customers/edit/${row.original.id}`);
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
                    Header: <FormattedMessage id="customer-name" />,
                    accessor: 'customer_name'
                },
                {
                    Header: <FormattedMessage id="mobile-no" />,
                    accessor: 'mobile'
                },
                {
                    Header: <FormattedMessage id="email" />,
                    accessor: 'email'
                },
                {
                    Header: <FormattedMessage id="joined-date" />,
                    accessor: 'date_joined',
                    Cell: ({ value }: { value: string }) => {
                        const formattedDateTime = formatDate(value, 'EEE, dd MMM yyyy HH:mm');
                        return <span>{formattedDateTime}</span>;
                    },
                    width: '250'
                },
                {
                    Header: <FormattedMessage id="status" />,
                    accessor: 'status',
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
                }
            ] as Column[],
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [theme]
    );

    return (
        <Page title="Customer List">
            <MainCard content={false}>
                {!loading && userData && (
                    <>
                        <ScrollX>
                            <CustomTable
                                key={refresh}
                                columns={columns}
                                paginationData={paginationData}
                                updateTableValues={updateTableRows}
                                editable={false}
                                getTableRows={getTableRows}
                                addButton={AddButton}
                                bulkUploadButton={BulkUploadButton}
                                filename="customers.csv"
                                searchColumns={Object.getOwnPropertyNames(new CustomerC())}
                            />
                        </ScrollX>
                        <Dialog
                            maxWidth="sm"
                            TransitionComponent={PopupTransition}
                            keepMounted
                            fullWidth
                            onClose={handleAdd}
                            open={add}
                            sx={{ '& .MuiDialog-paper': { p: 0 }, transition: 'transform 225ms' }}
                            aria-describedby="alert-dialog-slide-description"
                        >
                            {add && (
                                <AddCustomer accessibility={true} handleCancel={handleAdd} title="View Form" tableRefresh={tableRefresh} />
                            )}
                        </Dialog>
                    </>
                )}
            </MainCard>
        </Page>
    );
};

CustomerList.getLayout = function getLayout(page: ReactElement) {
    return <Layout>{page}</Layout>;
};

export default CustomerList;
