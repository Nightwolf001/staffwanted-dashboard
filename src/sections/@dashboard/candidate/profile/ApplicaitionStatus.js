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

ApplicaitionStatus.propTypes = {
  job: PropTypes.object,
  job_match: PropTypes.object,
  employee: PropTypes.object,
};

export default function ApplicaitionStatus({ employee, job, job_match }) {

  const theme = useTheme();

  const [candidate, setCandidate] = useState(employee.attributes);
  const [jobMatch, setJobMatch] = useState(job_match.attributes);
  const [currentJob, setCurrentJob] = useState(job.attributes);

  const { first_name, last_name, email, phone_number, date_of_birth, gender, place_id } = candidate;
  const { id, application_status, applied, bookmarked, status_description, createdAt } = jobMatch;
  const { title, job_role } = currentJob;

  const handleUpdateApplicationStatus = async (status) => {
    const { data } = await updateApplicationStatus(job_match.id, status, '');
    setJobMatch(data.attributes);
  }

  return (
    <Box>
      <Card>
        <CardHeader title="Application Details" />
        
        <Stack spacing={2} sx={{ p: 3 }}>
            <Stack direction="row">
              <IconStyle icon={'ic:round-business-center'} />
              <Typography variant="body2">
                Job applied for: &nbsp;
                <Link component="span" variant="subtitle2" color="text.primary">
                  {title}
                </Link>
              </Typography>
            </Stack>

            <Stack direction="row">
              <IconStyle icon={'eva:clock-outline'} />
              <Typography variant="body2">
                Interview Status: &nbsp;
                <Link component="span" variant="subtitle2" color="text.primary" sx={{ textTransform: 'capitalize' }}>
                  <Label variant={theme.palette.mode === 'light' ? 'ghost' : 'filled'} color={(application_status === 'pending' && 'warning') || (application_status === 'none' && 'error') || 'success'} sx={{ textTransform: 'capitalize' }}>
                    {application_status === 'none' ? 'not applied' : application_status}
                  </Label>
                </Link>
              </Typography>
            </Stack>

            <Stack direction="row">
              <IconStyle icon={'eva:calendar-outline'} />
              <Typography variant="body2">
                Application Date: &nbsp;
                <Link component="span" variant="subtitle2" color="text.primary" sx={{ textTransform: 'capitalize' }}>
                  <Label variant={theme.palette.mode === 'light' ? 'ghost' : 'filled'} color={(moment(createdAt).fromNow().includes("month") && 'error') || moment(createdAt).fromNow().includes("week") && 'warning' || moment(createdAt).fromNow().includes("days") && 'warning' || 'success'} sx={{ textTransform: 'capitalize' }}>
                    {moment(createdAt).fromNow()}
                  </Label>
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
