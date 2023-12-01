import { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import * as Yup from 'yup';
import merge from 'lodash/merge';
import { isBefore } from 'date-fns';
import { useSnackbar } from 'notistack';
// form
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import { Box, Stack, Button, Tooltip, TextField, IconButton, DialogActions, Divider, Grid, Typography } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { MobileDateTimePicker } from '@mui/x-date-pickers';
import _ from 'lodash';
// api
import { getEmployerJobs, getApplicantsByJobs, createEventLog } from '../../../api/staffwanted-api';
// redux
import { useDispatch, useSelector } from '../../../redux/store';
import { createEvent, updateEvent, deleteEvent } from '../../../redux/slices/calendar';
// components
import Iconify from '../../../components/Iconify';
import { ColorSinglePicker } from '../../../components/color-utils';
import { FormProvider, RHFTextField, RHFSwitch, RHFAutocomplete, RHFSelect } from '../../../components/hook-form';

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
    job: '',
    employee: '',
    employer: '',
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
};

const ValidationSchema = Yup.object().shape({
  title: Yup.string().max(255).required('Title is required'),
  description: Yup.string().max(500),
  job: Yup.number().required('Job is required'),
  employee: Yup.object().shape({ label: Yup.string().required('Label is required'), value: Yup.string().required('Value is required') }).required('Applicant is required'),
  employer: Yup.number().required('Employer is required'),
  employer_status: Yup.string().required('Status is required'),
  employee_status: Yup.string().required('Status is required'),
  textColor: Yup.string(),
  allDay: Yup.boolean(),
  start: Yup.date().required('Start date is required'),
  end: Yup.date().required('End date is required'),
});

export default function CalendarForm({ event, range, onCancel }) {
  const { enqueueSnackbar } = useSnackbar();

  const isCreating = Object.keys(event).length === 0;

  const methods = useForm({ 
    mode: 'onTouched',
    resolver: yupResolver(ValidationSchema), 
    defaultValues: getInitialValues(event, range),
    shouldFocusError: true,
  });

  const { reset, watch, control, handleSubmit, setValue, formState: { isSubmitting } } = methods;
  const values = watch();

  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.user);

  const [jobs, setJobs] = useState([]);
  const [status, setStatus] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [disabled, setDisabled] = useState(true);

  useEffect(() => {
    (async () => {
      if(user.profile_id) {

        setValue('employer', user.profile_id);
        const { data } = await getEmployerJobs(user.profile_id);
        setJobs(data);

        if (isCreating) {
          setValue('employer_status', 'yes');
          setValue('employee_status', 'pending');
        } else {
          setDisabled(false);
          setValue('job', event.job.data.id);
          setValue('employer_status', event.employer_status);
          setValue('employee_status', event.employee_status);
        }
      }
    })();
  }, [user, isCreating]);

  useEffect(() => {
    (async () => {
      if (values.job) {
        setDisabled(false);
        const { data } = await getApplicantsByJobs(values.job);
        const employees = _.map(data, item => ({ label: `${item.attributes.first_name} ${item.attributes.last_name}`, value: item.id, }));
        setEmployees(employees);

        if (!isCreating) {
          const employee = _.find(employees, item => item?.value === event.employee);
          setValue('employee', employee);
        }
      } else {
        setDisabled(true);
      }
    })();
  }, [values.job]);

  const onSubmit = async () => {
    try {

      const newEvent = {
        title: values.title,
        description: values.description,
        text_color: values.textColor,
        all_day: values.allDay,
        employer_status: values.employer_status,
        employee_status: values.employee_status,
        employee: values.employee.value,
        job: values.job,
        employer: values.employer,
        start: values.start,
        end: values.end,
      };
      
      if (event.id) {
        dispatch(updateEvent(event.id, newEvent));
        enqueueSnackbar('Update success!');
      } else {
        dispatch(createEvent(newEvent));
        enqueueSnackbar('Create success!');
      }

      const newEventLog = {
        title: event.id ? `meeting update RE: ${values.title}` : `meeting request RE: ${values.title}`,
        description: values.description,
        action: 'meeting',
        employee: values.employee,
        job: values.job,
        employer: values.employer,
        date_time: new Date(),
      };

      await createEventLog(newEventLog);
      onCancel();
      reset();
    } catch (error) {
      console.error(error);
    }
  };

  const handelStatusChange = async (status) => {};

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

        <RHFSelect sx={{ mb: 2 }} name="job" label="Select a Job" placeholder="Select a Job">
          <option value="" />
          {jobs.map((option) => (
            <option key={option.id} value={option.id}>
              {option.attributes.title}
            </option>
          ))}
        </RHFSelect>

        {!disabled && 
        <>
          <RHFAutocomplete
            name="employee"
            label="Select Applicant"
            // multiple
            freeSolo
            options={employees.map((option) => option)}
            // ChipProps={{ size: 'small' }}
          />

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
        </>
        }
      </Stack>
      {!isCreating && (
        <>
          <Divider />
          <Grid container spacing={2} sx={{ p: 3, alignItems: 'center' }}>
            <Grid item xs={6}>
              <Typography variant={'subTitle2'}>
                Going ?
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Stack direction="row" spacing={2} alignItems="center">
                <Button onClick={() => handelStatusChange('yes')} fullWidth variant={values.employer_status === 'yes' ? 'contained' : 'outlined'}>
                  Yes
                </Button>

                <Button onClick={() => handelStatusChange('no')} fullWidth variant={values.employer_status === 'no' ? 'contained' : 'outlined'}>
                  No
                </Button>
              </Stack>
            </Grid>
          </Grid>
          <Divider />
        </>
      )}
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
          {isCreating ? 'Cancel' : 'Close'}
        </Button>

        <LoadingButton disabled={disabled} type="submit" variant="contained" loading={isSubmitting}>
          {isCreating ? 'Add' : 'Update'}
        </LoadingButton>
      </DialogActions>
    </FormProvider>
  );
}
