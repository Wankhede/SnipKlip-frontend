// material-ui
import { useTheme } from '@mui/material/styles';
import { Box, Container, Grid, Typography } from '@mui/material';

// third party
import Marquee from 'react-fast-marquee';
import { BRAND } from 'config/branding';

// project import

// assets
const techCI = 'assets/images/landing/technology/tech-ci.png';
const techReact = 'assets/images/landing/technology/tech-react.png';
const techAngular = 'assets/images/landing/technology/tech-angular.png';
const techBootstrap = 'assets/images/landing/technology/tech-bootstrap.png';
const techDotnet = 'assets/images/landing/technology/tech-dot-net.png';

const techCIDark = 'assets/images/landing/technology/tech-ci-dark.png';
const techReactDark = 'assets/images/landing/technology/tech-react-dark.png';
const techAngularDark = 'assets/images/landing/technology/tech-angular-dark.png';
const techBootstrapDark = 'assets/images/landing/technology/tech-bootstrap-dark.png';
const techDotnetDark = 'assets/images/landing/technology/tech-dot-net-dark.png';

// ================================|| SLIDER - ITEMS ||================================ //

const Item = ({ item }: { item: { text: string; highlight?: boolean } }) => (
    <Typography
        variant="h2"
        sx={{
            cursor: 'pointer',
            fontWeight: 600,
            my: 1,
            mx: 4.5,
            transition: 'all 0.3s ease-in-out',
            opacity: item.highlight ? 0.75 : 0.4,
            '&:hover': { opacity: '1' }
        }}
    >
        {item.text}
    </Typography>
);

// ==============================|| LANDING - PARTNER PAGE ||============================== //

const PartnerBlock = () => {
    const theme = useTheme();

    const partnerimage = [
        {
            image: theme.palette.mode === 'dark' ? techCIDark : techCI,
            name: '',
            link: 'https://codedthemes.com/item/mantis-codeigniter-admin-template/'
        },
        {
            image: theme.palette.mode === 'dark' ? techReactDark : techReact,
            name: 'Palace The Salon',
            link: 'https://mui.com/store/items/mantis-react-admin-dashboard-template/'
        },
        {
            image: theme.palette.mode === 'dark' ? techAngularDark : techAngular,
            name: 'Gagandeep Arora Salon',
            link: 'https://codedthemes.com/item/mantis-angular-admin-template/'
        },
        {
            image: theme.palette.mode === 'dark' ? techBootstrapDark : techBootstrap,
            name: '',
            link: 'https://codedthemes.com/item/mantis-bootstrap-admin-dashboard/'
        },
        {
            image: theme.palette.mode === 'dark' ? techDotnetDark : techDotnet,
            name: '',
            link: 'https://codedthemes.com/item/mantis-dotnet-bootstrap-dashboard-template/'
        }
    ];

    const items = [
        // { text: '150+ Pages' },
        // { text: '6+ Preset Colors' },
        // { text: '50+ Widgets' },
        { text: 'Best User Experience' },
        // { text: 'Live Customizer' },
        // { text: '5+ Apps' },
        { text: 'Most Affordable' },
        { text: 'Easy to use' },
        { text: 'Highly Flexible' },
        { text: 'Always Updated' },
        { text: 'Professional Design' },
        { text: 'Dark Layout' },
        { text: 'Customer Support' }
    ];

    return (
        <Box sx={{ overflowX: 'hidden' }}>
            <Container>
                <Grid
                    container
                    alignItems="center"
                    justifyContent="center"
                    spacing={2}
                    sx={{ mt: { md: 15, xs: 2.5 }, mb: { md: 5, xs: 2.5 } }}
                >
                    <Grid item xs={12}>
                        <Grid container spacing={1} justifyContent="center" sx={{ mb: 4, textAlign: 'center' }}>
                            <Grid item sm={10} md={6}>
                                <Grid container spacing={1} justifyContent="center">
                                    <Grid item xs={12}>
                                        <Typography variant="subtitle1" color="primary">
                                            Work smarter with {BRAND.COMPANY_NAME}
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={12}>
                                        <Typography variant="h2">Happy Customers</Typography>
                                    </Grid>
                                    <Grid item xs={12}>
                                        <Typography variant="body1">
                                            {BRAND.COMPANY_NAME} brings bookings, customers, staff, inventory, billing, and insights
                                            together.
                                            {/* <Link variant="subtitle1" href="https://codedthemes.gitbook.io/mantis/mantis-eco-system" target="_blank">
                        separately
                      </Link> */}
                                        </Typography>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item xs={12}>
                        <Grid container spacing={5} justifyContent="center" sx={{ mb: 4, textAlign: 'center' }}>
                            {partnerimage.map((item, index) => (
                                <Grid item key={index}>
                                    <p>{item.name}</p>
                                </Grid>
                            ))}
                        </Grid>
                    </Grid>
                </Grid>
            </Container>
            <Grid container spacing={4}>
                <Grid item xs={12}>
                    <Marquee pauseOnHover gradient={false}>
                        {items.map((item, index) => (
                            <Item key={index} item={item} />
                        ))}
                    </Marquee>
                </Grid>
                <Grid item xs={12}>
                    <Marquee pauseOnHover direction="right" gradient={false}>
                        {items.map((item, index) => (
                            <Item key={index} item={item} />
                        ))}
                    </Marquee>
                </Grid>
            </Grid>
        </Box>
    );
};

export default PartnerBlock;
