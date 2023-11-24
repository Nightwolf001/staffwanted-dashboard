import {paramCase} from 'change-case';
import {useCallback, useEffect, useState} from 'react';
import {Link as RouterLink, useNavigate} from 'react-router-dom';
// @mui
import { useTheme } from '@mui/material/styles';
import { Stack, Box, Tab, Tabs, Card, Table, Switch, Button, Tooltip, Divider, TableBody, Container, IconButton, TableContainer, TablePagination, FormControlLabel, Grid, Typography, Avatar } from '@mui/material';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';
import ChatIcon from '@mui/icons-material/Forum';
import CloudDownloadIcon from '@mui/icons-material/CloudDownload';

// api
import { getEmployerJobs, getApplicantsByJobs } from '../../api/staffwanted-api';
// redux
import { useDispatch, useSelector } from '../../redux/store';
// routes
import {PATH_DASHBOARD} from '../../routes/paths';
// hooks
import useTabs from '../../hooks/useTabs';
import useSettings from '../../hooks/useSettings';
import useTable, {getComparator, emptyRows} from '../../hooks/useTable';
// components
import Page from '../../components/Page';
import Iconify from '../../components/Iconify';
import Scrollbar from '../../components/Scrollbar';
import LoadingScreen from '../../components/LoadingScreen';
import HeaderBreadcrumbs from '../../components/HeaderBreadcrumbs';
import {TableEmptyRows, TableHeadCustom, TableNoData, TableSelectedActions} from '../../components/table';
// sections
import {ApplicantsTableToolbar, ApplicantsTableRow} from '../../sections/@dashboard/applicants/list';
import useIsMountedRef from "../../hooks/useIsMountedRef";

const _ = require('lodash');

// ----------------------------------------------------------------------
const STATUS_OPTIONS = ['all', 'none', 'pending', 'reviewing', 'approved', 'declined'];

const TABLE_HEAD = [
    { id: 'applicant', label: 'Applicant' },
    { id: 'status', label: 'Availabiltity' },
    { id: 'location', label: 'Applicant Location' },
    { id: 'applied', label: 'Applicant Applied' },
    { id: 'status', label: 'Application Status' },
    { id: '', label: 'Actions' }, 
];

// ----------------------------------------------------------------------

export default function ApplicantsList() {

    const theme = useTheme();
    const {themeStretch} = useSettings();
    const navigate = useNavigate();
    const { dense, page, order, orderBy, rowsPerPage, setPage, selected, setSelected, onSelectRow, onSelectAllRows, onSort, onChangeDense, onChangePage,onChangeRowsPerPage} = useTable();

    const {user} = useSelector((state) => state.user);

    const [candidates, setCandidates] = useState([]);
    const [tableData, setTableData] = useState([]);
    const [filterName, setFilterName] = useState('');
    const [filterJob, setFilterJob] = useState('all');
    const [allRoles, setAllRoles] = useState([]);

    const [rawJobs, setRawJobs] = useState([]);
    const [optionsJobs, setOptionsJob] = useState([]);
    const [applicants, setApplicants] = useState([]);

    const {currentTab: filterStatus, onChangeTab: onChangeFilterStatus} = useTabs('all');

    useEffect(() => {
        (async () => {
        
        if(filterStatus !== 'all') {
            const result = _.filter(applicants, item => _.find(item.attributes.employee_job_matches, match => match.application_status === filterStatus ));
            setTableData(result);
        } else {
            await getJobs();
        }

        })();
    }, [filterStatus]);

    const getJobs = async () => {

        const jobs = await getEmployerJobs(user.profile_id);

        const job_ids = _.map(jobs.data, item => (item.id));
        await filterApplicants(job_ids);

        const jobOptions = _.map(jobs.data, item => (item.attributes.title));
        jobOptions.unshift('all');
        setOptionsJob(jobOptions);
        setRawJobs(jobs.data)

    }

    const filterApplicants = async (ids) => {
            const applicants = await getApplicantsByJobs(ids);
            setApplicants(applicants.data);
            setTableData(applicants.data);
            console.log('applicants', applicants.data);
    };

    const handleFilterJob = async (event) => {
        setFilterJob(event.target.value);
        let job_ids = [];
        if(event.target.value !== 'all') {
            const job = _.find(rawJobs, item => item?.attributes?.title === event.target.value);
            job_ids.push(job.id);
        } else {
            job_ids = _.map(rawJobs, item => (item.id));
        }

        await filterApplicants(job_ids);
    };

    const denseHeight = dense ? 52 : 72;
    const isNotFound = (!tableData.length && !!filterJob) ;

    if(!candidates) return (<LoadingScreen />);
    
    return (
        <Page title="Applicants: List">
            <Container maxWidth={themeStretch ? false : 'lg'}>
                <HeaderBreadcrumbs
                    heading="Applicants List"
                    links={[
                        {name: 'Dashboard', href: PATH_DASHBOARD.root},
                        { name: 'Applicants', href: PATH_DASHBOARD.applicants.list},
                        {name: 'List'},
                    ]}
                />
                <Card sx={{mb: 3}}> 
                    <Tabs
                        allowScrollButtonsMobile
                        variant="scrollable"
                        scrollButtons="auto"
                        value={filterStatus}
                        onChange={onChangeFilterStatus}
                        sx={{px: 2, bgcolor: 'background.neutral'}}
                    >
                        {STATUS_OPTIONS.map((tab) => (<Tab disableRipple key={tab} label={tab} value={tab}/>))}
                    </Tabs>

                    <Divider/>
                    {optionsJobs.length !== 0 && (
                    <ApplicantsTableToolbar
                        filterJob={filterJob}
                        onFilterJob={handleFilterJob}
                        optionsJob={optionsJobs}
                    />
                    )}
                </Card>
                
                <Grid container spacing={2}>
                    {tableData.map((row) => (
                        <Grid item xs={4}>
                            <Card>
                                <Stack spacing={2.5} sx={{ p: 3 }}>
                                    <Stack direction="row" alignItems="center" spacing={2} sx={{mb: -10}}>
                                        <Avatar sx={{ width: 70, height: 70, mr: 1 }} alt={row.attributes.first_name} src={row.attributes.avatar_url} />
                                        <div>
                                            <Typography variant="subtitle2">{row.attributes.first_name} {row.attributes.last_name}</Typography>
                                            <Typography variant="caption" sx={{ color: 'text.disabled', mt: 0.5, display: 'block' }}>
                                                {_.map(row.attributes.job_roles, item => (item.role)).join(', ')}
                                            </Typography>
                                        </div>
                                    </Stack>
                                    <Stack direction="row" alignItems="center" spacing={1} sx={{mt: '0!important'}}>
                                        <Box sx={{ width: 72, mr: 1}} />
                                        <IconButton variant="contained" color={'primary'} sx={{ backgroundColor: "" }}>
                                            <PhoneIcon size={'small'} />
                                        </IconButton>
                                        <IconButton variant="contained" color={'primary'} sx={{ backgroundColor: "" }}>
                                            <EmailIcon size={'small'} />
                                        </IconButton>
                                        <IconButton variant="contained" color={'primary'} sx={{ backgroundColor: "" }}>
                                            <ChatIcon size={'small'} />
                                        </IconButton>
                                        <IconButton variant="contained" color={'primary'} sx={{ backgroundColor: "" }}>
                                            <CloudDownloadIcon size={'small'} />
                                        </IconButton>
                                    </Stack>
                                </Stack>
                            </Card>
                        </Grid>
                    ))}
                </Grid>

            </Container>
        </Page>
    );
}

// ----------------------------------------------------------------------