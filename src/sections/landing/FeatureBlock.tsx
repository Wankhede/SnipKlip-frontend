// material-ui
import { Box, Container, Grid, Typography } from '@mui/material';
import { CalendarOutlined, LineChartOutlined, SmileOutlined } from '@ant-design/icons';

// project import
import { BRAND } from 'config/branding';
import Animation from './Animation';

const pillars = [
  {
    icon: <CalendarOutlined style={{ fontSize: 28 }} />,
    title: 'Booking that breathes',
    copy: 'Fill chairs without the phone ping-pong. Reminders, slots, and stylist load stay in sync.'
  },
  {
    icon: <LineChartOutlined style={{ fontSize: 28 }} />,
    title: 'Numbers you can act on',
    copy: `Reports that speak floor language — busy hours, top services, and cash you can count on.`
  },
  {
    icon: <SmileOutlined style={{ fontSize: 28 }} />,
    title: 'Clients who come back',
    copy: 'From first book to feedback, the experience feels intentional — and loyalty follows.'
  }
];

// ==============================|| LANDING - FEATURE PAGE ||============================== //

const FeatureBlock = () => (
  <Box sx={{ bgcolor: '#fff', py: { xs: 6, md: 10 } }}>
    <Container>
      <Grid container spacing={2} justifyContent="center" sx={{ mb: { xs: 4, md: 6 }, textAlign: 'center' }}>
        <Grid item xs={12} md={7}>
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
            Built for modern salons
          </Typography>
          <Typography
            component="h2"
            sx={{
              fontFamily: '"Fraunces", Georgia, serif',
              fontWeight: 600,
              fontSize: { xs: '2rem', md: '2.6rem' },
              lineHeight: 1.15,
              color: '#0A1628',
              mb: 1.5
            }}
          >
            Why {BRAND.COMPANY_NAME}?
          </Typography>
          <Typography sx={{ fontFamily: '"Outfit", sans-serif', color: 'text.secondary', fontSize: '1.05rem' }}>
            Raise the standard of every visit — without stacking another tool on the counter.
          </Typography>
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        {pillars.map((item) => (
          <Grid item xs={12} md={4} key={item.title}>
            <Animation
              variants={{
                hidden: { opacity: 0, translateY: 40 },
                visible: { opacity: 1, translateY: 0 }
              }}
            >
              <Box
                sx={{
                  height: '100%',
                  p: { xs: 2.5, md: 3 },
                  borderRadius: 2,
                  background: 'linear-gradient(165deg, #f7fbfb 0%, #ffffff 55%, #f0f7f6 100%)',
                  border: '1px solid rgba(13,115,119,0.12)'
                }}
              >
                <Box
                  sx={{
                    width: 52,
                    height: 52,
                    borderRadius: 2,
                    display: 'grid',
                    placeItems: 'center',
                    bgcolor: '#0A1628',
                    color: '#63c7bd',
                    mb: 2
                  }}
                >
                  {item.icon}
                </Box>
                <Typography
                  sx={{
                    fontFamily: '"Fraunces", Georgia, serif',
                    fontWeight: 600,
                    fontSize: '1.35rem',
                    color: '#0A1628',
                    mb: 1
                  }}
                >
                  {item.title}
                </Typography>
                <Typography sx={{ fontFamily: '"Outfit", sans-serif', color: 'text.secondary', lineHeight: 1.6 }}>
                  {item.copy}
                </Typography>
              </Box>
            </Animation>
          </Grid>
        ))}
      </Grid>
    </Container>
  </Box>
);

export default FeatureBlock;
