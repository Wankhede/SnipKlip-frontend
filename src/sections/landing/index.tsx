import { useEffect, useRef, useState } from 'react';

// material-ui
import { Box } from '@mui/material';

import TawkMessengerReact from '@tawk.to/tawk-messenger-react';
import HeaderPage from 'sections/landing/Header';
import FeatureBlock from './FeatureBlock';
import DemoBlock from './DemoBlock';
import TestimonialBlock from './TestimonialBlock';

// ==============================|| LANDING PAGE ||============================== //

const Landing = () => {
  const tawkMessengerRef = useRef();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const listenToScroll = () => {
      const heightToHideFrom = 250;
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

  return (
    <>
      <TawkMessengerReact propertyId="645a7e9d6a9aad4bc579c9e5" widgetId="1h00nt6nd" ref={tawkMessengerRef} />
      <Box
        sx={{
          position: 'relative',
          overflow: 'hidden',
          minHeight: '100vh',
          bgcolor: '#071018',
          '&>*': {
            position: 'relative',
            zIndex: 5
          },
          '&:before': {
            content: '""',
            position: 'absolute',
            inset: 0,
            zIndex: 2,
            background:
              'linear-gradient(105deg, rgba(7,16,24,0.92) 0%, rgba(7,16,24,0.78) 38%, rgba(7,16,24,0.35) 62%, rgba(7,16,24,0.55) 100%)'
          },
          '&:after': {
            content: '""',
            position: 'absolute',
            inset: 0,
            zIndex: 1,
            backgroundImage: 'url(/assets/images/landing/hero-snipklip.jpg)',
            backgroundSize: 'cover',
            backgroundPosition: { xs: '72% center', md: 'center' },
            backgroundRepeat: 'no-repeat',
            transform: 'scale(1.02)',
            animation: 'snipHeroDrift 18s ease-in-out infinite alternate'
          },
          '@keyframes snipHeroDrift': {
            from: { transform: 'scale(1.02) translate3d(0,0,0)' },
            to: { transform: 'scale(1.06) translate3d(-1.5%, 0.5%, 0)' }
          }
        }}
      >
        <HeaderPage />
      </Box>
      <FeatureBlock />
      <DemoBlock />
      <TestimonialBlock />
    </>
  );
};

export default Landing;
