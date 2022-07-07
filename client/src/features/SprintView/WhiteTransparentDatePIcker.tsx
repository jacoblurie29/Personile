import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { TextField } from "@mui/material";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { useState } from "react";

interface Props {
    disabled: boolean
}

export default function WhiteTransparentDatePicker({disabled}: Props) {

    const [value, setValue] = useState<Date | null>(null);

    if(!disabled) {
    return (
        <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DatePicker
            disabled={disabled}
            openTo="year"
            views={['year', 'month', 'day']}
            label="Year, month and date"
            value={value}
            onChange={(newValue) => {
                setValue(newValue);
            }}
            renderInput={(params) => <TextField color="secondary" fullWidth {...params} label="Due date" placeholder="(Optional)" variant="outlined" helperText={null}
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
            disabled={disabled}
            openTo="year"
            views={['year', 'month', 'day']}
            label="Year, month and date"
            value={value}
            onChange={(newValue) => {
                setValue(newValue);
            }}
            renderInput={(params) => <TextField color="secondary" fullWidth {...params} label="Due date" placeholder="(Optional)" variant="outlined" helperText={null}
            sx={{
            color: 'white', textArea: {color: 'white'}, input: {color: 'white'}, marginLeft: '10px', borderRadius: '5px'}} />} />
            </LocalizationProvider>
        )
    }
    

}