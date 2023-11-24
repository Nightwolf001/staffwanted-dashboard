import {paramCase} from 'change-case';
import { useCallback, useEffect, useState } from 'react';
import {Link as RouterLink, useNavigate} from 'react-router-dom';
import PropTypes from 'prop-types';
// @mui
import { styled, useTheme } from '@mui/material/styles';
import { TableRow, Grid, Box, Tab, Tabs, Card, Table, Switch, Button, Tooltip, Divider, TableBody, Container, IconButton, TableContainer, TablePagination, FormControlLabel, Typography} from '@mui/material';
// routes
import {PATH_DASHBOARD} from '../../../../routes/paths';
// hooks
import useTabs from '../../../../hooks/useTabs';
import useSettings from '../../../../hooks/useSettings';
import useTable, {getComparator, emptyRows} from '../../../../hooks/useTable';
// utils
import { fDate } from '../../../../utils/formatTime';
import { fCurrency } from '../../../../utils/formatNumber';
// components
import Label from '../../../../components/Label';
import Image from '../../../../components/Image';
import Scrollbar from '../../../../components/Scrollbar';
import LoadingScreen from '../../../../components/LoadingScreen';
import Iconify from '../../../../components/Iconify';
import {TableEmptyRows, TableHeadCustom, TableNoData, TableSelectedActions} from '../../../../components/table';
// sections
import {CandidateTableToolbar, CandidateTableRow} from '../../candidate/list';
import useIsMountedRef from "../../../../hooks/useIsMountedRef";

const _ = require('lodash');

// ----------------------------------------------------------------------

const STATUS_OPTIONS = ['all', 'bookmarked', 'applied'];

const TABLE_HEAD = [
    {id: 'name', label: 'Name', align: 'left'},
    // {id: 'roles', label: 'Roles', align: 'left'},
    {id: 'preferred_hours', label: 'Preferred Hours', align: 'left'},
    {id: 'applied', label: 'Applied', align: 'center'},
    {id: 'application_status', label: 'Application Status', align: 'left'},
    {id: 'available_from', label: 'Available From', align: 'left'},
    {id: 'available_until', label: 'Available Until', align: 'left'},
    {id: ''},
];

// ----------------------------------------------------------------------
// ----------------------------------------------------------------------

const RowResultStyle = styled(TableRow)(({ theme }) => ({
  '& td': {
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(1),
  },
}));

// ----------------------------------------------------------------------

CandidatesDetails.propTypes = {
  job_id: PropTypes.number.isRequired,
  candidates: PropTypes.object.isRequired,
  roles: PropTypes.array.isRequired,
};

export default function CandidatesDetails({ job_id, candidates, roles }) {

  const theme = useTheme();
  const {themeStretch} = useSettings();
  const navigate = useNavigate();

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

  const [tableData, setTableData] = useState(candidates);
  const [filterName, setFilterName] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const [allRoles, setAllRoles] = useState([]);
  const {currentTab: filterStatus, onChangeTab: onChangeFilterStatus} = useTabs('all');

  useEffect(() => {
    (async () => {
      if(roles.length !== 0) {
        roles.unshift('all');
        setAllRoles(roles);
      }
    })();
  }, [roles]);

  const handleFilterName = (filterName) => {
      setFilterName(filterName);
      setPage(0);
  };

  const handleFilterRole = (event) => {
      setFilterRole(event.target.value);
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

  const handleViewRow = (id, job_id) => {
      navigate(PATH_DASHBOARD.job.candidate(id, job_id));
  };

  const dataFiltered = applySortFilter({
      tableData,
      comparator: getComparator(order, orderBy),
      filterName,
      filterRole,
      filterStatus,
  });

  const denseHeight = dense ? 52 : 72;
  const isNotFound = (!dataFiltered.length && !!filterName) || (!dataFiltered.length && !!filterRole) || (!dataFiltered.length && !!filterStatus);

  if(!candidates) return (<LoadingScreen />);
  
  return (
    <>
      <Card>
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
        {allRoles.length !== 0 && (
        <CandidateTableToolbar
            filterName={filterName}
            filterRole={filterRole}
            onFilterName={handleFilterName}
            onFilterRole={handleFilterRole}
            optionsRole={allRoles}
        />
        )}

        <Scrollbar>
            <TableContainer sx={{minWidth: 800, position: 'relative'}}>
                {selected.length > 0 && (
                    <TableSelectedActions
                        dense={dense}
                        numSelected={selected.length}
                        rowCount={tableData.length}
                        onSelectAllRows={(checked) => onSelectAllRows( checked, tableData.map((row) => row.id))}
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
                        onSelectAllRows={(checked) => onSelectAllRows(checked, tableData.map((row) => row.id))}
                    />

                    <TableBody>
                        {dataFiltered.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => (
                            <CandidateTableRow
                                key={row.id}
                                row={row}
                                selected={selected.includes(row.id)}
                                onSelectRow={() => onSelectRow(row.id)}
                                onDeleteRow={() => handleDeleteRow(row.id)}
                                onViewRow={() => handleViewRow(row.attributes.employee.data.id, job_id)}
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
                count={dataFiltered.length}
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
    </>
  );
}

// ----------------------------------------------------------------------

function applySortFilter({tableData, comparator, filterName, filterStatus, filterRole}) {

    console.log('tableData', tableData)

    const stabilizedThis = tableData.map((el, index) => [el, index]);
    console.log('stabilizedThis', stabilizedThis)

    stabilizedThis.sort((a, b) => {
        const order = comparator(a[0], b[0]);
        if (order !== 0) return order;
        return a[1] - b[1];
    });

    tableData = stabilizedThis.map((el) => el[0]);
    console.log('stabilizedThis tableData', tableData)

    if (filterName) {
        tableData = tableData.filter((item) => item.attributes.employee.data.attributes.first_name.toLowerCase().indexOf(filterName.toLowerCase()) !== -1);
    }

    if (filterStatus !== 'all') {
        if(filterStatus === 'bookmarked') {
          tableData = tableData.filter((item) => item.attributes.bookmarked === true);
        }
        if(filterStatus === 'applied') {
          tableData = tableData.filter((item) => item.attributes.applied === true);
        }
    }

    if (filterRole !== 'all') {
        tableData = tableData.filter((item) => (
            _.map(item.attributes.employee.data.attributes.job_roles.data, item => ( item.attributes.role )).includes(filterRole)
        ));
    }

    return tableData;
}
