import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';
import { sentenceCase } from 'change-case';
import moment from 'moment';
// @mui
import { useTheme } from '@mui/material/styles';
import { Box, Card, Table, Button, Divider, MenuItem, TableRow, TableBody, TableCell, CardHeader, TableContainer, Typography, Stack} from '@mui/material';
// utils
import { fCurrency } from '../../../../utils/formatNumber';
// components
import Label from '../../../../components/Label';
import Iconify from '../../../../components/Iconify';
import Scrollbar from '../../../../components/Scrollbar';
import { TableMoreMenu, TableHeadCustom } from '../../../../components/table';

// ----------------------------------------------------------------------

ApplicationsNew.propTypes = {
  title: PropTypes.string,
  subheader: PropTypes.string,
  tableData: PropTypes.array.isRequired,
  tableLabels: PropTypes.array.isRequired,
};

export default function ApplicationsNew({ title, subheader, tableData, tableLabels, ...other }) {
  return (
    <Card {...other}>
      <CardHeader title={title} subheader={subheader} sx={{ mb: 3 }} />

      <Scrollbar>
        <TableContainer sx={{ minWidth: 720 }}>
          <Table>
            <TableHeadCustom headLabel={tableLabels} />
            <TableBody>
              {tableData.map((row) => (
                <ApplicationsNewRow key={row.id} row={row} />
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Scrollbar>

      <Divider />

      <Box sx={{ p: 2, textAlign: 'right' }}>
        <Button size="small" color="inherit" endIcon={<Iconify icon={'eva:arrow-ios-forward-fill'} />}>
          View All
        </Button>
      </Box>
    </Card>
  );
}

// ----------------------------------------------------------------------

ApplicationsNewRow.propTypes = {
  row: PropTypes.shape({
    id: PropTypes.string,
  }),
};

function ApplicationsNewRow({ row }) {
  const theme = useTheme();

  const [openMenu, setOpenMenuActions] = useState(null);

  useEffect(() => {
      let dateNow = moment()
      let dateValue = moment(row.createdAt, "YYYY-MM-DD")
      let diffInMonths = dateNow.diff(dateValue, 'months', true)
  }, [row]);

  const handleOpenMenu = (event) => {
    setOpenMenuActions(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setOpenMenuActions(null);
  };

  const handleView = () => {
    handleCloseMenu();
    console.log('VIEW', row.id);
  };

  const handleDelete = () => {
    handleCloseMenu();
    console.log('DELETE', row.id);
  };

  return (
    <TableRow>
      <TableCell>
        <Stack direction="column" alignItems="left">
          <Typography variant="subtitle2">{row.job.title}</Typography>
          <Typography variant="body2">{row.job.location}</Typography>
        </Stack>
        
      </TableCell>

      <TableCell>{row.employee.first_name} {row.employee.last_name}</TableCell>
      <TableCell>{row.employee.location}</TableCell>

      <TableCell align="left">
        <Label variant={theme.palette.mode === 'light' ? 'ghost' : 'filled'} color={(moment(row.createdAt).fromNow().includes("month") && 'error') || moment(row.createdAt).fromNow().includes("week") && 'warning' || moment(row.createdAt).fromNow().includes("days") && 'warning' || 'success'} sx={{ textTransform: 'capitalize' }}>
          {moment(row.createdAt).fromNow()}
        </Label>
      </TableCell>

      <TableCell align="left">
        <Label variant={theme.palette.mode === 'light' ? 'ghost' : 'filled'} color={(row.application_status === 'pending' && 'warning') || (row.application_status === 'none' && 'error') || 'success'} sx={{ textTransform: 'capitalize' }}>
          {row.application_status === 'none' ? 'not applied' : row.application_status}
        </Label>
      </TableCell>
        
      <TableCell align="right">
        <TableMoreMenu
          open={openMenu}
          onOpen={handleOpenMenu}
          onClose={handleCloseMenu}
          actions={
            <>
              <MenuItem onClick={handleView}>
                <Iconify icon={'eva:edit-fill'} />
                View
              </MenuItem>
              <Divider sx={{ borderStyle: 'dashed' }} />
              <MenuItem onClick={handleDelete} sx={{ color: 'error.main' }}>
                <Iconify icon={'eva:trash-2-outline'} />
                Decline
              </MenuItem>
            </>
          }
        />
      </TableCell>
    </TableRow>
  );
}
