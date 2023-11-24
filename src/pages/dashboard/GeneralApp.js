import {useCallback, useEffect, useState} from 'react';
import moment from 'moment';
// @mui
import { useTheme } from '@mui/material/styles';
import { Container, Grid, Stack, Button } from '@mui/material';
// api
import { getEmployerJobs, getApplicantsByJobs, getApplicationAnalytics } from '../../api/staffwanted-api';
// hooks
import useAuth from '../../hooks/useAuth';
import useSettings from '../../hooks/useSettings';
// _mock_
import { _appFeatured, _appAuthors, _appInstalled, _appRelated, _appInvoices } from '../../_mock';
// components
import Page from '../../components/Page';
// sections
import {
  AppWidget,
  AppWelcome,
  AppFeatured,
  AppNewInvoice,
  AppTopAuthors,
  AppTopRelated,
  AppAreaInstalled,
  AppWidgetSummary,
  AppCurrentDownload,
  AppTopInstalledCountries,
} from '../../sections/@dashboard/general/app';

import {
  ApplicantsByJob,
  ApplicantsByGender,
  ApplicantsAgeGroup,
  ApplicationsNew,
} from '../../sections/@dashboard/general/employee';
// assets

import {
  BookingDetails,
  BookingBookedRoom,
  BookingTotalIncomes,
  BookingRoomAvailable,
  BookingNewestBooking,
  BookingWidgetSummary,
  BookingCheckInWidgets,
  BookingCustomerReviews,
  BookingReservationStats,
} from '../../sections/@dashboard/general/booking';

// assets
import { BookingIllustration, CheckInIllustration, CheckOutIllustration, SeoIllustration } from '../../assets';

const _ = require('lodash');
// ----------------------------------------------------------------------

