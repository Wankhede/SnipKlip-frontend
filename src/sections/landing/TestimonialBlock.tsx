// material-ui
import { Box, Container, Grid, Rating, Typography } from '@mui/material';

// third party
import Slider from 'react-slick';

// project import
import Avatar from 'components/@extended/Avatar';
import MainCard from 'components/MainCard';
import { BRAND } from 'config/branding';

// assets
const imgfeature1 = 'assets/images/logo.png';

// ================================|| TESTIMONIAL - ITEMS ||================================ //

interface Props {
    item: { image: string; title: string; review: string; rating: number; client: string };
}

const Item = ({ item }: Props) => (
    <MainCard sx={{ mx: 2 }} contentSX={{ p: 3 }}>
        <Grid container spacing={1}>
            {/* <Grid item>
        <Avatar src={item.image} alt="feature" />
      </Grid> */}
            <Grid item sm zeroMinWidth>
                <Grid container spacing={1}>
                    <Grid item xs={12}>
                        <Typography variant="h5" sx={{ fontWeight: 600 }}>
                            {item.title}
                        </Typography>
                        <Rating name="read-only" readOnly value={item.rating} size="small" precision={0.5} />
                    </Grid>
                    <Grid item xs={12}>
                        <Typography variant="body1" color="secondary">
                            {item.review}
                        </Typography>
                    </Grid>
                    <Grid item xs={12}>
                        <Typography variant="subtitle2">{item.client}</Typography>
                    </Grid>
                </Grid>
            </Grid>
        </Grid>
    </MainCard>
);

// ==============================|| LANDING - TESTIMONIAL PAGE ||============================== //

const TestimonialBlock = () => {
    const settings = {
        autoplay: true,
        arrows: false,
        dots: false,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1
    };

    const items = [
        {
            image: imgfeature1,
            title: 'Usability',
            review: 'One of the best system we have used till date. Very easy to use with beautiful and clean design.',
            rating: 5,
            client: 'Gangadeep'
        },
        {
            image: imgfeature1,
            title: 'Value for Money',
            review: 'The most affordable product with best of all the features.',
            rating: 5,
            client: 'Apple Salons'
        },
        {
            image: imgfeature1,
            title: 'Customer Support',
            review: `Helpful customer support that listens to feedback and follows through. Thanks ${BRAND.COMPANY_NAME} team.`,
            rating: 5,
            client: 'Jawed Habib'
        },
        {
            image: imgfeature1,
            title: 'Design',
            review: 'Elegant design that catches the eye. We will use it till the end of our salon business',
            rating: 5,
            client: 'The Palace Salons'
        }
        // {
        //   image: imgfeature1,
        //   title: 'Design Quality',
        //   review: 'there is no mistake, great design and organized code, thank you ...',
        //   rating: 4,
        //   client: 'Yang Z.'
        // },
        // {
        //   image: imgfeature1,
        //   title: 'Code Quality',
        //   review:
        //     'Fantastic design and good code quality. Its a great starting point for any new project. They provide plenty of premade components, page views, and authentication options. Definitely the best Ive found for Material UI in Typescript',
        //   rating: 5,
        //   client: 'Felipe F.'
        // },
        // {
        //   image: imgfeature1,
        //   title: 'Code Quality ',
        //   review:
        //     'Great template. Very well written code and good structure. Very customizable and tons of nice components. Good documentation. Team is very responsive too.',
        //   rating: 5,
        //   client: 'Besart M.'
        // },
        // {
        //   image: imgfeature1,
        //   title: 'Code Quality',
        //   review:
        //     'We are just getting started with this new theme, but we liked it enough that we decided to import our application into this codebase rather than the other way around. Impressive number of custom components and original work VS some other themes that seem to just be repackaged versions of Material UI.',
        //   rating: 5,
        //   client: 'Oxbird'
        // }
    ];
    return (
        <Box sx={{ overflowX: 'hidden' }}>
            <Container>
                <Grid
                    container
                    alignItems="center"
                    justifyContent="center"
                    spacing={2}
                    sx={{ mt: { md: 15, xs: 2.5 }, mb: { md: 10, xs: 2.5 } }}
                >
                    <Grid item xs={12}>
                        <Grid container spacing={1} justifyContent="center" sx={{ mb: 4, textAlign: 'center' }}>
                            <Grid item sm={10} md={6}>
                                <Grid container spacing={1} justifyContent="center">
                                    <Grid item xs={12}>
                                        <Typography
                                            sx={{
                                                fontFamily: '"Outfit", sans-serif',
                                                fontWeight: 700,
                                                letterSpacing: '0.12em',
                                                textTransform: 'uppercase',
                                                fontSize: '0.75rem',
                                                color: '#0d7377',
                                                mb: 1
                                            }}
                                        >
                                            Love notes
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={12}>
                                        <Typography
                                            component="h2"
                                            sx={{
                                                fontFamily: '"Fraunces", Georgia, serif',
                                                fontWeight: 600,
                                                fontSize: { xs: '2rem', md: '2.5rem' },
                                                color: '#0A1628'
                                            }}
                                        >
                                            Salons already humming on {BRAND.COMPANY_NAME}
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={12}>
                                        <Typography sx={{ fontFamily: '"Outfit", sans-serif', color: 'text.secondary' }}>
                                            Average 4.9/5 from owners who swapped spreadsheets for a floor that just… flows.
                                        </Typography>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item lg={6} md={8} xs={12} sx={{ '& .slick-list': { overflow: 'visible' } }}>
                        <Slider {...settings}>
                            {items.map((item, index) => (
                                <Item key={index} item={item} />
                            ))}
                        </Slider>
                    </Grid>
                </Grid>
            </Container>
        </Box>
    );
};

export default TestimonialBlock;
