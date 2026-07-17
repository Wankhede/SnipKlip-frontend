// types
import { DefaultConfigProps } from 'types/config';
import { BRAND } from 'config/branding';

// ==============================|| THEME CONSTANT  ||============================== //
export const twitterColor = '#1DA1F2';
export const facebookColor = '#3b5998';
export const linkedInColor = '#0e76a8';

export const APP_DEFAULT_PATH = '/dashboard/default';
export const APP_ADMIN_DEFAULT_PATH = '/apps/subscription/account/subscriptions';
export const HORIZONTAL_MAX_ITEM = 6;
export const DRAWER_WIDTH = 260;

export const backendBaseURLPath = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://127.0.0.1:8000/';
export const frontendBaseURLPath = process.env.NEXT_PUBLIC_FRONTEND_URL || 'http://localhost:8081/';
export const logoDark = BRAND.LOGO_DARK;
export const logo = BRAND.LOGO;
export const timeZone = 'India/Kolkata';

// String consts

export const successColor = 'success';
export const errorColor = 'error';
// ==============================|| THEME CONFIG  ||============================== //

const config: DefaultConfigProps = {
    fontFamily: `'Public Sans', sans-serif`,
    i18n: 'en',
    menuOrientation: 'vertical',
    miniDrawer: false,
    container: true,
    mode: 'light',
    presetColor: 'default',
    themeDirection: 'ltr'
};

export default config;
