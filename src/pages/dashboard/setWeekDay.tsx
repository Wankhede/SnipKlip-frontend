import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Grid, Typography, FormControlLabel, Checkbox, Select, MenuItem } from '@mui/material';

type Day = 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';
type TimeField = 'start' | 'end';

interface DaySchedule {
  start: string;
  end: string;
  isHoliday: boolean;
}

interface FormValues {
  monday: DaySchedule;
  tuesday: DaySchedule;
  wednesday: DaySchedule;
  thursday: DaySchedule;
  friday: DaySchedule;
  saturday: DaySchedule;
  sunday: DaySchedule;
}

const WeekDaysDialog = ({ open, onClose, onSubmit }: { open: boolean; onClose: () => void; onSubmit: (values: FormValues) => void; }) => {
  const [formValues, setFormValues] = useState<FormValues>({
    monday: { start: '', end: '', isHoliday: false },
    tuesday: { start: '', end: '', isHoliday: false },
    wednesday: { start: '', end: '', isHoliday: false },
    thursday: { start: '', end: '', isHoliday: false },
    friday: { start: '', end: '', isHoliday: false },
    saturday: { start: '', end: '', isHoliday: false },
    sunday: { start: '', end: '', isHoliday: false },
  });

  const handleChange = (day: Day, field: TimeField, value: string) => {
    setFormValues((prev) => ({
      ...prev,
      [day]: {
        ...prev[day],
        [field]: value,
      },
    }));
  };

  const handleHolidayChange = (day: Day, value: boolean) => {
    setFormValues((prev) => ({
      ...prev,
      [day]: {
        ...prev[day],
        isHoliday: value,
      },
    }));
  };

  const handleSubmit = () => {
    onSubmit(formValues);
    onClose();
  };

  // Function to generate options for hours and minutes
  const generateHourMinuteOptions = () => {
    const options = [];
    for (let hour = 0; hour < 24; hour++) {
      for (let minute = 0; minute < 60; minute += 5) {
        const formattedHour = hour % 12 === 0 ? 12 : hour % 12; // Convert 0 to 12
        const amPm = hour < 12 ? 'AM' : 'PM';
        const formattedMinute = minute < 10 ? `0${minute}` : `${minute}`;
        options.push(
          <MenuItem key={`${formattedHour}:${formattedMinute} ${amPm}`} value={`${formattedHour}:${formattedMinute} ${amPm}`}>
            {formattedHour}:{formattedMinute} {amPm}
          </MenuItem>
        );
      }
    }
    return options;
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="lg" PaperProps={{ style: { height: '100vh', width: '100vw', maxWidth: 'none' } }}>
      <DialogTitle>Set Week Days Timing For Your Branch</DialogTitle>
      <DialogContent>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={3}></Grid>
          <Grid item xs={4}>
            <Typography variant="subtitle1" gutterBottom>
              Start Time
            </Typography>
          </Grid>
          <Grid item xs={4}>
            <Typography variant="subtitle1" gutterBottom>
              End Time
            </Typography>
          </Grid>
          <Grid item xs={1}>
            <Typography variant="subtitle1" gutterBottom>
              Holiday
            </Typography>
          </Grid>
        </Grid>
        {Object.keys(formValues).map((day) => (
          <Grid container spacing={2} alignItems="center" key={day}>
            <Grid item xs={3}>
              <Typography variant="body1">
                {day.charAt(0).toUpperCase() + day.slice(1)}
              </Typography>
            </Grid>
            <Grid item xs={4}>
              <Select
                value={formValues[day as Day].start}
                onChange={(e) => handleChange(day as Day, 'start', e.target.value as string)}
                disabled={formValues[day as Day].isHoliday} // Disable if it's a holiday
                fullWidth
              >
                {generateHourMinuteOptions()}
              </Select>
            </Grid>
            <Grid item xs={4}>
              <Select
                value={formValues[day as Day].end}
                onChange={(e) => handleChange(day as Day, 'end', e.target.value as string)}
                disabled={formValues[day as Day].isHoliday} // Disable if it's a holiday
                fullWidth
              >
                {generateHourMinuteOptions()}
              </Select>
            </Grid>
            <Grid item xs={1}>
              <FormControlLabel
                control={<Checkbox checked={formValues[day as Day].isHoliday} onChange={(e) => handleHolidayChange(day as Day, e.target.checked)} />}
                label=""
              />
            </Grid>
            <br />
            <br />
            <br />
          </Grid>
        ))}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSubmit} variant="contained" color="primary">
          Set
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default WeekDaysDialog;
