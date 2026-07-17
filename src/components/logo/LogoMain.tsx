// material-ui
import { useTheme } from '@mui/material/styles';
import Image from 'next/image';
import { logoDark, logo } from 'config';
import { BRAND } from 'config/branding';

// ==============================|| LOGO SVG ||============================== //

const LogoMain = ({ reverse, ...others }: { reverse?: boolean }) => {
    const theme = useTheme();
    return (
        <Image src={theme.palette.mode === 'dark' ? logoDark : logo} alt={BRAND.COMPANY_NAME} width="118" height="35" objectFit="none" />
    );
};

export default LogoMain;
