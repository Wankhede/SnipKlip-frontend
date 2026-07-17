// third-party
import { EventInput, EventSourceInput } from '@fullcalendar/common';

// ==============================|| CALENDAR TYPES  ||============================== //

export type DateRange = { start: number | Date; end: number | Date };
export type CalendarView = 'resourceTimeGridDay' | 'dayGridMonth' | 'timeGridWeek' | 'timeGridDay' | 'listWeek';

export type CalendarProps = {
  calendarView: CalendarView;
  error: boolean;
  events: any;
  isLoader: boolean;
  isModalOpen: boolean;
  selectedEventId: null | string;
  selectedRange: null | { start: Date; end: Date };
};
