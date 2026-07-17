import { useEffect, useRef, useState } from 'react';

// material-ui
import { Theme } from '@mui/material/styles';
import { useMediaQuery, Box, Dialog, SpeedDial, Tooltip } from '@mui/material';

// third-party
import FullCalendar from '@fullcalendar/react';
import { EventResizeDoneArg } from '@fullcalendar/interaction';
import resourceTimeGridPlugin from '@fullcalendar/resource-timegrid';
// project import
import Page from 'components/Page';
import { PopupTransition } from 'components/@extended/Transitions';
import CalendarStyled from 'sections/apps/calendar/CalendarStyled';
import Toolbar from 'sections/apps/calendar/Toolbar';
import AddEventForm from 'sections/apps/calendar/AddEventForm';

import { dispatch, useSelector } from 'store';
import { getEvents, selectEvent, selectRange, updateCalendarView, updateEvent } from 'store/reducers/calendar';
import { DateSelectArg, EventClickArg, EventDropArg } from '@fullcalendar/core';

// types
import { PlusOutlined } from '@ant-design/icons';
import { listEmployee } from 'services/employees';
import { useSession } from 'next-auth/react';
import { useUserProfile } from './user-provider';
import { useRouter } from 'next/router';
import { getStaff } from 'services/metadata';

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
  const fetchData = async () => {
    let metadata;
    if (userData && userData.branch_id) {
      listEmployee({ ...userData, status: 'Active' }).then(response => {
        // Extract customer names from the response
        if (response && response.data) {
          metadata = response.data.data.rows.map((item: any) => ({
            id: item.id,
            title: item.customer_name,
          }));
        } else {
          metadata = []
        }
        // Set the resources to the metadata array
        setResources(metadata);
        const calendarEl = calendarRef.current;

        // Render the calendar
        calendarEl &&
          (calendarEl as any).getApi().setOption('resources', metadata);

        // Clean up when the component unmounts
        return () => {
          const calendarApi = (calendarEl as any).getApi();
          const newView = matchDownSM ? 'listWeek' : 'resourceTimeGridDay';
          calendarApi.changeView(newView);
          dispatch(updateCalendarView(newView));
          calendarApi && calendarApi.destroy();
        };
      });
    }
  }
  useEffect(() => {
    if (!loading && userData) {
      fetchData();
    }
  }, [loading, userData, matchDownSM]);

  const fetchDataEvents = async () => {
    dispatch(getEvents(userData));
  }
  useEffect(() => {
    if (!loading && userData && session) {
      fetchDataEvents();
      // dispatch(
      //   openSnackbar({
      //     open: true,
      //     anchorOrigin: { vertical: 'top', horizontal: 'center' },
      //     message: '👀 Unlock exclusive benefits! Sign up for a personalized journey.',
      //     close: false,
      //     actionButton: false
      //   })
      // )
    }
  }, [loading, userData, session]);

  // calendar toolbar events
  const handleDateToday = () => {
    const calendarEl = calendarRef.current;

    if (calendarEl) {
      const calendarApi = calendarEl.getApi();

      calendarApi.today();
      setDate(calendarApi.getDate());
    }
  };

  const handleViewChange = (newView: string) => {
    const calendarEl = calendarRef.current;

    if (calendarEl) {
      const calendarApi = calendarEl.getApi();

      calendarApi.changeView(newView);
      dispatch(updateCalendarView(newView));
    }
  };

  const handleDatePrev = () => {
    const calendarEl = calendarRef.current;

    if (calendarEl) {
      const calendarApi = calendarEl.getApi();

      calendarApi.prev();
      setDate(calendarApi.getDate());
    }
  };

  const handleDateNext = () => {
    const calendarEl = calendarRef.current;

    if (calendarEl) {
      const calendarApi = calendarEl.getApi();

      calendarApi.next();
      setDate(calendarApi.getDate());
    }
  };

  // calendar events
  const handleRangeSelect = (arg: DateSelectArg) => {
    const calendarEl = calendarRef.current;
    if (calendarEl) {
      const calendarApi = calendarEl.getApi();
      calendarApi.unselect();
    }

    dispatch(selectRange(arg.start, arg.end));
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
    // dispatch(toggleModal());
    router.push('/apps/bookings/add-bookings')
  };

  return (
    <Page title="Calendar">
      <Box sx={{ position: 'relative' }}>
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
            events={events}
            ref={calendarRef}
            rerenderDelay={10}
            initialDate={date}
            initialView={calendarView}
            dayMaxEventRows={3}
            eventDisplay="block"
            headerToolbar={false}
            nowIndicator
            slotMinTime="08:00:00"
            slotMaxTime="23:00:00"
            allDayMaintainDuration
            eventResizableFromStart
            select={handleRangeSelect}
            // eventDrop={handleEventUpdate}
            eventClick={handleEventSelect}
            // eventResize={handleEventUpdate}
            height={matchDownSM ? 'auto' : 720}
            plugins={[resourceTimeGridPlugin]}
          />
        </CalendarStyled>

        {/* Dialog renders its body even if not open */}
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
