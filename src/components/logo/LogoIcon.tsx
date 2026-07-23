// next
import Image from 'next/image';

// material-ui
import { useTheme } from '@mui/material/styles';

import { BRAND } from 'config/branding';

const logoIcon = '/assets/images/logo-icon.svg';
const logoIconDark = '/assets/images/logo-icon-dark.svg';

// ==============================|| LOGO ICON — SNIPKLIP ||============================== //

const LogoIcon = () => {
  const theme = useTheme();

  return (
    <Image
      src={theme.palette.mode === 'dark' ? logoIconDark : logoIcon}
      alt={BRAND.COMPANY_NAME}
      width={35}
      height={35}
    />
  );
};

export default LogoIcon;
