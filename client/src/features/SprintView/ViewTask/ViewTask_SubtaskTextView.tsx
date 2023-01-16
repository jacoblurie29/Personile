import { TextField } from "@mui/material";
import { useController, UseControllerProps } from "react-hook-form";

interface formProps extends UseControllerProps {
  setEditSubTaskValue: (value: string) => void;
  editSubTaskValue: string;
}

export default function ViewTaskSubtaskTextView(props: formProps) {
  // redux state
  const { fieldState, field } = useController({ ...props, defaultValue: "" });

  // styles
  const textFieldStyles = {
    ml: "10px",
    mt: "5px",
    mb: "5px",
    paddingLeft: "5px",
    backgroundColor: "rgba(0,0,0,0.07)",
    borderRadius: "5px",
  };

  return (
    <TextField
      {...field}
      helperText={fieldState.error?.message}
      placeholder="New task..."
      variant="standard"
      size="small"
      fullWidth
      value={props.editSubTaskValue}
      sx={textFieldStyles}
      InputProps={{ style: { fontSize: "14px" }, disableUnderline: true }}
      onChange={(event) => props.setEditSubTaskValue(event.target.value)}
    />
  );
}
