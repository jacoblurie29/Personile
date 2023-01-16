import { TextField } from "@mui/material";
import { useEffect } from "react";
import { useController, UseControllerProps } from "react-hook-form";

interface formProps extends UseControllerProps {
  setNewSubTaskValue: (value: string) => void;
  newSubTaskValue: string;
}

export default function ViewTaskEditSubtaskTextField(props: formProps) {
  // react hook form
  const { fieldState, field } = useController({ ...props, defaultValue: "" });

  return (
    <TextField
      {...field}
      helperText={fieldState.error?.message}
      placeholder="New task..."
      variant="standard"
      size="small"
      fullWidth
      value={props.newSubTaskValue}
      sx={{
        ml: "10px",
        mt: "5px",
        mb: "5px",
        paddingLeft: "5px",
        backgroundColor: "rgba(0,0,0,0.07)",
        borderRadius: "5px",
      }}
      InputProps={{ style: { fontSize: "14px" }, disableUnderline: true }}
      onChange={(event) => props.setNewSubTaskValue(event.target.value)}
    />
  );
}
