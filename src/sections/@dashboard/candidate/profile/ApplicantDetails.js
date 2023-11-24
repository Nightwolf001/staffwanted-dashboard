import * as Yup from 'yup';
import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';
import moment from 'moment';
// form
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm, Controller } from 'react-hook-form';
// @mui
import { styled, useTheme } from '@mui/material/styles';
import { Link, Card, Typography, CardHeader, Stack, Box, Chip, Button, Grid } from '@mui/material';
// api
import { fetchLocationDetials, updateApplicationStatus } from '../../../../api/staffwanted-api';
// components
import Label from '../../../../components/Label';
import Iconify from '../../../../components/Iconify';
import { RHFSwitch, RHFEditor, FormProvider, RHFTextField, RHFUploadSingleFile } from '../../../../components/hook-form';

// ----------------------------------------------------------------------

const IconStyle = styled(Iconify)(({ theme }) => ({
  width: 20,
  height: 20,
  marginTop: 1,
  flexShrink: 0,
  marginRight: theme.spacing(2),
}));

// ----------------------------------------------------------------------

ApplicantDetails.propTypes = {
  job: PropTypes.object,
  job_match: PropTypes.object,
  employee: PropTypes.object,
};

export default function ApplicantDetails({ employee, job, job_match }) {

  const theme = useTheme();

  const [candidate, setCandidate] = useState(employee.attributes);
  const [jobMatch, setJobMatch] = useState(job_match.attributes);
  const [currentJob, setCurrentJob] = useState(job.attributes);

  const { first_name, last_name, email, phone_number, date_of_birth, gender, place_id, start_date, end_date } = candidate;
  const { id, application_status, applied, bookmarked, status_description, createdAt } = jobMatch;
  const { title } = currentJob;

  const handleUpdateApplicationStatus = async (status) => {
    const { data } = await updateApplicationStatus(job_match.id, status, '');
    setJobMatch(data.attributes);
  }

  return (
    <Box>
      <Card sx={{ mb: 3 }}>
        <CardHeader title="Applicant Details" />
        <Stack spacing={2} sx={{ p: 3 }}>
        
          <Stack direction="row">
              <IconStyle icon={'mdi:file-document-multiple'} />
              <Typography variant="body2">
                <Link component="span" variant="subtitle2" color="text.primary">
                  Circulum Vitae
                </Link>
              </Typography>
          </Stack>

          <Stack direction="row">
            <IconStyle icon={'mdi:calendar-range'} />
            <Typography variant="body2">
              Available From: &nbsp;
              <Link component="span" variant="subtitle2" color="text.primary">
                {start_date !== "NULL" ? start_date : 'Immediatetly'}
              </Link>
            </Typography>
          </Stack>

          <Stack direction="row">
            <IconStyle icon={'mdi:calendar-range'} />
            <Typography variant="body2">
              Available Until: &nbsp;
              <Link component="span" variant="subtitle2" color="text.primary">
                {end_date !== "NULL" ? end_date : 'N/A'}
              </Link>
            </Typography>
          </Stack>
          
        </Stack>

        {application_status === 'pending' &&
        <Stack direction="row" spacing={2} alignItems="flex-end" sx={{ p: 3, flexGrow: 1 }}>
          <Button onClick={() => handleUpdateApplicationStatus('reviewing')} fullWidth variant="contained" endIcon={<Iconify icon={'eva:checkmark-circle-2-fill'} />}>
            Review Application
          </Button>
        </Stack>  
        }

      </Card>
    </Box>
  );
}
