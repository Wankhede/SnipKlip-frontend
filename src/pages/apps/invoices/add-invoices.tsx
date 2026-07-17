
import { ReactElement, useEffect, useState } from 'react';

import { useSession } from 'next-auth/react';

// material-ui
import { useTheme } from '@mui/material/styles';
import {
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Divider,
    FormControl,
    FormHelperText,
    Grid,
    InputLabel,
    MenuItem,
    Select,
    Stack,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextField,
    Typography,
} from '@mui/material';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { useRouter } from 'next/router';
// third party
import * as yup from 'yup';
import { v4 as UIDV4 } from 'uuid';
import { format } from 'date-fns';
import { FieldArray, FormikProvider, useFormik } from 'formik';

// project import
import Layout from 'layout';
import Page from 'components/Page';
import MainCard from 'components/MainCard';
import InvoiceItem from 'sections/apps/invoice/InvoiceItem';
import AddressModal from 'sections/apps/invoice/AddressModal';

import incrementer from 'utils/incrementer';
import { useDispatch, useSelector } from 'store';
import { customerPopup } from 'store/reducers/invoice';

// assets
import { PlusOutlined } from '@ant-design/icons';

// types
import { Invoice } from 'types/invoice';
import { addInvoice, sendInvoiceNotification } from 'services/invoices';
import { EssentialMethods } from 'utils/essentialMethods';
import { errorColor, successColor } from 'config';
import useUser from 'hooks/useUser';
import { useUserProfile } from '../user-provider';
import { checkCouponCode } from 'services/coupon';

const validationSchema = yup.object({
    date: yup.date().required('Invoice date is required'),
    customerInfo: yup
        .object({
            customer_name: yup.string().required('Invoice receiver information is required')
        })
        .required('Invoice receiver information is required'),
    status: yup.string().required('Status selection is required'),
    invoice_detail: yup
        .array()
        .required('Invoice details is required')
        .of(
            yup.object()
        )
        .min(1, 'Invoice must have at least 1 items')
});

// ==============================|| INVOICE - CREATE ||============================== //

