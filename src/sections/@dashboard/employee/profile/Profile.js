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
// ----------------------------------------------------------------------

Profile.propTypes = {
  employee: PropTypes.object,
};

export default function Profile({ employee }) {
  return (
    <Grid container spacing={3}>
      <Grid item xs={12} md={4}>
        <Stack spacing={3}>
          <ProfilePersonal employee={employee} />
          <ProfileSendRequest employee={employee} />
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
