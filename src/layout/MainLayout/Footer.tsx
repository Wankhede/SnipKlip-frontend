// material-ui
import { Link, Stack, Typography } from '@mui/material';
import { BRAND } from 'config/branding';

const Footer = () => (
  <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ p: '24px 16px 0px', mt: 'auto' }}>
    <Typography variant="caption">
      &copy; {new Date().getFullYear()} {BRAND.COMPANY_NAME}. All rights reserved.
    </Typography>
    <Stack spacing={1.5} direction="row" justifyContent="space-between" alignItems="center">
      <Link href="/about-us" target="_blank" variant="caption" color="textPrimary">
        About us
      </Link>
      <Link href="/privacy-policy" target="_blank" variant="caption" color="textPrimary">
        Privacy Policy
      </Link>
      <Link href="/terms-and-conditions" target="_blank" variant="caption" color="textPrimary">
        Terms & Conditions
      </Link>
    </Stack>
  </Stack>
);

export default Footer;
