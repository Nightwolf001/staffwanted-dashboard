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
import { fetchLocationDetials, updateApplicationStatus } from '../../../../api/staffwanted-api';
// components
import { CalendarForm } from '../calendar';
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
};

export default function ApplicaitionManagement({ employee, job, job_match }) {

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

  const [isOpenModal, setOpenModal] = useState(false);

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

  const handleAddMeeting = () => {
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
          <Grid item xs={3}>
              <Card sx={{cursor: 'pointer'}}>
                <Stack alignItems="center" spacing={2} sx={{ p: 3 }} direction="column" >
                  <IconStyle icon={'mdi:phone'} />
                  <Typography variant="subtitle2" color="text.primary">
                      Log an call
                  </Typography>
                </Stack>
              </Card>
          </Grid>
          <Grid item xs={3}>
            <Card sx={{ cursor: 'pointer' }}>
              <Stack alignItems="center" spacing={2} sx={{ p: 3 }} direction="column" >
                <IconStyle icon={'mdi:mail'} />
                <Typography variant="subtitle2" color="text.primary">
                  Log an email
                </Typography>
              </Stack>
            </Card>
          </Grid>
          <Grid item xs={3}>
            <Card sx={{ cursor: 'pointer' }}>
              <Stack alignItems="center" spacing={2} sx={{ p: 3 }} direction="column" >
                <IconStyle icon={'mdi:chat'} />
                <Typography variant="subtitle2" color="text.primary">
                  Start conversation
                </Typography>
              </Stack>
            </Card>
          </Grid>
          <Grid item xs={3}>
              <Card onClick={() => handleAddMeeting()} sx={{ cursor: 'pointer' }}>
              <Stack alignItems="center" spacing={2} sx={{ p: 3 }} direction="column" >
                <IconStyle icon={'mdi:calendar'} />
                <Typography variant="subtitle2" color="text.primary">
                  Request a meeting
                </Typography>
              </Stack>
            </Card>
          </Grid>
        </Grid>
        <Card sx={{ mb: 3 }}>
          <CardHeader title="Application Notes & Records" />
              <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)} >
                  <Grid container spacing={3} sx={{ p: 3 }}>
                    <Grid item xs={12}>
                      <div>
                        <LabelStyle>Notes</LabelStyle>
                        <RHFEditor simple name="notes" />
                      </div>
                    </Grid>
                  </Grid>
              </FormProvider>
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
      <DialogAnimate open={isOpenModal} onClose={handleCloseModal}>
          <DialogTitle>{'Request a meeting'}</DialogTitle>
          <CalendarForm event={{}} range={null} employee={employee} job={job} job_match={job_match} onCancel={handleCloseModal} />
      </DialogAnimate>
    </>
    }
    </Box>
  );
}
