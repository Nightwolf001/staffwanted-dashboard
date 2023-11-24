import PropTypes from 'prop-types';
import { useState } from 'react';
// @mui
import { useTheme } from '@mui/material/styles';
import { Avatar, Checkbox, TableRow, TableCell, Typography, MenuItem, Stack } from '@mui/material';
import moment from 'moment';
// utils
import { fDate } from '../../../../utils/formatTime';
// components
import Label from '../../../../components/Label';
import Iconify from '../../../../components/Iconify';
import { TableMoreMenu } from '../../../../components/table';

const _ = require('lodash');
// ----------------------------------------------------------------------

ApplicantsTableRow.propTypes = {
  row: PropTypes.object,
  selected: PropTypes.bool,
  onViewRow: PropTypes.func,
  onSelectRow: PropTypes.func,
  onDeleteRow: PropTypes.func,
};

export default function ApplicantsTableRow({ row, selected, onViewRow, onSelectRow, onDeleteRow }) {
  const theme = useTheme();

  const { id, attributes } = row;
  const { avatar_url, first_name, last_name, location, email, phone_number, start_date, end_date, current_employment_status } = attributes;
  console.log('attributes', attributes);
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
        <Stack direction="column" alignItems="left">
          <Typography variant="subtitle2">{first_name} {last_name}</Typography>
          <Typography variant="body2">{location}</Typography>
        </Stack>
      </TableCell>


      <TableCell align="left">
        {current_employment_status}
      </TableCell>

      <TableCell align="left">
          {phone_number}
      </TableCell>

      <TableCell align="left">
          {start_date ? moment(start_date).format('DD-MM-YYYY') : 'Immediately'}
      </TableCell>

      <TableCell align="left">
          {end_date ? moment(end_date).format('DD-MM-YYYY') : 'Unspecified'}
      </TableCell>

    </TableRow>
  );
}
