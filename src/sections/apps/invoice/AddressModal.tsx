// material-ui
import { useTheme } from '@mui/material/styles';
import { useEffect, useState } from 'react';

import { getCustomers, getStaff, getServices } from 'services/metadata';
import { PopupTransition } from 'components/@extended/Transitions';

import { CustomerInfo, CustomerTypeI } from 'types/common';

import {
  Box,
  Button,
  Divider,
  Dialog,
  DialogActions,
  DialogTitle,
  DialogContent,
  FormControl,
  InputAdornment,
  Stack,
  TextField,
  Typography
} from '@mui/material';

// third-party
import { PlusOutlined, SearchOutlined } from '@ant-design/icons';
import { EssentialMethods } from 'utils/essentialMethods';
import { useSession } from 'next-auth/react';
import AddCustomer from 'pages/apps/customers/add-customer';
import { useUserProfile } from 'pages/apps/user-provider';

type CustomerModalType = {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  handlerCustomer: (a: any) => void;
};

// ==============================|| INVOICE - SELECT ADDRESS ||============================== //

const AddressModal = ({ open, setOpen, handlerCustomer }: CustomerModalType) => {
  function closeAddressModal() {
    setOpen(false);
  }
  const { userData, loading } = useUserProfile();
  const [add, setAdd] = useState<boolean>(false);
  const [customer, setCustomer] = useState(null);
  const { data: session } = useSession();
  const handleAddCustomer = () => {
    setAdd(!add);
    if (customer && !add) setCustomer(null);
  };

  const onComplete = async () => {
    getCustomers(userData)
      .then(response => {
        let metadata: CustomerTypeI[] = response.data.data.rows.map((item: any) => {
          return item;
        });
        // setCustomers(metadata);// Access the data property of the response
      })
      .catch(error => console.log(error))

    console.log("submitted");
  }

  return (
    <Dialog
      maxWidth="sm"
      open={open}
      onClose={closeAddressModal}
      sx={{ '& .MuiDialog-paper': { p: 0 }, '& .MuiBackdrop-root': { opacity: '0.5 !important' } }}
    >
      <DialogTitle>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Typography variant="h5">Select Customer</Typography>
          <Button startIcon={<PlusOutlined />} onClick={handleAddCustomer} color="primary">
            Add New
          </Button>
        </Stack>

        <Dialog
          maxWidth="sm"
          TransitionComponent={PopupTransition}
          keepMounted
          fullWidth
          onClose={handleAddCustomer}
          open={add}
          sx={{ '& .MuiDialog-paper': { p: 0 }, transition: 'transform 225ms' }}
          aria-describedby="alert-dialog-slide-description"
        >
          <AddCustomer customer={customer} onCancel={handleAddCustomer} onComplete={onComplete} />
        </Dialog>
      </DialogTitle>
      <Divider />
      <DialogContent sx={{ p: 2.5 }}>
        <FormControl sx={{ width: '100%', pb: 2 }}>
          <TextField
            autoFocus
            id="name"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchOutlined />
                </InputAdornment>
              )
            }}
            placeholder="Search"
            fullWidth
          />
        </FormControl>
        <Stack direction="column" spacing={2}>
          <Address handlerCustomer={handlerCustomer} />
        </Stack>
      </DialogContent>
      <Divider />
      <DialogActions sx={{ p: 2.5 }}>
        <Button color="error" onClick={closeAddressModal}>
          Cancel
        </Button>
        <Button onClick={closeAddressModal} color="primary" variant="contained">
          Add
        </Button>
      </DialogActions>
    </Dialog>
  );
};

type CustomerProps = {
  handlerCustomer: (e: any) => void;
};
const Address = ({ handlerCustomer }: CustomerProps) => {
  const theme = useTheme();
  const [customers, setCustomers] = useState<CustomerInfo[]>([]);
  const { data: session } = useSession();
  const { userData, loading } = useUserProfile();
  const fetchMetadata = async () => {
    try {
      getCustomers(userData)
        .then(response => {
          // debugger;
          let metadata: CustomerInfo[] = response.data.data.rows.map((item: any) => {
            return item;
          });
          console.log(metadata)
          setCustomers(metadata);
        })
        .catch(error => console.log(error))
      // // The code to process the API response and extract the staff information
      // getStaff()
      //   .then(response => {
      //     let metadata: MetaDataTypeI[] = response.data.data.rows[0].staff_assigned.map((item: any) => {
      //       return {
      //         element: item.first_name + ' ' + item.last_name,
      //         id: item.id
      //       };
      //     });
      //     setStaff(metadata); // Setting the extracted staff information to the state variable
      //   })
      //   .catch(error => console.log(error))

      // The code to process the API response and extract the service information
      // getServices()
      //   .then(response => {
      //     let metadata: any = response.data.data.rows[0].service.map((item: any) => {
      //       // Mapping over the service array of each appointment
      //       return {
      //         element: item.name,
      //         id: item.id
      //       };
      //     }); // We are assuming that the response contains only one appointment, so we consider the first one.
      //     setServices(metadata); // Setting the extracted service information to the state variable
      //   })
      //   .catch(error => console.log(error));
    } catch (error) {
      console.error('Error retrieving metadata:', error);
      // Handle the error accordingly
    }
  };

  useEffect(() => {
    if (!loading && userData) {
      fetchMetadata();
    }
  }, [loading, userData]);

  return (
    <>
      {customers.map((customer: any) => (
        <Box
          onClick={() => handlerCustomer(customer)}
          key={customer.customer_id}
          sx={{
            cursor: 'pointer',
            width: '100%',
            border: '1px solid',
            borderColor: 'grey.200',
            borderRadius: 1,
            p: 1.25,
            '&:hover': {
              bgcolor: theme.palette.primary.lighter,
              borderColor: theme.palette.primary.lighter
            }
          }}
        >
          <Typography textAlign="left" variant="subtitle1">
            {customer.customer_name}
          </Typography>
          <Stack direction="row" spacing={1}>
            <Typography textAlign="left" variant="body2" color="secondary">
              {customer.email}
            </Typography>

            <Typography textAlign="left" variant="body2" color="secondary">
              {customer.mobile}
            </Typography>
          </Stack>
        </Box>
      ))}
    </>
  );
};
export default AddressModal;