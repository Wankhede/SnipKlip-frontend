import { useEffect, useRef, useState } from 'react';

// material-ui
import { useTheme } from '@mui/material/styles';
import { Box, CardMedia } from '@mui/material';

import { PresetColor } from 'types/config';
import TawkMessengerReact from '@tawk.to/tawk-messenger-react';
import HeaderPage from 'sections/landing/Header';
import FeatureBlock from './FeatureBlock';
import DemoBlock from './DemoBlock';
import TestimonialBlock from './TestimonialBlock';

interface ColorProps {
  id: PresetColor;
  primary: string;
}

// ==============================|| LANDING PAGE ||============================== //

const Landing = () => {
  const tawkMessengerRef = useRef();
  const theme = useTheme();
  // const { mode, presetColor, onChangePresetColor } = useConfig();

  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const listenToScroll = () => {
      let heightToHideFrom = 250;
      const winScroll = document.body.scrollTop || document.documentElement.scrollTop;

      if (winScroll > heightToHideFrom) {
        setVisible(true);
      } else {
        visible && setVisible(false);
      }
    };

    window.addEventListener('scroll', listenToScroll);
    return () => window.removeEventListener('scroll', listenToScroll);
  }, [visible]);

  // const colors: PalettesProps = mode === 'dark' ? presetDarkPalettes : presetPalettes;
  // const { blue } = colors;
  // const colorOptions: ColorProps[] = [
  //   {
  //     id: 'theme1',
  //     primary: mode === 'dark' ? '#305bdd' : '#3366FF'
  //   },
  //   {
  //     id: 'theme2',
  //     primary: mode === 'dark' ? '#655ac8' : '#7265E6'
  //   },
  //   {
  //     id: 'theme3',
  //     primary: mode === 'dark' ? '#0a7d3e' : '#068e44'
  //   },
  //   {
  //     id: 'theme4',
  //     primary: mode === 'dark' ? '#5d7dcb' : '#3c64d0'
  //   },
  //   {
  //     id: 'default',
  //     primary: blue[5]
  //   },
  //   {
  //     id: 'theme5',
  //     primary: mode === 'dark' ? '#d26415' : '#f27013'
  //   },
  //   {
  //     id: 'theme6',
  //     primary: mode === 'dark' ? '#288d99' : '#2aa1af'
  //   },
  //   {
  //     id: 'theme7',
  //     primary: mode === 'dark' ? '#05934c' : '#00a854'
  //   },
  //   {
  //     id: 'theme8',
  //     primary: mode === 'dark' ? '#058478' : '#009688'
  //   }
  // ];

  // const handlePresetColorChange = (event: ChangeEvent<HTMLInputElement>) => {
  //   onChangePresetColor(event.target.value as PresetColor);
  // };

  return (
    <>
      <TawkMessengerReact
        propertyId="645a7e9d6a9aad4bc579c9e5"
        widgetId="1h00nt6nd"
        ref={tawkMessengerRef} />
      <Box
        sx={{
          position: 'relative',
          bgcolor: theme.palette.mode === 'dark' ? 'grey.0' : 'grey.800',
          overflow: 'hidden',
          minHeight: '100vh',
          '&>*': {
            position: 'relative',
            zIndex: 5
          },
          '&:before': {
            content: '""',
            position: 'absolute',
            width: '100%',
            height: '100%',
            top: 0,
            left: 0,
            zIndex: 2,
            background: 'linear-gradient(329.36deg, rgb(0, 0, 0) 14.79%, rgba(67, 67, 67, 0.28) 64.86%)'
          }
        }}
      >
        <CardMedia
          component="img"
          image={`/assets/images/landing/bg-mockup-default.png`}
          sx={{
            position: 'absolute',
            width: { md: '78%', lg: '70%', xl: '65%' },
            right: { md: '-14%', lg: '-4%', xl: '-2%' },
            top: { md: '16%', lg: '12%', xl: '8%' },
            zIndex: 1,
            display: { xs: 'none', md: 'block' }
          }}
        />
        <HeaderPage />
      </Box>
      <FeatureBlock />
      <DemoBlock />
      {/* <NumberBlock /> */}
      {/* <CallToAction /> */}
      {/* <BrowserBlock /> */}
      {/* <ElementBlock /> */}
      {/* <PartnerBlock /> */}
      <TestimonialBlock />
    </>
  );
};

export default Landing;
