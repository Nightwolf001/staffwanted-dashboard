import { createSlice } from '@reduxjs/toolkit';
import moment from 'moment';
// utils
import axios from '../../utils/axios';
import { getCalendarEvents, createCalendarEvents, updateCalendarEvents } from '../../api/staffwanted-api';
//
import { dispatch } from '../store';

const _ = require('lodash');
// ----------------------------------------------------------------------

const initialState = {
  isLoading: false,
  error: null,
  events: [],
  isOpenModal: false,
  selectedEventId: null,
  selectedRange: null,
};

const slice = createSlice({
  name: 'calendar',
  initialState,
  reducers: {
    // START LOADING
    startLoading(state) {
      state.isLoading = true;
    },

    // HAS ERROR
    hasError(state, action) {
      state.isLoading = false;
      state.error = action.payload;
    },

    // GET EVENTS
    getEventsSuccess(state, action) {
      state.isLoading = false;
      state.events = action.payload;
    },

    // CREATE EVENT
    createEventSuccess(state, action) {
      const newEvent = action.payload;
      state.isLoading = false;
      state.events = [...state.events, newEvent];
    },

    // UPDATE EVENT
    updateEventSuccess(state, action) {
      const event = action.payload;
      const updateEvent = state.events.map((_event) => {
        if (_event.id === event.id) {
          return event;
        }
        return _event;
      });

      state.isLoading = false;
      state.events = updateEvent;
    },

    // DELETE EVENT
    deleteEventSuccess(state, action) {
      const { eventId } = action.payload;
      const deleteEvent = state.events.filter((event) => event.id !== eventId);
      state.events = deleteEvent;
    },

    // SELECT EVENT
    selectEvent(state, action) {
      const eventId = action.payload;
      state.isOpenModal = true;
      state.selectedEventId = eventId;
    },

    // SELECT RANGE
    selectRange(state, action) {
      const { start, end } = action.payload;
      state.isOpenModal = true;
      state.selectedRange = { start, end };
    },

    // OPEN MODAL
    openModal(state) {
      state.isOpenModal = true;
    },

    // CLOSE MODAL
    closeModal(state) {
      state.isOpenModal = false;
      state.selectedEventId = null;
      state.selectedRange = null;
    },
  },
});

const formatEvents = async (rawEvents) => {
  console.log('formatEvents', rawEvents);
  const events = _.map(rawEvents, event => ({
    id: event.id,
    title: event.attributes.title,
    description: event.attributes.description,
    allDay: event.attributes.all_day,
    employer_status: event.attributes.employer_status,
    employee_status: event.attributes.employee_status,
    textColor: event.attributes.text_color,
    job: event.attributes.job.data.id,
    employee: event.attributes.employee.data.id,
    employer: event.attributes.employer.data.id,
    start: new Date(event.attributes.start),
    end: new Date(event.attributes.end),
  })); 
  console.log('formatEvents', events);
  return events;
}

const formatEvent = async (rawEvent) => {
  const event = {
    id: rawEvent.id,
    title: rawEvent.attributes.title,
    description: rawEvent.attributes.description,
    allDay: rawEvent.attributes.all_day,
    employer_status: rawEvent.attributes.employer_status,
    employee_status: rawEvent.attributes.employee_status,
    textColor: rawEvent.attributes.text_color,
    job: rawEvent.attributes.job.data.id,
    employee: rawEvent.attributes.employee.data.id,
    employer: rawEvent.attributes.employer.data.id,
    start: new Date(rawEvent.attributes.start),
    end: new Date(rawEvent.attributes.end),
  };
  return event;
}

// Reducer
export default slice.reducer;

// Actions
export const { openModal, closeModal, selectEvent } = slice.actions;

// ----------------------------------------------------------------------

export function getEvents(id) {
  return async () => {
    dispatch(slice.actions.startLoading());
    try {
      const { data } = await getCalendarEvents(id);
      const events = await formatEvents(data);
      dispatch(slice.actions.getEventsSuccess(events));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

// ----------------------------------------------------------------------

export function createEvent(newEvent) {
  return async () => {
    dispatch(slice.actions.startLoading());
    try {
      const { data } = await createCalendarEvents(newEvent);
      const event = await formatEvent(data);
      dispatch(slice.actions.createEventSuccess(event));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

// ----------------------------------------------------------------------

export function updateEvent(eventId, updateEvent) {
  return async () => {
    dispatch(slice.actions.startLoading());
    try {
      const { data } = await updateCalendarEvents(eventId, updateEvent);
      const event = await formatEvent(data);
      dispatch(slice.actions.updateEventSuccess(event));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

// ----------------------------------------------------------------------

export function deleteEvent(eventId) {
  return async () => {
    dispatch(slice.actions.startLoading());
    try {
      await axios.post('/api/calendar/events/delete', { eventId });
      dispatch(slice.actions.deleteEventSuccess({ eventId }));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

// ----------------------------------------------------------------------

export function selectRange(start, end) {
  return async () => {
    dispatch(
      slice.actions.selectRange({
        start: start.getTime(),
        end: end.getTime(),
      })
    );
  };
}
