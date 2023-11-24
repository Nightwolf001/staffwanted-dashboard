import { useEffect, useState } from 'react';
import { paramCase, capitalCase } from 'change-case';
import { useParams, useLocation } from 'react-router-dom';
// @mui
import { Container, Grid, Button } from '@mui/material';
// api
import { getEmployerJob } from '../../api/staffwanted-api';
// routes
import { PATH_DASHBOARD } from '../../routes/paths';
// hooks
import useSettings from '../../hooks/useSettings';
// _mock_
import { _userList } from '../../_mock';
// components
import Page from '../../components/Page';
import HeaderBreadcrumbs from '../../components/HeaderBreadcrumbs';
// sections
import JobNewEditForm from '../../sections/@dashboard/jobs/new-edit-form/JobNewEditForm';

// ----------------------------------------------------------------------

export default function JobCreate() {

  const { themeStretch } = useSettings();
  const { pathname } = useLocation();

  const { id = '' } = useParams();

  const isEdit = pathname.includes('edit');
  const [currentJob, setCurrentJob] = useState(null);

  useEffect(() => {
    (async () => {
      if(id) {
        const {data} = await getEmployerJob(id);
        setCurrentJob(data);
      }
    })();
  }, [id]);

  return (
    <Page title="Job: Create a new job">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading={!isEdit ? 'Create a new job' : 'Edit job'}
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            { name: 'Jobs', href: PATH_DASHBOARD.job.list },
            { name: !isEdit ? 'New job' : 'Edit job' },
          ]}
        />

        <JobNewEditForm isEdit={isEdit} currentJob={currentJob} />
      </Container>
    </Page>
  );
}
