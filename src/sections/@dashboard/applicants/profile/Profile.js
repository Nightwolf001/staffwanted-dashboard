import PropTypes from 'prop-types';
// @mui
import { Grid, Stack } from '@mui/material';
//
import ProfileAbout from './ProfileAbout';
import ProfilePersonal from './ProfilePersonal';
import ProfilePostCard from './ProfilePostCard';
import ProfilePostInput from './ProfilePostInput';
import ProfileFollowInfo from './ProfileFollowInfo';
import ProfileSocialInfo from './ProfileSocialInfo';
import ProfileSendRequest from './ProfileSendRequest';
import ProfileStatus from './ProfileStatus';
// ----------------------------------------------------------------------

Profile.propTypes = {
  job: PropTypes.object,
  job_match: PropTypes.object,
  employee: PropTypes.object,
};

export default function Profile({ employee, job, job_match }) {
  return (
    <Grid container spacing={3}>
      <Grid item xs={12} md={4}>
        <Stack spacing={3}>
          <ProfileStatus employee={employee} job={job} job_match={job_match} />
          <ProfilePersonal employee={employee} />
        </Stack>
      </Grid>

      <Grid item xs={12} md={8}>
        <Stack spacing={3}>
          <ProfileAbout employee={employee} />
        </Stack>
      </Grid>
    </Grid>
  );
}
