import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { TextField } from "@mui/material";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { useEffect, useState } from "react";
import { useController, UseControllerProps } from "react-hook-form";

interface formProps extends UseControllerProps {
    disabled: boolean,
    editvalue?: string
}
export default function WhiteTransparentDatePicker(props: formProps) {

    const {fieldState, field} = useController({...props, defaultValue: props.editvalue !== undefined ? new Date(props.editvalue) : ""});

    const [value, setValue] = useState<Date | null>(props.editvalue !== undefined && props.editvalue !== "" ? new Date(props.editvalue) : new Date());


    
    

    if(!props.disabled) {
    return (
        <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DatePicker
            disabled={props.disabled}
            openTo="year"    
            views={['year', 'month', 'day']}
            label="Year, month, and date"
            value={value || null}
            InputProps={{ sx: {
                "& .MuiOutlinedInput-root": {
                    border: "1px solid white",
                  }
            }}}
            onChange={(newValue) => {
                if(newValue !== null) {
                    console.log(newValue)
                    if(newValue !== undefined) {
                        setValue(newValue);
                        field.onChange(newValue);
                    }   
                }
                    
            }}
            renderInput={(params) => <TextField 
                sx={{ 
                    "& .MuiInputLabel-root": {color: 'white'},
                    "& .MuiOutlinedInput-root": {
                        "& > fieldset": { borderColor: "white" },
                    },
                    "& .MuiOutlinedInput-root:hover": {
                        "& > fieldset": {
                            borderColor: "white"
                        }
                    },
                    "& .MuiSvgIcon-root": { 
                        color: 'white'
                    },
                    color: 'white',
                    textArea: {color: 'white'},
                    input: {color: 'white'},
                    marginLeft: '10px',
                    borderRadius: '5px'
                  }}
                {...props}
                helperText={fieldState.error?.message}
                fullWidth
                {...params}
                label="Due date"
                placeholder="(Optional)"
                variant="outlined"
                 />} />
        </LocalizationProvider>
        
    ) } else {
        return (
            <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DatePicker
            value={value || null}
            disabled={props.disabled}
            openTo="year"
            views={['year', 'month', 'day']}
            label="Year, month and date"
            onChange={(newValue) => {
                if(newValue !== null) {
                    console.log(newValue)
                    if(newValue !== undefined) {
                        setValue(newValue);
                        field.onChange(newValue);
                    }   
                }
                    
            }}
            renderInput={(params) => <TextField 
                {...props}
                color="secondary"
                fullWidth
                {...params}
                label="Due date (optional)"
                variant="outlined"
                helperText={null}
                sx={{ 
                    color: 'white',
                    textArea: {color: 'white'},
                    input: {color: 'white'},
                    marginLeft: '10px',
                    borderRadius: '5px'
                  }}
                    />}
                />
            </LocalizationProvider>
        )
    }
    

}