import { DatePicker } from '@mui/x-date-pickers';
import { parseISO, isValid } from 'date-fns';
import PropTypes from 'prop-types';
import { Controller, useFormContext } from 'react-hook-form';

RHFDatePicker.propTypes = {
  name: PropTypes.string,
  label: PropTypes.string,
  disabled: PropTypes.bool,
};

export default function RHFDatePicker({ name, label, disabled }) {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field: { onChange, value, ref, ...fieldProps }, fieldState }) => {

        // Determine whether the value is an ISO string or a Date object
        const parsedValue = typeof value === 'string' ? parseISO(value) : value;

        // Adjust the Date object to UTC
        let adjustedValue = null;
        if (isValid(parsedValue)) {
          adjustedValue = new Date(parsedValue.getTime() - parsedValue.getTimezoneOffset() * 60000);
        }

        return (
          <DatePicker
            {...fieldProps}
            onChange={e => {
              onChange(e);
            }}
            value={adjustedValue} 
            slotProps={{
              textField: {
                fullWidth: true,
                variant: 'outlined',
                inputRef: ref,
                label,
                error: Boolean(fieldState.error),
                helperText: fieldState?.error?.message,
                disabled,
              },
            }}
            disabled={disabled}
          />
        );
      }}
    />
  );
}
