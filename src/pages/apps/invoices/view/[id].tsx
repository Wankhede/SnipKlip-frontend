import { ReactElement, useEffect, useState, useRef } from 'react';

// next
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';

// material-ui
import { useTheme } from '@mui/material/styles';
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3'


import {
    Box,
    Grid,
    IconButton,
    Chip,
    FormControl,
    Button,
    Stack,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography,
    Divider
} from '@mui/material';

// third-party
import ReactToPrint from 'react-to-print';
import { PDFDownloadLink, pdf } from '@react-pdf/renderer';

// project import
import Layout from 'layout';
import Page from 'components/Page';
import Loader from 'components/Loader';
import MainCard from 'components/MainCard';
import LogoSection from 'components/logo';
import ExportPDFView from 'sections/apps/invoice/export-pdf';

import { useSelector } from 'store';

// assets
import { DownloadOutlined, EditOutlined, PrinterFilled, ShareAltOutlined } from '@ant-design/icons';
import { Invoice } from 'types/invoice';
import React from 'react';
import { getInvoiceById } from 'services/invoices';
import { EssentialMethods } from 'utils/essentialMethods';
import { errorColor, successColor } from 'config';

// ==============================|| INVOICE - DETAILS ||============================== //
const initialInvoice: Invoice = {
    id: 1,
    invoice_id: 1001,
    date: new Date(),
    due_date: new Date(),
    quantity: 1,
    status: "Pending",
    invoice_detail: [], // Assuming Items is an array type
    cashierInfo: {
        // Assuming InfoType has its own structure
        name: "John Doe",
        address: "EMP001",
        phone: "123",
        email: ""
    },
    discount: null,
    tax: null,
    customerInfo: {
        // Assuming InfoType has its own structure
        name: "John Doe",
        address: "EMP001",
        phone: "123",
        email: ""
    },
    notes: "This is an initial invoice.",
    customer_name: "Alice Smith",
    coupon_code: null,
    date_created: '',
    total: '1001',
    discount_added: '11',
    actual_amount: 0,
    price_cut_by_coupon_code: 0,
    payment_received: 0,
    tax_percentage: null,
    tax_added: 0,
    discount_percentage: null,
    mode_of_payment: 'UPI',
};

