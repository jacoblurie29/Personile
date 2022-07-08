import { TextField } from "@mui/material";
import { useController, UseControllerProps } from "react-hook-form";


interface formProps extends UseControllerProps {
    label: string
    lines?: number
}

export default function WhiteTransparentTextFieldprops(props: formProps) {

    const {fieldState, field} = useController({...props, defaultValue: ''})

    return (
        <TextField 
            {...props}
            {...field}
            helperText={fieldState.error?.message}
            multiline={props.lines != null} 
            rows={props.lines}
            fullWidth
            variant="outlined"
            label={props.label}
            color="secondary"
            id="outlined-size-small"
            size="small" 
            sx={{
                "& .MuiFormHelperText-root":{
                    color: "white"
                },
                "& .MuiInputLabel-root": {color: 'white'},
                "& .MuiOutlinedInput-root": {
                    "& > fieldset": { borderColor: "white" },
                },
                "& .MuiOutlinedInput-root:hover": {
                    "& > fieldset": {
                        borderColor: "white"
                    }
                },
                color: 'white',
                textArea: 
                    {color: 'white'},
                input:
                    {color: 'white'},
                marginLeft: '10px',
                borderRadius: '5px',
                marginBottom: '15px'
        }} />
    )
}