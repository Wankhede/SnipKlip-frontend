// next
import Image from 'next/image';
import NextLink from 'next/link';

// material-ui
import { useTheme } from '@mui/material/styles';
import { Box, Button, Container, Grid, Stack, Typography } from '@mui/material';
import { motion } from 'framer-motion';

// project import
import Animation from './Animation';
import { BRAND } from 'config/branding';

const imgCalendar = '/assets/images/landing/feature-calendar-bookings.jpg';
const imgBilling = '/assets/images/landing/feature-billing-customer.jpg';
const imgAnalytics = '/assets/images/landing/feature-analytics-reports.jpg';

const features = [
  {
    title: 'Calendar & Bookings',
    copy: 'Staff timelines, 30‑minute slots, and drag‑friendly appointments that keep the chair board honest.',
    image: imgCalendar,
    href: '/register',
    accent: false
  },
  {
    title: 'Billing & Customer',
    copy: 'Invoices, profiles, and visit history in one glance — so checkout feels as polished as the cut.',
    image: imgBilling,
    href: '/register',
    accent: true
  },
  {
    title: 'Analytics & Reports',
    copy: 'See what fills the books, what stalls revenue, and where to nudge the team next week.',
    image: imgAnalytics,
    href: '/register',
    accent: false
  }
];

// ==============================|| LANDING - DEMO PAGE ||============================== //

const DemoBlock = () => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        py: { xs: 6, md: 12 },
        background:
          theme.palette.mode === 'dark'
            ? theme.palette.background.default
            : 'linear-gradient(180deg, #f4f7f8 0%, #ffffff 42%, #eef6f5 100%)'
      }}
    >
      <Container>
        <Grid container spacing={2} justifyContent="center" sx={{ mb: { xs: 4, md: 6 }, textAlign: 'center' }}>
          <Grid item xs={12} md={8}>
            <Typography
              sx={{
                fontFamily: '"Outfit", sans-serif',
                fontWeight: 700,
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                fontSize: '0.75rem',
                color: '#0d7377',
                mb: 1.5
              }}
            >
              {BRAND.COMPANY_NAME} in action
            </Typography>
            <Typography
              component="h2"
              sx={{
                fontFamily: '"Fraunces", Georgia, serif',
                fontWeight: 600,
                fontSize: { xs: '2rem', md: '2.75rem' },
                lineHeight: 1.15,
                color: '#0A1628',
                mb: 1.5
              }}
            >
              Everything your front desk touches — in one beat.
            </Typography>
            <Typography
              sx={{
                fontFamily: '"Outfit", sans-serif',
                fontSize: '1.05rem',
                color: 'text.secondary',
                maxWidth: 560,
                mx: 'auto'
              }}
            >
              From the first booking ping to the final receipt, {BRAND.COMPANY_NAME} keeps the rhythm of the floor without the spreadsheet scramble.
            </Typography>
          </Grid>
        </Grid>

        <Grid container spacing={3}>
          {features.map((feature, index) => (
            <Grid item xs={12} md={4} key={feature.title}>
              <Animation
                variants={{
                  visible: { opacity: 1, y: 0 },
                  hidden: { opacity: 0, y: 40 }
                }}
              >
                <Box
                  component={motion.div}
                  whileHover={{ y: -6 }}
                  transition={{ type: 'spring', stiffness: 260, damping: 22 }}
                  sx={{
                    height: '100%',
                    borderRadius: 3,
                    overflow: 'hidden',
                    bgcolor: feature.accent ? '#0A1628' : '#fff',
                    color: feature.accent ? '#fff' : 'inherit',
                    border: '1px solid',
                    borderColor: feature.accent ? 'transparent' : 'rgba(10,22,40,0.08)',
                    boxShadow: feature.accent
                      ? '0 24px 48px rgba(10,22,40,0.22)'
                      : '0 12px 32px rgba(10,22,40,0.06)',
                    display: 'flex',
                    flexDirection: 'column'
                  }}
                >
                  <Box sx={{ p: 3, pb: 2 }}>
                    <Typography
                      sx={{
                        fontFamily: '"Fraunces", Georgia, serif',
                        fontWeight: 600,
                        fontSize: '1.55rem',
                        mb: 1,
                        color: feature.accent ? '#fff' : '#0A1628'
                      }}
                    >
                      {feature.title}
                    </Typography>
                    <Typography
                      sx={{
                        fontFamily: '"Outfit", sans-serif',
                        fontSize: '0.95rem',
                        lineHeight: 1.55,
                        color: feature.accent ? 'rgba(255,255,255,0.72)' : 'text.secondary',
                        mb: 2
                      }}
                    >
                      {feature.copy}
                    </Typography>
                    <NextLink href={feature.href} passHref>
                      <Button
                        component="a"
                        size="small"
                        sx={{
                          fontFamily: '"Outfit", sans-serif',
                          fontWeight: 700,
                          color: feature.accent ? '#63c7bd' : '#0d7377',
                          px: 0,
                          '&:hover': { bgcolor: 'transparent', textDecoration: 'underline' }
                        }}
                      >
                        Try it →
                      </Button>
                    </NextLink>
                  </Box>
                  <Box
                    sx={{
                      position: 'relative',
                      mt: 'auto',
                      mx: 2,
                      mb: 2,
                      borderRadius: 2,
                      overflow: 'hidden',
                      border: '1px solid',
                      borderColor: feature.accent ? 'rgba(99,199,189,0.25)' : 'rgba(10,22,40,0.06)'
                    }}
                  >
                    <Image
                      src={feature.image}
                      alt={feature.title}
                      layout="responsive"
                      width={720}
                      height={720}
                      priority={index === 0}
                    />
                  </Box>
                </Box>
              </Animation>
            </Grid>
          ))}
        </Grid>

        <Stack alignItems="center" sx={{ mt: { xs: 5, md: 7 } }}>
          <NextLink href="/register" passHref>
            <Button
              component="a"
              variant="contained"
              size="large"
              sx={{
                px: 4,
                py: 1.4,
                bgcolor: '#0d7377',
                fontFamily: '"Outfit", sans-serif',
                fontWeight: 700,
                '&:hover': { bgcolor: '#0a5f62' }
              }}
            >
              Open your salon workspace
            </Button>
          </NextLink>
        </Stack>
      </Container>
    </Box>
  );
};

export default DemoBlock;
