import { useCallback, useEffect, useRef, useState } from 'react';

// material-ui
import { Theme } from '@mui/material/styles';
import { useMediaQuery, Box, Dialog, SpeedDial, Tooltip, Stack, Chip, Typography } from '@mui/material';

// third-party — import core before plugins (FullCalendar v6 requirement)
import { DateSelectArg, EventClickArg, EventDropArg } from '@fullcalendar/core';
import FullCalendar from '@fullcalendar/react';
import interactionPlugin, { EventResizeDoneArg } from '@fullcalendar/interaction';
import resourceTimeGridPlugin from '@fullcalendar/resource-timegrid';

// project import
import Page from 'components/Page';
import { PopupTransition } from 'components/@extended/Transitions';
import CalendarStyled from 'sections/apps/calendar/CalendarStyled';
import Toolbar from 'sections/apps/calendar/Toolbar';
import AddEventForm from 'sections/apps/calendar/AddEventForm';

import { dispatch, useSelector } from 'store';
import { getEvents, selectEvent, selectRange, updateCalendarView, updateEvent } from 'store/reducers/calendar';

import { PlusOutlined, TeamOutlined, CalendarOutlined } from '@ant-design/icons';
import { listEmployee } from 'services/employees';
import { useSession } from 'next-auth/react';
import { useUserProfile } from './user-provider';
import { useRouter } from 'next/router';
import { getApiListData } from 'utils/api-list';

const EVENT_PALETTE = ['#0B6E4F', '#1B4F72', '#9A3412', '#6D28D9', '#0E7490', '#B45309'];

function staffDisplayName(item: any) {
  return (
    item?.name ||
    item?.user_name ||
    [item?.first_name, item?.last_name].filter(Boolean).join(' ').trim() ||
    item?.customer_name ||
    item?.username ||
    `Staff ${item?.id ?? ''}`
  );
}

// ==============================|| CALENDAR - MAIN ||============================== //

