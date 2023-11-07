import {useEffect, useState} from "react";
import PropTypes from 'prop-types';
// form
import {useFormContext, Controller} from 'react-hook-form';
// @mui
import {TextField, Autocomplete} from '@mui/material';
import {findLocationPredictions} from "../../api/staffwanted-api";


RHFAddressAutoComplete.propTypes = {
    children: PropTypes.node,
    name: PropTypes.string,
};

export default function RHFAddressAutoComplete({ name, label}) {
    const { control } = useFormContext();

    // console.log('_formValues' ,control._formValues)

    const [inputValue, setInputValue] = useState('');
    const [options, setOptions] = useState([]);

    const getGooglePlacesPredictions = async (search) => {
        const {data} = await findLocationPredictions(search);
        const options = data.map((item) => ({label: item.description, value: item.place_id}));
        setOptions(options);
    };

    useEffect(() => {
        if (inputValue !== '') {
            getGooglePlacesPredictions(inputValue);
        }
    }, [inputValue]);

    return (
        <Controller
            name={name}
            control={control}
            defaultValue={null}
            render={({ field: {ref, ...fieldProps}, fieldState}) => (
                <Autocomplete
                    {...fieldProps}
                    fullWidth
                    options={options}
                    getOptionLabel={(option) => option ? option.label : ""}
                    isOptionEqualToValue={(option, value) =>
                        option.value === value?.value
                    }
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            inputRef={ref}
                            variant="outlined"
                            label={label}
                            error={Boolean(fieldState.error)}
                            helperText={fieldState?.error?.message}
                        />
                    )}
                    onChange={(event, data) => {
                        fieldProps.onChange(data);
                    }}
                    inputValue={inputValue}
                    onInputChange={(event, newInputValue) => {
                        setInputValue(newInputValue);
                    }}
                />
            )}
        />
    );
}
