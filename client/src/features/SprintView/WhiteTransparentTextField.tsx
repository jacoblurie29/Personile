import { TextField } from "@mui/material";
import { useController, UseControllerProps } from "react-hook-form";


interface formProps extends UseControllerProps {
    label: string
    lines?: number
    editvalue?: string
}

export default function WhiteTransparentTextFieldprops(props: formProps) {

    const {fieldState, field} = useController({...props, defaultValue: props.editvalue || ""})

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
            id="outlined-size-small"
            size="small" 
            sx={{
                "& .MuiFormHelperText-root":{
                    color: 'grey.500'
                },
                "& .MuiInputLabel-root": { color: 'grey.500' },
                "& .MuiOutlinedInput-root": {
                    "& > fieldset": { borderColor: 'grey.500' },
                },
                "& .MuiOutlinedInput-root:hover": {
                    "& > fieldset": {
                        borderColor: 'primary.main'
                    }
                },
                color: 'grey.800',
                textArea: 
                    {color: 'grey.800'},
                input:
                    {color: 'grey.800'},
                marginLeft: '10px',
                borderColor: 'grey.500',
                borderRadius: '5px',
                marginBottom: '15px'
        }} />
    )
}