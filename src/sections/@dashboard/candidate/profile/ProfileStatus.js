import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';
// @mui
import { styled } from '@mui/material/styles';
import { Link, Card, Typography, CardHeader, Stack, Box, Chip } from '@mui/material';
// api
import { fetchLocationDetials } from '../../../../api/staffwanted-api';
// components
import Iconify from '../../../../components/Iconify';

// ----------------------------------------------------------------------

const IconStyle = styled(Iconify)(({ theme }) => ({
  width: 20,
  height: 20,
  marginTop: 1,
  flexShrink: 0,
  marginRight: theme.spacing(2),
}));

// ----------------------------------------------------------------------

ProfileStatus.propTypes = {
  job: PropTypes.object,
  job_match: PropTypes.object,
  employee: PropTypes.object,
};

export default function ProfileStatus({ employee, job, job_match }) {

  console.log('job_match', job_match);

  const { first_name, last_name, email, phone_number, date_of_birth, gender, place_id } = employee.attributes;
  const { application_status, applied, bookmarked, status_description } = job_match.attributes;
  const { title } = job.attributes;

  const [location, setLocation] = useState([]);

  return (
    <Box>
    <Card>
      <CardHeader title="Application Status" />
      
      <Stack spacing={2} sx={{ p: 3 }}>
          <Stack direction="row">
            <IconStyle icon={'ic:round-business-center'} />
            <Typography variant="body2">
              Job: &nbsp;
              <Link component="span" variant="subtitle2" color="text.primary">
                {title}
              </Link>
            </Typography>
          </Stack>

        {!applied && bookmarked &&
          <Stack direction="row" sx={{position: 'relative'}}>
            <IconStyle icon={'eva:checkmark-circle-fill'} />
            <Typography variant="body2">
              <Link component="span" variant="subtitle2" color="text.primary">
                Bookmarked job
              </Link>
            </Typography>
            <Chip size={'small'} color={'success'} label={'Request Application'} sx={{position: 'absolute', right: 0}}/>
          </Stack>
         }

          <Stack direction="row">
            <IconStyle icon={applied ?'eva:checkmark-circle-fill' : 'eva:clock-outline'} />
            <Typography variant="body2">
              <Link component="span" variant="subtitle2" color="text.primary">
                {applied ? 'Applied' : 'Not Applied'}
              </Link>
            </Typography>
          </Stack>

        {applied && 
          <Stack direction="row">
            <IconStyle icon={'eva:clock-outline'} />
            <Typography variant="body2">
              Interview Process Status: &nbsp;
              <Link component="span" variant="subtitle2" color="text.primary">
                {!application_status ? 'Applied' : application_status}
              </Link>
            </Typography>
          </Stack>
        }

      </Stack>

    </Card>
    </Box>
  );
}
