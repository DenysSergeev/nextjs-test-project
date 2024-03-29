import { fetchEventsStart } from '@/redux/events/eventsSlice';
import { Container, DialogTitle, TextField, Typography } from '@mui/material';
import { format } from 'date-fns';
import { useState } from 'react';
import PrimaryButton from '../Buttons/PrimaryButton';
import BaseDialog from '../Dialog/page';

const mapState = ({ eventsData }) => ({
  event: eventsData.event,
});

const CreateEventPopUp = ({ handleClose, open }) => {
  //   const { event } = useSelector(mapState);
  const startTimeAndDate = event.start;
  const endTimeAndDate = event.end;
  const from_time = startTimeAndDate && format(startTimeAndDate, 'hh:mma');
  const formattedStartDate =
    startTimeAndDate && format(startTimeAndDate, 'eeee, MMMM dd, yyyy ');
  const to_time = endTimeAndDate && format(endTimeAndDate, 'hh:mma');
  const [title, setTitle] = useState('');
  const [backgroundColor, setBackgroundColor] = useState('#000000');
  //   const dispatch = useDispatch();

  const handleCreateEvent = e => {
    e.preventDefault();

    try {
      const schema = {
        title: title,
        description: '',
        background: backgroundColor,
        start: startTimeAndDate,
        end: endTimeAndDate,
      };
      const url = '/api/events';
      fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(schema),
      })
        .then(res => res.json())
        .then(json => {
          dispatch(fetchEventsStart({ url: '/api/events' }));
          setTitle('');
        });
    } catch (error) {
      console.log(error);
    }
    handleClose();
  };

  return (
    <BaseDialog open={open} handleClose={handleClose} scroll={`body`}>
      <DialogTitle
        style={{
          fontSize: '21px',
          fontWeight: 'bold',
          marginTop: '-24px',
        }}
      >
        Add Event
      </DialogTitle>

      <Container
        sx={{
          background: 'white',
          top: '30%',
          left: '10%',
          minWidth: '450px',
          paddingBottom: '64px',
        }}
      >
        {formattedStartDate && (
          <Typography sx={{ fontSize: '18px', fontWeight: '500' }}>
            {formattedStartDate}, {from_time} - {to_time}
          </Typography>
        )}
        <TextField
          fullWidth
          sx={{ marginTop: '16px', fontSize: '14px' }}
          placeholder='Title'
          label='Title'
          value={title}
          onChange={e => setTitle(e.target.value)}
        />
        <div>
          <div style={{ paddingTop: '16px' }}>
            <label style={{ fontWeight: 700 }}>Select Color</label>
            <div style={{ display: 'flex' }}>
              {colorsList.map(item => {
                return (
                  <div
                    key={item}
                    style={{
                      width: '20px',
                      height: '20px',
                      background: item,
                      marginRight: '8px',
                    }}
                    onClick={() => setBackgroundColor(item)}
                  ></div>
                );
              })}
            </div>

            <input
              type={'color'}
              value={backgroundColor}
              onChange={e => setBackgroundColor(e.target.value)}
              style={{
                width: '100%',
                marginTop: '4px',
                border: 'none',
                background: 'none',
              }}
            />
            <Typography sx={{ fontSize: '14px' }}>
              Selected color: <b>{backgroundColor}</b>
            </Typography>
          </div>
        </div>

        <div
          style={{
            display: 'flex',
            padding: '8px',
            justifyContent: 'center',
            paddingTop: '32px',
          }}
        >
          <PrimaryButton
            onClick={handleCreateEvent}
            sx={{
              paddingRight: '32px',
              paddingLeft: '32px',
              fontSize: '14px',
            }}
          >
            Confirm
          </PrimaryButton>
        </div>
      </Container>
    </BaseDialog>
  );
};

export default CreateEventPopUp;

const colorsList = [
  '#624b4b',
  '#bc2020',
  '#bc20b6',
  ' #420b40',
  '#1fad96',
  '#3538ed',
  ' #1c474a',
  '#32bb30',
  '#cae958',
  '#dc3e09',
];
