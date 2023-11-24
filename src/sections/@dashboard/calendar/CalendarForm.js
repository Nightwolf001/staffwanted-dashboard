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
import { Box, Stack, Button, Tooltip, TextField, IconButton, DialogActions } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { MobileDateTimePicker } from '@mui/x-date-pickers';
import _ from 'lodash';
// api
import { getEmployerJobs, getApplicantsByJobs } from '../../../api/staffwanted-api';
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
    status: 'proposed', // 'proposed', 'accepted', 'declined', 'change', 'cancelled
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
  status: Yup.string().required('Status is required'),
  textColor: Yup.string(),
  allDay: Yup.boolean(),
  start: Yup.date().required('Start date is required'),
  end: Yup.date().required('End date is required'),
});

export default function CalendarForm({ event, range, onCancel }) {
  const { enqueueSnackbar } = useSnackbar();

  const isCreating = Object.keys(event).length === 0;

  const methods = useForm({ 
    resolver: yupResolver(ValidationSchema), 
    defaultValues: getInitialValues(event, range),
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
      }

      if(isCreating) {
        setValue('status', 'proposed');
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
      } else {
        setDisabled(true);
      }
    })();
  }, [values.job]);

  const onSubmit = async (data) => {
    try {
      const newEvent = {
        title: data.title,
        description: data.description,
        textColor: data.textColor,
        allDay: data.allDay,
        start: data.start,
        end: data.end,
      };
      if (event.id) {
        dispatch(updateEvent(event.id, newEvent));
        enqueueSnackbar('Update success!');
      } else {
        enqueueSnackbar('Create success!');
        dispatch(createEvent(newEvent));
      }
      onCancel();
      reset();
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

          <RHFSwitch name="allDay" label="All day" />

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
