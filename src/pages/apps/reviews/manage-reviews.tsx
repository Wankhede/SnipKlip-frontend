import { useMemo, ReactElement } from 'react';

// netx
import { useRouter } from 'next/router';

// material-ui
import { useTheme } from '@mui/material/styles';
import { Stack, Tooltip } from '@mui/material';

// third-party
import {
    Column,
    Row,
} from 'react-table';

// project import
import Layout from 'layout';
import Page from 'components/Page';
import MainCard from 'components/MainCard';
import ScrollX from 'components/ScrollX';
import { editReview, listReview } from 'services/reviews';
import CustomTable from 'components/custom-table';
import { getTableRowsDataI } from 'types/common';
import formatDate from 'utils/date-format';
import IconButton from 'components/@extended/IconButton';

// assets
import { CloseOutlined, EyeTwoTone, CheckOutlined } from '@ant-design/icons';
import { FormattedMessage } from 'react-intl';
import { Review } from 'types/reviews';
import { EssentialMethods } from 'utils/essentialMethods';
import { useUserProfile } from '../user-provider';
import { BookingC } from 'models/booking';

// ==============================|| EXPESNE - MANAGE ||============================== //

const ReviewList = () => {
    const theme = useTheme();
    const router = useRouter();
    const paginationData = { pageIndex: 0, pageSize: 10 }
    const { userData, loading } = useUserProfile();
    const demo_account = localStorage.getItem('demo_account');
    const demoAccount = demo_account === 'true' ? true : false;
    const subscription_name = localStorage.getItem('subscription_name');
    const getTableRows = async (tableParams: getTableRowsDataI) => {
        const mergedParams = { ...tableParams, ...userData };
        if (demoAccount) {
            return listReview(mergedParams, true)
        }
        return listReview(mergedParams)
    }
    const updateTableRows = (reviewData: Review) => {
        return editReview(reviewData)
    }
    // const AddButton: JSX.Element = <Button variant="contained" startIcon={<PlusOutlined />} onClick={() => router.push('/apps/reviews/add-review')}>Add Review</Button>


    // // Assuming you're using React Table
    // const TruncateText = ({ text: string }) => {
    //     const [showMore, setShowMore] = useState(false);

    //     const toggleShowMore = () => {
    //         setShowMore(!showMore);
    //     };

    //     const truncatedText = text.split(' ').slice(0, 15).join(' ');
    //     const remainingText = text.split(' ').slice(15).join(' ');

    //     return (
    //         <div>
    //             {showMore ? (
    //                 <>
    //                     {text}
    //                     <button onClick={toggleShowMore}>Read less</button>
    //                 </>
    //             ) : (
    //                 <>
    //                     {truncatedText}
    //                     {text.split(' ').length > 15 && <span>...</span>}
    //                     {text.split(' ').length > 15 && (
    //                         <button onClick={toggleShowMore}>Read more</button>
    //                     )}
    //                 </>
    //             )}
    //         </div>
    //     );
    // };

    const columns = useMemo(
        () => [
            {
                Header: 'Actions',
                className: 'cell-center',
                disableSortBy: true,
                dataType: 'action',
                disableFilters: true,
                Cell: ({ row }: { row: Row<Review> }) => {
                    const collapseIcon = row.isExpanded ? (
                        <CloseOutlined style={{ color: theme.palette.error.main }} />
                    ) : (
                        <EyeTwoTone twoToneColor={theme.palette.secondary.main} />
                    );
                    return (
                        <Stack direction="row" alignItems="center" justifyContent="center" spacing={0}>
                            {subscription_name === 'PREMIUM' && (
                                <Tooltip title="Send for Review">
                                    <IconButton
                                        color="success"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                        }}
                                    >
                                        <CheckOutlined />
                                    </IconButton>
                                </Tooltip>
                            )},
                        </Stack>
                    );

                }
            },
            {
                Header: <FormattedMessage id="customer" />,
                accessor: 'user',
                dataType: 'text'
            },
            {
                Header: <FormattedMessage id="service" />,
                accessor: 'service_name',
                dataType: 'text'
            },
            {
                Header: <FormattedMessage id="Comment" />,
                accessor: 'comment',
                dataType: 'text',
                // Cell: ({ value }) => <TruncateText text={value} />
            },
            {
                Header: <FormattedMessage id="Rating" />,
                accessor: 'rating',
                dataType: 'number',
                Cell: ({ value }) => (
                    <div>
                        {[...Array(value)].map((_, index) => (
                            <span key={index}>⭐</span>
                        ))}
                    </div>
                )
            },
            {
                Header: 'Created On',
                accessor: 'createdAt',
                Cell: ({ value }: { value: string }) => {
                    const formattedDateTime = formatDate(value, 'EEE, dd MMM yyyy HH:mm');
                    return <span>{formattedDateTime}</span>;
                },
                width: EssentialMethods.setColumnWidth("added_on")
            }
        ] as Column[],
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [theme]
    );

    return (
        <Page title="Reviews List">
            <MainCard content={false}>
                {!loading && userData && (
                    <ScrollX>
                        <CustomTable columns={columns} updateTableValues={updateTableRows} editable={false} paginationData={paginationData} columnResize={true} rowSelection={true} getTableRows={getTableRows} filename='expenses.csv'
                            searchColumns={Object.getOwnPropertyNames(new BookingC)}
                        />
                    </ScrollX>
                )}
            </MainCard>
        </Page>
    );
};

ReviewList.getLayout = function getLayout(page: ReactElement) {
    return <Layout>{page}</Layout>;
};

export default ReviewList;
