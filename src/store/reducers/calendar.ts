import { createSlice } from '@reduxjs/toolkit';

// third-party
import { EventInput } from '@fullcalendar/core';

// project import
import axios from 'utils/axios';
import { dispatch } from 'store';

// types
import { CalendarProps } from 'types/calendar';
const initialState: CalendarProps = {
  calendarView: 'resourceTimeGridWeek',
  error: false,
  events: [],
  isLoader: false,
  isModalOpen: false,
  selectedEventId: null,
  selectedRange: null
};

// ==============================|| CALENDAR - SLICE ||============================== //

const calendar = createSlice({
  name: 'calendar',
  initialState,
  reducers: {
    // loader
    loading(state) {
      state.isLoader = true;
    },

    // error
    hasError(state, action) {
      state.isLoader = false;
      state.error = action.payload;
    },

    // event list
    setEvents(state, action) {
      state.isLoader = false;
      state.events = action.payload;
    },

    // update calendar view
    updateCalendarView(state, action) {
      state.calendarView = action.payload;
    },

    // select event
    selectEvent(state, action) {
      const eventId = action.payload;
      state.isModalOpen = true;
      state.selectedEventId = eventId;
    },

    // create event
    createEvent(state, action) {
      const newEvent = action.payload;
      state.isLoader = false;
      state.isModalOpen = false;
      state.events = [...state.events, newEvent];
    },

    // update event
    updateEvent(state, action) {
      const event = action.payload;
      const eventUpdate = state.events.map((item: any) => {
        if (item.id === event.id) {
          return event;
        }
        return item;
      });

      state.isLoader = false;
      state.isModalOpen = false;
      state.selectedEventId = null;
      state.events = eventUpdate;
    },

    // delete event
    deleteEvent(state, action) {
      const { eventId } = action.payload;
      state.isModalOpen = false;
      state.events = state.events.filter((user: any) => user.id !== eventId);
    },

    // select date range
    selectRange(state, action) {
      const { start, end } = action.payload;
      state.isModalOpen = true;
      state.selectedRange = { start, end };
    },

    // modal toggle
    toggleModal(state) {
      state.isModalOpen = !state.isModalOpen;
      if (state.isModalOpen === false) {
        state.selectedEventId = null;
        state.selectedRange = null;
      }
    }
  }
});

export default calendar.reducer;

export const { selectEvent, toggleModal, updateCalendarView } = calendar.actions;

export function getEvents(sessionData: any) {
  return async () => {
    dispatch(calendar.actions.loading());
    let eventsR: EventInput[] = [];
    try {
      if (sessionData && sessionData.branch_id && sessionData.branch_id !== '') {
        let urlParams = '/api/v3/calendar/events/?user_id=' + sessionData.user_id + '&branch_id=' + sessionData.branch_id + '&salon_id=' + sessionData.salon_id + '&current_page=' + sessionData.current_page + '&group=' + sessionData.group + '&subscription_name=' + sessionData.subscription_name;
        const response = await axios.get(urlParams);
        if (response && response.data && Array.isArray(response.data) && response.data.length > 0) {
          eventsR = response.data.map((event: any) => ({
            id: event.id,
            allDay: event.allDay,
            color: event.color,
            description: event.description,
            start: new Date(event.start),
            end: new Date(event.end),
            title: event.title,
            resourceId: event.resourceId
          }));
        }
      }
      dispatch(calendar.actions.setEvents(eventsR));
    } catch (error) {
      dispatch(calendar.actions.hasError(error));
    }
  };
}

export function createEvent(newEvent: Omit<EventInput, 'id'>) {
  return async () => {
    dispatch(calendar.actions.loading());
    try {
      const response = await axios.post('/api/v3/calendar/add/', newEvent);
      dispatch(calendar.actions.createEvent(response.data));
    } catch (error) {
      dispatch(calendar.actions.hasError(error));
    }
  };
}

export function updateEvent(eventId: string, event: Partial<{ allDay: boolean; start: Date | null; end: Date | null }>) {
  return async () => {
    dispatch(calendar.actions.loading());
    try {
      const response = await axios.post('/api/v3/calendar/update/', {
        eventId,
        update: event
      });
      dispatch(calendar.actions.updateEvent(response.data));
    } catch (error) {
      dispatch(calendar.actions.hasError(error));
    }
  };
}

export function deleteEvent(eventId: string) {
  return async () => {
    dispatch(calendar.actions.loading());
    try {
      await axios.post('/api/v3/calendar/delete/', { eventId });
      dispatch(calendar.actions.deleteEvent({ eventId }));
    } catch (error) {
      dispatch(calendar.actions.hasError(error));
    }
  };
}

export function selectRange(start: Date, end: Date) {
  return async () => {
    dispatch(
      calendar.actions.selectRange({
        start: start.getTime(),
        end: end.getTime()
      })
    );
  };
}
