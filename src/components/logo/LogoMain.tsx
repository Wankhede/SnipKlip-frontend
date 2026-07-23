// material-ui
import { useTheme } from '@mui/material/styles';
import Image from 'next/image';
import { logoDark, logo } from 'config';
import { BRAND } from 'config/branding';

// ==============================|| LOGO SVG ||============================== //

const LogoMain = ({ reverse }: { reverse?: boolean }) => {
  const theme = useTheme();
  // logoDark = white wordmark (for dark surfaces); logo = dark wordmark (for light surfaces)
  const useLightMark = reverse || theme.palette.mode === 'dark';

  return (
    <Image
      src={useLightMark ? logoDark : logo}
      alt={BRAND.COMPANY_NAME}
      width={118}
      height={35}
      objectFit="contain"
    />
  );
};

export default LogoMain;
