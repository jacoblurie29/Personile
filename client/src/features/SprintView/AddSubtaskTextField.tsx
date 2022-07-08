import { TextField } from "@mui/material";
import { useController, UseControllerProps } from "react-hook-form";

interface formProps extends UseControllerProps {
}

export default function AddSubtaskTextField(props: formProps) {

    const {fieldState, field} = useController({...props, defaultValue: ''})

    return (
        <TextField {...props} {...field} helperText={fieldState.error?.message} placeholder="New task..." variant="standard" size="small" fullWidth sx={{ ml: "10px", mt: '5px', mb: '5px', paddingLeft: '5px', backgroundColor: 'rgba(0,0,0,0.07)', borderRadius: '5px'}} InputProps={{ style: { fontSize: '14px' }, disableUnderline: true }} />
    )
}