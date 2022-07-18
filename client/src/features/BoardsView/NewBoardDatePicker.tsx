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
    onChange: (index: number, value: string) => void,
    register: UseFormRegister<FieldValues>,
    errors: FieldErrorsImpl<DeepRequired<FieldValues>>
}
export default function NewEditTaskDatePicker(formProps: Props) {

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
            openTo="year"    
            value={formProps.value || new Date().toString()}
            views={['year', 'month', 'day']}
            label="Year, month, and date"
            InputProps={{ sx: {
                "& .MuiOutlinedInput-root": {
                    border: "1px solid grey.500",
                  }
            }}}
            onChange={(newValue) => formProps.onChange(formProps.index, newValue || "")}
            renderInput={(params) => <TextField 
                sx={ formProps.disabled ? {...disabledStlyes} : {...enabledStyles}}
                {...formProps.register(formProps.name, {required: formProps.label + ' is required!'})}
                error={!!formProps.errors.name}
                helperText={formProps.errors?.name?.message?.toString()}
                fullWidth
                {...params}
                label="Due date"
                placeholder="(Optional)"
                variant="outlined"
                 />} />
        </LocalizationProvider>
        
    ) 
    

}