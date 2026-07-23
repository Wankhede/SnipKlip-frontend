import NextLink from 'next/link';
import { useTheme } from '@mui/material/styles';
import { Box, Button, Container, Stack, Typography } from '@mui/material';
import { motion } from 'framer-motion';

import AnimateButton from 'components/@extended/AnimateButton';
import { BRAND } from 'config/branding';

const HeaderPage = () => {
  const theme = useTheme();

  return (
    <Container
      sx={{
        minHeight: { xs: '92vh', md: '100vh' },
        display: 'flex',
        alignItems: 'center',
        position: 'relative',
        zIndex: 6,
        pt: { xs: 12, md: 10 },
        pb: { xs: 8, md: 6 }
      }}
    >
      <Stack
        spacing={3}
        sx={{
          maxWidth: { xs: '100%', md: 560 },
          textAlign: { xs: 'center', md: 'left' },
          alignItems: { xs: 'center', md: 'flex-start' }
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        >
          <Typography
            component="p"
            sx={{
              fontFamily: '"Outfit", "Public Sans", sans-serif',
              fontWeight: 700,
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              fontSize: '0.78rem',
              color: '#63c7bd',
              mb: 1.5
            }}
          >
            {BRAND.COMPANY_NAME}
          </Typography>
          <Typography
            component="h1"
            sx={{
              fontFamily: '"Fraunces", Georgia, serif',
              fontWeight: 600,
              fontSize: { xs: '2.35rem', sm: '3rem', md: '3.55rem' },
              lineHeight: 1.08,
              color: theme.palette.common.white,
              letterSpacing: '-0.02em'
            }}
          >
            Run your salon like it already has a waitlist.
          </Typography>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}
        >
          <Typography
            sx={{
              fontFamily: '"Outfit", "Public Sans", sans-serif',
              fontSize: { xs: '1.05rem', md: '1.15rem' },
              lineHeight: 1.55,
              color: 'rgba(255,255,255,0.78)',
              maxWidth: 460
            }}
          >
            Bookings, billing, and live staff schedules in one calm workspace — so your front desk stays fast and your chairs stay full.
          </Typography>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.22, ease: [0.22, 1, 0.36, 1] }}
        >
          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            spacing={1.5}
            sx={{ width: { xs: '100%', sm: 'auto' }, justifyContent: { xs: 'center', md: 'flex-start' } }}
          >
            <AnimateButton>
              <NextLink href="/register" passHref>
                <Button
                  component="a"
                  variant="contained"
                  size="large"
                  sx={{
                    px: 3.5,
                    py: 1.35,
                    bgcolor: '#63c7bd',
                    color: '#0A1628',
                    fontFamily: '"Outfit", sans-serif',
                    fontWeight: 700,
                    '&:hover': { bgcolor: '#4fb5ab' }
                  }}
                >
                  Start free
                </Button>
              </NextLink>
            </AnimateButton>
            <NextLink href="/login" passHref>
              <Button
                component="a"
                variant="outlined"
                size="large"
                sx={{
                  px: 3.5,
                  py: 1.35,
                  borderColor: 'rgba(255,255,255,0.45)',
                  color: theme.palette.common.white,
                  fontFamily: '"Outfit", sans-serif',
                  fontWeight: 600,
                  '&:hover': { borderColor: '#fff', bgcolor: 'rgba(255,255,255,0.06)' }
                }}
              >
                Sign in
              </Button>
            </NextLink>
          </Stack>
        </motion.div>

        <Box
          component={motion.div}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.45, duration: 0.6 }}
          sx={{
            display: { xs: 'none', md: 'flex' },
            gap: 3,
            pt: 1,
            fontFamily: '"Outfit", sans-serif',
            fontSize: '0.85rem',
            color: 'rgba(255,255,255,0.55)'
          }}
        >
          <Box component="span">30‑min smart slots</Box>
          <Box component="span">·</Box>
          <Box component="span">Live stylist timeline</Box>
          <Box component="span">·</Box>
          <Box component="span">One‑tap billing</Box>
        </Box>
      </Stack>
    </Container>
  );
};

export default HeaderPage;
