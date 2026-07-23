import { useTheme } from '@mui/material/styles';
import { Box, Container, Grid, Typography } from '@mui/material';
import { motion, useAnimation } from 'framer-motion';
import React, { useEffect, useRef } from 'react';

const HeaderPage = () => {
  const theme = useTheme();
  const [text, setText] = React.useState("Indian Salons");
  const textRef = useRef(null);
  const controls = useAnimation();

  const variants = {
    hidden: { opacity: 0, translateY: 550 },
    visible: { opacity: 1, translateY: 0 }
  };

  const exitVariant = { opacity: 0, translateX: -20 };

  const changeText = async () => {
    const newTexts = [
      "Effortless Appointment Scheduling",
      "Inventory Optimization Made Easy",
      "Streamlined Payroll and Staff Management",
      "Enhanced Client Experience with Automated Reminders",
      "Boost Sales with Marketing Automation"
    ];
    const randomIndex = Math.floor(Math.random() * newTexts.length);
    setText(newTexts[randomIndex]);
  };

  useEffect(() => {
    const animateText = async () => {
      await changeText();
    };

    const intervalId = setInterval(() => {
      animateText();
    }, 5000);

    return () => clearInterval(intervalId);
  }, [controls]);

  return (
    <Container sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center' }}>
      <Grid container alignItems="center" justifyContent="space-between" spacing={2} sx={{ pt: { md: 0, xs: 8 }, pb: { md: 0, xs: 5 } }}>
        <Grid item xs={12} lg={12} md={12}>
          <Grid container spacing={2} sx={{ pr: 0, [theme.breakpoints.down('md')]: { pr: 0, textAlign: 'center' } }}>
            <Grid item xs={6}>
              <motion.div
                initial="hidden"
                animate={variants.visible}
                variants={variants}
                transition={{
                  type: 'spring',
                  stiffness: 150,
                  damping: 30
                }}
                ref={textRef}
              >
                <Typography
                  variant="h1"
                  color="white"
                  sx={{
                    fontSize: { xs: '1.825rem', sm: '2rem', md: '2.5rem' },
                    fontWeight: 700,
                    lineHeight: { xs: 1.3, sm: 1.3, md: 1.3 }
                  }}
                >
                  <span>The Ultimate Salon Management System for </span>
                  <Box component="span" sx={{ color: theme.palette.primary.main }}>
                    {text.split('').map((char, index) => (
                      <motion.span
                        key={index}
                        initial={{ opacity: 0, translateX: -50 }}
                        animate={{ opacity: 1, translateX: 0 }}
                        exit={exitVariant}
                        transition={{ type: 'spring', stiffness: 150, damping: 30, delay: index * 0.1 }}
                      >
                        {char}
                      </motion.span>
                    ))}
                  </Box>
                </Typography>
              </motion.div>
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12} lg={7} md={6} sx={{ display: { xs: 'none', md: 'flex' } }} />
      </Grid>
    </Container>
  );
};

export default HeaderPage;