const Calendar = () => {
  const matchDownSM = useMediaQuery((theme: Theme) => theme.breakpoints.down('sm'));
  const [date, setDate] = useState(new Date());
  const { calendarView, events, isModalOpen, selectedRange } = useSelector((state) => state.calendar);
  const selectedEvent = useSelector((state) => {
    const { events, selectedEventId } = state.calendar;
    if (selectedEventId) {
      return events.find((event: any) => event.id === selectedEventId);
    }
    return null;
  });
  const [resources, setResources] = useState<any[]>([]);
  const calendarRef = useRef<FullCalendar>(null);
  const { data: session } = useSession();
  const { userData, loading } = useUserProfile();
  const router = useRouter();

  const loadStaffResources = useCallback(async () => {
    if (!userData?.branch_id) return;
    try {
      const response = await listEmployee({ ...userData, status: 'Active' });
      const list = getApiListData(response);
      const metadata = (list?.rows || []).map((item: any, index: number) => ({
        id: String(item.id),
        title: staffDisplayName(item),
        eventColor: EVENT_PALETTE[index % EVENT_PALETTE.length]
      }));
      setResources(metadata);
      const api = calendarRef.current?.getApi();
      api?.setOption('resources', metadata);
    } catch (error) {
      console.error('Failed to load calendar staff resources', error);
      setResources([]);
    }
  }, [userData]);

  const loadEvents = useCallback(() => {
    if (!userData || !session) return;
    dispatch(getEvents(userData));
  }, [userData, session]);

  useEffect(() => {
    if (!loading && userData) {
      loadStaffResources();
      loadEvents();
    }
  }, [loading, userData, session, loadStaffResources, loadEvents]);

  useEffect(() => {
    const onFocus = () => loadEvents();
    window.addEventListener('focus', onFocus);
    return () => window.removeEventListener('focus', onFocus);
  }, [loadEvents]);

  useEffect(() => {
    const preferred = matchDownSM ? 'resourceTimeGridDay' : calendarView || 'resourceTimeGridWeek';
    const api = calendarRef.current?.getApi();
    if (api && preferred !== calendarView) {
      api.changeView(preferred);
      dispatch(updateCalendarView(preferred));
    }
  }, [matchDownSM]);

  const handleDateToday = () => {
    const calendarApi = calendarRef.current?.getApi();
    if (!calendarApi) return;
    calendarApi.today();
    setDate(calendarApi.getDate());
  };

  const handleViewChange = (newView: string) => {
    const calendarApi = calendarRef.current?.getApi();
    if (!calendarApi) return;
    calendarApi.changeView(newView);
    dispatch(updateCalendarView(newView));
    setDate(calendarApi.getDate());
  };

  const handleDatePrev = () => {
    const calendarApi = calendarRef.current?.getApi();
    if (!calendarApi) return;
    calendarApi.prev();
    setDate(calendarApi.getDate());
  };

  const handleDateNext = () => {
    const calendarApi = calendarRef.current?.getApi();
    if (!calendarApi) return;
    calendarApi.next();
    setDate(calendarApi.getDate());
  };

  const handleRangeSelect = (arg: DateSelectArg) => {
    calendarRef.current?.getApi()?.unselect();
    dispatch(selectRange(arg.start, arg.end));
    router.push('/apps/bookings/add-bookings');
  };

  const handleEventSelect = (arg: EventClickArg) => {
    dispatch(selectEvent(arg.event.id));
  };

  const handleEventUpdate = async ({ event }: EventResizeDoneArg | EventDropArg) => {
    try {
      dispatch(
        updateEvent(event.id, {
          allDay: event.allDay,
          start: event.start,
          end: event.end
        })
      );
    } catch (error) {
      console.error(error);
    }
  };

  const handleModal = () => {
    router.push('/apps/bookings/add-bookings');
  };

  const coloredEvents = (events || []).map((event: any, index: number) => ({
    ...event,
    backgroundColor: event.backgroundColor || EVENT_PALETTE[index % EVENT_PALETTE.length],
    borderColor: event.borderColor || event.backgroundColor || EVENT_PALETTE[index % EVENT_PALETTE.length]
  }));

  return (
    <Page title="Calendar">
      <Box sx={{ position: 'relative' }}>
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          spacing={1.5}
          alignItems={{ xs: 'flex-start', sm: 'center' }}
          justifyContent="space-between"
          sx={{ mb: 2 }}
        >
          <Stack spacing={0.5}>
            <Typography variant="h4" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <CalendarOutlined /> Schedule
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Staff timeline · 30-minute slots · live bookings
            </Typography>
          </Stack>
          <Chip
            icon={<TeamOutlined />}
            label={`${resources.length} stylist${resources.length === 1 ? '' : 's'}`}
            color="primary"
            variant="outlined"
          />
        </Stack>

        <CalendarStyled>
          <Toolbar
            date={date}
            view={calendarView}
            onClickNext={handleDateNext}
            onClickPrev={handleDatePrev}
            onClickToday={handleDateToday}
            onChangeView={handleViewChange}
          />
          <FullCalendar
            weekends
            editable
            droppable
            selectable
            events={coloredEvents}
            resources={resources}
            ref={calendarRef}
            rerenderDelay={10}
            initialDate={date}
            initialView={calendarView || 'resourceTimeGridWeek'}
            dayMaxEventRows={4}
            eventDisplay="block"
            headerToolbar={false}
            nowIndicator
            slotMinTime="08:00:00"
            slotMaxTime="22:00:00"
            slotDuration="00:30:00"
            slotLabelInterval="01:00:00"
            scrollTime="09:00:00"
            allDaySlot={false}
            allDayMaintainDuration
            eventResizableFromStart
            select={handleRangeSelect}
            eventDrop={handleEventUpdate}
            eventClick={handleEventSelect}
            eventResize={handleEventUpdate}
            height={matchDownSM ? 'auto' : 760}
            expandRows
            stickyHeaderDates
            plugins={[resourceTimeGridPlugin, interactionPlugin]}
            resourceOrder="title"
            eventTimeFormat={{ hour: 'numeric', minute: '2-digit', meridiem: 'short' }}
            slotLabelFormat={{ hour: 'numeric', minute: '2-digit', meridiem: 'short' }}
          />
        </CalendarStyled>

        <Dialog
          maxWidth="sm"
          TransitionComponent={PopupTransition}
          fullWidth
          onClose={handleModal}
          open={isModalOpen}
          sx={{ '& .MuiDialog-paper': { p: 0 } }}
        >
          <AddEventForm event={selectedEvent} range={selectedRange} onCancel={handleModal} />
        </Dialog>
        <Tooltip title="Add Booking">
          <SpeedDial
            ariaLabel="add-event-fab"
            sx={{ display: 'inline-flex', position: 'sticky', bottom: 24, left: '100%', transform: 'translate(-50%, -50% )' }}
            icon={<PlusOutlined style={{ fontSize: '1.5rem' }} />}
            onClick={handleModal}
          />
        </Tooltip>
      </Box>
    </Page>
  );
};

export default Calendar;