export default function GeneralApp() {
  const { user } = useAuth();

  const theme = useTheme();
  const { themeStretch } = useSettings();

  const [jobs, setJobs] = useState([]);
  const [ageGroups, setAgeGroups] = useState(['0-20', '25-29', '30-34', '35-39', '40-44', '45-49', '50-54', '55-59', '60+' ]);
  const [genders, setGenders] = useState(['Male', 'Female', 'Other']);
  const [applicants, setApplicants] = useState([]);
  const [newApplications, setNewApplications] = useState([]);

  const [totalJobs, setTotalJobs] = useState(0);
  const [totalApplicants, setTotalApplicants] = useState(0);
  const [pendingApplicants, setPendingApplicants] = useState(0);
  const [reviewdApplicants, setReviewdApplicants] = useState(0);

  const [pieChartData, setPieChartData] = useState([]);
  const [genderChartData, setGenderChartData] = useState([]);
  const [ageGroupChartData, setAgeGroupChartData] = useState([]);

  useEffect(() => {
      (async () => {
        const jobs = await getEmployerJobs(user.profile_id);
        const job_ids = _.map(jobs.data, item => (item.id));
        await filterApplicants(job_ids, jobs.data);
      })();
  }, []);

  const filterApplicants = async (ids, jobs) => {

      const applicants = await getApplicantsByJobs(ids);
      const analytics = await getApplicationAnalytics(ids);

      setTotalApplicants(analytics.data.attributes.total_applications);
      setPendingApplicants(analytics.data.attributes.total_pending);
      setReviewdApplicants(analytics.data.attributes.total_reviewing);
      setNewApplications(analytics.data.attributes.latest_applications);

      const gender_graph = _.map(genders, item => ({label: item, value: _.filter(applicants.data, applicant => _.find(applicant.attributes.gender, gender => gender === item )).length }));
      setGenderChartData(gender_graph)

      const pie_graph = _.map(jobs, item => ({label: item.attributes.title, value: _.filter(applicants.data, applicant => _.find(applicant.attributes.employee_job_matches, match => match.job.id === item.id )).length}));
      setPieChartData(pie_graph)
      
      const age_graph = await generateAgeGroups(applicants);
      setAgeGroupChartData(age_graph)
      
  };

  const generateAgeGroups = async (applicants) => {

    for (let i = 0; i < applicants.data.length; i++) {
      const apptlicant = applicants.data[i];

      let dateValue = moment(apptlicant.attributes.date_of_birth, "YYYY-MM-DD")
      let dateNow = moment()
      let diffInMonths = dateNow.diff(dateValue, 'months', true)
      let ageGroup

      if (diffInMonths < 252) {
        ageGroup = '0-20'
      } else if (diffInMonths >= 252 && diffInMonths < 360) {
        ageGroup = '25-29'
      } else if (diffInMonths >= 360 && diffInMonths < 420) {
        ageGroup = '30-34'
      } else if (diffInMonths >= 420 && diffInMonths < 480) {
        ageGroup = '35-39'
      } else if (diffInMonths >= 480 && diffInMonths < 540) {
        ageGroup = '40-44'
      } else if (diffInMonths >= 540 && diffInMonths < 600) {
        ageGroup = '45-49'
      } else if (diffInMonths >= 600 && diffInMonths < 660) {
        ageGroup = '50-54'
      } else if (diffInMonths >= 660 && diffInMonths < 720) {
        ageGroup = '55-59'
      } else {
        ageGroup = '60+'
      }
      apptlicant.attributes.ageGroup = ageGroup 
    }

    const age_graph = _.map(ageGroups, item => ({label: item, value: _.filter(applicants.data, applicant => _.find(applicant.attributes, attributes => attributes === item )).length }));
    return age_graph

  }

  return (
    <Page title="General: App">
      <Container maxWidth={themeStretch ? false : 'xl'}>
        <Grid container spacing={3}>
          {/* <Grid item xs={12} md={8}>
            <AppWelcome
              title={`Welcome back! \n ${user?.displayName}`}
              description="If you are going to use a passage of Lorem Ipsum, you need to be sure there isn't anything."
              img={
                <SeoIllustration
                  sx={{
                    p: 3,
                    width: 360,
                    margin: { xs: 'auto', md: 'inherit' },
                  }}
                />
              }
              action={<Button variant="contained">Go Now</Button>}
            />
          </Grid>

          <Grid item xs={12} md={4}>
            <AppFeatured list={_appFeatured} />
          </Grid> */}

          <Grid item xs={12} md={4}>
            <BookingWidgetSummary title="Total Applications" total={totalApplicants} icon={<BookingIllustration />} />
          </Grid>

          <Grid item xs={12} md={4}>
            <BookingWidgetSummary title="Pending Review" total={pendingApplicants} icon={<CheckInIllustration />} />
          </Grid>

          <Grid item xs={12} md={4}>
            <BookingWidgetSummary title="In Review" total={reviewdApplicants} icon={<CheckOutIllustration />} />
          </Grid>

          <Grid item xs={12} lg={12}>
            <ApplicationsNew
              title="Latest Apllications"
              tableData={newApplications}
              tableLabels={[
                { id: 'job', label: 'Job' },
                { id: 'applicant', label: 'Applicant Name' },
                { id: 'location', label: 'Applicant Location' },
                { id: 'applied', label: 'Applicant Applied' },
                { id: 'status', label: 'Application Status' },
                { id: '' , label: 'Actions'},
              ]}
            />
          </Grid>

          
          <Grid item xs={12} md={6} lg={4}>
            <ApplicantsByJob
              title="Applications By Job"
              chartData={pieChartData}
              chartColors={[
                theme.palette.primary.main,
                theme.palette.chart.blue[0],
                theme.palette.chart.violet[0],
                theme.palette.chart.yellow[0],
              ]}
            />
          </Grid>
          
          <Grid item xs={12} md={6} lg={4}>
            <ApplicantsByGender
              title="Applicants By Gender"
              total={totalApplicants}
              chartData={genderChartData}
              chartColors={[
                [theme.palette.primary.light, theme.palette.primary.main],
                [theme.palette.warning.light, theme.palette.warning.main],
                [theme.palette.primary.dark, theme.palette.primary.dark],
              ]}
            />
          </Grid>

          <Grid item xs={12} md={6} lg={4}>
            <ApplicantsAgeGroup
              title="Applicants By Age"
              subheader="Broken down by age group"
              chartData={ageGroupChartData}
            />
          </Grid>

          {/* <Grid item xs={12} md={6} lg={4}>
            <AppTopRelated title="Top Related Applications" list={_appRelated} />
          </Grid> */}

          <Grid item xs={12} md={6} lg={4}>
            <AppTopInstalledCountries title="Top Installed Countries" list={_appInstalled} />
          </Grid>

          <Grid item xs={12} md={6} lg={4}>
            <AppTopAuthors title="Top Authors" list={_appAuthors} />
          </Grid>

          <Grid item xs={12} md={6} lg={4}>
            <Stack spacing={3}>
              <AppWidget title="Conversion" total={38566} icon={'eva:person-fill'} chartData={48} />
              <AppWidget title="Applications" total={55566} icon={'eva:email-fill'} color="warning" chartData={75} />
            </Stack>
          </Grid>
        </Grid>
      </Container>
    </Page>
  );
}
