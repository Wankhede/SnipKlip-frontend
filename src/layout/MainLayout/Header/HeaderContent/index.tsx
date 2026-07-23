// material-ui
import { Theme } from '@mui/material/styles';
import { Box, useMediaQuery } from '@mui/material';

// project import
import Search from './Search';
import Profile from './Profile';
import Customization from './Customization';
import MobileSection from './MobileSection';

import useConfig from 'hooks/useConfig';
import DrawerHeader from 'layout/MainLayout/Drawer/DrawerHeader';

// type
import { LAYOUT_CONST } from 'types/config';
import Message from './Message';
import { useMemo } from 'react';
import Localization from './Localization';
import FullScreen from './FullScreen';

// ==============================|| HEADER - CONTENT ||============================== //

const HeaderContent = () => {
  const { i18n, menuOrientation } = useConfig();

  const downLG = useMediaQuery((theme: Theme) => theme.breakpoints.down('lg'));

  const localization = useMemo(() => <Localization />, [i18n]);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  return (
    <>
      {menuOrientation === LAYOUT_CONST.HORIZONTAL_LAYOUT && !downLG && <DrawerHeader open={true} />}
      {!downLG && <Search />}
      {!downLG && localization}
      {/* {!downLG && megaMenu} */}
      {downLG && <Box sx={{ width: '100%', ml: 1 }} />}
      {!downLG && <FullScreen />}
      {/* <Notification /> */}
      {/* <Message /> */}
      <Customization />
      {!downLG && <Profile />}
      {downLG && <MobileSection />}
    </>
  );
};

export default HeaderContent;