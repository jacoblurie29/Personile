import { TextField } from "@mui/material"
import { DeepRequired, FieldErrorsImpl, FieldValues, UseFormRegister } from "react-hook-form"

interface Props {
    required: boolean,
    id: string,
    label: string,
    name: string,
    rows?: number,
    register: UseFormRegister<FieldValues>,
    error?: boolean,
    helperText?: string,
    autoFocus: boolean
    
}

export default function NewBoardTextField(formProps: Props) {
    


    return (
        <TextField
            fullWidth 
            margin="normal"
            required = {formProps.required}
            id = {formProps.id}
            label= {formProps.label}
            multiline={formProps.rows !== undefined}
            rows={formProps.rows}
            autoFocus={formProps.autoFocus}
            {...formProps.register(formProps.name, {required: formProps.label + ' is required!'})}
            error={!!formProps.error}
            helperText={formProps.helperText}
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
            borderColor: 'grey.500',
            borderRadius: '5px',
            marginBottom: '15px',
        }}/>
    )
}