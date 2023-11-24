import { useEffect, useState } from 'react';
import { paramCase, capitalCase } from 'change-case';
import {Link as RouterLink, useParams} from 'react-router-dom';
// @mui
import { Container, Tab, Box, Tabs, Button } from '@mui/material';
// api
import { getEmployerJob } from '../../api/staffwanted-api';
// routes
import { PATH_DASHBOARD } from '../../routes/paths';
// hooks
import useTabs from '../../hooks/useTabs';
import useSettings from '../../hooks/useSettings';
// components
import Page from '../../components/Page';
import Iconify from '../../components/Iconify';
import HeaderBreadcrumbs from '../../components/HeaderBreadcrumbs';
// sections
import Job from '../../sections/@dashboard/jobs/details';
import Candidates from '../../sections/@dashboard/jobs/candidates';

const _ = require('lodash');
// ----------------------------------------------------------------------

export default function JobDetails() {

  const { themeStretch } = useSettings();
  const { currentTab, onChangeTab } = useTabs('details');

  const { id } = useParams();
  const [job, setJob] = useState(null);
  const [candidates, setCandidates] = useState([]);

  useEffect(() => {
    (async () => {
      if(id) {
        const {data} = await getEmployerJob(id);
        setJob(data);
      }
    })();
  }, [id]);

  const JOB_TABS = [
    {
      value: 'details',
      icon: <Iconify icon={'ic:round-receipt'} width={20} height={20} />,
    },
    {
      value: 'candidates',
      icon: <Iconify icon={'ic:round-account-box'} width={20} height={20} />,
    },
  ];

  return (
    <Page title="Job: View">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading="Job Details"
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            {
              name: 'Jobs',
              href: PATH_DASHBOARD.job.root,
            },
            { name: `${job?.attributes?.title}` || '' },
          ]}
          action={
            <Button
                variant="contained"
                component={RouterLink}
                to={PATH_DASHBOARD.job.edit(job?.id)}
                startIcon={<Iconify icon={'eva:plus-fill'}/>}
            >
                Edit Job
            </Button>
          }
        />

        <Tabs
          allowScrollButtonsMobile
          variant="scrollable"
          scrollButtons="auto"
          value={currentTab}
          onChange={onChangeTab}
        >
          {JOB_TABS.map((tab) => (
            <Tab disableRipple key={tab.value} label={capitalCase(tab.value)} icon={tab.icon} value={tab.value} />
          ))}
        </Tabs>

        <Box sx={{ mb: 5 }} />

        {JOB_TABS.map((tab) => {
            const isMatched = tab.value === currentTab;
            return isMatched && 
            <Box key={tab.value}>
              {currentTab === 'details' && <Job job={job}/>}
              {currentTab === 'candidates' && <Candidates job_id={id} candidates={job.attributes.employee_job_matches.data} roles={_.map(job.attributes.job_roles.data, item => ( item.attributes.role ))}/>}
            </Box>
        })}
      </Container>
    </Page>
  );
}
