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
import { updateApplicationStatus } from '../../../../api/staffwanted-api';
// components
import { CalendarForm } from '../calendar';
import { EventForm } from '../event';
import Label from '../../../../components/Label';
import Iconify from '../../../../components/Iconify';
import { DialogAnimate } from '../../../../components/animate';
import { RHFSwitch, RHFEditor, FormProvider, RHFTextField, RHFUploadSingleFile } from '../../../../components/hook-form';

// ----------------------------------------------------------------------

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

ApplicaitionEventManagement.propTypes = {
  job: PropTypes.object,
  job_match: PropTypes.object,
  employee: PropTypes.object,
  refresh: PropTypes.bool,
  setRefresh: PropTypes.func,
};

export default function ApplicaitionEventManagement({ employee, job, job_match, refresh, setRefresh }) {

  const theme = useTheme();

  const [candidate, setCandidate] = useState(employee.attributes);
  const [jobMatch, setJobMatch] = useState(job_match.attributes);
  const [currentJob, setCurrentJob] = useState(job.attributes);

  const [isOpenModal, setOpenModal] = useState(false);
  const [action, setAction] = useState('');

  const { first_name, last_name, email, phone_number, date_of_birth, gender, place_id } = candidate;
  const { id, application_status, applied, bookmarked, status_description, createdAt } = jobMatch;
  const { title, job_role } = currentJob;

  const handleUpdateApplicationStatus = async (status) => {
    const { data } = await updateApplicationStatus(job_match.id, status, '');
    setJobMatch(data.attributes);
  }

  const handleAction = (action) => {
    setAction(action);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  return (
    <Box>    
    {application_status === 'reviewing' &&
    <>
      <Box>
        <Grid sx={{ mb: 3 }} container spacing={2}>
          <Grid item xs={12} md={6}>
              <Card onClick={() => handleAction('call')} sx={{cursor: 'pointer'}}>
                <Stack alignItems="center" spacing={2} sx={{ p: 3 }} direction="column" >
                  <IconStyle icon={'mdi:phone'} />
                  <Typography variant="subtitle2" color="text.primary">
                      Log a call
                  </Typography>
                </Stack>
              </Card>
          </Grid>
          <Grid item xs={12} md={6}>
            <Card onClick={() => handleAction('email')} sx={{ cursor: 'pointer' }}>
              <Stack alignItems="center" spacing={2} sx={{ p: 3 }} direction="column" >
                <IconStyle icon={'mdi:mail'} />
                <Typography variant="subtitle2" color="text.primary">
                  Log a email
                </Typography>
              </Stack>
            </Card>
          </Grid>
            <Grid item xs={12} md={6}>
            <Card onClick={() => handleAction('chat')} sx={{ cursor: 'pointer' }}>
              <Stack alignItems="center" spacing={2} sx={{ p: 3 }} direction="column" >
                <IconStyle icon={'mdi:chat'} />
                <Typography variant="subtitle2" color="text.primary">
                  Start a chat
                </Typography>
              </Stack>
            </Card>
          </Grid>
          <Grid item xs={12} md={6}>
              <Card onClick={() => handleAction('meeting')} sx={{ cursor: 'pointer' }}>
              <Stack alignItems="center" spacing={2} sx={{ p: 3 }} direction="column" >
                <IconStyle icon={'mdi:calendar'} />
                <Typography variant="subtitle2" color="text.primary">
                  Request a meeting
                </Typography>
              </Stack>
            </Card>
          </Grid>
          <Grid item xs={12} md={6}>
            <Card onClick={() => handleAction('note')} sx={{ cursor: 'pointer' }}>
              <Stack alignItems="center" spacing={2} sx={{ p: 3 }} direction="column" >
                <IconStyle icon={'mdi:note'} />
                <Typography variant="subtitle2" color="text.primary">
                  Create a note
                </Typography>
              </Stack>
            </Card>
          </Grid>
          <Grid item xs={12} md={6}>
            <Card onClick={() => handleAction('recommend')} sx={{ cursor: 'pointer' }}>
              <Stack alignItems="center" spacing={2} sx={{ p: 3 }} direction="column" >
                <IconStyle icon={'mdi:account'} />
                <Typography variant="subtitle2" color="text.primary">
                  Recommend user
                </Typography>
              </Stack>
            </Card>
          </Grid>
        </Grid>

      </Box>
      <DialogAnimate open={isOpenModal} onClose={handleCloseModal}>
          {action === 'call' &&
            <>
            <DialogTitle>{'Log a call'}</DialogTitle>
            <EventForm event={{}} action={action} employee={employee} job={job} onCancel={handleCloseModal} refresh={refresh} setRefresh={setRefresh} />
            </>
          }
          {action === 'email' &&
            <>
            <DialogTitle>{'Log a email'}</DialogTitle>
            <EventForm event={{}} action={action} employee={employee} job={job} onCancel={handleCloseModal} refresh={refresh} setRefresh={setRefresh} />
            </>
          }
          {action === 'note' &&
            <>
              <DialogTitle>{'Log a note'}</DialogTitle>
              <EventForm event={{}} action={action} employee={employee} job={job} onCancel={handleCloseModal} refresh={refresh} setRefresh={setRefresh} />
            </>
          }
          {action === 'chat' &&
            <DialogTitle>{'Start a conversation'}</DialogTitle>
          }
          {action === 'meeting' &&
            <>
            <DialogTitle>{'Request a meeting'}</DialogTitle>
            <CalendarForm event={{}} range={null} employee={employee} job={job} job_match={job_match} onCancel={handleCloseModal} refresh={refresh} setRefresh={setRefresh} />
            </>
          }
      </DialogAnimate>
    </>
    }
    </Box>
  );
}
