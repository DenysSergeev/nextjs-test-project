'use client';
import React, { useState } from 'react';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import format from 'date-fns/format';
import parse from 'date-fns/parse';
import startOfWeek from 'date-fns/startOfWeek';
import getDay from 'date-fns/getDay';
import enUS from 'date-fns/locale/en-US';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import withDragAndDrop from 'react-big-calendar/lib/addons/dragAndDrop';
import { useDispatch, useSelector } from 'react-redux';
import CreateEventPopUp from './CreateEventPopup';
import { setEventData } from '@/redux/events/eventsSlice';
import DeleteEventPopup from './DeleteEventPopup';

const DragAndDropCalendar = withDragAndDrop(Calendar);

const locales = {
  'en-US': enUS,
};

let currentDate = new Date();
let currentDay = currentDate.getDay();

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek: () => startOfWeek(currentDate, { weekStartsOn: currentDay }),
  getDay,
  locales,
});

const customDayPropGetter = date => {
  const currentDate = new Date();
  if (date < currentDate)
    return {
      className: 'disabled-day',
      style: {
        cursor: 'not-allowed',
        background: 'rgba(184, 184, 184, 0.1)',
      },
    };
  else return {};
};

const CustomCalendar = ({ events = [], height, style, ...calendarProps }) => {
  const calendarRef = React.createRef();
  // const dispatch = useDispatch();
  const [openDialog, setOpenDialog] = useState(false);
  const [openRemoveDialog, setOpenRemoveDialog] = useState(false);
  const [data, setData] = useState({});

  const setEventCellStyling = (event) => {
    if (event.background) {
      let style = {
        background: '#E2ECF5',
        border: `1px solid ${event.background}`,
        color: '#6E9ECF',
        borderLeft: `3px solid ${event.background}`,
        fontWeight: 200,
        fontSize: '14px',
        maxWidth: '200px',
      };
      return { style };
    }
    let style = {
      background: '#E2ECF5',
      border: `1px solid #6E9ECF`,
      color: '#6E9ECF',
      borderLeft: '3px solid #07617D',
      fontWeight: 200,
      fontSize: '14px',
      maxWidth: '200px',
    };
    return { style };
  };

  const formats = {
    weekdayFormat: 'EEE',
    timeGutterFormat: 'HH:mm',
    timeSlotFormat: 'HH:mm',
  };

  const handleSelect = ({ start, end }) => {
    const currentDate = new Date();
    if (start < currentDate) {
      return null;
    }
    if (start > end) return;

    handleOpenPopup();
    dispatch(setEventData({ start, end }));
  };

  const handleOpenPopup = () => {
    setOpenDialog(true);
  };

  const handleEventSelect = event => {
    handleRemoveDialogOpen();
    setData(event);
  };

  const handleRemoveDialogOpen = () => {
    setOpenRemoveDialog(true);
  };

  const handleRemoveDialogClose = () => {
    setOpenRemoveDialog(false);
    setEventData({});
  };

  const handleDialogClose = () => {
    setOpenDialog(false);
    dispatch(setEventData({}));
  };

  return (
    <>
      <DragAndDropCalendar
        ref={calendarRef}
        localizer={localizer}
        formats={formats}

        defaultDate={new Date()} // Set the default date to today
        min={new Date(0, 0, 0, 8, 0, 0)} // Set the minimum time to 8:00 AM
        max={new Date(0, 0, 0, 17, 30, 0)} // Set the maximum time to 5:00 PM
        timeslots={1} // Display two time slots per hour (30-minute intervals)

        popup={true}
        events={events}
        selectable
        resizable
        longPressThreshold={1}
        eventPropGetter={setEventCellStyling}
        dayPropGetter={customDayPropGetter}
        onSelectSlot={handleSelect}
        onSelectEvent={handleEventSelect}
        views={{ week: true }}
        step={30}
        drilldownView={'week'}
        scrollToTime={currentDate.getHours()}
        defaultView={'week'}
        style={{ height: height ? height : '68vh', ...style }}
        {...calendarProps}
        // className='bg-gray-200 border-1'
      />
      <CreateEventPopUp open={openDialog} handleClose={handleDialogClose} />
      <DeleteEventPopup
        open={openRemoveDialog}
        handleClose={handleRemoveDialogClose}
        event={data}
      />
    </>
  );
};

export default CustomCalendar;
