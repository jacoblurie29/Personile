import { TextField } from "@mui/material";

interface Props {
    lines?: number
    label: string
}

export default function WhiteTransparentTextField({lines, label}: Props) {

    return (
        <TextField multiline={lines != null} rows={lines} fullWidth variant="outlined" label={label} color="secondary" id="outlined-size-small" size="small" 
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
        color: 'white', textArea: {color: 'white'}, input: {color: 'white'}, marginLeft: '10px', borderRadius: '5px', marginBottom: '15px'}} />
    )
}