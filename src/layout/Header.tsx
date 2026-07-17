import * as React from 'react';
import { useState } from 'react';

// next
import NextLink from 'next/link';
import { signIn, useSession } from 'next-auth/react';

// material-ui
import AppBar from '@mui/material/AppBar';
import { useTheme } from '@mui/material/styles';
import {
    useMediaQuery,
    Box,
    Button,
    Chip,
    Container,
    Drawer,
    Link,
    List,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Stack,
    Toolbar,
    Typography,
    useScrollTrigger
} from '@mui/material';

// project import
import { APP_DEFAULT_PATH } from 'config';
import { BRAND } from 'config/branding';
import IconButton from 'components/@extended/IconButton';

import AnimateButton from 'components/@extended/AnimateButton';
import Logo from 'components/logo';

// assets
import { MenuOutlined, LineOutlined } from '@ant-design/icons';
import router from 'next/router';

// ==============================|| COMPONENTS - APP BAR ||============================== //

// elevation scroll
function ElevationScroll({ layout, children, window }: any) {
    const theme = useTheme();

    const trigger = useScrollTrigger({
        disableHysteresis: true,
        threshold: 10,
        target: window ? window() : undefined
    });

    const backColorScroll = theme.palette.mode === 'dark' ? theme.palette.grey[50] : theme.palette.grey[800];
    const backColor = layout !== 'landing' ? backColorScroll : 'transparent';

    return React.cloneElement(children, {
        style: {
            backgroundColor: trigger ? backColorScroll : backColor
        }
    });
}

interface Props {
    handleDrawerOpen?: () => void;
    layout?: string;
    csrfToken: any;
}

