import { Select, OutlinedInput, Box, Chip, MenuItem, FormControl, InputLabel, SelectChangeEvent } from "@mui/material";
import { Board } from "app/models/board";
import { useState } from "react";
import { useController, UseControllerProps, useForm } from "react-hook-form";

interface formProps extends UseControllerProps {
    label: string
    placeholder: string
    editvalue?: String
    board: Board
}

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};




export default function NewEditTaskMilestoneSelect(props: formProps) {

    const {fieldState, field} = useController({...props, defaultValue: props.editvalue?.split("|") || []});

    const handleChange = (event: SelectChangeEvent<typeof field.value>) => {
        const {
          target: { value },
        } = event;

        field.onChange(value)

      };


    return (
        <FormControl variant="outlined" fullWidth sx={{ label: { color: 'grey.500' }, 
            "& .MuiOutlinedInput-root:hover": {
                "& > fieldset": { borderColor: 'primary.main'},
            },
            color: 'primary.main', textArea: {color: 'grey.500'}, input: {color: 'grey.500'}, marginLeft: '10px', borderColor: 'grey.500', borderRadius: '5px', marginBottom: '15px'}}
   >
        <InputLabel id="demo-multiple-checkbox-label" key='label'>Milestones</InputLabel>
        <Select
          labelId="demo-multiple-checkbox-label"
          label={"Milestones"}
          id="demo-multiple-checkbox"
          multiple
          multiline={true}
          fullWidth
          onChange={handleChange}
          defaultValue={props.editvalue !== undefined && props.editvalue !== "" ? [...props.editvalue.split("|")] : []}
          error={!!fieldState.error?.message}
          value={field.value[0] !== "" ? field.value : []}
          input={
            <OutlinedInput 
                label="Milestones"
                key="box" />}
            MenuProps={MenuProps}
            renderValue={(selected) => (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
              {field.value[0] !== "" && field.value.map((value: string, index: number) => (
                <Chip
                key={'selectedMilestone' + index}
                sx={{backgroundColor: 'primary.light'}}
                variant="filled"
                label={props.board.milestones.find(m => m.milestoneEntityId == value)?.description}
                />
              ))}
              </Box>
          )}
        >
          {props.board.milestones.map((milestone) => (
                <MenuItem
                key={milestone.milestoneEntityId}
                value={milestone.milestoneEntityId}
            >
            {milestone.description}
          </MenuItem>
          ))}
        </Select>
      </FormControl>
    )
}