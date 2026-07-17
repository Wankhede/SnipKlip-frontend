import { useState } from 'react';
import { useMemo, MouseEvent, useEffect } from 'react';

// netx
import { useRouter } from 'next/router';

// material-ui
import { useTheme } from '@mui/material/styles';
import { Grid, IconButton, Table, TableBody, TableCell, TableContainer, TableHead, Tooltip, Typography } from '@mui/material';

// third-party
import {
    Column,
    Row,
} from 'react-table';

// material-ui
import { Button, Stack } from '@mui/material';
import { getAccountDetails, getSalonDetails } from 'services/salon';
import { EssentialComponents } from 'components/essentialComponents';
import { apps } from 'data/apps';
import { EssentialMethods } from 'utils/essentialMethods';
import CustomTable from 'components/custom-table';
import ScrollX from 'components/ScrollX';
import { CloseOutlined, EditTwoTone, EyeTwoTone, PlusOutlined } from '@ant-design/icons';
import { FormattedMessage } from 'react-intl';
import { editService } from 'services/services';
import { listSalary } from 'services/salary';
import { getTableRowsDataI } from 'types/common';
import { useUserProfile } from 'pages/apps/user-provider';
import { BookingC } from 'models/booking';
import { getServices } from 'services/metadata';
import { TableRow } from '@mui/material';
import { useSession } from 'next-auth/react';

// styles & constant
const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;

// ==============================|| ACCOUNT PROFILE - MY ACCOUNT ||============================== //

const TabAccount = () => {
    const [signing, setSigning] = useState('facebook');
    const theme = useTheme();
    const router = useRouter();
    const [serviceData, setServiceData] = useState([]);
    const { userData, loading } = useUserProfile();
    const [checked, setChecked] = useState(['sb', 'ln', 'la']);


    const [formData, setFormData] = useState([]);
    const { data: session } = useSession();
    const getTableRows = async (tableParams: getTableRowsDataI) => {
      try {
        const mergedParams = { ...tableParams, ...userData };
        const response = await getServices(mergedParams);
        const serviceData = response.data?.data?.rows[0]?.service // Access the nested array of service objects
        setFormData(serviceData)
      } catch (error) {
        return {};
      }
    };
    useEffect(() => {
        getTableRows(userData);
    }, []);

    const handleAddService = () => {
      router.push('/apps/services/add-service')
  };
  
  const handleEditService = (service_id: any) => {
    router.push(`/apps/services/edit/${service_id}/`);
};


    return (
        <Grid container spacing={3}>
          <Grid item spacing={3}>
            <EssentialComponents.downloadSampleExcel template={apps['service']['template']} />
          </Grid>
          <Grid item xs={12}>
            <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
              <Typography variant="h5" component="div">Services</Typography>
              <Button variant="contained" startIcon={<PlusOutlined />} onClick={handleAddService}>Add Service</Button>
            </Stack>
          </Grid>
          <Grid item xs={12}>
            <TableContainer>
              <Table sx={{ minWidth: 350 }} aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ pl: 3 }}>Edit Service</TableCell>
                    <TableCell sx={{ pl: 3 }}>Service Name</TableCell>
                    <TableCell sx={{ pl: 3 }}>Service Name</TableCell>
                    <TableCell>Service Price</TableCell>
                    <TableCell align="right">Service Time</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {formData.map((service: any) => (
                    <TableRow>

                    <TableCell align="left" key={service.id}>
                        <Typography>
                            <IconButton aria-label="edit" size="small" onClick={() => handleEditService(service.id)}>
                                <EditTwoTone />
                            </IconButton>
                        </Typography>
                    </TableCell>

                      <TableCell align="left" key={service.id}>
                        <Typography>{service.name}</Typography>
                      </TableCell>
    
                      <TableCell align="left">
                        <Typography>₹ {service.price}</Typography>
                      </TableCell>
    
                      <TableCell align="right">
                         <Typography>{service.time_for_each_service} Minutes</Typography>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
        </Grid>
      );
};

export default TabAccount;
