import PropTypes from 'prop-types';
// form
import { useFormContext, Controller } from 'react-hook-form';
// @mui
import { TextField } from '@mui/material';
import {DatePicker} from "@mui/x-date-pickers";

// ----------------------------------------------------------------------

RHFDatePicker.propTypes = {
  name: PropTypes.string,
};

export default function RHFDatePicker({ name, label, disabled}) {
  const { control } = useFormContext();
//   console.log("Disabled: ", disabled)

  return (
      <Controller
          name={name}
          control={control}
          render={({ field: { onChange, value, ref, ...fieldProps }, fieldState }) => (
                <DatePicker
                    sx={{ width: '100%' }}
                    {...fieldProps}
                    onChange={onChange}
                    label={label}
                    value={value}
                    renderInput={(params) => (
                        <TextField
                            inputRef={ref}
                            {...params}
                            variant="outlined"
                            label={label}
                            sx={{ width: '100%' }}
                            error={Boolean(fieldState.error)}
                            helperText={fieldState?.error?.message}
                            disabled={disabled}
                        />
                    )}
                    disabled={disabled}
                />
          )}
      />
  );
}
