import PropTypes from 'prop-types';
import { useState } from 'react';
// @mui
import { useTheme } from '@mui/material/styles';
import { Avatar, Checkbox, TableRow, TableCell, Typography, MenuItem } from '@mui/material';
// components
import Label from '../../../../components/Label';
import Iconify from '../../../../components/Iconify';
import { TableMoreMenu } from '../../../../components/table';

const _ = require('lodash');

// ----------------------------------------------------------------------

EmployeeTableRow.propTypes = {
  row: PropTypes.object,
  selected: PropTypes.bool,
  onViewRow: PropTypes.func,
  onSelectRow: PropTypes.func,
  onDeleteRow: PropTypes.func,
};

export default function EmployeeTableRow({ row, selected, onViewRow, onSelectRow, onDeleteRow }) {
  const theme = useTheme();

  const { id } = row;
  const { first_name, last_name,  avatar_url, job_roles, experience, preferred_hours, distance_from_job, job_application_status} = row.attributes;

  const [openMenu, setOpenMenuActions] = useState(null);

  const handleOpenMenu = (event) => {
    setOpenMenuActions(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setOpenMenuActions(null);
  };

  return (
    <TableRow hover selected={selected}>
      {/* <TableCell padding="checkbox">
        <Checkbox checked={selected} onClick={onSelectRow} />
      </TableCell> */}

      <TableCell sx={{ display: 'flex', alignItems: 'center' }}>
        <Avatar alt={first_name} src={avatar_url} sx={{ mr: 2 }} />
        <Typography variant="subtitle2" noWrap>
          {first_name} {last_name}
        </Typography>
      </TableCell>

      <TableCell align="left" sx={{ textTransform: 'capitalize' }}>
        {_.map(job_roles, item => ( item.role )).join(', ')}
      </TableCell>

      <TableCell align="left" sx={{ textTransform: 'capitalize' }}>
        {experience.name}
      </TableCell>

      <TableCell align="left" sx={{ textTransform: 'capitalize' }}>
        {_.map(preferred_hours, item => ( item.name )).join(', ')}
      </TableCell>

      <TableCell align="left" sx={{ textTransform: 'capitalize' }}>
        {parseFloat(distance_from_job).toFixed(2)} mi
      </TableCell>


      <TableCell align="left">
        <Label
          variant={theme.palette.mode === 'light' ? 'ghost' : 'filled'}
          color={(job_application_status === 'yes' && 'error') || 'success'}
          sx={{ textTransform: 'capitalize' }}
        >
          {job_application_status || 'Avialable'}
        </Label>
      </TableCell>

      <TableCell align="right">
        <TableMoreMenu
          open={openMenu}
          onOpen={handleOpenMenu}
          onClose={handleCloseMenu}
          actions={
            <>
              <MenuItem
                onClick={() => {
                  onDeleteRow();
                  handleCloseMenu();
                }}
              >
                <Iconify icon={'eva:bookmark-outline'} />
                Shortlist
              </MenuItem>
              <MenuItem
                onClick={() => {
                  onViewRow();
                  handleCloseMenu();
                }}
              >
                <Iconify icon={'eva:edit-fill'} />
                View Profile
              </MenuItem>
            </>
          }
        />
      </TableCell>
    </TableRow>
  );
}
