import { Alert, AlertTitle, Button, ButtonGroup, Container, List, ListItem, ListItemText, Typography } from "@mui/material";
import { useState } from "react";
import agent from "../../app/api/agent";

export default function SettingsView() {

    const [validationErrors, setValidationErrors] = useState<string[]>([]);

    function getValidationError() {
        agent.TestErrors.getValidationError()
        .catch(error => setValidationErrors(error));
    }

    return (
        <>
            <Typography variant="h1">This is an h1</Typography>
            <Typography variant="h2">This is an h2</Typography>
            <Typography variant="h3">This is an h3</Typography>
            <Typography variant="h4">This is an h4</Typography>
            <Typography variant="h5">This is an h5</Typography>
            <Typography variant="h6">This is an h6</Typography>
            <Typography variant="body1">This is a body1</Typography>
            <Typography variant="body2">This is an body2</Typography>
            <Typography variant="subtitle1">This is a subtitle1</Typography>
            <Typography variant="subtitle2">This is a subtitle2</Typography>
            <Typography variant="button">This is a button</Typography><br />
            <Typography variant="caption">This is a caption</Typography>
        </>

    )
}