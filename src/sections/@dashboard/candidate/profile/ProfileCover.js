import PropTypes from 'prop-types';
// @mui
import { styled } from '@mui/material/styles';
import { Box, Typography } from '@mui/material';
// utils
import cssStyles from '../../../../utils/cssStyles';
// hooks
import useAuth from '../../../../hooks/useAuth';
// components
import EmployeeAvatar from '../../../../components/EmployeeAvatar';
import Image from '../../../../components/Image';

const _ = require('lodash');
// ----------------------------------------------------------------------

const RootStyle = styled('div')(({ theme }) => ({
  '&:before': {
    ...cssStyles().bgBlur({ }),
    top: 0,
    zIndex: 9,
    content: "''",
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
}));

const InfoStyle = styled('div')(({ theme }) => ({
  left: 0,
  right: 0,
  zIndex: 99,
  position: 'absolute',
  marginTop: theme.spacing(5),
  [theme.breakpoints.up('md')]: {
    right: 'auto',
    display: 'flex',
    alignItems: 'center',
    left: theme.spacing(3),
    bottom: theme.spacing(3),
  },
}));

// ----------------------------------------------------------------------

ProfileCover.propTypes = {
  myProfile: PropTypes.object,
  employee: PropTypes.object,
};

export default function ProfileCover({ myProfile, employee }) {
  const { user } = useAuth();

  const { position, cover } = myProfile;
  const { first_name, last_name, job_roles } = employee?.attributes;

  return (
    <RootStyle>
      <InfoStyle>
        <EmployeeAvatar
          employee={employee}
          sx={{ mx: 'auto', borderWidth: 2, borderStyle: 'solid', borderColor: 'common.white', width: { xs: 80, md: 128 }, height: { xs: 80, md: 128 }}}
        />
        <Box
          sx={{ ml: { md: 3 }, mt: { xs: 1, md: 0 }, color: 'common.white', textAlign: { xs: 'center', md: 'left' }}}
        >
          <Typography variant="h4">{first_name} {last_name}</Typography>
          <Typography sx={{ opacity: 0.72 }}> {_.map(job_roles.data, item => ( item.attributes.role )).join(', ')}</Typography>
        </Box>
      </InfoStyle>
      <Image alt="profile cover" src={'/assets/bg_gradient.jpeg'} sx={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }} />
    </RootStyle>
  );
}
