import { ReactElement, useEffect, useMemo, useState } from 'react';
import { useSession } from 'next-auth/react';
// material-ui
import {
    Box,
    FormControl,
    Grid,
    MenuItem,
    Pagination,
    Select,
    SelectChangeEvent,
    Slide,
    Stack,
    Theme,
    Typography,
    useMediaQuery,
} from '@mui/material';

import Page from 'components/Page';
import EmptyUserCard from 'components/cards/skeleton/EmptyUserCard';
import Layout from 'layout';

import usePagination from 'hooks/usePagination';
import { GlobalFilter } from 'utils/react-table';

import { listSalon } from 'services/salon';
import makeData from 'data/react-table';
import SalonCard from 'sections/apps/subscription/SalonCard';
import { useUserProfile } from 'pages/apps/user-provider';

// ==============================|| CUSTOMER - CARD ||============================== //

const allColumns = [
    {
        id: 1,
        header: 'Default'
    }
];

const CustomerCardPage = () => {
    const data = useMemo(() => makeData(12), []);
    const matchDownSM = useMediaQuery((theme: Theme) => theme.breakpoints.down('sm'));
    const [sortBy, setSortBy] = useState('Default');
    const [globalFilter, setGlobalFilter] = useState('');
    const [salonCard, setSalonCard] = useState([]);
    const [page, setPage] = useState(1);
    const handleChange = (event: SelectChangeEvent) => {
        setSortBy(event.target.value as string);
    };
    const { userData, loading } = useUserProfile();
    const fetchData = async () => {
        try {
            const response = await listSalon(userData);
            if (response.data.status === 200) {
                const newData = response.data.data.rows.filter((value: any) => {
                    if (globalFilter) {
                        return value.name.toLowerCase().includes(globalFilter.toLowerCase());
                    } else {
                        return true;
                    }
                });
                console.log(newData);
                setSalonCard(newData);
            } else {
            }
        } catch (error) {
            console.error('Error fetching salon data:', error);
        }
    };

    useEffect(() => {
        if (!loading && userData) {
            fetchData();
        }
    }, [loading, userData, globalFilter]);

    const PER_PAGE = 8;

    const count = Math.ceil(salonCard.length / PER_PAGE);
    const _DATA = usePagination(salonCard, PER_PAGE);

    const handleChangePage = (e: any, p: any) => {
        setPage(p);
        _DATA.jump(p);
    };


    return (
        <Page title="Apps List">
            <Box sx={{ position: 'relative', marginBottom: 3 }}>
                <Stack direction="row" alignItems="center">
                    <Stack
                        direction={matchDownSM ? 'column' : 'row'}
                        sx={{ width: '100%' }}
                        spacing={1}
                        justifyContent="space-between"
                        alignItems="center"
                    >
                        <GlobalFilter preGlobalFilteredRows={salonCard} globalFilter={globalFilter} setGlobalFilter={setGlobalFilter} />
                        {/* <Stack direction={matchDownSM ? 'column' : 'row'} alignItems="center" spacing={1}>
                            <FormControl sx={{ m: 1, minWidth: 120 }}>
                                <Select
                                    value={sortBy}
                                    onChange={handleChange}
                                    displayEmpty
                                    inputProps={{ 'aria-label': 'Without label' }}
                                    renderValue={(selected) => {
                                        if (!selected) {
                                            return <Typography variant="subtitle1">Sort By</Typography>;
                                        }

                                        return <Typography variant="subtitle2">Sort by ({sortBy})</Typography>;
                                    }}
                                >
                                    {allColumns.map((column) => {
                                        return (
                                            <MenuItem key={column.id} value={column.header}>
                                                {column.header}
                                            </MenuItem>
                                        );
                                    })}
                                </Select>
                            </FormControl>
                        </Stack> */}
                    </Stack>
                </Stack>
            </Box>
            <Grid container spacing={3}>
                {salonCard.length > 0 ? (
                    _DATA
                        .currentData()
                        .sort(function (a: any, b: any) {
                            if (sortBy === 'Default') return a.name.localeCompare(b.name);
                            return a;
                        })
                        .map((user: any, index: number) => (
                            <Slide key={index} direction="up" in={true} timeout={50}>
                                <Grid item xs={12} sm={6} lg={3}>
                                    <SalonCard apps={user} />
                                </Grid>
                            </Slide>
                        ))
                ) : (
                    <EmptyUserCard title={'You have not registered salons yet.'} />
                )}
            </Grid>
            <Stack spacing={2} sx={{ p: 2.5 }} alignItems="flex-end">
                <Pagination
                    count={count}
                    size="medium"
                    page={page}
                    showFirstButton
                    showLastButton
                    variant="combined"
                    color="primary"
                    onChange={handleChangePage}
                />
            </Stack>
        </Page>
    );
};

CustomerCardPage.getLayout = function getLayout(page: ReactElement) {
    return <Layout>{page}</Layout>;
};

export default CustomerCardPage;
