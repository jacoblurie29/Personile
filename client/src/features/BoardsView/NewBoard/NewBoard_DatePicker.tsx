import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { TextField } from "@mui/material";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { useState } from "react";
import { DeepRequired, FieldErrorsImpl, FieldValues, useController, UseControllerProps, UseFormRegister } from "react-hook-form";

interface Props {
    disabled: boolean,
    id: string,
    label: string,
    name: string,
    value: string,
    index: number,
    onChange: (index: number, value: string) => void
}
export default function NewBoardDatePicker(formProps: Props) {

    // styles for date picker enabled
    const enabledStyles = { 
        "& .MuiInputLabel-root": {color: 'grey.500'},
        "& .MuiOutlinedInput-root": {
            "& > fieldset": { borderColor: 'grey.500' },
        },
        "& .MuiOutlinedInput-root:hover": {
            "& > fieldset": {
                borderColor: 'primary.main'
            }
        },
        "& .MuiSvgIcon-root": { 
            color: 'grey.500'
        },
        color: 'primary.main',
        textArea: {color: 'grey.800'},
        input: {color: 'grey.800'},
        borderRadius: '5px',
        backgroundColor: 'background.paper'
      };

    // styles for disabled date picker
    const disabledStlyes = {
    color: 'grey.200',
    textArea: {color: 'grey.200'},
    input: {color: 'grey.200'},
    borderRadius: '5px'
    }
    
    
    return (
        <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DatePicker
            disabled={formProps.disabled}
            minDate={Date.parse(new Date().toString())}
            openTo="year"    
            value={formProps.value || new Date().toString()}
            views={['year', 'month', 'day']}
            label="Year, month, and date"
            InputProps={{ sx: {
                "& .MuiOutlinedInput-root": {
                    border: "1px solid grey.500",
                  }
            }}}
            onChange={(newValue) => formProps.onChange(formProps.index, newValue !== null ? new Date(newValue).toString() : new Date().toString())}
            renderInput={(params) => <TextField 
                sx={ formProps.disabled ? {...disabledStlyes} : {...enabledStyles}}
                fullWidth
                {...params}
                label={formProps.label}
                placeholder="(Optional)"
                variant="outlined"
                 />} />
        </LocalizationProvider>
        
    ) 
    

}