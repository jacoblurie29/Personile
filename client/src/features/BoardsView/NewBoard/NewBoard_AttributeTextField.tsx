import { TextField } from "@mui/material";
import {
  DeepRequired,
  FieldErrorsImpl,
  FieldValues,
  UseFormRegister,
} from "react-hook-form";

interface Props {
  value: string;
  id: string;
  label: string;
  name: string;
  index: number;
  onChange: (index: number, value: string) => void;
  error?: boolean;
  helperText?: string;
}

export default function NewBoardAttributeTextField(formProps: Props) {
  const textFieldStyles = {
    "& .MuiFormHelperText-root": {
      color: "grey.500",
    },
    "& .MuiInputLabel-root": { color: "grey.500" },
    "& .MuiOutlinedInput-root": {
      "& > fieldset": { borderColor: "grey.500" },
    },
    "& .MuiOutlinedInput-root:hover": {
      "& > fieldset": {
        borderColor: "primary.main",
      },
    },
    color: "grey.800",
    textArea: { color: "grey.800" },
    input: { color: "grey.800" },
    borderColor: "grey.500",
    borderRadius: "5px",
    backgroundColor: "background.paper",
  };

  return (
    <TextField
      fullWidth
      value={formProps.value || ""}
      id={formProps.id}
      label={formProps.label}
      required={true}
      name={formProps.name}
      onChange={(event) => {
        formProps.onChange(formProps.index, event.target.value);
      }}
      error={!!formProps.error}
      helperText={formProps.helperText}
      sx={textFieldStyles}
    />
  );
}
