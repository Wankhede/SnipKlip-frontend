// material-ui
import {
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import { EssentialComponents } from 'components/essentialComponents';
import { useEffect, useState } from 'react';
import { getSalonDetails } from 'services/salon';
import { EssentialMethods } from 'utils/essentialMethods';
import { apps } from 'data/apps';
import { useSession } from 'next-auth/react';

// ==============================|| ACCOUNT PROFILE - ROLE ||============================== //
const TabRole = () => {

  const [formData, setFormData] = useState([]);
  const { data: session } = useSession();
  const branchAPI = async () => {
    try {
      const user_id = session?.token.user.data.user_id
      const response = await getSalonDetails(user_id);
      setFormData(response.data.data.rows)
    } catch (error) {
      return {};
    }
  };
  useEffect(() => {
    branchAPI();
  }, []);

  return (
    <Grid container spacing={3}>
      <Grid item spacing={3}>
        <EssentialComponents.downloadSampleExcel template={apps['service']['template']} />
      </Grid>
      <Grid item xs={12}>
        <TableContainer>
          <Table sx={{ minWidth: 350 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell sx={{ pl: 3 }}>Branch Name</TableCell>
                <TableCell>Manager</TableCell>
                <TableCell align="right">Upload Service</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {formData.map((branch: any) => (
                <TableRow>
                  <TableCell align="left" key={branch.id}>
                    <Typography>{branch.branch_name}</Typography>
                  </TableCell>

                  <TableCell align="left">
                    <Typography>{branch.manager_name}</Typography>
                  </TableCell>

                  <TableCell align="right">
                    <EssentialComponents.uploadButton
                      acceptType=".csv"
                      bulkUploadApi={EssentialMethods.uploadFile}
                      template={apps['service']['template']}
                    />
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

export default TabRole;
