import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
// @mui
import { Grid, Stack } from '@mui/material';
//
import ApplicantDetails from './ApplicantDetails';
import ApplicaitionStatus from './ApplicaitionStatus';
import ApplicaitionManagement from './ApplicaitionManagement';
import ApplicaitionEventManagement from './ApplicaitionEventManagement';

// ----------------------------------------------------------------------

Application.propTypes = {
  job: PropTypes.object,
  job_match: PropTypes.object,
  employee: PropTypes.object,
};

export default function Application({ employee, job, job_match }) {

  const [refresh, setRefresh] = useState(false);

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} md={4}>
        <Stack spacing={3}>
          <ApplicaitionStatus employee={employee} job={job} job_match={job_match} refresh={refresh} setRefresh={setRefresh}/>
          <ApplicaitionEventManagement employee={employee} job={job} job_match={job_match} refresh={refresh} setRefresh={setRefresh} />
        </Stack>
      </Grid>

      <Grid item xs={12} md={8}>
        <Stack spacing={3}>
          {job_match.attributes.applied &&
            <ApplicaitionManagement employee={employee} job={job} job_match={job_match} refresh={refresh} setRefresh={setRefresh} />
          }
        </Stack>
      </Grid>
    </Grid>
  );
}
