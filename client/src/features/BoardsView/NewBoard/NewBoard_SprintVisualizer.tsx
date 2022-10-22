import { Grid, Typography } from "@mui/material"
import { useState } from "react";

interface Props {
    overflowOption: string,
    sprintLength: number,
    totalLength: number
}

export default function SprintVisualizer({overflowOption, sprintLength, totalLength}: Props) {

    // calculated constants
    const numberOfSprints = Math.ceil(totalLength / sprintLength);
    
    // calculated predicted sprint lengths
    const calculateSprintValues = (sprintNum: number) => {
        var sprintLengthArray = [] as number[];
        for(var i = 0; i < sprintNum; i++) {
            if(overflowOption == "start" && i == 0) {
                sprintLengthArray[i] = sprintLength + (totalLength % sprintLength);
            } else if (overflowOption == "end" && i == sprintNum - 1) {
                
                sprintLengthArray[i] = sprintLength + (totalLength % sprintLength);
            } else {
                sprintLengthArray[i] = sprintLength;
            }
        }
        return sprintLengthArray;
    }

    const calculatedPredictionBorders = (index: number, max: number) => {
        if(index == 0) {
            return "5px 0px 0px 5px";
        } else if(index == max) {
            return "0px 5px 5px 0px";
        } else {
            return "0px";
        }
    }

    return (
        <>
            <Grid container display={'flex'} justifyContent={'center'}>
                {calculateSprintValues(numberOfSprints).map((value, index) => (
                    (index == 0 || index == 1 || index == calculateSprintValues(numberOfSprints).length - 1 || index == calculateSprintValues(numberOfSprints).length - 2) &&
                        (<Grid item sx={{padding: '5px 10px', width: '100px', marginRight: '2px', textAlign: 'center'}}>
                            <Typography variant="subtitle2">{'Sprint #' + (index + 1)}</Typography>
                        </Grid>) || 
                    (index == 2 && index < calculateSprintValues(numberOfSprints).length - 2) && 
                        (<Grid item sx={{padding: '5px 10px', width: '50px', marginRight: '2px', textAlign: 'center'}}>
                            <Typography variant="subtitle2">{''}</Typography>
                        </Grid>)
                ))}
            </Grid>
            <Grid container display={'flex'} justifyContent={'center'}>
            {calculateSprintValues(numberOfSprints).map((value,index) => (
                (index == 0 || index == 1 || index == calculateSprintValues(numberOfSprints).length - 1 || index == calculateSprintValues(numberOfSprints).length - 2) &&
                    (<Grid item sx={{padding: '10px 10px', width: '100px', marginRight: '2px', backgroundColor: 'primary.light', textAlign: 'center', borderRadius: calculatedPredictionBorders(index, numberOfSprints - 1)}}>
                    <Typography variant="h5">{value + ' days'}</Typography>
                    </Grid>)|| 
                    (index == 2 && index < calculateSprintValues(numberOfSprints).length - 2) && 
                    (<Grid item sx={{padding: '5px 10px', width: '50px', marginRight: '2px', textAlign: 'center'}}>
                        <Typography variant="h5">{'. . .'}</Typography>
                    </Grid>)
            ))}
            {/* USE STATE VARIABLE TO MAKE SURE ONLY ONE ... PRINTS, THEN DO BORDERS AND ABSTRACT THE STYLES */}
            </Grid>
        </>
    )
}