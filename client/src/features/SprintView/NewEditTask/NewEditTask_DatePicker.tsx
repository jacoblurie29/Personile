import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { TextField } from "@mui/material";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { useState } from "react";
import { useController, UseControllerProps } from "react-hook-form";

interface formProps extends UseControllerProps {
    disabled: boolean,
    editvalue?: string
}
export default function NewEditTaskDatePicker(props: formProps) {

    // react hook form
    const {fieldState, field} = useController({...props, defaultValue: props.editvalue !== undefined ? new Date(props.editvalue) : ""});

    // state values (date selected)
    const [value, setValue] = useState<Date | null>(props.editvalue !== undefined && props.editvalue !== "" ? new Date(props.editvalue) : new Date());
    
    // styles when switch is enabled
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
        input: {color: 'grey.800', backgroundColor: 'background.paper'},
        marginLeft: '10px',
        borderRadius: '5px',
      };

      // styles when switch is disabled
      const disabledStlyes = {
        color: 'grey.200',
        textArea: {color: 'grey.200'},
        input: {color: 'grey.200'},
        marginLeft: '10px',
        borderRadius: '5px',
        
      }
    
    
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
                    border: "1px solid grey.500",
                  }
            }}}
            onChange={(newValue) => {
                if(newValue !== null) {
                    if(newValue !== undefined) {
                        setValue(newValue);
                        field.onChange(newValue);
                    }   
                }
                    
            }}
            renderInput={(params) => <TextField 
                sx={ props.disabled ? {...disabledStlyes} : {...enabledStyles}}
                {...props}
                helperText={fieldState.error?.message}
                fullWidth
                {...params}
                label="Due date"
                placeholder="(Optional)"
                 />} />
        </LocalizationProvider>
        
    ) 
    

}