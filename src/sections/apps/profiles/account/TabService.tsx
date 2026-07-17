import { useMemo, MouseEvent } from 'react';

// netx
import { useRouter } from 'next/router';

// material-ui
import { useTheme } from '@mui/material/styles';
import { IconButton, Tooltip } from '@mui/material';

// third-party
import {
  Column,
  Row,
} from 'react-table';

// material-ui
import { Button, Stack } from '@mui/material';
import { EssentialComponents } from 'components/essentialComponents';
import { apps } from 'data/apps';
import { EssentialMethods } from 'utils/essentialMethods';
import CustomTable from 'components/custom-table';
import ScrollX from 'components/ScrollX';
import { Service } from 'types/service';
import { CloseOutlined, EditTwoTone, EyeTwoTone, PlusOutlined } from '@ant-design/icons';
import { FormattedMessage } from 'react-intl';
import { listServicesCustom } from 'services/services';
import { getTableRowsDataI } from 'types/common';
import { useUserProfile } from 'pages/apps/user-provider';
import { BookingC } from 'models/booking';

// ==============================|| ACCOUNT PROFILE - MY ACCOUNT ||============================== //

const TabServices = () => {
  const theme = useTheme();
  const router = useRouter();

  const getTableRows = async (tableParams: getTableRowsDataI) => {
    try {
      const mergedParams = { ...tableParams, ...userData };
      return listServicesCustom(mergedParams);
    } catch (error) {
      // Handle any errors that occur during the API call
      console.error('Error retrieving employee data:', error);
      return [];
    }
  }
  const paginationData = { pageIndex: 0, pageSize: 10 }
  const { userData, loading } = useUserProfile();
  const AddButton: JSX.Element = <Button variant="contained" startIcon={<PlusOutlined />} onClick={() => router.push('/apps/services/add-service')}>Add Service</Button>
  const BulkUploadButton =
    <>
      <EssentialComponents.downloadSampleExcel template={apps['service']['template']}
      />
      <EssentialComponents.uploadButton
        acceptType=".csv"
        bulkUploadApi={EssentialMethods.uploadFile}
        template={apps['service']['template']}
      />
    </>

  const columns = useMemo(
    () => [
      {
        Header: 'Actions',
        className: 'cell-center',
        disableSortBy: true,
        dataType: 'action',
        disableFilters: true,
        Cell: ({ row }: { row: Row<Service> }) => {
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
                    router.push(`/apps/services/view/${row.original.id}`)
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
                    router.push(`/apps/services/edit/${row.original.id}`)
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
        Header: <FormattedMessage id="service-name" />,
        accessor: 'name',
      },
      {
        Header: <FormattedMessage id='description' />,
        accessor: 'description',
      },
      {
        Header: <FormattedMessage id='category' />,
        accessor: 'category',
      },
      {
        Header: <FormattedMessage id='price' />,
        accessor: 'price',
        Cell: ({ value }) => `Rs ${value}`
      },
      {
        Header: <FormattedMessage id='time' />,
        accessor: 'time_for_each_service',
        Cell: ({ value }) => `${value} Mins`
      },
    ] as Column[],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [theme]
  );
  return (
    <>
      {!loading && userData && (
        <ScrollX>
          <CustomTable columns={columns} paginationData={paginationData} editable={false} getTableRows={getTableRows} filename='employees.csv'
            addButton={AddButton} bulkUploadButton={BulkUploadButton} searchColumns={Object.getOwnPropertyNames(new BookingC)}
          />
        </ScrollX>
      )}
    </>
  );
};

export default TabServices;