const Details = () => {
    const theme = useTheme();
    const router = useRouter();
    const { id } = router.query;

    const { data: session } = useSession();

    const { list } = useSelector((state) => state.invoice);
    const [loading, setLoading] = useState<boolean>(false);
    const [invoice, setInvoice] = useState<Invoice>(initialInvoice);
    const [invoiceI, setInvoiceI] = useState<any>();
    useEffect(() => {
        const fetchData = async () => {
            getInvoiceById({ 'id': id }).then((response) => {
                const data = response.data.data.rows;
                console.log(data);
                const convertedInvoice: Invoice = convertResponse(data);
                console.log(convertedInvoice);
                setInvoice(convertedInvoice)
                setLoading(true)
            });
            console.log('Invoice', invoice)
            // convertResponse(invoice);
        }
        fetchData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id]);


    const convertResponse = (invoice: any): any => {
        let invoiceDetails: any = []
        if (invoice?.appointment && invoice.appointment.length > 0) {

            let stylists = '';
            const appointments = invoice.appointment;

            for (const appointment of appointments) {
                if (appointment.staff_assigned && Array.isArray(appointment.staff_assigned)) {
                    for (const staff of appointment.staff_assigned) {
                        if (staff && staff.customer_name) {
                            stylists += `${staff.customer_name}, `;
                        }
                    }
                }
            }

            // Remove the trailing ', ' and log the concatenated names
            stylists = stylists.slice(0, -2);

            // console.log('Concatenated stylist names:', stylists);
            // This code will iterate over the appointments, check for staff_assigned, and concatenate the customer_name into the stylists variable. Finally, it removes the trailing comma and space. The concatenated stylist names are then logged to the console.


            invoiceDetails = invoice.appointment.flatMap((appointment: any) => {
                let invoice_item = appointment.category === 'Service' ? appointment.service : appointment.product;

                return invoice_item?.map((service: any) => ({
                    id: service.id,
                    name: service.name,
                    qty: 1,
                    stylist: appointment.staff_assigned[0].customer_name,
                    price: parseFloat(service.price),
                    category: appointment.category
                })) || [];
            });
        }

        const convertedInvoice: Invoice = {
            id: invoice.id,
            invoice_id: Date.now(),
            customer_name: invoice.customer_name,
            date: invoice.date_created,
            due_date: new Date(invoice.date_created),
            quantity: 0,
            status: invoice.status,
            invoice_detail: invoiceDetails,
            cashierInfo: {
                name: invoice.appointment && invoice.appointment[0].salon.name,
                address: invoice.appointment && invoice.appointment[0].salon.owner_name,
                phone: invoice.appointment && invoice.appointment[0].salon.contact_no,
                email: invoice.appointment && invoice.appointment[0].salon.email,
            },
            discount: invoice.discount_added,
            tax: null,
            customerInfo: {
                name: invoice.appointment && invoice.appointment[0].customer_name,
                address: invoice.appointment && invoice.appointment[0].user.owner_name,
                phone: invoice.appointment && invoice.appointment[0].user.mobile,
                email: invoice.appointment && invoice.appointment[0].user.email,
            },
            notes: '',
            coupon_code: null,
            total: invoice.total,
            discount_added: invoice.discount_added,
            actual_amount: invoice.actual_amount,
            price_cut_by_coupon_code: invoice.price_cut_by_coupon_code,
            payment_received: invoice.payment_received,
            tax_percentage: invoice.tax_percentage,
            tax_added: invoice.tax_added,
            discount_percentage: invoice.discount_percentage,
            mode_of_payment: invoice.mode_of_payment,
        };
        console.log(convertedInvoice);
        return convertedInvoice; // Return the converted object
    };
    const convertedInvoice: Invoice = convertResponse(invoice);

    const str_date = String(invoice.date);
    const invoice_date = str_date.substring(0, 10);
    const componentRef: React.Ref<HTMLDivElement> = useRef(null);
    const fileName = invoice.customer_name + '-' + id + '.pdf';
    if (!loading) return <Loader />;
    const handleShare = async () => {
        try {


            const sharableLink = await generateShareableLink(Number(id!));
            const shareText = `Check out this invoice: ${sharableLink}`;
            const whatsappUrl = `whatsapp://send?text=${encodeURIComponent(shareText)}`;

            if (navigator.clipboard) {
                navigator.clipboard.writeText(sharableLink);
                console.log('copied sharable link to clipboard: ', sharableLink);
                EssentialMethods.showSnackbar('Sharable link copied to clipboard', successColor)
            } else {
                console.log("Clipboard API not available!!");
                throw new Error("Clipboard API not available!!");
            }
        } catch (error) {
            console.error(error);
            EssentialMethods.showSnackbar('Something went wrong!', errorColor)
        }

        // if (!navigator.share) {
        //   navigator.share({
        //     title: 'Invoice',
        //     text: shareText,
        //     url: await generateShareableLink(Number(id!)),
        //   })
        //     .then(() => console.log('Shared successfully'))
        //     .catch((error) => console.error('Error sharing:', error));
        // } else if (window.open(whatsappUrl)) {
        //   // If the Web Share API is not supported, try to open the WhatsApp URL directly
        //   console.log('Opened WhatsApp');
        // } else {
        //   // Fallback for browsers that do not support the Web Share API
        //   alert('Web Share API and WhatsApp are not supported in this browser.');
        // }
    };

    // Function to generate a shareable link for an invoice
    async function generateShareableLink(invoiceId: number) {
        const invoiceDoc = <ExportPDFView invoice={invoice} />;
        const invoicePdfBlob = await pdf(invoiceDoc).toBlob();

        const S3_BUCKET = process.env.S3_BUCKET_AWS
        const AWS_REGION = process.env.REGION_AWS

        const INVOICE_KEY = `${invoice.customer_name}/invoice-${invoice.id}.pdf`;
        var uploadParams = { Bucket: S3_BUCKET, Key: INVOICE_KEY, Body: invoicePdfBlob, ContentType: 'application/pdf' }
        console.log(uploadParams);

        const s3Client = new S3Client({
            credentials: {
                accessKeyId: process.env.ACCESS_KEY_ID_AWS ?? '',
                secretAccessKey: process.env.SECRET_ACCESS_KEY_AWS ?? ''
            },
            region: AWS_REGION
        })

        const uploadPromise = await s3Client.send(new PutObjectCommand(uploadParams));
        console.log('after file upload');

        console.log('Uploaded file URL', uploadPromise)
        return `https://${S3_BUCKET}.s3.${AWS_REGION}.amazonaws.com/${INVOICE_KEY}`;
    }
    const calculateSubtotal = () => {
        return invoice.invoice_detail?.reduce((prev: any, curr: any) => {
            return prev + Number(curr.price * Math.floor(curr.qty));
        }, 0) || 0;
    };
    const subtotal = calculateSubtotal();
    const discountPercentage = invoice.discount_percentage
    const taxPercentage = invoice.tax_percentage

    const discountAdded = Math.floor(discountPercentage! / 100 * subtotal)
    const taxAdded = Math.floor(taxPercentage! / 100 * subtotal)

    const price_cut_by_membership = invoice.price_cut_by_membership

    const default_coupon_discount_value = invoice.price_cut_by_coupon_code
    const couponDiscount = ((default_coupon_discount_value && Number(default_coupon_discount_value))) / 100 * subtotal

    const grandTotal = Math.round(Number(subtotal - discountAdded + taxAdded - (price_cut_by_membership || couponDiscount)))

    const paymentReceived = grandTotal - invoice.due_payment!
    return (
        <Page title="Invoice Details">
            <MainCard content={false}>
                <Stack spacing={2.5}>
                    <Box sx={{ p: 2.5, pb: 0 }}>
                        <MainCard content={false} sx={{ p: 1.25, bgcolor: 'primary.lighter', borderColor: theme.palette.primary[100] }}>
                            <Stack direction="row" justifyContent="flex-end" spacing={1}>
                                <IconButton onClick={() => router.push(`/apps/invoice/edit/${id}`)}>
                                    <EditOutlined style={{ color: theme.palette.grey[900] }} />
                                </IconButton>
                                <PDFDownloadLink document={<ExportPDFView invoice={invoice} />} fileName={fileName}>
                                    <IconButton>
                                        <DownloadOutlined style={{ color: theme.palette.grey[900] }} />
                                    </IconButton>
                                </PDFDownloadLink>
                                <ReactToPrint
                                    trigger={() => (
                                        <IconButton>
                                            <PrinterFilled style={{ color: theme.palette.grey[900] }} />
                                        </IconButton>
                                    )}
                                    content={() => componentRef.current}
                                />
                                <IconButton onClick={handleShare}>
                                    <ShareAltOutlined style={{ color: theme.palette.grey[900] }} />
                                </IconButton>
                            </Stack>
                        </MainCard>
                    </Box>
                    <Box sx={{ p: 2.5 }} id="print" ref={componentRef}>
                        <Grid container spacing={2.5}>
                            <Grid item xs={12}>
                                <Stack direction="row" justifyContent="space-between">
                                    <Box>
                                        {/* <Stack direction="row" spacing={2}>
                                            <LogoSection />
                                            <Chip label="Paid" variant="light" color="success" size="small" />
                                        </Stack> */}
                                        <Typography variant="subtitle1">Invoice Number</Typography>
                                        <Typography color="secondary">{invoice.invoice_id}</Typography>
                                    </Box>
                                    <Box>
                                        <Stack direction="row" spacing={1} justifyContent="flex-end">
                                            <Typography variant="subtitle1">Date</Typography>
                                            <Typography color="secondary">{invoice_date}</Typography>
                                        </Stack>
                                    </Box>
                                </Stack>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <MainCard>
                                    <Stack spacing={1}>
                                        <Typography variant="h5">From:</Typography>
                                        <FormControl sx={{ width: '100%' }}>
                                            <Typography color="secondary">{invoice.cashierInfo.name}</Typography>
                                            <Typography color="secondary">{invoice.cashierInfo.email}</Typography>
                                            <Typography color="secondary">{invoice.cashierInfo.phone}</Typography>
                                        </FormControl>
                                    </Stack>
                                </MainCard>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <MainCard>
                                    <Stack spacing={1}>
                                        <Typography variant="h5">To:</Typography>
                                        <FormControl sx={{ width: '100%' }}>
                                            <Typography color="secondary">{invoice.customerInfo.name}</Typography>
                                            <Typography color="secondary">{invoice.customerInfo.email}</Typography>
                                            <Typography color="secondary">{invoice.customerInfo.phone}</Typography>
                                        </FormControl>
                                    </Stack>
                                </MainCard>
                            </Grid>
                            <Grid item xs={12}>
                                <TableContainer>
                                    <Table>
                                        <TableHead>
                                            <TableRow>
                                                <TableCell>#</TableCell>
                                                <TableCell>CATEGORY</TableCell>
                                                <TableCell>ITEM</TableCell>
                                                <TableCell>STYLIST NAME</TableCell>
                                                <TableCell align="right">QTY</TableCell>
                                                <TableCell align="right">PRICE</TableCell>
                                                <TableCell align="right">AMOUNT</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {invoice.invoice_detail?.map((service: any, index: number) => (
                                                <React.Fragment key={service.id}>
                                                    <TableRow key={service.name} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                                        <TableCell>{index + 1}</TableCell>
                                                        <TableCell>{service.category}</TableCell>
                                                        <TableCell>{service.name}</TableCell>
                                                        <TableCell>{service.stylist}</TableCell>
                                                        <TableCell align="right">1</TableCell>
                                                        <TableCell align="right">₹ {Number(service.price).toFixed(2)}</TableCell>
                                                        <TableCell align="right">₹ {Number(service.price).toFixed(2)}</TableCell>
                                                    </TableRow>
                                                </React.Fragment>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            </Grid>
                            <Grid item xs={12}>
                                <Divider sx={{ borderWidth: 1 }} />
                            </Grid>
                            <Grid item xs={12} sm={6} md={8}></Grid>
                            <Grid item xs={12} sm={6} md={4}>
                                <Stack spacing={2}>
                                    <Stack direction="row" justifyContent="space-between">
                                        <Typography color={theme.palette.grey[500]}>Sub Total:</Typography>
                                        <Typography>₹ {subtotal}</Typography>
                                    </Stack>
                                    <Stack direction="row" justifyContent="space-between">
                                        <Typography color={theme.palette.grey[500]}>Discount:</Typography>
                                        <Typography variant="h6" color={theme.palette.success.main}>
                                            ₹{discountAdded}
                                        </Typography>
                                    </Stack>
                                    <Stack direction="row" justifyContent="space-between">
                                        <Typography color={theme.palette.grey[500]}>Coupon/Membership Discount Added:</Typography>
                                        <Typography>₹{price_cut_by_membership || Math.round(couponDiscount)}</Typography>
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
                            <Grid item xs={12}>
                            </Grid>
                        </Grid>
                    </Box>
                    <Stack direction="row" justifyContent="flex-end" spacing={2} sx={{ p: 2.5, a: { textDecoration: 'none', color: 'inherit' } }}>
                        <PDFDownloadLink document={<ExportPDFView invoice={invoice} />} fileName={fileName}>
                            <Button variant="contained" color="primary">
                                Download
                            </Button>
                        </PDFDownloadLink>
                    </Stack>
                </Stack>
            </MainCard>
        </Page>
    );
};

Details.getLayout = function getLayout(page: ReactElement) {
    return <Layout>{page}</Layout>;
};

export default Details;