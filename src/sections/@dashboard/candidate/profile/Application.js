import PropTypes from 'prop-types';
// @mui
import { Grid, Stack } from '@mui/material';
//
import ApplicantDetails from './ApplicantDetails';
import ApplicaitionStatus from './ApplicaitionStatus';
import ApplicaitionManagement from './ApplicaitionManagement';
// ----------------------------------------------------------------------

Application.propTypes = {
  job: PropTypes.object,
  job_match: PropTypes.object,
  employee: PropTypes.object,
};

export default function Application({ employee, job, job_match }) {
  return (
    <Grid container spacing={3}>
      <Grid item xs={12} md={4}>
        <Stack spacing={3}>
          <ApplicaitionStatus employee={employee} job={job} job_match={job_match} />
          <ApplicantDetails employee={employee} job={job} job_match={job_match} />
        </Stack>
      </Grid>

      <Grid item xs={12} md={8}>
        <Stack spacing={3}>
          {job_match.attributes.applied &&
            <ApplicaitionManagement employee={employee} job={job} job_match={job_match} />
          }
        </Stack>
      </Grid>
    </Grid>
  );
}
