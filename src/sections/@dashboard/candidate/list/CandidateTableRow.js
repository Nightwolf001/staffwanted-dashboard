import PropTypes from 'prop-types';
import { useState } from 'react';
// @mui
import { useTheme } from '@mui/material/styles';
import { Avatar, Checkbox, TableRow, TableCell, Typography, MenuItem } from '@mui/material';
import moment from 'moment';
// utils
import { fDate } from '../../../../utils/formatTime';
// components
import Label from '../../../../components/Label';
import Iconify from '../../../../components/Iconify';
import { TableMoreMenu } from '../../../../components/table';

const _ = require('lodash');
// ----------------------------------------------------------------------

CandidateTableRow.propTypes = {
  row: PropTypes.object,
  selected: PropTypes.bool,
  onViewRow: PropTypes.func,
  onSelectRow: PropTypes.func,
  onDeleteRow: PropTypes.func,
};

export default function CandidateTableRow({ row, selected, onViewRow, onSelectRow, onDeleteRow }) {
  const theme = useTheme();

  const { id, attributes } = row;
  const { application_status, applied } = attributes;
  const { avatar_url, first_name, last_name, boosted, hide_profile, job_roles, preferred_hours, start_date, end_date} = attributes.employee.data.attributes;
  const [openMenu, setOpenMenuActions] = useState(null);

  const handleOpenMenu = (event) => {
    setOpenMenuActions(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setOpenMenuActions(null);
  };
  
  return (
    <TableRow hover selected={selected}>
      <TableCell sx={{ display: 'flex', alignItems: 'center' }}>
        <Avatar alt={first_name} src={avatar_url} sx={{ mr: 2 }} />
        <Typography variant="subtitle2" noWrap>
          {first_name} {last_name}
        </Typography>
      </TableCell>

      <TableCell align="left" sx={{ textTransform: 'capitalize' }}>
        {_.map(preferred_hours.data, item => ( item.attributes.name )).join(', ')}
      </TableCell>

      <TableCell align="center">
        <Iconify
          icon={applied ? 'eva:checkmark-circle-fill' : 'eva:clock-outline'}
          sx={{
            width: 20,
            height: 20,
            color: 'success.main',
            ...(!applied && { color: 'warning.main' }),
          }}
        />
      </TableCell>

      <TableCell align="left">
        <Label
          variant={theme.palette.mode === 'light' ? 'ghost' : 'filled'}
          color={(application_status === 'pending' && 'warning') || (application_status === 'none' && 'error') || 'success'}
          sx={{ textTransform: 'capitalize' }}
        >
          {application_status === 'none' ? 'not applied' : application_status}
        </Label>
      </TableCell>

      <TableCell align="left">
          {console.log('start_date', start_date)}
          {start_date !== 'NULL' ? moment(start_date).format('DD-MM-YYYY') : 'Immediately'}
      </TableCell>

      <TableCell align="left">
        {end_date !== 'NULL' ? moment(end_date).format('DD-MM-YYYY') : 'Unspecified'}
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
                sx={{ color: 'error.main' }}
              >
                <Iconify icon={'eva:trash-2-outline'} />
                Delete
              </MenuItem>
              <MenuItem
                onClick={() => {
                  onViewRow();
                  handleCloseMenu();
                }}
              >
              <Iconify icon={'eva:edit-fill'} />
                View
              </MenuItem>
            </>
          }
        />
      </TableCell>
    </TableRow>
  );
}
