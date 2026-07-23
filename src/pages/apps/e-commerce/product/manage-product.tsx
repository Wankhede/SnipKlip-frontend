import { useMemo, MouseEvent, ReactElement, useState } from 'react';

// netx
import { useRouter } from 'next/router';

// material-ui
import { useTheme } from '@mui/material/styles';
import {
    Button,
    Chip,
    Stack,
    Tooltip,
    Typography,
} from '@mui/material';

// third-party
import {
    Column,
    Row,
} from 'react-table';
// project import
import Layout from 'layout';
import Page from 'components/Page';
import MainCard from 'components/MainCard';
import CustomTable from 'components/custom-table';
import { getTableRowsDataI } from 'types/common';
import IconButton from 'components/@extended/IconButton';

// assets
import { CloseOutlined, PlusOutlined, EyeTwoTone, EditTwoTone, DeleteTwoTone } from '@ant-design/icons';
import { Expense } from 'types/expenses';
import { EssentialMethods } from 'utils/essentialMethods';
import { EssentialComponents } from 'components/essentialComponents';
import { apps } from 'data/apps';
import { useSession } from 'next-auth/react';
import { Product } from 'types/product';
import { deleteProduct, editProduct, listProduct } from 'services/product';
import NumberFormat from 'react-number-format';
import { errorColor } from 'config';
import { useUserProfile } from 'pages/apps/user-provider';
import { ProductC } from 'models/product';
import ScrollX from 'components/ScrollX';
import useListRefresh from 'hooks/useListRefresh';
// ==============================|| REACT TABLE ||============================== //

const ProductList = () => {
    const theme = useTheme();
    const router = useRouter();
    const { refreshKey } = useListRefresh('/apps/e-commerce/product/manage-product');
    const { data: session } = useSession();
    const paginationData = { pageIndex: 0, pageSize: 10 } // Here pageSize means row count.
    const [openDrawer, setOpenDrawer] = useState<boolean>(false);
    const { userData, loading } = useUserProfile();
    const handleDrawerOpen = () => {
        setOpenDrawer((prevState) => !prevState);
    };

    const demo_account = localStorage.getItem('demo_account');
    const demoAccount = demo_account === 'true' ? true : false;

    const addStory = () => {
        setOpenDrawer((prevState) => !prevState);
    };
    const BulkUploadButton =
        <>
            {<EssentialComponents.uploadButton
                acceptType=".csv"
                bulkUploadApi={EssentialMethods.uploadFile}
                template={apps['product']['template']}
            />}

            {<EssentialComponents.downloadSampleExcel template={apps['product']['template']}
            />}
        </>
    const getTableRows = async (tableParams: getTableRowsDataI) => {
        const mergedParams = { ...tableParams, ...userData };
        if (demoAccount) {
            return listProduct(mergedParams, true)
        }
        return listProduct(mergedParams)
    }
    const updateTableRows = (expenseData: Product) => {
        return editProduct(expenseData)
    }
    const AddButton: JSX.Element = <Button variant="contained" startIcon={<PlusOutlined />} href='/apps/e-commerce/product/add-product'>Add Product</Button>

    const handleDelete = async (product_ID: any) => {
        try {
            const productId = product_ID.id;
            const response = await deleteProduct(productId);
            if (response.status === 200) {
                window.location.reload()
            } else {
                EssentialMethods.showSnackbar(response.data.message, errorColor)
            }
        } catch (error) {
            console.error('Error deleting product:', error);
        }
    };
    const columns = useMemo(
        () => [
            {
                Header: 'Actions',
                className: 'cell-center',
                disableSortBy: true,
                dataType: 'action',
                disableFilters: true,
                Cell: ({ row }: { row: Row<Expense> }) => {
                    const collapseIcon = row.isExpanded ? (
                        <CloseOutlined style={{ color: theme.palette.error.main }} />
                    ) : (
                        <EyeTwoTone twoToneColor={theme.palette.secondary.main} />
                    );
                    return (
                        <Stack direction="row" alignItems="center" justifyContent="center" spacing={0}>
                            <Tooltip title="View">
                                <IconButton
                                    color="secondary"
                                    // onClick={addStory}
                                    onClick={(e: MouseEvent<HTMLButtonElement>) => {
                                        // e.stopPropagation();
                                        router.push(`/apps/e-commerce/product/view/${row.original.id}`)
                                    }}
                                >
                                    {collapseIcon}
                                </IconButton>
                            </Tooltip>
                            <Tooltip title="Edit">
                                <IconButton
                                    color="primary"
                                    // onClick={addStory}
                                    onClick={(e: MouseEvent<HTMLButtonElement>) => {
                                        // e.stopPropagation();
                                        router.push(`/apps/e-commerce/product/edit/${row.original.id}`)
                                    }}
                                >
                                    <EditTwoTone twoToneColor={theme.palette.primary.main} />
                                </IconButton>
                            </Tooltip>
                            <Tooltip title="Delete">
                                <IconButton
                                    color="error"
                                    onClick={(e: MouseEvent<HTMLButtonElement>) => {
                                        e.stopPropagation(); // Prevent the row from being selected
                                        handleDelete(row.original); // Pass the product data to handleDelete
                                    }}
                                >
                                    <DeleteTwoTone twoToneColor={theme.palette.error.main} />
                                </IconButton>
                            </Tooltip>
                        </Stack>
                    );
                }
            },
            {
                Header: 'Product Detail',
                accessor: 'name'
            },
            {
                Header: 'Description',
                accessor: 'description'
            },
            {
                Header: 'Categories',
                accessor: 'category'
            },
            {
                Header: 'Price',
                accessor: 'price',
                Cell: ({ value }: { value: number }) => <NumberFormat value={value} displayType="text" thousandSeparator prefix="₹ " />
            },
            {
                Header: 'Qty',
                accessor: 'quantity',
            },
            {
                Header: 'Status',
                accessor: 'availablity',
                Cell: ({ value }: { value: string }) => (
                    <Chip color={value ? 'success' : 'error'} label={value ? 'In Stock' : 'Out of Stock'} size="small" variant="light" />
                )
            },
        ] as Column[],
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [theme]
    );

    return (
        <Page title="Product List">
            <MainCard content={false}>
                {!loading && userData && (
                    <ScrollX>
                        <CustomTable columns={columns} updateTableValues={updateTableRows} editable={false} paginationData={paginationData} columnResize={true} rowSelection={true} getTableRows={getTableRows} addButton={AddButton} filename='products.csv'
                            searchColumns={Object.getOwnPropertyNames(new ProductC)}
                            refreshKey={refreshKey}
                        />
                    </ScrollX>
                )}
            </MainCard>
        </Page>
    );
};

ProductList.getLayout = function getLayout(page: ReactElement) {
    return <Layout>{page}</Layout>;
};

export default ProductList;
