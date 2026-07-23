import { useState, useEffect } from 'react';

// material-ui
import { Theme } from '@mui/material/styles';
import { useMediaQuery, Button, ButtonGroup, Grid, Stack, Tooltip, Typography, GridProps } from '@mui/material';

// third-party
import { format } from 'date-fns';

// project import
import IconButton from 'components/@extended/IconButton';

// assets
import { LayoutOutlined, LeftOutlined, PicCenterOutlined, RightOutlined } from '@ant-design/icons';

const toolbarViews = [
  { label: 'Day', value: 'resourceTimeGridDay', icon: PicCenterOutlined },
  { label: 'Week', value: 'resourceTimeGridWeek', icon: LayoutOutlined }
];

// ==============================|| CALENDAR - TOOLBAR ||============================== //

export interface ToolbarProps {
  date: number | Date;
  view: string;
  onClickNext: () => void;
  onClickPrev: () => void;
  onClickToday: () => void;
  onChangeView: (s: string) => void;
  sx?: GridProps['sx'];
}

const Toolbar = ({ date, view, onClickNext, onClickPrev, onClickToday, onChangeView, sx, ...others }: ToolbarProps) => {
  const matchDownSM = useMediaQuery((theme: Theme) => theme.breakpoints.down('sm'));
  const [viewFilter, setViewFilter] = useState(toolbarViews);

  useEffect(() => {
    setViewFilter(matchDownSM ? toolbarViews.filter((item) => item.value === 'resourceTimeGridDay') : toolbarViews);
  }, [matchDownSM]);

  const title =
    view === 'resourceTimeGridDay' ? format(date, 'EEE, d MMM yyyy') : format(date, 'MMMM yyyy');

  return (
    <Grid alignItems="center" container justifyContent="space-between" spacing={matchDownSM ? 1 : 3} {...others} sx={{ pb: 3, ...sx }}>
      <Grid item>
        <Button variant="contained" onClick={onClickToday} size={matchDownSM ? 'small' : 'medium'}>
          Today
        </Button>
      </Grid>
      <Grid item>
        <Stack direction="row" alignItems="center" spacing={matchDownSM ? 1 : 3}>
          <IconButton onClick={onClickPrev} size={matchDownSM ? 'small' : 'large'}>
            <LeftOutlined />
          </IconButton>
          <Typography
            variant={matchDownSM ? 'h5' : 'h3'}
            color="textPrimary"
            sx={{ minWidth: matchDownSM ? 140 : 220, textAlign: 'center' }}
          >
            {title}
          </Typography>
          <IconButton onClick={onClickNext} size={matchDownSM ? 'small' : 'large'}>
            <RightOutlined />
          </IconButton>
        </Stack>
      </Grid>
      <Grid item>
        <ButtonGroup variant="outlined" aria-label="calendar view switcher">
          {viewFilter.map((viewOption) => {
            const Icon = viewOption.icon;
            return (
              <Tooltip title={viewOption.label} key={viewOption.value}>
                <Button
                  disableElevation
                  size={matchDownSM ? 'small' : 'medium'}
                  variant={viewOption.value === view ? 'contained' : 'outlined'}
                  onClick={() => onChangeView(viewOption.value)}
                >
                  <Icon style={{ fontSize: '1.3rem' }} />
                </Button>
              </Tooltip>
            );
          })}
        </ButtonGroup>
      </Grid>
    </Grid>
  );
};

export default Toolbar;
