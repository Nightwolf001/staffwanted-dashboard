import {paramCase} from 'change-case';
import {useCallback, useEffect, useState} from 'react';
import {Link as RouterLink, useNavigate} from 'react-router-dom';
// @mui
import { Box, Tab, Tabs, Card, Table, Switch, Button, Tooltip, Divider, TableBody, Container, IconButton, TableContainer, TablePagination, FormControlLabel } from '@mui/material';
// api
import { fetchJobRoles, getEmployerJobs, fetchFilteredEmployees, fetchPreviousExperiences, fetchPreferredHours } from '../../api/staffwanted-api';
// redux
import { useSelector } from '../../redux/store';
// routes
import {PATH_DASHBOARD} from '../../routes/paths';
// hooks
import useTabs from '../../hooks/useTabs';
import useSettings from '../../hooks/useSettings';
import useTable, {getComparator, emptyRows} from '../../hooks/useTable';
// _mock_
import {_userList} from '../../_mock';
// components
import Page from '../../components/Page';
import Iconify from '../../components/Iconify';
import Scrollbar from '../../components/Scrollbar';
import HeaderBreadcrumbs from '../../components/HeaderBreadcrumbs';
import {TableEmptyRows, TableHeadCustom, TableNoData, TableSelectedActions} from '../../components/table';
// sections
import {EmployeeTableToolbar, EmployeeTableRow} from '../../sections/@dashboard/employee/list';
import useIsMountedRef from "../../hooks/useIsMountedRef";
import axios from "../../utils/axios";

const _ = require('lodash');

// ----------------------------------------------------------------------

const STATUS_OPTIONS = ['all', 'boosted', 'new'];

const TABLE_HEAD = [
    // {id: ''},
    {id: 'name', label: 'Name', align: 'left'},
    {id: 'role', label: 'Roles', align: 'left'},
    {id: 'experience', label: 'Experience', align: 'left'},
    {id: 'hours', label: 'Preferrd Hours', align: 'left'},
    {id: 'distance', label: 'Distance from job', align: 'left'},
    {id: 'job_application_status', label: 'Status', align: 'left'},
    {id: ''},
];

// ----------------------------------------------------------------------

