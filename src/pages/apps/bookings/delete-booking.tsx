// material-ui
import { Button, Dialog, DialogContent, Stack, Typography } from '@mui/material';
import { useSession } from 'next-auth/react';
// project import
import Avatar from 'components/@extended/Avatar';
import { PopupTransition } from 'components/@extended/Transitions';
import { deleteBooking } from 'services/bookings';
// assets
import { DeleteFilled } from '@ant-design/icons';
import { useUserProfile } from '../user-provider';
import { dispatch } from 'store';
import { openSnackbar } from 'store/reducers/snackbar';

// types
interface Props {
    title: string;
    open: boolean;
    handleClose: () => void;
    tableRefresh: () => void;
}

// ==============================|| BOOKING - DELETE ||============================== //

export default function AlertBookingDelete({ title, open, handleClose, tableRefresh }: Props) {
    const { userData, loading } = useUserProfile();
    const handleCancelBooking = async (data: any) => {
        try {
            const mergedParams = { id: title, ...userData };
            const response = await deleteBooking(mergedParams);
            if (response.status === 200) {
                handleClose();
                tableRefresh();
            }
        } catch (error) {
            console.error('Error cancelling booking', error);
        }
    };

    return (
        <Dialog
            open={open}
            onClose={() => handleClose()}
            keepMounted
            TransitionComponent={PopupTransition}
            maxWidth="xs"
            aria-labelledby="column-delete-title"
            aria-describedby="column-delete-description"
        >
            <DialogContent sx={{ mt: 2, my: 1 }}>
                <Stack alignItems="center" spacing={3.5}>
                    <Avatar color="error" sx={{ width: 72, height: 72, fontSize: '1.75rem' }}>
                        <DeleteFilled />
                    </Avatar>
                    <Stack spacing={2}>
                        <Typography variant="h4" align="center">
                            Are you sure you want to Cancel This Appointment?
                        </Typography>
                        <Typography align="center">After Cancelling This Appointment, This Appointment will be not Added in The Invoice.</Typography>
                    </Stack>

                    <Stack direction="row" spacing={2} sx={{ width: 1 }}>
                        <Button fullWidth onClick={() => handleClose()} color="secondary" variant="outlined">
                            Cancel
                        </Button>
                        <Button fullWidth color="error" variant="contained" onClick={handleCancelBooking} autoFocus>
                            Cancel Appointment
                        </Button>
                    </Stack>
                </Stack>
            </DialogContent>
        </Dialog>
    );
}
