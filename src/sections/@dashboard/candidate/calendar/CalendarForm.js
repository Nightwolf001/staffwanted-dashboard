import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';
import * as Yup from 'yup';
import merge from 'lodash/merge';
import { isBefore } from 'date-fns';
import { useSnackbar } from 'notistack';
// form
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import { Box, Stack, Button, Tooltip, TextField, IconButton, DialogActions } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { MobileDateTimePicker } from '@mui/x-date-pickers';
// api
import { createCalendarEvents, createEventLog } from '../../../../api/staffwanted-api';
// redux
import { useDispatch, useSelector } from '../../../../redux/store';
import { createEvent, updateEvent, deleteEvent } from '../../../../redux/slices/calendar';
// components
import Iconify from '../../../../components/Iconify';
import { ColorSinglePicker } from '../../../../components/color-utils';
import { FormProvider, RHFTextField, RHFSwitch } from '../../../../components/hook-form';

// ----------------------------------------------------------------------

const COLOR_OPTIONS = [
  '#00AB55', // theme.palette.primary.main,
  '#1890FF', // theme.palette.info.main,
  '#54D62C', // theme.palette.success.main,
  '#FFC107', // theme.palette.warning.main,
  '#FF4842', // theme.palette.error.main
  '#04297A', // theme.palette.info.darker
  '#7A0C2E', // theme.palette.error.darker
];

const getInitialValues = (event, range) => {
  const _event = {
    title: '',
    description: '',
    textColor: '#1890FF',
    allDay: false,
    employer_status: 'yes', // 'proposed', 'yes', 'no'
    employee_status: 'pending', // 'proposed', 'yes', 'no'
    start: range ? new Date(range.start) : new Date(),
    end: range ? new Date(range.end) : new Date(),
  };

  if (event || range) {
    return merge({}, _event, event);
  }

  return _event;
};

// ----------------------------------------------------------------------

CalendarForm.propTypes = {
  event: PropTypes.object,
  range: PropTypes.object,
  onCancel: PropTypes.func,
  job: PropTypes.object,
  job_match: PropTypes.object,
  employee: PropTypes.object,
  refresh: PropTypes.bool,
  setRefresh: PropTypes.func,
};

export default function CalendarForm({ event, range, employee, job, job_match, onCancel, refresh, setRefresh }) {
  const { enqueueSnackbar } = useSnackbar();

  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.user);

  const isCreating = Object.keys(event).length === 0;

  const EventSchema = Yup.object().shape({
    title: Yup.string().max(255).required('Title is required'),
    description: Yup.string().max(5000),
    employee: Yup.number().required('Employee is required'),
    job: Yup.number().required('Job is required'),
    employer: Yup.number().required('Employer is required'),
    employer_status: Yup.string().required('Status is required'),
    employee_status: Yup.string().required('Status is required'),
  });

  const methods = useForm({
    resolver: yupResolver(EventSchema),
    defaultValues: getInitialValues(event, range),
  });

  const { reset, watch, control, handleSubmit, setValue, formState: { isSubmitting }} = methods;
  const values = watch();

  useEffect(() => {
    if(user) setValue('employer', user.profile_id);
    if (employee) setValue('employee', employee.id);
    if (job) setValue('job', job.id);
    setValue('employer_status', 'yes');
    setValue('employee_status', 'pending');
  }, [employee, job, user]);

  const onSubmit = async () => {
    try {
      const newEvent = {
        title: values.title,
        description: values.description,
        text_color: values.textColor,
        all_day: values.allDay,
        employer_status: values.employer_status,
        employee_status: values.employee_status,
        employee: values.employee,
        job: values.job,
        employer: values.employer,
        start: values.start,
        end: values.end,
      };

      const {data} = await createCalendarEvents(newEvent);
      if(data) {
        enqueueSnackbar('Create success!');

        const newEventLog = {
          title: `meeting request RE: ${values.title}`,
          description: values.description,
          action: 'meeting',
          employee: values.employee,
          job: values.job,
          employer: values.employer,
          date_time: new Date(),
        };
        
        await createEventLog(newEventLog);
        setRefresh(!refresh);
        onCancel();
        reset();
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async () => {
    if (!event.id) return;
    try {
      onCancel();
      dispatch(deleteEvent(event.id));
      enqueueSnackbar('Delete success!');      
    } catch (error) {
      console.error(error);
    }
  };

  const isDateError = isBefore(new Date(values.end), new Date(values.start));

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Stack spacing={3} sx={{ p: 3 }}>
        <RHFTextField name="title" label="Title" />

        <RHFTextField name="description" label="Description" multiline rows={4} />

        {/* <RHFSwitch name="allDay" label="All day" /> */}

        <Controller
          name="start"
          control={control}
          render={({ field }) => (
            <MobileDateTimePicker
              {...field}
              label="Start date"
              inputFormat="dd/MM/yyyy hh:mm a"
              renderInput={(params) => <TextField {...params} fullWidth />}
            />
          )}
        />

        <Controller
          name="end"
          control={control}
          render={({ field }) => (
            <MobileDateTimePicker
              {...field}
              label="End date"
              inputFormat="dd/MM/yyyy hh:mm a"
              renderInput={(params) => (
                <TextField
                  {...params}
                  fullWidth
                  error={!!isDateError}
                  helperText={isDateError && 'End date must be later than start date'}
                />
              )}
            />
          )}
        />

        <Controller
          name="textColor"
          control={control}
          render={({ field }) => (
            <ColorSinglePicker value={field.value} onChange={field.onChange} colors={COLOR_OPTIONS} />
          )}
        />
      </Stack>

      <DialogActions>
        {!isCreating && (
          <Tooltip title="Delete Event">
            <IconButton onClick={handleDelete}>
              <Iconify icon="eva:trash-2-outline" width={20} height={20} />
            </IconButton>
          </Tooltip>
        )}
        <Box sx={{ flexGrow: 1 }} />

        <Button variant="outlined" color="inherit" onClick={onCancel}>
          Cancel
        </Button>

        <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
          Add
        </LoadingButton>
      </DialogActions>
    </FormProvider>
  );
}
