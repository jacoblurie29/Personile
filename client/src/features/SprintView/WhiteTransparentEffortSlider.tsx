import { Slider } from "@mui/material";
import { useController, UseControllerProps } from "react-hook-form";

interface formProps extends UseControllerProps {
    editvalue?: string
}

export default function WhiteTransparentEffortSlider(props: formProps) {

    const {field} = useController({...props, defaultValue: props.editvalue || 5 })

    return (
        <Slider
            {...props}
            onChange={(_, value) => {
                field.onChange(value)
            }}
            aria-label="Temperature"
            defaultValue={5}
            valueLabelDisplay="auto"
            step={1}
            marks
            min={1}
            max={10}
            color="secondary"
            sx={{paddingLeft: '5px'}}
        />   
)
}