import { ReactElement, useEffect, useState } from 'react';
// next
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { format } from 'date-fns';
// material-ui
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
import { useTheme } from '@mui/material/styles';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { v4 as UIDV4 } from 'uuid';
// third-party
import { FieldArray, FormikProvider, useFormik } from 'formik';
import * as yup from 'yup';

// project import
import Loader from 'components/Loader';
import MainCard from 'components/MainCard';
import Page from 'components/Page';
import Layout from 'layout';
import InvoiceModal from 'sections/apps/invoice/InvoiceModal';

import { useDispatch, useSelector } from 'store';
import { reviewInvoicePopup } from 'store/reducers/invoice';

// types
import { PlusOutlined } from '@ant-design/icons';
import InvoiceItem from 'sections/apps/invoice/InvoiceItem';
import { editInvoice, getInvoiceById, sendInvoiceNotification } from 'services/invoices';
import { checkCouponCode } from 'services/coupon';
import { EssentialMethods } from 'utils/essentialMethods';
import { errorColor, successColor } from 'config';
import { Invoice } from 'types/invoice';


const validationSchema = yup.object({
    date: yup.date().required('Invoice date is required'),
    due_date: yup
        .date()
        .required('Due date is required')
        .when('date', (date, schema) => date && schema.min(date, "Due date can't be before invoice date"))
        .nullable(),
    status: yup.string().required('Status selection is required'),
});
const initialInvoice = {
    id: 1,
    invoice_id: 1001,
    date: new Date(),
    due_date: new Date(),
    quantity: 1,
    status: "Pending",
    invoice_detail: [
        {
            id: UIDV4(),
            service: {
                attribute_id: 0,
                attribute_name: ''
            },
            staff: [{
                attribute_id: 0,
                attribute_name: '',
                attribute_type: ''
            }],
            qty: 1,
            price: '1.00',
            category: 'Service'
        }
    ],
    cashierInfo: {
        // Assuming InfoType has its own structure
        name: "John Doe",
        address: "EMP001",
        phone: "123",
        email: ""
    },
    discount: null,
    coupon_code: null,
    tax: null,
    tax_added: 0,
    tax_percentage: 0,
    discount_percentage: 0,
    customerInfo: {
        // Assuming InfoType has its own structure
        name: "John Doe",
        address: "EMP001",
        phone: "123",
        email: ""
    },
    notes: "This is an initial invoice.",
    customer_name: "Alice Smith",
    email: "alice@example.com",
    date_created: '',
    total: '1001',
    discount_added: 0,
    price_cut_by_membership: ""
};

// ==============================|| INVOICE - EDIT ||============================== //

