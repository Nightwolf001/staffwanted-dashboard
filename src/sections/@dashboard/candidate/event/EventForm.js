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
import { createEventLog, updateEventLog } from '../../../../api/staffwanted-api';
// redux
import { useDispatch, useSelector } from '../../../../redux/store';
import { createEvent, updateEvent, deleteEvent } from '../../../../redux/slices/calendar';
// components
import Iconify from '../../../../components/Iconify';
import { ColorSinglePicker } from '../../../../components/color-utils';
import { FormProvider, RHFTextField, RHFSwitch } from '../../../../components/hook-form';

// ----------------------------------------------------------------------


const getInitialValues = (event, action) => {
    const _event = {
        title: '',
        description: '',
        action,
        date_time: new Date(),
    };

    if (event || action) {
        return merge({}, _event, event);
    }

    return _event;
};

// ----------------------------------------------------------------------

EventForm.propTypes = {
    event: PropTypes.object,
    action: PropTypes.string,
    onCancel: PropTypes.func,
    job: PropTypes.object,
    employee: PropTypes.object,
};

const ValidationSchema = Yup.object().shape({
    title: Yup.string().max(255).required('Title is required'),
    description: Yup.string().max(5000),
    employee: Yup.number().required('Employee is required'),
    date_time: Yup.date().required('Date is required'),
    job: Yup.number().required('Job is required'),
    employer: Yup.number().required('Employer is required'),
});

export default function EventForm({ event, action, employee, job, onCancel, refresh, setRefresh }) {
    const { enqueueSnackbar } = useSnackbar();

    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.user);

    const isCreating = Object.keys(event).length === 0;

    const methods = useForm({
        mode: 'onTouched',
        resolver: yupResolver(ValidationSchema),
        defaultValues: getInitialValues(event, action),
        shouldFocusError: true,
    });

    const { reset, watch, control, handleSubmit, setValue, formState: { isSubmitting } } = methods;
    const values = watch();

    useEffect(() => {
        if (user) setValue('employer', user.profile_id);
        if (employee) setValue('employee', employee.id);
        if (job) setValue('job', job.id);
        if (action === 'call') setValue('title', `Call with ${employee.attributes.first_name} ${employee.attributes.last_name}`);
        if (action === 'email') setValue('title', `Email to ${employee.attributes.first_name} ${employee.attributes.last_name}`);
        if (action === 'note') setValue('title', `Note`);
    }, [employee, job, user, action]);

    const onSubmit = async () => {
        try {
            const newEvent = {
                title: values.title,
                description: values.description,
                action: values.action,
                employee: values.employee,
                job: values.job,
                employer: values.employer,
                date_time: values.date_time,
            };

            const { data } = await createEventLog(newEvent);
            console.log('createEventLog', data);
            if (data) {
                enqueueSnackbar('Create success!');
                onCancel();
                reset();
                setRefresh(!refresh);
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

                <Controller
                    name="date_time"
                    control={control}
                    render={({ field }) => (
                        <MobileDateTimePicker
                            {...field}
                            label="Date & Time"
                            inputFormat="dd/MM/yyyy hh:mm a"
                            renderInput={(params) => <TextField {...params} fullWidth />}
                        />
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