const Create = () => {
    const theme = useTheme();
    const router = useRouter();
    const dispatch = useDispatch();
    const { isCustomerOpen, lists, isOpen } = useSelector((state) => state.invoice);
    const notesLimit: number = 500;
    const user = useUser();
    const { data: session } = useSession();
    const [formData, setFormData] = useState({
        id: 120,
        invoice_id: Date.now(),
        status: 'Paid',
        date: new Date(),
        due_date: null,
        cashierInfo: {
            name: session?.user?.name,
            // address: session?.user?.address,
            // phone: session?.user?.phone,
            email: session?.user?.email
        },
        customerInfo: {
            address: '',
            email: '',
            name: '',
            mobile: '',
            customer_name: '',
        },
        invoice_detail: [
            {
                id: UIDV4(),
                invoice_item: {
                    attribute_id: 0,
                    attribute_name: '',
                },
                staff: [],
                qty: 1,
                price: '0.00',
                category: 'Service'
            }
        ],
        discount: 0,
        tax: 0,
        notes: '',
        price_cut_by_coupon_code: 0,
        mode_of_payment: 'UPI',
        amount_paid: 0,
        payment_received: 0,
        coupon_code: '',
        due_payment: 0,
        quantity: 0,
        discount_percentage: 0,
        customer_name: '',
    });
    const { userData, loading } = useUserProfile();
    const [open, setOpen] = useState(false);
    const [notificationMethod, setNotificationMethod] = useState('');

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        router.push('/apps/invoices/manage-invoices');
        setOpen(false);
    };

    const handleNotificationSelection = async (method: string) => {
        setNotificationMethod(method);
        setOpen(false);
        const dataToSend = {
            method: method,
            ...formik.values
        };
        generateShareableLink(formik.values);
        try {
            const response = await sendInvoiceNotification(dataToSend);
            console.log(response)
            if (response.data.status === 200) {
                router.push('/apps/invoices/manage-invoices');
                EssentialMethods.showSnackbar(response.data.message, successColor);
            } else {
                EssentialMethods.showSnackbar(response.data.message, errorColor);
            }
        } catch (error) {
            console.error("Error sending notification:", error);
        }
    };

    const handlerCreate = async (values: any) => {
        const NewList: Invoice = {
            id: Number(incrementer(lists.length)),
            invoice_id: Number(values.invoice_id),
            discount: Number(values.discount),
            tax: Number(values.tax),
            date: format(new Date(values.date), 'MM/dd/yyyy'),
            due_date: format(new Date(values.due_date), 'MM/dd/yyyy'),
            quantity: Number(
                values.invoice_detail?.reduce((sum: any, i: any) => {
                    return sum + i.qty;
                }, 0)
            ),
            status: values.status,
            cashierInfo: values.cashierInfo,
            customerInfo: values.customerInfo,
            invoice_detail: values.invoice_detail,
            notes: values.notes,
            customer_name: values.customer_name,
            coupon_code: values.coupon_code,
            actual_amount: values.actual_amount,
            due_payment: values.due_payment,
            price_cut_by_coupon_code: values.price_cut_by_coupon_code,
            payment_received: values.payment_received,
            tax_percentage: values.tax_percentage,
            tax_added: values.tax_added,
            discount_percentage: values.discount_percentage,
            mode_of_payment: values.mode_of_payment,
        };
        var response;
        response = await addInvoice(NewList);
        if (response.data.status === 200) {
            EssentialMethods.showSnackbar(response.data.message, successColor);
            formik.values.id = response.data.data.id;
            // handleClickOpen();
        } else {
            EssentialMethods.showSnackbar(response.data.message, errorColor)
        }

    };

    async function generateShareableLink(invoice: any) {
        // const invoiceDoc = <ExportPDFView invoice={invoice} />;
        // const invoicePdfBlob = await pdf(invoiceDoc).toBlob();

        const S3_BUCKET = process.env.S3_BUCKET_AWS
        const AWS_REGION = process.env.REGION_AWS

        const INVOICE_KEY = `invoice-${invoice.id}.pdf`;
        // var uploadParams = { Bucket: S3_BUCKET, Key: INVOICE_KEY, Body: invoicePdfBlob, ContentType: 'application/pdf' }
        // console.log(uploadParams);

        // const s3Client = new S3Client({
        //     credentials: {
        //         accessKeyId: process.env.ACCESS_KEY_ID_AWS ?? '',
        //         secretAccessKey: process.env.SECRET_ACCESS_KEY_AWS ?? ''
        //     },
        //     region: AWS_REGION
        // })

        // const uploadPromise = await s3Client.send(new PutObjectCommand(uploadParams));
        // console.log('after file upload');

        // console.log('Uploaded file URL', uploadPromise)
        return `https://${S3_BUCKET}.s3.${AWS_REGION}.amazonaws.com/${INVOICE_KEY}`;
    }
    const formik = useFormik({
        initialValues: formData,
        validationSchema: validationSchema,
        enableReinitialize: true,
        onSubmit: (values) => {
            handlerCreate(values);
        },
    });


    const calculateSubtotal = () => {
        return formik.values?.invoice_detail?.reduce((prev, curr) => {
            return prev + Number(Number(curr.price) * Math.floor(curr.qty));
        }, 0) || 0;
    };

    const [CouponCode, setCouponCode] = useState(String(formik.values?.coupon_code));
    const [duePayment, setduePayment] = useState(0);
    const [couponCodeDiscount, setcouponCodeDiscount] = useState(0);


    const subtotal = calculateSubtotal();
    const taxRate = (formik.values?.tax);
    const discountRate = formik.values?.discount_percentage
    const total = subtotal - discountRate + taxRate;

    const default_coupon_discount_value = formik.values?.price_cut_by_coupon_code
    const CouponDiscount = ((default_coupon_discount_value && Number(default_coupon_discount_value)) || couponCodeDiscount) / 100 * subtotal
    const GrandTotal = Math.round(Number(subtotal - (discountRate / 100 * subtotal) + (taxRate / 100 * subtotal) - (CouponDiscount)))


    const handleApplyCoupon = async () => {
        try {
            const data = {
                'coupon_code': formik.values?.coupon_code,
                'actual_amount': subtotal
            }
            const response = await checkCouponCode(data);

            if (response.data.status === 200) {
                setcouponCodeDiscount(response.data.discount_percentange)
                EssentialMethods.showSnackbar(response.data.message, successColor)
            } else {
                setcouponCodeDiscount(0)
                EssentialMethods.showSnackbar(response.data.message, errorColor)
            }
        } catch (error) {
            console.error('Error applying coupon code:', error);
        }
    }


    // Custom handleChange function to update Formik state and component state
    const handleChange = (e: any) => {
        // Update Formik state using formik.handleChange
        formik.handleChange(e);

        // Update component state with the current coupon_code value
        setCouponCode(e.target.value);
    };


    const paymentReceived = GrandTotal - formik.values?.due_payment

    useEffect(() => {
        formik.setFieldValue('payment_received', paymentReceived);
        setduePayment(Math.round(GrandTotal - paymentReceived))
    }, [paymentReceived]); // Only run this effect when paymentReceived changes

    const handlePaymentChange = (e: any) => {
        const enteredValue = Math.round(e.target.value);
        if (enteredValue <= GrandTotal && enteredValue >= 0) {
            formik.handleChange(e);

            const duePayment = GrandTotal - enteredValue;
            setduePayment(duePayment)
        }
    };

    const checkCoupon = CouponCode.length > 3

    return (
        <Page title="Invoice Create">
            <MainCard>
                <FormikProvider value={formik}>
                    <form onSubmit={formik.handleSubmit}>
                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={6} md={3}>
                                <Stack spacing={1}>
                                    <InputLabel>Invoice Id</InputLabel>
                                    <FormControl sx={{ width: '100%' }}>
                                        <TextField
                                            required
                                            disabled
                                            type="number"
                                            name="invoice_id"
                                            id="invoice_id"
                                            value={formik.values.invoice_id}
                                            onChange={formik.handleChange}
                                        />
                                    </FormControl>
                                </Stack>
                            </Grid>
                            <Grid item xs={12} sm={6} md={3}>
                                <Stack spacing={1}>
                                    <InputLabel>Status</InputLabel>
                                    <FormControl sx={{ width: '100%' }}>
                                        <Select
                                            value={formik.values.status}
                                            displayEmpty
                                            name="status"
                                            renderValue={(selected) => {
                                                return selected;
                                            }}
                                            onChange={formik.handleChange}
                                            error={Boolean(formik.errors.status && formik.touched.status)}
                                        >
                                            <MenuItem disabled value="">
                                                Select Status
                                            </MenuItem>
                                            <MenuItem value="Paid">Paid</MenuItem>
                                            <MenuItem value="Unpaid">Unpaid</MenuItem>
                                            <MenuItem value="Cancelled">Cancelled</MenuItem>
                                        </Select>
                                    </FormControl>
                                </Stack>
                                {formik.touched.status && formik.errors.status && <FormHelperText error={true}>{formik.errors.status}</FormHelperText>}
                            </Grid>
                            <Grid item xs={12} sm={6} md={6}>
                                <Stack spacing={1}>
                                    <InputLabel>Date</InputLabel>
                                    <FormControl sx={{ width: '100%' }} error={Boolean(formik.touched.date && formik.errors.date)}>
                                        <LocalizationProvider dateAdapter={AdapterDateFns}>
                                            <DatePicker
                                                inputFormat="dd/MM/yyyy"
                                                value={formik.values.date}
                                                onChange={(newValue) => formik.setFieldValue('date', newValue)}
                                                renderInput={(params) => <TextField {...params} />}
                                            />
                                        </LocalizationProvider>
                                    </FormControl>
                                </Stack>
                                {formik.touched.date && formik.errors.date && <FormHelperText error={true}>{formik.errors.date as string}</FormHelperText>}
                            </Grid>

                            <Grid item xs={12} sm={6}>
                                <MainCard sx={{ minHeight: 168 }}>
                                    <Grid container spacing={2}>
                                        <Grid item xs={12} sm={8}>
                                            <Stack spacing={2}>
                                                <Typography variant="h5">From:</Typography>
                                                <Stack sx={{ width: '100%' }}>
                                                    <FormControl sx={{ width: '100%' }}>
                                                        <Typography color="secondary">{formik.values?.cashierInfo?.name}</Typography>
                                                        <Typography color="secondary">{formik.values?.cashierInfo?.email}</Typography>
                                                    </FormControl>
                                                </Stack>
                                            </Stack>
                                        </Grid>
                                    </Grid>
                                </MainCard>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <MainCard sx={{ minHeight: 168 }}>
                                    <Grid container spacing={2}>
                                        <Grid item xs={12} sm={8}>
                                            <Stack spacing={2}>
                                                <Typography variant="h5">To:</Typography>
                                                <Stack sx={{ width: '100%' }}>
                                                    <Typography variant="subtitle1">{formik.values?.customerInfo?.customer_name}</Typography>
                                                    <Typography color="secondary">{formik.values?.customerInfo?.mobile}</Typography>
                                                    <Typography color="secondary">{formik.values?.customerInfo?.email}</Typography>
                                                </Stack>
                                            </Stack>
                                        </Grid>
                                        <Grid item xs={12} sm={4}>
                                            <Box textAlign="right" color="grey.200">
                                                <Button
                                                    size="small"
                                                    startIcon={<PlusOutlined />}
                                                    color="secondary"
                                                    variant="outlined"
                                                    onClick={() =>
                                                        dispatch(
                                                            customerPopup({
                                                                isCustomerOpen: true
                                                            })
                                                        )
                                                    }
                                                >
                                                    Add
                                                </Button>
                                                <AddressModal
                                                    open={isCustomerOpen}
                                                    setOpen={(value) =>
                                                        dispatch(
                                                            customerPopup({
                                                                isCustomerOpen: value
                                                            })
                                                        )
                                                    }
                                                    handlerCustomer={(value) => {
                                                        formik.setFieldValue('customerInfo', value);
                                                        dispatch(
                                                            customerPopup({
                                                                isCustomerOpen: false
                                                            })
                                                        );
                                                    }
                                                    }
                                                />
                                            </Box>
                                        </Grid>
                                    </Grid>
                                </MainCard>
                                {formik.touched.customerInfo && formik.errors.customerInfo && (
                                    <FormHelperText error={true}>{formik.errors?.customerInfo?.name as string}</FormHelperText>
                                )}
                            </Grid>

                            <Grid item xs={12}>
                                <Typography variant="h5">Detail</Typography>
                            </Grid>
                            <Grid item xs={12}>
                                <FieldArray
                                    name="invoice_detail"
                                    render={({ remove, push }) => {
                                        return (
                                            <>
                                                <TableContainer>
                                                    <Table sx={{ minWidth: 650 }}>
                                                        <TableHead>
                                                            <TableRow>
                                                                <TableCell>#</TableCell>
                                                                <TableCell>Category</TableCell>
                                                                <TableCell>Item</TableCell>
                                                                <TableCell>Staff</TableCell>
                                                                <TableCell>Qty</TableCell>
                                                                <TableCell>Price</TableCell>
                                                                <TableCell>Amount</TableCell>
                                                                <TableCell align="right">Action</TableCell>
                                                            </TableRow>
                                                        </TableHead>
                                                        <TableBody>
                                                            {formik.values.invoice_detail?.map((item: any, index: number) => (
                                                                <TableRow key={item.id}>
                                                                    <TableCell>{formik.values.invoice_detail.indexOf(item) + 1}</TableCell>
                                                                    <InvoiceItem
                                                                        key={item.id}
                                                                        id={item.id}
                                                                        index={index}
                                                                        name={item.name}
                                                                        qty={item.qty}
                                                                        price={item.price}
                                                                        onDeleteItem={(index: number) => remove(index)}
                                                                        onEditItem={formik.handleChange}
                                                                        Blur={formik.handleBlur}
                                                                        errors={formik.errors}
                                                                        touched={formik.touched}
                                                                        setFormData={setFormData}
                                                                        formData={formData}
                                                                        formik={formik}
                                                                        category={item.category}
                                                                    />
                                                                </TableRow>
                                                            ))}
                                                        </TableBody>
                                                    </Table>
                                                </TableContainer>
                                                <Divider />
                                                {formik.touched.invoice_detail && formik.errors.invoice_detail && !Array.isArray(formik.errors?.invoice_detail) && (
                                                    <Stack direction="row" justifyContent="center" sx={{ p: 1.5 }}>
                                                        <FormHelperText error={true}>{formik.errors.invoice_detail as string}</FormHelperText>
                                                    </Stack>
                                                )}
                                                <Grid container justifyContent="space-between">
                                                    <Grid item xs={12} md={8}>
                                                        <Box sx={{ pt: 2.5, pr: 2.5, pb: 2.5, pl: 0 }}>
                                                            <Stack direction="row" gap={2} sx={{ p: 1.5 }}>
                                                                <Button
                                                                    color="primary"
                                                                    startIcon={<PlusOutlined />}
                                                                    onClick={() =>
                                                                        formik.setFieldValue('invoice_detail', [
                                                                            ...formik.values.invoice_detail,
                                                                            {
                                                                                id: UIDV4(),
                                                                                invoice_item: {
                                                                                    attribute_id: 0,
                                                                                    attribute_name: ''
                                                                                },
                                                                                staff: [
                                                                                ],
                                                                                qty: 1,
                                                                                price: '0.00',
                                                                                category: 'Service'
                                                                            },
                                                                        ])
                                                                    }
                                                                    variant="dashed"
                                                                    sx={{ bgcolor: 'transparent !important' }}
                                                                >
                                                                    Add Service Item
                                                                </Button>
                                                                <Button
                                                                    color="primary"
                                                                    startIcon={<PlusOutlined />}
                                                                    onClick={() =>
                                                                        formik.setFieldValue('invoice_detail', [
                                                                            ...formik.values.invoice_detail,
                                                                            {
                                                                                id: UIDV4(),
                                                                                invoice_item: {
                                                                                    attribute_id: 0,
                                                                                    attribute_name: '',
                                                                                },
                                                                                staff: [
                                                                                ],
                                                                                qty: 1,
                                                                                price: '0.00',
                                                                                category: 'Product'
                                                                            },
                                                                        ])
                                                                    }
                                                                    variant="dashed"
                                                                    sx={{ bgcolor: 'transparent !important' }}
                                                                >
                                                                    Add Product Item
                                                                </Button>
                                                            </Stack>

                                                        </Box>

                                                    </Grid>

                                                    <Grid item xs={12} md={4}>
                                                        <Grid container justifyContent="space-between" spacing={2} sx={{ pt: 2.5, pb: 2.5 }}>
                                                            <Grid item xs={6}>
                                                                <Stack spacing={1}>
                                                                    <InputLabel>Discount(%)</InputLabel>
                                                                    <TextField
                                                                        type="number"
                                                                        style={{ width: '100%' }}
                                                                        name="discount_percentage"
                                                                        id="discount_percentage"
                                                                        placeholder="0.0"
                                                                        value={formik.values.discount_percentage}
                                                                        onChange={formik.handleChange}
                                                                    />
                                                                </Stack>
                                                            </Grid>



                                                            <Grid item xs={6}>
                                                                <Stack spacing={1}>
                                                                    <InputLabel>Tax(%)</InputLabel>
                                                                    <TextField
                                                                        type="number"
                                                                        style={{ width: '100%' }}
                                                                        name="tax"
                                                                        id="tax"
                                                                        placeholder="0.0"
                                                                        value={formik.values.tax}
                                                                        onChange={formik.handleChange}
                                                                    />
                                                                </Stack>
                                                            </Grid>
                                                        </Grid>




                                                        <Grid container spacing={2} style={{ marginBottom: '15px' }}>
                                                            <Grid item xs={12} sm={6}>
                                                                <Stack spacing={1}>
                                                                    <TextField
                                                                        type="text"
                                                                        style={{ width: '100%' }}
                                                                        name="coupon_code"
                                                                        id="coupon_code"
                                                                        placeholder="Enter Coupon Code"
                                                                        value={formik.values.coupon_code}
                                                                        onBlur={formik.handleBlur}
                                                                        onChange={handleChange}
                                                                    />
                                                                </Stack>
                                                            </Grid>
                                                            <Grid item xs={12} sm={6}>
                                                                <Button
                                                                    variant="contained"
                                                                    color="success"
                                                                    onClick={handleApplyCoupon}
                                                                    disabled={!checkCoupon}
                                                                    style={{ marginBottom: '15px' }}
                                                                >
                                                                    Apply Coupon Code
                                                                </Button>
                                                            </Grid>
                                                        </Grid>




                                                        <Grid item xs={6} style={{ marginBottom: '15px' }}>
                                                            <Stack spacing={1}>
                                                                <InputLabel>Payment Recieved</InputLabel>
                                                                <TextField
                                                                    type="number"
                                                                    style={{ width: '100%' }}
                                                                    name="payment_received"
                                                                    id="payment_received"
                                                                    placeholder="0.0"
                                                                    value={Math.round(formik.values?.payment_received)}
                                                                    onChange={handlePaymentChange}
                                                                />
                                                            </Stack>
                                                        </Grid>


                                                        <Grid item xs={12}>
                                                            <Stack spacing={2}>
                                                                <Stack direction="row" justifyContent="space-between">
                                                                    <Typography color={theme.palette.grey[500]}>Sub Total:</Typography>
                                                                    <Typography>₹{Math.round(subtotal)}</Typography>
                                                                </Stack>
                                                                <Stack direction="row" justifyContent="space-between">
                                                                    <Typography color={theme.palette.grey[500]}>Discount:</Typography>
                                                                    <Typography>₹{Math.round(discountRate / 100 * subtotal)}</Typography>
                                                                </Stack>

                                                                <Stack direction="row" justifyContent="space-between">
                                                                    <Typography color={theme.palette.grey[500]}>Coupon/Membership Discount Added:</Typography>
                                                                    <Typography variant="h6" color={theme.palette.success.main}>
                                                                        ₹{Math.round(CouponDiscount)}
                                                                    </Typography>
                                                                </Stack>

                                                                <Stack direction="row" justifyContent="space-between">
                                                                    <Typography color={theme.palette.grey[500]}>Tax:</Typography>
                                                                    <Typography>₹{Math.round(taxRate / 100 * subtotal)}</Typography>
                                                                </Stack>
                                                                <Stack direction="row" justifyContent="space-between">
                                                                    <Typography variant="subtitle1">Grand Total:</Typography>
                                                                    <Typography variant="subtitle1"> ₹{Math.round(GrandTotal)}</Typography>
                                                                </Stack>
                                                            </Stack>
                                                        </Grid>
                                                        <Stack direction="row" justifyContent="space-between" style={{ marginTop: '10px', backgroundColor: '#ffa0a0', padding: '10px', borderRadius: '10px' }}>
                                                            <Typography variant="subtitle1" style={{ color: 'black' }}>Payment Due: ₹{Math.round(duePayment)}</Typography>
                                                        </Stack>
                                                    </Grid>
                                                </Grid>
                                            </>
                                        );
                                    }}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <Stack spacing={1}>
                                    <InputLabel>Notes</InputLabel>
                                    <TextField
                                        placeholder="Notes"
                                        rows={3}
                                        value={formik.values.notes || ''}
                                        multiline
                                        name="notes"
                                        onChange={formik.handleChange}
                                        inputProps={{
                                            maxLength: notesLimit
                                        }}
                                        helperText={`${(formik.values.notes || '').length} / ${notesLimit}`}
                                        sx={{
                                            width: '100%',
                                            '& .MuiFormHelperText-root': {
                                                mr: 0,
                                                display: 'flex',
                                                justifyContent: 'flex-end'
                                            }
                                        }}
                                    />
                                </Stack>
                            </Grid>
                            <Grid item xs={12}>
                                <Stack spacing={1}>
                                    <InputLabel>Mode of Payment</InputLabel>
                                    <FormControl sx={{ width: { xs: '100%', sm: 250 } }}>
                                        <Select
                                            id="mode_of_payment"
                                            {...formik.getFieldProps('mode_of_payment')}
                                            displayEmpty
                                            defaultValue={formik.values.mode_of_payment}
                                        >
                                            <MenuItem value="UPI">UPI</MenuItem>
                                            <MenuItem value="CASH">CASH</MenuItem>
                                            <MenuItem value="CARD">CARD</MenuItem>
                                            <MenuItem value="OTHERS">OTHERS</MenuItem>
                                        </Select>
                                    </FormControl>
                                </Stack>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <Grid container gap={2}>

                                    {/* <Grid item xs={6}>
                                        <Stack spacing={1}>
                                            <InputLabel>Amount Paid</InputLabel>
                                            <FormControl sx={{ width: { xs: '100%', sm: 250 } }}>
                                                <TextField
                                                    placeholder="Amount Paid"
                                                    value={formik.values.amount_paid}
                                                    name="amount_paid"
                                                    onChange={formik.handleChange}
                                                />
                                            </FormControl>
                                        </Stack>
                                    </Grid> */}
                                </Grid>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <Stack direction="row" justifyContent="flex-end" alignItems="flex-end" spacing={2} sx={{ height: '100%' }}>
                                    <Button color="primary" variant="contained" type="submit">
                                        Create & Send
                                    </Button>
                                </Stack>
                            </Grid>
                        </Grid>
                    </form>
                </FormikProvider>
            </MainCard>
            <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
                <DialogTitle id="form-dialog-title">Send Notification</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Do you want to send the notification?
                    </DialogContentText>
                    <Grid item xs={12} sm={8}>
                        <Stack spacing={2}>
                            <Typography variant="h5">To:</Typography>
                            <Stack sx={{ width: '100%' }}>
                                <Typography variant="subtitle1">{formik.values?.customerInfo?.customer_name}</Typography>
                                <Typography color="secondary">{formik.values?.customerInfo?.mobile}</Typography>
                                <Typography color="secondary">{formik.values?.customerInfo?.email}</Typography>
                            </Stack>
                        </Stack>
                    </Grid>
                    <Button onClick={() => handleNotificationSelection('EMAIL')}>Email</Button>
                    <Button onClick={() => handleNotificationSelection('WHATSAPP')}>WhatsApp</Button>
                    <Button onClick={() => handleNotificationSelection('SMS')}>SMS</Button>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="primary">
                        Cancel
                    </Button>
                </DialogActions>
            </Dialog>
        </Page>
    );
};

Create.getLayout = function getLayout(page: ReactElement) {
    return <Layout>{page}</Layout>;
};

export default Create;
