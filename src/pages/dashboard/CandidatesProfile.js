import { useState, useEffect } from 'react';
import { paramCase, capitalCase } from 'change-case';
import {Link as RouterLink, useParams} from 'react-router-dom';
// @mui
import { styled } from '@mui/material/styles';
import { Tab, Box, Card, Tabs, Container } from '@mui/material';
// api
import { getEmployee } from '../../api/staffwanted-api';
// routes
import { PATH_DASHBOARD } from '../../routes/paths';
// hooks
import useAuth from '../../hooks/useAuth';
import useTabs from '../../hooks/useTabs';
import useSettings from '../../hooks/useSettings';
// _mock_
import { _userAbout, _userFeeds, _userFriends, _userGallery, _userFollowers } from '../../_mock';
// components
import Page from '../../components/Page';
import Iconify from '../../components/Iconify';
import HeaderBreadcrumbs from '../../components/HeaderBreadcrumbs';
// sections
import { Profile, Application, ProfileCover, ProfileFriends, ProfileGallery, ProfileFollowers } from '../../sections/@dashboard/candidate/profile';

const _ = require('lodash');
// ----------------------------------------------------------------------

const TabsWrapperStyle = styled('div')(({ theme }) => ({
  zIndex: 9,
  bottom: 0,
  width: '100%',
  display: 'flex',
  position: 'absolute',
  backgroundColor: theme.palette.background.paper,
  [theme.breakpoints.up('sm')]: {
    justifyContent: 'center',
  },
  [theme.breakpoints.up('md')]: {
    justifyContent: 'flex-end',
    paddingRight: theme.spacing(3),
  },
}));

// ----------------------------------------------------------------------

export default function CandidatesProfile() {
  
  const { themeStretch } = useSettings();
  const { currentTab, onChangeTab } = useTabs('general overview');

  const { id, job_id } = useParams();

  const [employee, setEmployee] = useState('');
  const [job, setJob] = useState(null);
  const [job_match, setJobMatch] = useState(null);

  useEffect(() => {
    (async () => {
      if(id) {
        const {data} = await getEmployee(id);
        let job_match = _.find(data?.attributes?.employee_job_matches.data, item => item.attributes.job.data.id === parseInt(job_id, 10));
        setJobMatch(job_match);
        setJob(job_match?.attributes?.job?.data);
        setEmployee(data);
      }
    })();
  }, [id]);

  const PROFILE_TABS = [
    {
      value: 'general overview',
      icon: <Iconify icon={'ic:round-account-box'} width={20} height={20} />,
    },
    {
      value: 'application management',
      icon: <Iconify icon={'ic:round-business-center'} width={20} height={20} />,
    },
  ];

  return (
    <Page title="Candidate: Profile">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading="Profile"
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            { name: 'Candidates', href: PATH_DASHBOARD.job.list },
            { name: `${employee?.attributes?.first_name} ${employee?.attributes?.last_name}`  || 'Candidate' },
          ]}
        />

        {employee && employee.lenght !== 0 &&
        <>
        <Card sx={{ mb: 3, height: 220, position: 'relative'}}>
          <ProfileCover employee={employee} myProfile={_userAbout} />
          <TabsWrapperStyle>
            <Tabs allowScrollButtonsMobile variant="scrollable" scrollButtons="auto" value={currentTab} onChange={onChangeTab}>
              {PROFILE_TABS.map((tab) => (
                <Tab disableRipple key={tab.value} value={tab.value} icon={tab.icon} label={capitalCase(tab.value)} />
              ))}
            </Tabs>
          </TabsWrapperStyle>
        </Card>

        {PROFILE_TABS.map((tab) => {
          const isMatched = tab.value === currentTab;
          return isMatched &&
          <Box>
            {currentTab === 'general overview' && <Profile job_match={job_match} job={job} employee={employee} />}
            {currentTab === 'application management' && <Application job_match={job_match} job={job} employee={employee} />}
          </Box>
        })}
        </>
        }
      </Container>
    </Page>
  );
}
