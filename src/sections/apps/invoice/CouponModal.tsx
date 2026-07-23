// material-ui
import { useTheme } from '@mui/material/styles';
import { useEffect, useState } from 'react';

import { PopupTransition } from 'components/@extended/Transitions';

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
import { useUserProfile } from 'pages/apps/user-provider';
import { listCoupon } from 'services/coupon';
import AddCoupon from 'pages/apps/coupon/add-coupon';
import { Coupon } from 'types/coupon'
type CouponModalType = {
    open: boolean;
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
    handlerCoupon: (a: any) => void;
};

// ==============================|| INVOICE - SELECT ADDRESS ||============================== //

const CouponModal = ({ open, setOpen, handlerCoupon }: CouponModalType) => {
    function closeCouponModal() {
        setOpen(false);
    }
    const { userData, loading } = useUserProfile();
    const [add, setAdd] = useState<boolean>(false);
    const [coupon, setCoupon] = useState(null);
    const { data: session } = useSession();
    const handleAddCoupon = () => {
        setAdd(!add);
        if (coupon && !add) setCoupon(null);
    };

    const onComplete = async () => {
        listCoupon(userData)
            .then(response => {
                let metadata: Coupon[] = response.data.data.rows.map((item: any) => {
                    return item;
                });
                // setCoupons(metadata);// Access the data property of the response
            })
            .catch(error => console.log(error))

        console.log("submitted");
    }

    return (
        <Dialog
            maxWidth="sm"
            open={open}
            onClose={closeCouponModal}
            sx={{ '& .MuiDialog-paper': { p: 0 }, '& .MuiBackdrop-root': { opacity: '0.5 !important' } }}
        >
            <DialogTitle>
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <Typography variant="h5">Select Coupon</Typography>
                </Stack>

                <Dialog
                    maxWidth="sm"
                    TransitionComponent={PopupTransition}
                    keepMounted
                    fullWidth
                    onClose={handleAddCoupon}
                    open={add}
                    sx={{ '& .MuiDialog-paper': { p: 0 }, transition: 'transform 225ms' }}
                    aria-describedby="alert-dialog-slide-description"
                >
                    <AddCoupon coupon={coupon} onCancel={handleAddCoupon} onComplete={onComplete} />
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
                    <CouponC handlerCoupon={handlerCoupon} />
                </Stack>
            </DialogContent>
            <Divider />
            <DialogActions sx={{ p: 2.5 }}>
                <Button color="error" onClick={closeCouponModal}>
                    Cancel
                </Button>
                <Button onClick={closeCouponModal} color="primary" variant="contained">
                    Add
                </Button>
            </DialogActions>
        </Dialog>
    );
};

type CouponProps = {
    handlerCoupon: (e: any) => void;
};
const CouponC = ({ handlerCoupon }: CouponProps) => {
    const theme = useTheme();
    const [coupons, setCoupons] = useState<Coupon[]>([]);
    const { data: session } = useSession();
    const { userData, loading } = useUserProfile();
    const fetchMetadata = async () => {
        try {
            listCoupon(userData)
                .then(response => {
                    // debugger;
                    let metadata: Coupon[] = response.data.data.rows.map((item: any) => {
                        return item;
                    });
                    console.log(metadata)
                    setCoupons(metadata);
                })
                .catch(error => console.log(error))
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
            {coupons.map((coupon: any) => (
                <Box
                    onClick={() => handlerCoupon(coupon)}
                    key={coupon.coupon_id}
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
                        {coupon.coupon_code}
                    </Typography>
                    <Stack direction="row" spacing={1}>
                        <Typography textAlign="left" variant="body2" color="secondary">
                            {coupon.discount_percent}
                        </Typography>
                    </Stack>
                </Box>
            ))}
        </>
    );
};
export default CouponModal;