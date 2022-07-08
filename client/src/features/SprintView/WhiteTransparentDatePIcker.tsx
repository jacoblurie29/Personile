import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { TextField } from "@mui/material";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { useEffect, useState } from "react";
import { useController, UseControllerProps } from "react-hook-form";

interface formProps extends UseControllerProps {
    disabled: boolean
}
export default function WhiteTransparentDatePicker(props: formProps) {

    const {fieldState, field} = useController({...props, defaultValue: ""});
    const [value, setValue] = useState<Date | null>(null);

    useEffect(() => {
        if(props.disabled) {
            field.onChange(null)
        }
    }, [props.disabled])

    if(!props.disabled) {
    return (
        <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DatePicker
            disabled={props.disabled}
            openTo="year"
            views={['year', 'month', 'day']}
            label="Year, month and date"
            value={value}
            onChange={(newValue) => {
                setValue(newValue);
            }}
            renderInput={(params) => <TextField 
                {...props}
                {...field}
                error={!!fieldState.error}
                helperText={fieldState.error?.message}
                color="secondary" fullWidth {...params} label="Due date" placeholder="(Optional)" variant="outlined"
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
            color: 'white', textArea: {color: 'white'}, input: {color: 'white'}, marginLeft: '10px', borderRadius: '5px'}} />} />
        </LocalizationProvider>
        
    ) } else {
        return (
            <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DatePicker
            value={null}
            disabled={props.disabled}
            openTo="year"
            views={['year', 'month', 'day']}
            label="Year, month and date"
            onChange={(newValue) => {
                setValue(null);
            }}
            renderInput={(params) => <TextField 
                {...props}
                {...field}
                color="secondary"
                fullWidth {...params}
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