import { Box, Card, Grid, Typography, useTheme, ToggleButtonGroup, ToggleButton } from "@mui/material";
import { useAppSelector } from "app/store/configureStore";
import { useState } from "react";

interface Props {
    title : string
    setPage : (page: string) => void
    component: string
}

export default function TopView_LayoutBox({title, setPage, component}: Props) {

    const { currentBoard } = useAppSelector(state => state.sprintView);
    const boards = useAppSelector(state => state.user.userData?.boards);

    const [alignment, setAlignment] = useState<String>("sprint");

    const handleChange = (
        event: React.MouseEvent<HTMLElement>,
        newAlignment: string,
    ) => {
        if(newAlignment !== null)
        {
            console.log(newAlignment);
            setAlignment(newAlignment);
            setPage(newAlignment);
        }
    };

    return (
        <Box margin='10px 10px 0px 0px' sx={{borderRadius: '15px', padding: '10px'}}>
            <Grid container>
                <Grid item lg={8} sm={6}>
                    <Typography variant="h1" sx={{color: 'primary.dark', textAlign: 'left', fontSize:'55px'}}>{title}<Box component='span' sx={{color: 'secondary.light'}}>.</Box></Typography>
                </Grid>
                <Grid item lg={4} sm={6} textAlign='right' margin='auto' paddingRight='20px'>
                    {component === "sprint" && 
                        <ToggleButtonGroup
                            color="primary"
                            value={alignment}
                            onChange={handleChange}
                            sx={{margin: 'auto'}}
                            exclusive
                            >
                            <ToggleButton value="sprint">Sprint View</ToggleButton>
                            <ToggleButton value="summary">Summary View</ToggleButton>
                        </ToggleButtonGroup>
                    }
                </Grid>
            </Grid>
        </Box>
    )
}