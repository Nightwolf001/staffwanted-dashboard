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
import {
  Profile,
  ProfileCover,
  ProfileFriends,
  ProfileGallery,
  ProfileFollowers,
} from '../../sections/@dashboard/employee/profile';

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

export default function EmployeeProfile() {
  console.log('EmployeeProfile');
  const { themeStretch } = useSettings();
  const { currentTab, onChangeTab } = useTabs('profile');

  const { id } = useParams();
  const { user } = useAuth();

  const [employee, setEmployee] = useState('');

  useEffect(() => {
    (async () => {
      if(id) {
        const {data} = await getEmployee(id);
        setEmployee(data);
      }
    })();
  }, [id]);

  const handleFindFriends = (value) => {
    // setFindFriends(value);
  };

  return (
    
    <Page title="User: Profile">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading="Profile"
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            { name: 'Employees', href: PATH_DASHBOARD.employees.list },
            { name: `${employee?.attributes?.first_name} ${employee?.attributes?.last_name}`  || 'Employee' },
          ]}
        />

        {employee && employee.lenght !== 0 &&
        <>
        <Card sx={{ mb: 3, height: 180, position: 'relative'}}>
          <ProfileCover employee={employee} myProfile={_userAbout} />
        </Card>
        <Profile employee={employee} />
        </>
        }
      </Container>
    </Page>
  );
}
