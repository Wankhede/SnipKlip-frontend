// material-ui
import { Button, Dialog, DialogContent, Stack, Typography } from '@mui/material';
import { useSession } from 'next-auth/react';
// project import
import Avatar from 'components/@extended/Avatar';
import { PopupTransition } from 'components/@extended/Transitions';
import { availBooking } from 'services/bookings';
// assets
import { SettingOutlined } from '@ant-design/icons';
import { useUserProfile } from '../user-provider';
import router from 'next/router';
// types
interface Props {
    title: string;
    open: boolean;
    handleClose: () => void;
    tableRefresh: () => void;
}

// ==============================|| BOOKING - AVAILED ||============================== //

export default function AlertBookingAvail({ title, open, handleClose, tableRefresh }: Props) {
    const { data: session } = useSession();
    const { userData, loading } = useUserProfile();
    const handleCancelBooking = async (data: any) => {
        // const mergedParams = { id: title, ...userData };
        //     const response = await availBooking(mergedParams);
        //     if (response.status === 200) {
        //     }
        // } catch (error) {
        //     // Handle errors
        //     console.error('Error in Completing booking:', error);
        // }
        router.push(`/apps/invoices/edit/${title}`, undefined, { shallow: true });
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
                        <SettingOutlined />
                    </Avatar>
                    <Stack spacing={2}>
                        <Typography variant="h4" align="center">
                            Are you sure?
                        </Typography>
                        <Typography align="center">
                            By clicking on Done. booking will get availed.
                        </Typography>
                    </Stack>

                    <Stack direction="row" spacing={2} sx={{ width: 1 }}>
                        <Button fullWidth onClick={() => handleClose()} color="secondary" variant="outlined">
                            Cancel
                        </Button>
                        <Button fullWidth color="success" variant="contained" onClick={handleCancelBooking} autoFocus>
                            Done
                        </Button>
                    </Stack>
                </Stack>
            </DialogContent>
        </Dialog>
    );
}