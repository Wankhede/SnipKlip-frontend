import { useState } from 'react';

// material-ui
import { Box, Divider, Grid, List, ListItem, ListItemText, Stack, Typography } from '@mui/material';

// third-party

// project import
import IconButton from 'components/@extended/IconButton';
import MainCard from 'components/MainCard';

// assets
import { MoreOutlined } from '@ant-design/icons';

// ==============================|| CUSTOMER - CARD ||============================== //

const SalonCard = ({ apps }: { apps: any }) => {
  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const [openAlert, setOpenAlert] = useState(false);

  const handleAlertClose = () => {
    setOpenAlert(!openAlert);
    handleMenuClose();
  };

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const openMenu = Boolean(anchorEl);
  const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const [add, setAdd] = useState<boolean>(false);
  const handleAdd = () => {
    setAdd(!add);
  };

  return (
    <>
      <MainCard sx={{ height: 1, '& .MuiCardContent-root': { height: 1, display: 'flex', flexDirection: 'column' } }}>
        <Grid id="print" container spacing={2.25}>
          <Grid item xs={12}>
            <List sx={{ width: 1, p: 0 }}>
              <ListItem
                disablePadding
                secondaryAction={
                  <IconButton edge="end" aria-label="comments" color="secondary" onClick={handleMenuClick}>
                    <MoreOutlined style={{ fontSize: '1.15rem' }} />
                  </IconButton>
                }
              >
                <ListItemText
                  primary={<Typography variant="subtitle1">{apps.name}</Typography>}
                />
              </ListItem>
            </List>
          </Grid>
          <Grid item xs={12}>
            <Divider />
          </Grid>
          <Grid item xs={12}>
            <Grid container spacing={1}>
              <Grid item xs={12}>
                <List sx={{ p: 0, overflow: 'hidden', '& .MuiListItem-root': { px: 0, py: 0.5 } }}>
                  <ListItem>
                    <ListItemText
                      primary={
                        <Typography color="secondary">
                          <ListItemText primary={<Typography color="secondary">Contact No:- {apps.contact_no}</Typography>} />
                          <ListItemText primary={<Typography color="secondary">Owner Name:- {apps.owner_name}</Typography>} />
                          <ListItemText primary={<Typography color="secondary">Owner Email:- {apps.owner_email}</Typography>} />
                          <ListItemText primary={<Typography color="secondary">Salon Id:- {apps.id}</Typography>} />
                        </Typography>
                      }
                    />
                  </ListItem>
                </List>
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={12}>
            <Box>
              <Box
                sx={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  listStyle: 'none',
                  p: 0.5,
                  m: 0
                }}
                component="ul"
              >
              </Box>
            </Box>
          </Grid>
        </Grid>
        <Stack
          direction="row"
          className="hideforPDf"
          alignItems="center"
          spacing={1}
          justifyContent="space-between"
          sx={{ mt: 'auto', mb: 0, pt: 2.25 }}
        >{apps.registration_status === 'Completed' ? (
            <span>Enabled</span>
        ) : null}
        </Stack>
      </MainCard>
    </>
  );
};

export default SalonCard;