export default function EmployeeList() {

    const {user} = useSelector((state) => state.user);

    const [tableData, setTableData] = useState([]);

    const [jobOptions, setJobsOptions] = useState([]);
    const [jobRoleOptions, setJobRolesOptions] = useState([]);
    const [experienceOptions, setExperienceOptions] = useState([]);
    const [preferredHoursOptions, setPreferredHoursOptions] = useState([]);

    const [jobsRaw, setJobsRaw] = useState([]);
    const [jobRolesRaw, setJobRolesRaw] = useState([]);
    const [experienceRaw, setExperienceRaw] = useState([]);
    const [preferredHoursRaw, setPreferredHoursRaw] = useState([]);
    
    const [filterJob, setFilterJob] = useState('');
    const [filterName, setFilterName] = useState('');
    const [filterRole, setFilterRole] = useState('all');
    const [filterDistance, setFitlerDistance] = useState(10);
    const [filterExperience, setFilterExperience] = useState('all');
    const [filterPreferredHours, setFilterPreferredHours] = useState('all');
    const [filterLocation, setFilterLocation] = useState({lat: 0, lng: 0});


    useEffect(() => {
        (async () => {

            const {data} = await getEmployerJobs(user.profile_id);
            const jobOptions = _.map(data, item => (item.attributes.title));
            setJobsRaw(data);
            setJobsOptions(jobOptions);

            const roles = await fetchJobRoles();
            const jobRoles = _.map(roles.data, item => (item.attributes.role));
            jobRoles.unshift('all');
            setJobRolesOptions(jobRoles);
            setJobRolesRaw(roles.data);

            const experience = await fetchPreviousExperiences();
            const experienceOptions = _.map(experience.data, item => (item.attributes.name));
            experienceOptions.unshift('all');
            setExperienceOptions(experienceOptions);
            setExperienceRaw(experience.data);

            const preferred_hours = await fetchPreferredHours();
            const preferredHoursOptions = _.map(preferred_hours.data, item => (item.attributes.name));
            preferredHoursOptions.unshift('all');
            setPreferredHoursOptions(preferredHoursOptions);
            setPreferredHoursRaw(preferred_hours.data);

        })();
    }, []);

    const {
        dense,
        page,
        order,
        orderBy,
        rowsPerPage,
        setPage,
        //
        selected,
        setSelected,
        onSelectRow,
        onSelectAllRows,
        //
        onSort,
        onChangeDense,
        onChangePage,
        onChangeRowsPerPage,
    } = useTable();

    const {themeStretch} = useSettings();

    const navigate = useNavigate();

    const {currentTab: filterStatus, onChangeTab: onChangeFilterStatus} = useTabs('all');

    const handleFilterJob = (event) => {
        setFilterJob(event.target.value);
    };

    const handleFilterDistance = (event) => {
        setFitlerDistance(event.target.value);
    };

    const handleFilterRole = (event) => {
        setFilterRole(event.target.value);
    };

    const handleFilterExperience = (event) => {
        setFilterExperience(event.target.value);
        // const selected_role = _.find(jobRolesRaw, item => item?.attributes?.role === event.target.value);
        // setJobRolesSelected(selected_role.id);
    };

    const handleFilterHours = (event) => {
        setFilterPreferredHours(event.target.value);
    };

    const handleFilterName = (filterName) => {
        setFilterName(filterName);
        setPage(0);
    };

    const handleDeleteRow = (id) => {
        const deleteRow = tableData.filter((row) => row.id !== id);
        setSelected([]);
        setTableData(deleteRow);
    };

    const handleDeleteRows = (selected) => {
        const deleteRows = tableData.filter((row) => !selected.includes(row.id));
        setSelected([]);
        setTableData(deleteRows);
    };

    const handleViewRow = (id) => {
        console.log('view', id);
        console.log('id', id);

        navigate(PATH_DASHBOARD.employees.view(id));
    };

    const applySortFilter = async ({tableData, comparator, filterName, filterRole, filterJob, filterExperience, filterPreferredHours, filterDistance, filterLocation, jobsRaw, jobRolesRaw, experienceRaw, preferredHoursRaw, setTableData}) => {

        const stabilizedThis = tableData.map((el, index) => [el, index]);

        stabilizedThis.sort((a, b) => {
            const order = comparator(a[0], b[0]);
            if (order !== 0) return order;
            return a[1] - b[1];
        });

        tableData = stabilizedThis.map((el) => el[0]);

        if (filterName) {
            filterName.toLowerCase();
        }

        if (filterJob && filterJob.length !== 0) {
            filterJob = _.find(jobsRaw, item => item?.attributes?.title === filterJob);
            filterLocation = filterJob?.attributes?.coord;
        }

        console.log('filterRole', filterRole);
        if(filterRole && filterRole !== 'all') {
            filterRole = _.find(jobRolesRaw, item => item?.attributes?.role === filterRole);
            filterRole = filterRole.id;
        } else {
            filterRole = '';
        }
        console.log('filterRole', filterRole);

        if(filterExperience && filterExperience !== 'all') {
            filterExperience = _.find(experienceRaw, item => item?.attributes?.name === filterExperience);
            filterExperience = filterExperience.id;
        } else {
            filterExperience = '';
        }

        if(filterPreferredHours && filterPreferredHours !== 'all') {
            filterPreferredHours = _.find(preferredHoursRaw, item => item?.attributes?.name === filterPreferredHours);
            filterPreferredHours = filterPreferredHours.id;
        } else {
            filterPreferredHours = '';
        }

        const {data} = await fetchFilteredEmployees(filterName, filterRole, filterExperience, filterPreferredHours, filterLocation.lat, filterLocation.lng, filterDistance, 'mi');
        setTableData(data)

    }

    useEffect(() => {
        (async () => {

            await applySortFilter({ tableData, comparator: getComparator(order, orderBy), filterName, filterRole, filterJob, filterExperience, filterPreferredHours, filterDistance, filterLocation, jobsRaw, jobRolesRaw, experienceRaw, preferredHoursRaw, setTableData });

        })();
    }, [filterName, filterRole, filterJob, filterExperience, filterPreferredHours, filterDistance, filterLocation]);

    const denseHeight = dense ? 52 : 72;
    const isNotFound = (!tableData.length && !!filterName) || (!tableData.length && !!filterRole) || !tableData.length && !!filterStatus;

    return (
        <Page title="Employees: List">
            <Container maxWidth={themeStretch ? false : 'lg'}>
                <HeaderBreadcrumbs
                    heading="Employees Search"
                    links={[
                        {name: 'Dashboard', href: PATH_DASHBOARD.root},
                        {name: 'Employees', href: PATH_DASHBOARD.employees.list},
                        {name: 'List'},
                    ]}
                    action={
                        <Button
                            variant="contained"
                            component={RouterLink}
                            to={PATH_DASHBOARD.job.new}
                            startIcon={<Iconify icon={'eva:plus-fill'}/>}
                        >
                            Add New Job
                        </Button>
                    }
                />

                <Card>
                    <Tabs
                        allowScrollButtonsMobile
                        variant="scrollable"
                        scrollButtons="auto"
                        value={filterStatus}
                        onChange={onChangeFilterStatus}
                        sx={{px: 2, bgcolor: 'background.neutral'}}
                    >
                        {STATUS_OPTIONS.map((tab) => (
                            <Tab disableRipple key={tab} label={tab} value={tab}/>
                        ))}
                    </Tabs>

                    <Divider/>

                    <EmployeeTableToolbar
                        filterName={filterName}
                        filterRole={filterRole}
                        filterJob={filterJob}
                        filterExperience={filterExperience}
                        filterPreferredHours={filterPreferredHours}
                        filterDistance={filterDistance}
                        onFilterName={handleFilterName}
                        onFilterRole={handleFilterRole}
                        onFilterJob={handleFilterJob}
                        onFilterDistance={handleFilterDistance}
                        onFilterExperience={handleFilterExperience}
                        onFilterHours={handleFilterHours}
                        optionsExperience={experienceOptions}
                        optionsPreferredHours={preferredHoursOptions}
                        optionsRole={jobRoleOptions}
                        optionsJob={jobOptions}
                    />

                    <Scrollbar>
                        <TableContainer sx={{minWidth: 800, position: 'relative'}}>
                            {selected.length > 0 && (
                                <TableSelectedActions
                                    dense={dense}
                                    numSelected={selected.length}
                                    rowCount={tableData.length}
                                    onSelectAllRows={(checked) => onSelectAllRows( checked,tableData.map((row) => row.id))}
                                    actions={
                                        <Tooltip title="Delete">
                                            <IconButton color="primary" onClick={() => handleDeleteRows(selected)}>
                                                <Iconify icon={'eva:trash-2-outline'}/>
                                            </IconButton>
                                        </Tooltip>
                                    }
                                />
                            )}

                            <Table size={dense ? 'small' : 'medium'}>
                                <TableHeadCustom
                                    order={order}
                                    orderBy={orderBy}
                                    headLabel={TABLE_HEAD}
                                    rowCount={tableData.length}
                                    numSelected={selected.length}
                                    onSort={onSort}
                                    onSelectAllRows={(checked) => onSelectAllRows( checked, tableData.map((row) => row.id))}
                                />

                                <TableBody>
                                    {tableData && tableData.length !==  0 && tableData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => (
                                        <EmployeeTableRow
                                            key={row.id}
                                            row={row}
                                            selected={selected.includes(row.id)}
                                            onSelectRow={() => onSelectRow(row.id)}
                                            onDeleteRow={() => handleDeleteRow(row.id)}
                                            onViewRow={() => handleViewRow(row.id)}
                                        />
                                    ))}

                                    <TableEmptyRows height={denseHeight} emptyRows={emptyRows(page, rowsPerPage, tableData.length)}/>

                                    <TableNoData isNotFound={isNotFound}/>
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Scrollbar>

                    <Box sx={{position: 'relative'}}>
                        <TablePagination
                            rowsPerPageOptions={[5, 10, 25]}
                            component="div"
                            count={tableData.length}
                            rowsPerPage={rowsPerPage}
                            page={page}
                            onPageChange={onChangePage}
                            onRowsPerPageChange={onChangeRowsPerPage}
                        />

                        <FormControlLabel
                            control={<Switch checked={dense} onChange={onChangeDense}/>}
                            label="Dense"
                            sx={{px: 3, py: 1.5, top: 0, position: {md: 'absolute'}}}
                        />
                    </Box>
                </Card>
            </Container>
        </Page>
    );
}