const Create = () => {
    const theme = useTheme();
    const dispatch = useDispatch();
    const { data: session } = useSession();

    const router = useRouter();
    const { id } = router.query;
    const [loading, setLoading] = useState<boolean>(false);
    const { isOpen, list } = useSelector((state) => state.invoice);


    const notesLimit: number = 500;
    // const [data, setData] = useState<any>({ discount: 0, coupon_code: false, tax: false, total: 0, mode_of_payment: '' });
    const [formData, setFormData] = useState<any>(initialInvoice);
    useEffect(() => {
        const fetchData = async () => {
            getInvoiceById({ 'id': id }).then((response) => {
                try {
                    const data = response.data.data;
                    const invoiceData = data.rows;
                    const appointmentData = data.staff_data;
                    const convertedInvoice: Invoice = convertResponse(invoiceData, appointmentData);
                    setFormData(convertedInvoice);
                    setLoading(true)
                } catch {
                    router.push('/apps/invoices/manage-invoices')
                }
            });
        }
        fetchData();
    }, [id]);


    const convertResponse = (invoice: any, appointmentData: any): any => {
        let invoiceDetails: any = []

        if (appointmentData?.length > 0) {
            invoiceDetails = appointmentData?.map((item: any) => {
                return {
                    id: item.id,
                    invoice_item: item.invoice_item,
                    qty: 1,
                    staff: item.staff_assigned,
                    price: parseFloat(item.price).toFixed(2),
                    category: item.category
                }
            }) || [];

        }

        const convertedInvoice: Invoice = {
            id: invoice.id,
            invoice_id: Date.now(),
            customer_name: invoice.customer_name,
            email: '',
            actual_amount: invoice?.actual_amount,
            date: new Date(invoice.date_created),
            due_date: new Date(invoice.date_created),
            quantity: 0,
            payment_received: invoice.actual_amount - invoice.due_payment,
            status: invoice.status,
            invoice_detail: invoiceDetails,
            appointment_date: invoice.appointment[0].booking_date,
            cashierInfo: {
                name: invoice.appointment && invoice.appointment[0].salon.name,
                address: invoice.appointment && invoice.appointment[0].salon.owner_name,
                phone: invoice.appointment && invoice.appointment[0].salon.contact_no,
                email: invoice.appointment && invoice.appointment[0].salon.email,
            },
            due_payment: invoice.due_payment,
            discount_added: invoice.discount_added,
            tax_added: invoice.tax_added,
            discount_percentage: invoice.discount_percentage,
            coupon_code: invoice.coupon_code?.coupon_code,
            price_cut_by_coupon_code: invoice.coupon_code?.discount_percent,
            tax_percentage: invoice.tax_percentage,
            customerInfo: {
                name: invoice.appointment && invoice.appointment[0].customer_name,
                address: invoice.appointment && invoice.appointment[0].user.owner_name,
                phone: invoice.appointment && invoice.appointment[0].user.mobile,
                email: invoice.appointment && invoice.appointment[0].user.email,
            },
            notes: invoice.notes,
            mode_of_payment: invoice.mode_of_payment,
            total: invoice.total,
            price_cut_by_membership: invoice.price_cut_by_membership,
            discount: null,
            tax: null
        };
        return convertedInvoice;

    };

    const mode_of_payments = [
        'CASH',
        'UPI',
        'CARD',
        'OTHER',
    ]

    const addNextInvoiceHandler = () => {
        dispatch(
            reviewInvoicePopup({
                isOpen: false
            })
        );
    };


    const handlerEdit = async (values: any) => {
        const NewList: Invoice = {
            appointment_date: values.appointment_date,
            id: Number(list?.id),
            actual_amount: values.actual_amount,
            invoice_id: Number(values.id),
            customer_name: values.cashierInfo?.name,
            email: values.cashierInfo?.email,
            discount_added: values.discount,
            coupon_code: values.coupon_code,
            tax_added: Number(values.tax),
            date: format(new Date(values.date), 'MM/dd/yyyy'),
            due_date: format(new Date(values.due_date), 'MM/dd/yyyy'),
            quantity: Number(
                values.invoice_detail?.reduce((sum: any, i: any) => {
                    return sum + i.qty;
                }, 0)
            ),
            price_cut_by_coupon_code: values.price_cut_by_coupon_code,
            status: values.status,
            cashierInfo: values.cashierInfo,
            customerInfo: values.customerInfo,
            invoice_detail: values.invoice_detail,
            notes: values.notes,
            tax_percentage: values.tax_percentage,
            discount_percentage: values.discount_percentage,
            payment_received: values.payment_received,
            due_payment: values.due_payment,
            price_cut_by_membership: values.price_cut_by_membership,
            discount: null,
            tax: null,
            mode_of_payment: values.mode_of_payment,
        };
        try {
            const response = await editInvoice(NewList);
            console.log(response)
            if (response.data.status === 200) {
                EssentialMethods.showSnackbar(response.data.message, successColor);
                router.push('/apps/invoices/manage-invoices');
            } else {
                EssentialMethods.showSnackbar(response.data.message, errorColor);
            }
        } catch (error) {
            console.error('Error updating invoice:', error);
            throw error;
        }
    };

    const [open, setOpen] = useState(false);
    const [notificationMethod, setNotificationMethod] = useState('');

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        router.push('/apps/invoices/manage-invoices');
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
                EssentialMethods.showSnackbar(response.data.message, successColor);
                router.push('/apps/invoices/manage-invoices');
            } else {
                EssentialMethods.showSnackbar(response.data.message, errorColor);
            }
        } catch (error) {
            console.error("Error sending notification:", error);
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
        console.log('after file upload');

        // console.log('Uploaded file URL', uploadPromise)
        return `https://${S3_BUCKET}.s3.${AWS_REGION}.amazonaws.com/${INVOICE_KEY}`;
    }


    const formik = useFormik({
        initialValues: formData,
        enableReinitialize: true,
        validationSchema: validationSchema,
        onSubmit: (values) => {
            handlerEdit(values);
        },
    });

    const calculateSubtotal = () => {
        return formik.values?.invoice_detail?.reduce((prev: any, curr: any) => {
            return prev + Number(curr.price * Math.floor(curr.qty));
        }, 0) || 0;
    };

    const [CouponCode, setCouponCode] = useState(String(formik.values?.coupon_code));
    const [duePayment, setduePayment] = useState(0);
    const [couponCodeDiscount, setcouponCodeDiscount] = useState(0);


    const subtotal = calculateSubtotal();

    const discountPercentage = formik.values?.discount_percentage
    const taxPercentage = formik.values?.tax_percentage

    const discountAdded = Math.floor(discountPercentage / 100 * subtotal)
    const taxAdded = Math.floor(taxPercentage / 100 * subtotal)

    const price_cut_by_membership = formik.values?.price_cut_by_membership

    const default_coupon_discount_value = formik.values?.price_cut_by_coupon_code
    const couponDiscount = ((default_coupon_discount_value && Number(default_coupon_discount_value)) || couponCodeDiscount) / 100 * subtotal

    const grandTotal = Math.round(Number(subtotal - discountAdded + taxAdded - (price_cut_by_membership || couponDiscount)))

    const paymentReceived = grandTotal - formik.values?.due_payment
    useEffect(() => {
        formik.setFieldValue('payment_received', paymentReceived);
        formik.setFieldValue('actual_amount', grandTotal)
        setduePayment(Math.round(grandTotal - paymentReceived))
    }, [paymentReceived]);

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
                formik.setFieldValue('coupon_code', '');
                EssentialMethods.showSnackbar(response.data.message, errorColor)
            }
        } catch (error) {
            console.error('Error applying coupon code:', error);
        }
    }

    const handleChange = (e: any) => {
        formik.handleChange(e);
        setCouponCode(e.target.value);
    };

    console.log(formik.values);
    const handlePaymentRecievedChange = (e: any) => {
        const payment_recieved = Math.round(e.target.value);
        if (payment_recieved <= grandTotal && payment_recieved >= 0) {
            formik.handleChange(e);
            const duePayment = grandTotal - payment_recieved;
            setduePayment(duePayment)
        }
    };

    if (!loading) return <Loader />;
    return (
        <Page title="Invoice Edit">
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
                                            type="text"
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
                                            name="status"
                                            renderValue={(selected) => {
                                                if (selected.length === 0) {
                                                    return <Box sx={{ color: 'secondary.400' }}>Select status</Box>;
                                                }
                                                return selected;
                                            }}
                                            onChange={formik.handleChange}
                                            error={Boolean(formik.errors.status && formik.touched.status)}
                                        >
                                            <MenuItem value="Paid">Paid</MenuItem>
                                            <MenuItem value="Unpaid">Unpaid</MenuItem>
                                            <MenuItem value="Cancelled">Cancelled</MenuItem>
                                        </Select>
                                    </FormControl>
                                </Stack>
                                {formik.touched.status && formik.errors.status && <FormHelperText error={true}>"Error"</FormHelperText>}
                            </Grid>
                            <Grid item xs={12} sm={6} md={3}>
                                <Stack spacing={1}>
                                    <InputLabel>Invoice Created on</InputLabel>
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
                            <Grid item xs={12} sm={6} md={3}>
                                <Stack spacing={1}>
                                    <InputLabel>Appointment date:</InputLabel>
                                    <FormControl sx={{ width: '100%' }} error={Boolean(formik.touched.appointment_date && formik.errors.appointment_date)}>
                                        <LocalizationProvider dateAdapter={AdapterDateFns}>
                                            <DatePicker
                                                inputFormat="dd/MM/yyyy"
                                                value={formik.values.appointment_date}
                                                onChange={(newValue) => formik.setFieldValue('appointment_date', newValue)}
                                                renderInput={(params) => <TextField error={formik.touched.appointment_date && Boolean(formik.errors.appointment_date)} {...params} />}
                                            />
                                        </LocalizationProvider>
                                    </FormControl>
                                </Stack>
                                {formik.touched.appointment_date && formik.errors.appointment_date && <FormHelperText error={true}>{formik.errors.appointment_date as string}</FormHelperText>}
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <MainCard>
                                    <Stack spacing={1}>
                                        <Typography variant="h5">From:</Typography>
                                        <FormControl sx={{ width: '100%' }}>
                                            <Typography color="secondary">{formik.values?.cashierInfo?.name}</Typography>
                                            <Typography color="secondary">{formik.values?.cashierInfo?.phone}</Typography>
                                        </FormControl>
                                    </Stack>
                                </MainCard>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <MainCard>
                                    <Stack spacing={1}>
                                        <Typography variant="h5">To:</Typography>
                                        <FormControl sx={{ width: '100%' }}>
                                            <Typography variant="subtitle1">{formik.values?.customerInfo?.name}</Typography>
                                            <Typography color="secondary">{formik.values?.customerInfo?.address}</Typography>
                                            <Typography color="secondary">{formik.values?.customerInfo?.email}</Typography>
                                        </FormControl>
                                    </Stack>
                                </MainCard>
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
                                                                        push({
                                                                            id: UIDV4(),
                                                                            service: {
                                                                                attribute_id: 0,
                                                                                attribute_name: ''
                                                                            },
                                                                            staff: [
                                                                                {
                                                                                    attribute_id: 0,
                                                                                    attribute_name: '',
                                                                                    attribute_type: '',
                                                                                },
                                                                            ],
                                                                            qty: 1,
                                                                            price: '0.00',
                                                                            category: 'Service'
                                                                        })
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
                                                                        push({
                                                                            id: UIDV4(),
                                                                            service: {
                                                                                attribute_id: 0,
                                                                                attribute_name: ''
                                                                            },
                                                                            staff: [
                                                                                {
                                                                                    attribute_id: 0,
                                                                                    attribute_name: '',
                                                                                    attribute_type: '',
                                                                                },
                                                                            ],
                                                                            qty: 1,
                                                                            price: '0.00',
                                                                            category: 'Product'
                                                                        })
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
                                                                        name="tax_percentage"
                                                                        id="tax_percentage"
                                                                        placeholder="0.0"
                                                                        value={formik.values.tax_percentage}
                                                                        onChange={formik.handleChange}
                                                                    />
                                                                </Stack>
                                                            </Grid>
                                                        </Grid>
                                                        {formik.values.price_cut_by_membership === 0 && (
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
                                                                            InputProps={{ readOnly: formik.values.due_payment === "PAID" }}
                                                                            onChange={handleChange}
                                                                        />
                                                                    </Stack>
                                                                </Grid>
                                                                <Grid item xs={12} sm={6}>
                                                                    <Button
                                                                        variant="contained"
                                                                        color="success"
                                                                        onClick={handleApplyCoupon}
                                                                        style={{ marginBottom: '15px' }}
                                                                    >
                                                                        Apply Coupon Code
                                                                    </Button>
                                                                </Grid>
                                                            </Grid>
                                                        )}


                                                        <Grid item xs={6} style={{ marginBottom: '15px' }}>
                                                            <Stack spacing={1}>
                                                                <InputLabel>Payment Recieved</InputLabel>
                                                                <TextField
                                                                    type="number"
                                                                    style={{ width: '100%' }}
                                                                    name="payment_received"
                                                                    id="payment_received"
                                                                    placeholder="0.0"
                                                                    value={Math.round(formik.values.payment_received)}
                                                                    onChange={handlePaymentRecievedChange}
                                                                />
                                                            </Stack>
                                                        </Grid>

                                                        <Grid item xs={12} spacing={4}>
                                                            <Stack spacing={2}>
                                                                <Stack direction="row" justifyContent="space-between">
                                                                    <Typography color={theme.palette.grey[500]}>Sub Total:</Typography>
                                                                    <Typography>₹{Math.round(subtotal)}</Typography>
                                                                </Stack>
                                                                <Stack direction="row" justifyContent="space-between">
                                                                    <Typography color={theme.palette.grey[500]}>Discount:</Typography>
                                                                    <Typography variant="h6" color={theme.palette.success.main}>
                                                                        ₹{discountAdded}
                                                                    </Typography>
                                                                </Stack>

                                                                <Stack direction="row" justifyContent="space-between">
                                                                    <Typography color={theme.palette.grey[500]}>Coupon/Membership Discount Added:</Typography>
                                                                    <Typography variant="h6" color={theme.palette.success.main}>
                                                                        ₹{price_cut_by_membership || Math.round(couponDiscount)}
                                                                    </Typography>
                                                                </Stack>

                                                                <Stack direction="row" justifyContent="space-between">
                                                                    <Typography color={theme.palette.grey[500]}>Tax:</Typography>
                                                                    <Typography>₹{taxAdded}</Typography>
                                                                </Stack>
                                                                <Stack direction="row" justifyContent="space-between">
                                                                    <Typography variant="subtitle1">Grand Total:</Typography>
                                                                    <Typography variant="subtitle1"> ₹{Math.round(grandTotal)}</Typography>
                                                                </Stack>
                                                            </Stack>
                                                        </Grid>
                                                        <Stack direction="row" justifyContent="space-between" style={{ marginTop: '10px', backgroundColor: '#ffa0a0', padding: '10px', borderRadius: '10px' }}>
                                                            <Typography variant="subtitle1" style={{ color: 'black' }}>Payment Due: ₹{Math.round(duePayment)}</Typography>
                                                        </Stack>
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
                                                            <InputLabel htmlFor="mode_of_payment">Mode of Payment</InputLabel>
                                                            <FormControl sx={{ width: { xs: '100%', sm: 250 } }}>
                                                                <Select
                                                                    id="mode_of_payment"
                                                                    {...formik.getFieldProps('mode_of_payment')}
                                                                    displayEmpty
                                                                    value={formik.values.mode_of_payment}
                                                                >
                                                                    <MenuItem value="UPI">UPI</MenuItem>
                                                                    <MenuItem value="CASH">Cash</MenuItem>
                                                                    <MenuItem value="CARD">Card</MenuItem>
                                                                    <MenuItem value="OTHERS">Others</MenuItem>
                                                                </Select>
                                                            </FormControl>
                                                        </Stack>
                                                    </Grid>
                                                    <Grid item xs={12} sm={6} md={8} ></Grid>
                                                    <Grid item xs={12} sm={6} md={4} >
                                                        <Stack direction="row" justifyContent="flex-end" alignItems="flex-end" spacing={2} sx={{ height: '140%' }}>
                                                            <Button color="error" onClick={() => router.push('/apps/invoices/manage-invoices')}>
                                                                Back
                                                            </Button>
                                                            <Button color="primary" variant="contained" type="submit">
                                                                Update & Send
                                                            </Button>
                                                            <InvoiceModal
                                                                isOpen={isOpen}
                                                                setIsOpen={(value: any) =>
                                                                    dispatch(
                                                                        reviewInvoicePopup({
                                                                            isOpen: value
                                                                        })
                                                                    )
                                                                }
                                                                key={formik.values.invoice_id}
                                                                invoiceInfo={{
                                                                    ...formik.values,
                                                                    subtotal
                                                                }}
                                                                items={formik.values?.invoice_detail}
                                                                onAddNextInvoice={addNextInvoiceHandler}
                                                            />
                                                        </Stack>
                                                    </Grid>
                                                </Grid>
                                            </>
                                        );
                                    }}
                                />
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
        </Page >
    );
};

Create.getLayout = function getLayout(page: ReactElement) {
    return <Layout>{page}</Layout>;
};

export default Create;