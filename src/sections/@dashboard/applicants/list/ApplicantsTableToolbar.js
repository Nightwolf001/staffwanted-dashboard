import PropTypes from 'prop-types';
import { Stack, InputAdornment, TextField, MenuItem } from '@mui/material';
// components
import Iconify from '../../../../components/Iconify';

// ----------------------------------------------------------------------

ApplicantsTableToolbar.propTypes = {
  filterName: PropTypes.string,
  filterJob: PropTypes.string,
  onFilterName: PropTypes.func,
  onFilterJob: PropTypes.func,
  optionsJob: PropTypes.arrayOf(PropTypes.string),
};

export default function ApplicantsTableToolbar({ filterName, filterJob, onFilterName, onFilterJob, optionsJob }) {
  return (
    <Stack spacing={2} direction={{ xs: 'column', sm: 'row' }} sx={{ py: 2.5, px: 3 }}>
      <TextField
        fullWidth
        select
        label="Jobs"
        value={filterJob}
        onChange={onFilterJob}
        SelectProps={{
          MenuProps: {
            sx: { '& .MuiPaper-root': { maxHeight: 260 } },
          },
        }}
        sx={{
          textTransform: 'capitalize',
        }}
      >
        {optionsJob.map((option) => (
          <MenuItem
            key={option}
            value={option}
            sx={{
              mx: 1,
              my: 0.5,
              borderRadius: 0.75,
              typography: 'body2',
              textTransform: 'capitalize',
            }}
          >
            {option}
          </MenuItem>
        ))}
      </TextField>

    </Stack>
  );
}
