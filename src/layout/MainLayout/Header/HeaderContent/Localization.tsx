import { useRef, useState } from 'react';

// material-ui
import { useTheme } from '@mui/material/styles';
import { Box, ClickAwayListener, Grid, List, ListItemButton, ListItemText, Paper, Popper, Typography, useMediaQuery } from '@mui/material';

// project import
import IconButton from 'components/@extended/IconButton';
import Transitions from 'components/@extended/Transitions';
import useConfig from 'hooks/useConfig';

// assets
import { TranslationOutlined } from '@ant-design/icons';
import { I18n } from 'types/config';

// ==============================|| HEADER CONTENT - LOCALIZATION ||============================== //
interface language {
  code: I18n;
  name: string;
}

const Localization = () => {
  const theme = useTheme();
  const matchesXs = useMediaQuery(theme.breakpoints.down('md'));

  const { i18n, onChangeLocalization } = useConfig();

  const anchorRef = useRef<any>(null);
  const [open, setOpen] = useState(false);
  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  const handleClose = (event: MouseEvent | TouchEvent) => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return;
    }
    setOpen(false);
  };

  const handleListItemClick = (lang: I18n) => {
    onChangeLocalization(lang);
    setOpen(false);
  };

  const iconBackColorOpen = theme.palette.mode === 'dark' ? 'grey.200' : 'grey.300';
  const iconBackColor = theme.palette.mode === 'dark' ? 'background.default' : 'grey.100';
  const IndianLanguages: language[] = [
    { code: 'en', name: 'English' },
    { code: 'hi', name: 'Hindi' },
    { code: 'te', name: 'Telugu' },
    { code: 'ta', name: 'Tamil' },
    { code: 'mr', name: 'Marathi' }
  ];
  return (
    <Box sx={{ flexShrink: 0, ml: 0.75 }}>
      <IconButton
        color="secondary"
        variant="light"
        aria-label="open localization"
        ref={anchorRef}
        aria-controls={open ? 'localization-grow' : undefined}
        aria-haspopup="true"
        onClick={handleToggle}
        sx={{ color: 'text.primary', bgcolor: open ? iconBackColorOpen : iconBackColor }}
      >
        <TranslationOutlined />
      </IconButton>
      <Popper
        placement={matchesXs ? 'bottom-start' : 'bottom'}
        open={open}
        anchorEl={anchorRef.current}
        role={undefined}
        transition
        disablePortal
        popperOptions={{
          modifiers: [
            {
              name: 'offset',
              options: {
                offset: [matchesXs ? 0 : 0, 9]
              }
            }
          ]
        }}
      >
        {({ TransitionProps }) => (
          <Transitions type="grow" position={matchesXs ? 'top-right' : 'top'} in={open} {...TransitionProps}>
            <Paper sx={{ boxShadow: theme.customShadows.z1 }}>
              <ClickAwayListener onClickAway={handleClose}>
                <List
                  component="nav"
                  sx={{
                    p: 0,
                    width: '100%',
                    minWidth: 200,
                    maxWidth: 290,
                    bgcolor: theme.palette.background.paper,
                    borderRadius: 0.5,
                    [theme.breakpoints.down('md')]: {
                      maxWidth: 250
                    }
                  }}
                >
                  {IndianLanguages.map((language) => (
                    <ListItemButton
                      key={language.code}
                      selected={i18n === language.code}
                      onClick={() => handleListItemClick(language.code)}
                    >
                      <ListItemText
                        primary={
                          <Grid container>
                            <Typography color="textPrimary">{language.name}</Typography>
                            <Typography variant="caption" color="textSecondary" sx={{ ml: '8px' }}>
                              India
                            </Typography>
                          </Grid>
                        }
                      />
                    </ListItemButton>
                  ))}
                </List>
              </ClickAwayListener>
            </Paper>
          </Transitions>
        )}
      </Popper>
    </Box>
  );
};

export default Localization;
