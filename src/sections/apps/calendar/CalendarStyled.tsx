// material-ui
import { styled } from '@mui/material/styles';

// ==============================|| CALENDAR - STYLED ||============================== //

const ExperimentalStyled = styled('div')(({ theme }) => ({
  width: '100%',
  borderRadius: 16,
  overflow: 'hidden',
  border: `1px solid ${theme.palette.divider}`,
  background:
    theme.palette.mode === 'dark'
      ? theme.palette.background.paper
      : `linear-gradient(180deg, ${theme.palette.grey[50]} 0%, ${theme.palette.background.paper} 48%)`,
  boxShadow: theme.palette.mode === 'dark' ? 'none' : '0 10px 30px rgba(15, 23, 42, 0.06)',
  padding: theme.spacing(1.5),

  '& .fc-license-message': {
    display: 'none'
  },
  '& .fc .fc-daygrid .fc-scroller-liquid-absolute': {
    overflow: 'hidden !important'
  },

  '& .fc': {
    '--fc-bg-event-opacity': 1,
    '--fc-border-color': theme.palette.divider,
    '--fc-daygrid-event-dot-width': '10px',
    '--fc-today-bg-color': theme.palette.primary.lighter || 'rgba(0, 0, 128, 0.08)',
    '--fc-list-event-dot-width': '10px',
    '--fc-event-border-color': 'transparent',
    '--fc-now-indicator-color': theme.palette.error.main,
    '--fc-page-bg-color': 'transparent',
    color: theme.palette.text.primary,
    backgroundColor: 'transparent',
    fontFamily: theme.typography.fontFamily
  },

  '& .fc .fc-scrollgrid': {
    borderRadius: 12,
    overflow: 'hidden',
    borderColor: theme.palette.divider
  },

  '& .fc .fc-col-header-cell': {
    backgroundColor: theme.palette.mode === 'dark' ? theme.palette.grey[800] : '#EEF2FF',
    border: 'none'
  },

  '& .fc .fc-col-header-cell-cushion': {
    color: theme.palette.text.primary,
    padding: '14px 10px',
    fontWeight: 600,
    fontSize: '0.85rem'
  },

  '& .fc .fc-resource-timeline-divider, & .fc .fc-datagrid-cell-frame': {
    backgroundColor: theme.palette.background.paper
  },

  '& .fc .fc-timegrid-slot': {
    height: '2.4em'
  },

  '& .fc .fc-timegrid-slot-label-cushion': {
    fontSize: '0.75rem',
    color: theme.palette.text.secondary
  },

  '& .fc .fc-timegrid-now-indicator-line': {
    borderWidth: 2
  },

  '& .fc .fc-timegrid-now-indicator-arrow': {
    borderTopColor: theme.palette.error.main,
    borderBottomColor: theme.palette.error.main
  },

  '& .fc-direction-ltr .fc-daygrid-event.fc-event-end, .fc-direction-rtl .fc-daygrid-event.fc-event-start': {
    marginLeft: 4,
    marginBottom: 6,
    borderRadius: 8,
    border: 'none'
  },

  '& .fc-timegrid-event': {
    borderRadius: 10,
    border: 'none',
    boxShadow: '0 4px 14px rgba(15, 23, 42, 0.12)'
  },

  '& .fc-timegrid-event .fc-event-main': {
    padding: '4px 8px'
  },

  '& .fc-h-event .fc-event-main': {
    padding: 4,
    paddingLeft: 8
  },

  '& .fc .fc-more-popover': {
    border: 'none',
    borderRadius: 10,
    zIndex: 1200,
    boxShadow: theme.shadows[8]
  },

  '& .fc .fc-more-popover .fc-popover-body': {
    backgroundColor: theme.palette.background.paper,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10
  },

  '& .fc .fc-popover-header': {
    padding: 12,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    backgroundColor: theme.palette.grey[100],
    color: theme.palette.text.primary
  },

  '& .fc-theme-standard .fc-list-day-cushion': {
    backgroundColor: theme.palette.grey[100]
  },

  '& .fc .fc-day': {
    cursor: 'pointer'
  },

  '& .fc .fc-highlight': {
    backgroundColor: 'rgba(0, 0, 128, 0.08)'
  },

  '& .fc .fc-resource': {
    fontWeight: 600
  }
}));

export default ExperimentalStyled;
