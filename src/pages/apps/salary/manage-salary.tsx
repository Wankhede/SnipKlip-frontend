import { useMemo, MouseEvent, ReactElement, useEffect } from 'react';

// netx
import { useRouter } from 'next/router';

// material-ui
import { useTheme } from '@mui/material/styles';
import { Chip, Stack, Tooltip } from '@mui/material';

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
import IconButton from 'components/@extended/IconButton';
import { editEmployee } from 'services/employees';
import { getTableRowsDataI } from 'types/common';
import CustomTable from 'components/custom-table';
import formatDate from 'utils/date-format';
import { CloseOutlined, EyeTwoTone, EditTwoTone } from '@ant-design/icons';
import { FormattedMessage } from 'react-intl';
import { Employee } from 'types/employees';
import { EssentialMethods } from 'utils/essentialMethods';
import { EssentialComponents } from 'components/essentialComponents';
import { apps } from 'data/apps';
import { useSession } from 'next-auth/react';
import { listSalary } from 'services/salary';
import { useUserProfile } from '../user-provider';
import { BookingC } from 'models/booking';

// assets

// ==============================|| SALARY LIST - MAIN ||============================== //

const SalaryList = () => {
    const theme = useTheme();
    const router = useRouter();
    const paginationData = { pageIndex: 0, pageSize: 10 }
    const { userData, loading } = useUserProfile();
    const BulkUploadButton =
        <>
            {<EssentialComponents.uploadButton
                acceptType=".csv"
                bulkUploadApi={EssentialMethods.uploadFile}
                template={apps['employee']['template']}
            />}

            {<EssentialComponents.downloadSampleExcel template={apps['employee']['template']}
            />}
        </>
    const getTableRows = async (tableParams: getTableRowsDataI) => {
        try {
            const mergedParams = { ...tableParams, ...userData };
            return listSalary(mergedParams);
        } catch (error) {
            // Handle any errors that occur during the API call
            console.error('Error retrieving employee data:', error);
            return [];
        }
    }
    const updateTableRows = (employeeData: Employee) => {
        return editEmployee(employeeData)
    }
    // const AddButton: JSX.Element = <Button variant="contained" startIcon={<PlusOutlined />} onClick={() => router.push('/apps/employees/add-employees')}>Add Employee</Button>

    const columns = useMemo(
        () => [
            {
                Header: 'Actions',
                className: 'cell-center',
                disableSortBy: true,
                dataType: 'action',
                disableFilters: true,
                Cell: ({ row }: { row: Row<Employee> }) => {
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
                                        router.push(`/apps/employees/view/${row.original.id}`)
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
                                        router.push(`/apps/employees/edit/${row.original.id}`)
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
                Header: <FormattedMessage id="emp_name" />,
                accessor: 'customer_name',
                dataType: 'text',
            },
            {
                Header: <FormattedMessage id='email' />,
                accessor: 'email',
                dataType: 'text'
            },
            {
                Header: <FormattedMessage id='mobile-no' />,
                accessor: 'mobile',
                dataType: 'text'
            },

            {
                Header: <FormattedMessage id='type' />,
                accessor: 'employee_type',
                dataType: 'select',
                Cell: ({ value }: { value: string }) => (
                    <div style={{ marginLeft: '8px' }}>
                        {value === 'Single' ? (
                            <Chip color="error" label="Rejected" size="small" variant="light" />
                        ) : value === 'Manager' ? (
                            <Chip color="success" label="Manager" size="small" variant="light" />
                        ) : (
                            <Chip color="info" label="Staff" size="small" variant="light" />
                        )}
                    </div>
                ),
            },

            {
                Header: <FormattedMessage id='joined-on' />,
                accessor: 'created',
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
                Cell: ({ value }: { value: boolean }) => {
                    switch (value) {
                        case false:
                            return <Chip color="error" label="Inactive" size="small" variant="light" />;
                        case true:
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
        <Page title="Employees List">
            <MainCard content={false}>
                {!loading && userData && (
                    <ScrollX>
                        <CustomTable columns={columns} paginationData={paginationData} updateTableValues={updateTableRows} editable={false} getTableRows={getTableRows} bulkUploadButton={BulkUploadButton} filename='employees.csv'
                            searchColumns={Object.getOwnPropertyNames(new BookingC)}
                        />
                    </ScrollX>
                )}
            </MainCard>
        </Page>
    );
};

SalaryList.getLayout = function getLayout(page: ReactElement) {
    return <Layout>{page}</Layout>;
};

export default SalaryList;
