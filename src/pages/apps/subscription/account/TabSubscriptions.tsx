import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
// material-ui
import { Chip, Grid, IconButton, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';

// project import
import { EllipsisOutlined } from '@ant-design/icons';
import MainCard from 'components/MainCard';
import { listSubscription } from 'services/subscription';
import formatDate from 'utils/date-format';
import { useUserProfile } from 'pages/apps/user-provider';

// ==============================|| ACCOUNT PROFILE - SETTINGS ||============================== //

const TabSubscriptions = () => {
  const [rows, setRows] = useState([{}]);
  const { userData, loading } = useUserProfile();
  const fetchData = async() => {
    const response = await listSubscription(userData);
    if (response.data.status === 200) {
      setRows(response.data.data.rows);
    }
  }
  useEffect(() => {
    if (!loading && userData) {
      fetchData();
    }
  }, [loading, userData]);

  const formattedDateTimeCell = (value: string) => {
    const formattedDateTime = formatDate(value, 'EEE, dd MMM yyyy HH:mm');
    return <span>{formattedDateTime}</span>;
  };
  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <MainCard title="Subscription History" content={false}>
          <TableContainer>
            <Table sx={{ minWidth: 350 }} aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell sx={{ pl: 3 }}>Branch Name</TableCell>
                  <TableCell>Subscription Name/Type</TableCell>
                  <TableCell>Start Date</TableCell>
                  <TableCell align="right">Status</TableCell>
                  <TableCell align="center">Order Id</TableCell>
                  <TableCell align="right" />
                </TableRow>
              </TableHead>
              <TableBody>
                {rows.map((row: any) => (
                  <TableRow hover key={row.name}>
                    <TableCell sx={{ pl: 3 }} component="th">
                      <Stack direction="row" alignItems="center" spacing={1.25}>
                        <Stack spacing={0}>
                          <Typography variant="subtitle1">{row.branch_name}</Typography>
                          <Typography variant="caption" color="secondary">
                            {row.email_id}
                          </Typography>
                          <Typography variant="caption" color="secondary">
                            {row.contactno}
                          </Typography>
                        </Stack>
                      </Stack>
                    </TableCell>
                    <TableCell>
                      {row.name_of_subscription && (
                        <>
                          <Chip size="small" variant="light" color="success" label={row.name_of_subscription} />
                          <br />
                        </>
                      )}
                      <Chip size="small" variant="light" color="primary" label={row.type} />
                    </TableCell>
                    <TableCell>
                      {formattedDateTimeCell(row.start_date)}
                    </TableCell>
                    <TableCell align="right">
                      {row && (
                        row.paid ? "Paid" : "Not Paid"
                      )}
                    </TableCell>
                    <TableCell align="right">
                      {row && (
                        row.order_id
                      )}
                    </TableCell>
                    <TableCell align="right">
                      <IconButton size="small" color="secondary">
                        <EllipsisOutlined style={{ fontSize: '1.15rem' }} />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </MainCard>
      </Grid>
    </Grid>
  );
}


export default TabSubscriptions;