const Header = ({ handleDrawerOpen, layout, csrfToken, ...others }: Props) => {
    const theme = useTheme();
    const { data: session } = useSession();

    const matchDownMd = useMediaQuery(theme.breakpoints.down('md'));
    const [drawerToggle, setDrawerToggle] = useState<boolean>(false);

    /** Method called on multiple components with different event types */
    const drawerToggler = (open: boolean) => (event: any) => {
        if (event.type! === 'keydown' && (event.key! === 'Tab' || event.key! === 'Shift')) {
            return;
        }
        setDrawerToggle(open);
    };

    return (
        <ElevationScroll layout={layout} {...others}>
            <AppBar sx={{ bgcolor: 'transparent', color: theme.palette.text.primary, boxShadow: 'none' }}>
                <Container disableGutters={matchDownMd}>
                    <Toolbar sx={{ px: { xs: 1.5, md: 0, lg: 0 }, py: 2 }}>
                        <Stack direction="row" sx={{ flexGrow: 1, display: { xs: 'none', md: 'block' } }} alignItems="center">
                            <Typography component="div" sx={{ textAlign: 'left', display: 'inline-block' }}>
                                {/* <Logo reverse to="/" /> */}
                                <Typography variant="h5" sx={{ fontWeight: 400, color: theme.palette.common.white }}>
                                    {BRAND.COMPANY_NAME}
                                </Typography>
                                {/* TODO : Santosh  */}
                            </Typography>
                        </Stack>
                        <Stack
                            direction="row"
                            sx={{
                                '& .header-link': { px: 1, '&:hover': { color: theme.palette.primary.main } },
                                display: { xs: 'none', md: 'block' }
                            }}
                            spacing={2}
                        >
                            {session ? (
                                <NextLink href={APP_DEFAULT_PATH} passHref>
                                    <Link className="header-link" color="white" target="_self" underline="none">
                                        Dashboard
                                    </Link>
                                </NextLink>
                            ) : (
                                <NextLink href="/login" passHref>
                                    <Link className="header-link" color="white" target="_self" underline="none">
                                        Login
                                    </Link>
                                </NextLink>
                            )}
                            <NextLink href={BRAND.BLOG_URL} passHref>
                                <Link
                                    className="header-link"
                                    color={handleDrawerOpen ? 'primary' : 'white'}
                                    underline="none"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    Blogs
                                </Link>
                            </NextLink>
                            <Link className="header-link" color="white" href="/contact-us" target="_blank" underline="none">
                                Contact Us
                            </Link>
                            <Box sx={{ display: 'inline-block' }}>
                                <AnimateButton>
                                    <Button component={Link} href="/register" disableElevation color="primary" variant="contained">
                                        Register a Salon
                                    </Button>
                                </AnimateButton>
                            </Box>
                            {/* <Box sx={{ display: 'inline-block' }}>
                <AnimateButton>
                  <Button
                    component={Link}
                    disableElevation
                    color="secondary"
                    variant="contained"
                    href="/login-as-guest"
                  >
                    Login As Guest
                  </Button>
                </AnimateButton>
              </Box> */}
                        </Stack>
                        <Box
                            sx={{
                                width: '100%',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                display: { xs: 'flex', md: 'none' }
                            }}
                        >
                            <Typography component="div" sx={{ textAlign: 'left', display: 'inline-block' }}>
                                {/* <Logo reverse to="/" /> */}
                                <Typography variant="h5" sx={{ fontWeight: 400, color: theme.palette.common.white }}>
                                    {BRAND.COMPANY_NAME}
                                </Typography>
                            </Typography>
                            <Stack direction="row" spacing={2}>
                                {layout === 'component' && (
                                    <NextLink href={APP_DEFAULT_PATH} passHref>
                                        <Button variant="outlined" size="small" color="warning" sx={{ mt: 0.5, height: 28 }}>
                                            Dashboard
                                        </Button>
                                    </NextLink>
                                )}
                                {layout !== 'component' && (
                                    <NextLink href="/login" passHref>
                                        <Button variant="outlined" size="small" color="warning" sx={{ mt: 0.5, height: 28 }}>
                                            Login
                                        </Button>
                                    </NextLink>
                                )}

                                <IconButton
                                    color="secondary"
                                    {...(layout === 'component' ? { onClick: handleDrawerOpen } : { onClick: drawerToggler(true) })}
                                    sx={{ '&:hover': { bgcolor: theme.palette.mode === 'dark' ? 'secondary.lighter' : 'secondary.dark' } }}
                                >
                                    <MenuOutlined style={{ color: theme.palette.mode === 'dark' ? 'inherit' : theme.palette.grey[100] }} />
                                </IconButton>
                            </Stack>
                            <Drawer
                                anchor="top"
                                open={drawerToggle}
                                onClose={drawerToggler(false)}
                                sx={{ '& .MuiDrawer-paper': { backgroundImage: 'none' } }}
                            >
                                <Box
                                    sx={{
                                        width: 'auto',
                                        '& .MuiListItemIcon-root': {
                                            fontSize: '1rem',
                                            minWidth: 28
                                        }
                                    }}
                                    role="presentation"
                                    onClick={drawerToggler(false)}
                                    onKeyDown={drawerToggler(false)}
                                >
                                    <List>
                                        {session && (
                                            <Link style={{ textDecoration: 'none' }} href="/login" target="_blank">
                                                <ListItemButton component="span">
                                                    <ListItemIcon>
                                                        <LineOutlined />
                                                    </ListItemIcon>
                                                    <ListItemText
                                                        primary="Dashboard"
                                                        primaryTypographyProps={{ variant: 'h6', color: 'text.primary' }}
                                                    />
                                                </ListItemButton>
                                            </Link>
                                        )}
                                        <Link style={{ textDecoration: 'none' }} href="/register" target="_blank">
                                            <ListItemButton component="span">
                                                <ListItemIcon>
                                                    <LineOutlined />
                                                </ListItemIcon>
                                                <ListItemText
                                                    primary="Register"
                                                    primaryTypographyProps={{ variant: 'h6', color: 'text.primary' }}
                                                />
                                            </ListItemButton>
                                        </Link>
                                        <Link style={{ textDecoration: 'none' }} href="/contact-us" target="_blank">
                                            <ListItemButton component="span">
                                                <ListItemIcon>
                                                    <LineOutlined />
                                                </ListItemIcon>
                                                <ListItemText
                                                    primary="Contact Us"
                                                    primaryTypographyProps={{ variant: 'h6', color: 'text.primary' }}
                                                />
                                            </ListItemButton>
                                        </Link>
                                    </List>
                                </Box>
                            </Drawer>
                        </Box>
                    </Toolbar>
                </Container>
            </AppBar>
        </ElevationScroll>
    );
};

Header.defaultProps = {
    layout: 'landing'
};

export default Header;
