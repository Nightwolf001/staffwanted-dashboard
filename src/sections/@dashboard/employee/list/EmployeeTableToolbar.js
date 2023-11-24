import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Stack, InputAdornment, TextField, MenuItem, Slider, Grid, Typography } from '@mui/material';
// components
import Iconify from '../../../../components/Iconify';

// ----------------------------------------------------------------------

EmployeeTableToolbar.propTypes = {
  filterName: PropTypes.string,
  filterRole: PropTypes.string,
  filterJob: PropTypes.string,
  onFilterName: PropTypes.func,
  onFilterRole: PropTypes.func,
  onFilterJob: PropTypes.func,
  optionsRole: PropTypes.arrayOf(PropTypes.string),
  optionsJob: PropTypes.arrayOf(PropTypes.string),
};

export default function EmployeeTableToolbar({ filterName, filterRole, filterJob, filterDistance, filterExperience, filterPreferredHours, onFilterName, onFilterRole, onFilterJob, optionsRole, optionsJob, onFilterDistance, onFilterExperience, onFilterHours, optionsExperience, optionsPreferredHours }) {

  const [searchRadius, setSearchRadius] = useState(`${filterDistance}mi`);
  
  const valuetext = (value) => {
    setSearchRadius(`${value}mi`);
    return `${value} mi`;
  }


  return (
    <Grid container spacing={2} sx={{ py: 2.5, px: 3 }}>

      <Grid item xs={12} md={6}>
        <Stack spacing={2} direction={{ xs: 'column', sm: 'column' }} sx={{ py: 1.5, px: .5 }}>

          <TextField
            fullWidth
            select
            label="employee location based on job"
            value={filterJob}
            onChange={onFilterJob}
            SelectProps={{ MenuProps: { sx: { '& .MuiPaper-root': { maxHeight: 260 } }}}}
            sx={{ textTransform: 'capitalize'}}
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

          <Typography variant="subtitle1" sx={{ color: 'text.secondary'}}>{searchRadius} search radius</Typography>
          <Slider 
            value={filterDistance} 
            // step={10} 
            marks 
            min={1} 
            max={20}
            onChange={onFilterDistance}
            getAriaValueText={valuetext}
            valueLabelDisplay="auto"
          />

        </Stack>
      </Grid>
      <Grid item xs={12} md={6}>
        <Stack spacing={2} direction={{ xs: 'column', sm: 'column' }} sx={{ py: 1.5, px: .5 }}>
          <TextField
            fullWidth
            select
            label="Employee job role"
            value={filterRole}
            onChange={onFilterRole}
            SelectProps={{ MenuProps: { sx: { '& .MuiPaper-root': { maxHeight: 260 } }}}}
            sx={{ textTransform: 'capitalize'}}
          >
            {optionsRole.map((option) => (
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
          <Stack spacing={2} direction={{ xs: 'column', sm: 'row' }} sx={{ py: 1.5, px: .5 }}>
            <TextField
              fullWidth
              select
              label="Employee experience"
              value={filterExperience}
              onChange={onFilterExperience}
              SelectProps={{ MenuProps: { sx: { '& .MuiPaper-root': { maxHeight: 260 } }}}}
              sx={{ textTransform: 'capitalize'}}
            >
              {optionsExperience.map((option) => (
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
            <TextField
              fullWidth
              select
              label="Employee hours"
              value={filterPreferredHours}
              onChange={onFilterHours}
              SelectProps={{ MenuProps: { sx: { '& .MuiPaper-root': { maxHeight: 260 } }}}}
              sx={{ textTransform: 'capitalize'}}
            >
              {optionsPreferredHours.map((option) => (
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
        </Stack>
      </Grid>

      {/* <Grid item xs={12} md={12}>
        <TextField
          fullWidth
          value={filterName}
          onChange={(event) => onFilterName(event.target.value)}
          placeholder="Search user..."
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Iconify icon={'eva:search-fill'} sx={{ color: 'text.disabled', width: 20, height: 20 }} />
              </InputAdornment>
            ),
          }}
        />
      </Grid> */}
      
    </Grid>
  );
}

