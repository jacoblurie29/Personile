import { Autocomplete, Chip, TextField } from "@mui/material";
import { useController, UseControllerProps } from "react-hook-form";

interface formProps extends UseControllerProps {
    label: string
    placeholder: string
    editvalue?: string[]
}

export default function WhiteTransparentAutoComplete(props: formProps) {

    const {fieldState, field} = useController({...props, defaultValue: props.editvalue || []});


    return (
            <Autocomplete
                multiple 
                id="tags-filled"
                options={[]}
                freeSolo
                defaultValue={props.editvalue !== undefined && props.editvalue[0] !== '' ? [...props.editvalue] : undefined}
                onChange={(_, values) => {field.onChange(values)}}
                renderTags={(value: string[], getTagProps) =>
                value.map((option: string, index: number) => (
                    <Chip
                    sx={{backgroundColor: 'primary.light'}}
                    variant="filled"
                    label={option}
                    {...getTagProps({ index })}
                    />
                ))
                }
                renderInput={(params) => (
                <TextField
                    error={!!fieldState.error?.message}
                    helperText={fieldState.error?.message}
                    {...params}
                    inputProps={{
                        ...params.inputProps,
                        autoComplete: "disabled"
                    }}
                    label={props.label}
                    variant="outlined"
                    placeholder={props.placeholder}
                    sx={{
                        "& .MuiInputLabel-root": {color: 'grey.500'},
                        "& .MuiOutlinedInput-root": {
                        "& > fieldset": { borderColor: 'grey.500' },
                        },
                        "& .MuiOutlinedInput-root:hover": {
                            "& > fieldset": { borderColor: 'primary.main'},
                        },
                        color: 'primary.main', textArea: {color: 'grey.500'}, input: {color: 'grey.500'}, marginLeft: '10px', borderColor: 'grey.500', borderRadius: '5px', marginBottom: '15px'}}
                />
            )}
        />
        )
}
