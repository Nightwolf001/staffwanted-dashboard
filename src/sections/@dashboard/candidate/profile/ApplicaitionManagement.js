import * as Yup from 'yup';
import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';
import moment from 'moment';
// form
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm, Controller } from 'react-hook-form';
// @mui
import { styled, useTheme } from '@mui/material/styles';
import { Link, Card, Typography, CardHeader, Stack, Box, Chip, Button, Grid, DialogTitle } from '@mui/material';
// api
import { getEventLogs, updateApplicationStatus } from '../../../../api/staffwanted-api';
// components
import { CalendarForm } from '../calendar';
import { EventForm } from '../event';
import ApplicationTimeline from './ApplicationTimeline';
import Label from '../../../../components/Label';
import Iconify from '../../../../components/Iconify';
import { DialogAnimate } from '../../../../components/animate';
import { RHFSwitch, RHFEditor, FormProvider, RHFTextField, RHFUploadSingleFile } from '../../../../components/hook-form';

// ----------------------------------------------------------------------

const ValidationSchema = Yup.object().shape({
  notes: Yup.string(),
});

const LabelStyle = styled(Typography)(({ theme }) => ({
  ...theme.typography.subtitle2,
  color: theme.palette.text.secondary,
  marginBottom: theme.spacing(1),
}));

const IconStyle = styled(Iconify)(({ theme }) => ({
  width: 20,
  height: 20,
  marginTop: 1,
  flexShrink: 0,
  marginRight: theme.spacing(2),
}));

// ----------------------------------------------------------------------

ApplicaitionManagement.propTypes = {
  job: PropTypes.object,
  job_match: PropTypes.object,
  employee: PropTypes.object,
  refresh: PropTypes.bool,
  setRefresh: PropTypes.func,
};

export default function ApplicaitionManagement({ employee, job, job_match, refresh, setRefresh }) {

  const theme = useTheme();

  const defaultValues = {
    notes: '',
  };

  const methods = useForm({
    resolver: yupResolver(ValidationSchema),
    defaultValues,
  });

  const { reset, watch, control, setValue, handleSubmit, formState: { isSubmitting, isValid }} = methods;
  const values = watch();

  const [candidate, setCandidate] = useState(employee.attributes);
  const [jobMatch, setJobMatch] = useState(job_match.attributes);
  const [currentJob, setCurrentJob] = useState(job.attributes);
  const [timelineEvents, setTimelineEvents] = useState([]);

  const [isOpenModal, setOpenModal] = useState(false);
  const [action, setAction] = useState('');

  const { first_name, last_name, email, phone_number, date_of_birth, gender, place_id } = candidate;
  const { id, application_status, applied, bookmarked, status_description, createdAt } = jobMatch;
  const { title, job_role } = currentJob;

  const handleUpdateApplicationStatus = async (status) => {
    const { data } = await updateApplicationStatus(job_match.id, status, '');
    setJobMatch(data.attributes);
  }

  const onSubmit = async () => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      reset();
    } catch (error) {
      console.error(error);
    }
  };

  const handleAction = (action) => {
    setAction(action);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const handelGetEventLogs = async () => {
    const { data } = await getEventLogs(job.id, employee.id);
    setTimelineEvents(data);
    setRefresh(false);
  }

  useEffect(() => {
    (async () => {
      await handelGetEventLogs();
    })();
  }, []);

  useEffect(() => {
    (async () => {
      if(refresh) {
        await handelGetEventLogs();
      }
    })();
  }, [refresh]);

  return (
    <Box>    
    {application_status === 'reviewing' &&
    <>
      <Box>
        <Card sx={{ mb: 3 }}>
            <ApplicationTimeline title="Application Timeline and Events" list={timelineEvents} />
        </Card>
        <Card sx={{ mb: 3 }}>
          <CardHeader title="Application Status" />
          <Stack direction="row" spacing={2} alignItems="flex-end" sx={{ p: 3, flexGrow: 1 }}>
            <Button onClick={() => handleUpdateApplicationStatus('approved')} fullWidth variant="contained" endIcon={<Iconify icon={'eva:checkmark-circle-2-fill'} />}>
              Accept Application
            </Button>

            <Button onClick={() => handleUpdateApplicationStatus('declined')} fullWidth variant="contained" color="error" endIcon={<Iconify icon={'eva:close-circle-fill'} />}>
              Decline Application
            </Button>
          </Stack>
        </Card>
      </Box>
    </>
    }
    </Box>
  );
}