// ----------------------------------------------------------------------

// function applySortFilter({tableData, comparator, filterName, filterRole, filterJob, filterExperience, filterPreferredHours, filterDistance, filterLocation, jobsRaw, jobRolesRaw, experienceRaw, preferredHoursRaw, setTableData}) {

//     (async () => {

//         const stabilizedThis = tableData.map((el, index) => [el, index]);

//         stabilizedThis.sort((a, b) => {
//             const order = comparator(a[0], b[0]);
//             if (order !== 0) return order;
//             return a[1] - b[1];
//         });

//         tableData = stabilizedThis.map((el) => el[0]);
        

//         if (filterName) {
//             filterName.toLowerCase();
//         }

//         if (filterJob && filterJob.length !== 0) {
//             filterJob = _.find(jobsRaw, item => item?.attributes?.title === filterJob);
//             filterLocation = filterJob?.attributes?.coord;
//         }

//         console.log('filterRole', filterRole);
//         if(filterRole && filterRole !== 'all') {
//             filterRole = _.find(jobRolesRaw, item => item?.attributes?.role === filterRole);
//             filterRole = filterRole.id;
//         } else {
//             filterRole = '';
//         }
//         console.log('filterRole', filterRole);

//         if(filterExperience && filterExperience !== 'all') {
//             filterExperience = _.find(filterExperience, item => item?.attributes?.name === filterExperience);
//             filterExperience = filterExperience.id;
//         } else {
//             filterExperience = '';
//         }

//         if(filterPreferredHours && filterPreferredHours !== 'all') {
//             filterPreferredHours = _.find(filterPreferredHours, item => item?.attributes?.name === filterPreferredHours);
//             filterPreferredHours = filterPreferredHours.id;
//         } else {
//             filterPreferredHours = '';
//         }

//         const {data} = await fetchFilteredEmployees(filterName, filterRole, filterExperience, filterPreferredHours, filterLocation.lat, filterLocation.lng, filterDistance, 'mi');
//         tableData = data;
//         setTableData(tableData)
//         return tableData;

//     })();
// }
