import PropTypes from 'prop-types';
// @mui
import { styled } from '@mui/material/styles';
import { Link, Card, Typography, CardHeader, Stack, Box } from '@mui/material';
import ReactPlayer from 'react-player';
// components
import Iconify from '../../../../components/Iconify';

const _ = require('lodash');
// ----------------------------------------------------------------------

const IconStyle = styled(Iconify)(({ theme }) => ({
  width: 20,
  height: 20,
  marginTop: 1,
  flexShrink: 0,
  marginRight: theme.spacing(2),
}));

// ----------------------------------------------------------------------

ProfileAbout.propTypes = {
  employee: PropTypes.object,
};

export default function ProfileAbout({ employee }) {
  const { cv_url, experience, job_roles, preferred_hours, start_date, end_date, unavailable_dates, work_description, video_url} = employee.attributes;

  return (
    <Box>
      <Card sx={{mb: 3}}>
        <CardHeader title="Portfolio Overview" />
        <Stack spacing={2} sx={{ p: 3 }}>
          
          <Stack direction="row">
            <IconStyle icon={'ic:round-business-center'} />
            <Typography variant="body2">
              Job Roles: &nbsp;
              <Link component="span" variant="subtitle2" color="text.primary">
                {_.map(job_roles.data, item => ( item.attributes.role )).join(', ')}
              </Link>
            </Typography>
          </Stack>

          <Stack direction="row">
            <IconStyle icon={'mdi:clock'} />
            <Typography variant="body2">
              Preferred Hours: &nbsp;
              <Link component="span" variant="subtitle2" color="text.primary">
                {_.map(preferred_hours.data, item => ( item.attributes.name )).join(', ')}
              </Link>
            </Typography>
          </Stack>

          <Stack direction="row">
            <IconStyle icon={'mdi:poll'} />
            <Typography variant="body2">
              Experience: &nbsp;
              <Link component="span" variant="subtitle2" color="text.primary">
                {experience.data.attributes.name}
              </Link>
            </Typography>
          </Stack>

          <Typography variant="body2">{work_description}</Typography>

        </Stack>
      </Card>

      <Card sx={{mb: 3}}>
        <CardHeader title="Intro Video" />
        <Stack spacing={2} sx={{ p: 3 }}>
          <ReactPlayer
            url={video_url}
            width="640"
            height="360"
            controls
          />
        </Stack>
      </Card>
    </Box>
  );
}
