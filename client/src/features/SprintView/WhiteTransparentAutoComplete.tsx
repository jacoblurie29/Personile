import { Autocomplete, Chip, TextField } from "@mui/material";
import { useState } from "react";
import { Controller, useController, UseControllerProps, useForm } from "react-hook-form";

interface formProps extends UseControllerProps {
    label: string
    placeholder: string
}

export default function WhiteTransparentAutoComplete(props: formProps) {

    const {fieldState, field} = useController({...props, defaultValue: [""]})

    return (

        <Autocomplete
            multiple
            id="tags-filled"
            options={[]}
            freeSolo
            onChange={(event, values) => console.log(values)}
            renderTags={(value: string[], getTagProps) =>
            value.map((option: string, index: number) => (
                <Chip
                sx={{backgroundColor: 'white'}}
                variant="outlined"
                label={option}
                {...getTagProps({ index })}
                />
            ))
            }
            renderInput={(params) => (
            <TextField
                {...props}
                {...field}
                error={!!fieldState.error?.message}
                helperText={fieldState.error?.message}
                {...params}
                label={props.label}
                variant="outlined"
                placeholder={props.placeholder}
                color="secondary"
                sx={{
                    "& .MuiInputLabel-root": {color: 'white'},
                    "& .MuiOutlinedInput-root": {
                      "& > fieldset": { borderColor: "white", color: "white" },
                    },
                    "& .MuiOutlinedInput-root.Mui-focused": {
                        "& > fieldset": { borderColor: "white", color: "white" },
                    },
                    "& .MuiOutlinedInput-root:hover": {
                        "& > fieldset": { borderColor: "white", color: "white" },
                    },
                    color: 'white', textArea: {color: 'white'}, input: {color: 'white'}, marginLeft: '10px', borderColor: "white", borderRadius: '5px', marginBottom: '15px'}}
            />
            )}
        />
    )
}