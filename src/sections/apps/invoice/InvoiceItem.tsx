// material-ui
import { Box, Button, Stack, TableCell, Tooltip, Typography, TextField } from '@mui/material';
import { Autocomplete } from '@mui/material';

import { useState, useEffect } from 'react';

// project import
import InvoiceField from './InvoiceField';

// assets
import { DeleteOutlined } from '@ant-design/icons';

import { getServices, getStaff } from 'services/metadata';
import { MetaDataTypeI } from 'types/common';
import { useUserProfile } from 'pages/apps/user-provider';
import { listProduct } from 'services/product';

// ==============================|| INVOICE - ITEMS ||============================== //

const InvoiceItem = ({ id, name, description, qty, price, onDeleteItem, onEditItem, index, Blur, errors, touched, setFormData, formik, category }: any) => {
    const deleteItemHandler = () => {
        onDeleteItem(index);
    };

    const textFieldItem = [
        { placeholder: '', label: 'Qty', type: 'number', name: `invoice_detail.${index}.qty`, id: id, value: qty },
        { placeholder: '', label: 'price', type: 'number', name: `invoice_detail.${index}.price`, id: id, value: price }
    ];
    const [products, setProducts] = useState<any[]>([]);
    const [services, setServices] = useState<any[]>([]);
    const [staff, setStaff] = useState<any[]>([]);
    const [selectedService, setSelectedService] = useState(null);
    const [selectedStaff, setSelectedStaff] = useState<any[]>([]);
    const { userData, loading } = useUserProfile();
    const onServiceChange = (event: any, newValue: any) => {
        setSelectedService(newValue);

        const selectedServiceData = services.find((service) => {
            return newValue && service.id === newValue.attribute_id;
        });
        if (selectedServiceData) {
            const updatedItem = {
                ...newValue,
                price: selectedServiceData.price,
            };
            const itemIndex = formik.values.invoice_detail.findIndex(
                (item: any) => item.id === id
            );
            if (itemIndex !== -1) {
                const updatedInvoiceDetail = [...formik.values.invoice_detail];
                updatedInvoiceDetail[itemIndex]['price'] = selectedServiceData.price;
                updatedInvoiceDetail[itemIndex]['invoice_item'] = newValue;
                formik.values.invoice_detail = updatedInvoiceDetail
                formik.setFieldValue('invoice_detail', updatedInvoiceDetail)
            }
        }
    };
    const onProductChange = (event: any, newValue: any) => {

        const selectedProductData = products.find(
            (product) => {
                return newValue && product.id === newValue.attribute_id
            }
        );
        if (selectedProductData) {
            const updatedItem = {
                ...newValue,
                price: selectedProductData.price,
            };
            const itemIndex = formik.values.invoice_detail.findIndex(
                (item: any) => item.id === id
            );

            if (itemIndex !== -1) {
                const updatedInvoiceDetail = [...formik.values.invoice_detail];
                updatedInvoiceDetail[itemIndex]['price'] = selectedProductData.price;
                updatedInvoiceDetail[itemIndex]['invoice_item'] = newValue;
                formik.values.invoice_detail = updatedInvoiceDetail
                formik.setFieldValue('invoice_detail', updatedInvoiceDetail)
            }
        }
    };
    const onStaffChange = (event: any, newValue: any) => {
        setSelectedStaff(newValue);
        const itemIndex = formik.values.invoice_detail.findIndex(
            (item: any) => item.id === id
        );
        if (itemIndex !== -1) {
            const updatedInvoiceDetail = [...formik.values.invoice_detail];
            updatedInvoiceDetail[itemIndex]['staff'] = newValue;
            formik.values.invoice_detail = updatedInvoiceDetail
            formik.setFieldValue('invoice_detail', updatedInvoiceDetail)

        }
    };
    const fetchMetadata = async () => {
        try {
            getStaff(userData)
                .then(response => {
                    let metadata: MetaDataTypeI[] = response.data.data.rows[0].staff_assigned.map((item: any) => {
                        return {
                            element: item.customer_name,
                            id: item.id
                        };
                    });
                    setStaff(metadata);
                })
                .catch(error => console.log(error))

            getServices(userData)
                .then(response => {
                    let metadata: any = response.data.data.rows[0].service.map((item: any) => {
                        return {
                            price: item.price,
                            element: item.name,
                            id: item.id
                        };
                    });
                    setServices(metadata);
                })
                .catch(error => console.log(error));

            listProduct(userData)
                .then(response => {
                    console.log(response);

                    let metadata: any = response.data.data.rows.map((item: any) => {
                        return {
                            price: item.price,
                            element: item.name,
                            id: item.id
                        };
                    });
                    console.log(metadata);

                    setProducts(metadata);
                })
                .catch(error => console.log(error));
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
            <TableCell>
                {category}
            </TableCell>
            <TableCell>
                {category === 'Product' ?
                    <Autocomplete
                        id={id}
                        value={formik.values.invoice_detail[index].invoice_item}
                        onChange={(event, newValue: any | null) => onProductChange(event, newValue)}
                        options={products.map((item: MetaDataTypeI) => ({ attribute_id: item.id!, attribute_name: item.element }))}
                        renderOption={(props, option) => <li {...props} key={option.attribute_id}>{option.attribute_name}</li>}
                        getOptionLabel={(option) => (option.attribute_name)}
                        isOptionEqualToValue={(option, value) => value?.attribute_id === undefined || option?.attribute_id === value?.attribute_id}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                placeholder="Please Select Products"
                            />
                        )}
                    /> : <Autocomplete
                        id={id}
                        value={formik.values.invoice_detail[index].invoice_item}
                        onChange={(event, newValue: any | null) => onServiceChange(event, newValue)}
                        options={services.map((item: MetaDataTypeI) => ({ attribute_id: item.id!, attribute_name: item.element }))}
                        renderOption={(props, option) => <li {...props} key={option.attribute_id}>{option.attribute_name}</li>}
                        getOptionLabel={(option) => (option.attribute_name)}
                        isOptionEqualToValue={(option, value) => value?.attribute_id === undefined || option?.attribute_id === value?.attribute_id}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                placeholder="Please Select Services"
                            />
                        )}
                    />}
            </TableCell>
            <TableCell>
                <Autocomplete
                    id={id}
                    multiple={true}
                    value={formik.values.invoice_detail[index].staff}
                    onChange={(event, newValue: any | null) => onStaffChange(event, newValue)}
                    options={staff.map((item: MetaDataTypeI) => ({ attribute_id: item.id!, attribute_name: item.element }))}
                    renderOption={(props, option) => <li {...props} key={option.attribute_id}>{option.attribute_name}</li>}
                    getOptionLabel={(option) => (option.attribute_name)}
                    isOptionEqualToValue={(option, value) => value?.attribute_id === undefined || option?.attribute_id === value?.attribute_id}
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            placeholder="Please Select Staff"
                        />
                    )}
                />
            </TableCell>
            {textFieldItem.map((item: any) => {
                return (
                    <InvoiceField
                        onEditItem={(event: any) => onEditItem(event)}
                        onBlur={(event: any) => Blur(event)}
                        cellData={{
                            placeholder: item.placeholder,
                            name: item.name,
                            type: item.type,
                            id: item.id,
                            value: item.value,
                            errors: item.errors,
                            touched: item.touched
                        }}
                        key={item.label}
                    />
                );
            })}
            <TableCell>
                <Stack direction="column" justifyContent="flex-end" alignItems="flex-center" spacing={2}>
                    <Box sx={{ pr: 2, pl: 2 }}>
                        <Typography>₹{(price * qty).toFixed(2)}</Typography>
                    </Box>
                </Stack>
            </TableCell>
            <TableCell>
                <Tooltip title="Remove Item">
                    <Button color="error" onClick={deleteItemHandler}>
                        <DeleteOutlined />
                    </Button>
                </Tooltip>
            </TableCell>
        </>
    );
};

export default InvoiceItem;
