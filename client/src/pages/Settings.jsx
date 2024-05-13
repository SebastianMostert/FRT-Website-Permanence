import { useEffect, useState } from "react";
import LanguageSelector from "../components/Inputs/LanguageSelector";
import {
    Container,
    Typography,
    Grid,
    Paper,
    Box,
    Collapse,
    IconButton,
} from "@mui/material";
import { ChromePicker } from 'react-color';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import { useSelector } from "react-redux";
import { useApiClient } from "../contexts/ApiContext";
import { getColors } from "../utils";

const Settings = () => {
    const [eventColors, setEventColors] = useState({});
    const [isExpanded, setIsExpanded] = useState(true);

    const { currentUser } = useSelector((state) => state.user);

    const apiClient = useApiClient();

    useEffect(() => {
        if (currentUser) {
            const fetchData = async () => {
                const colors = await getColors(currentUser.IAM);

                setEventColors(colors);
            }

            fetchData();
        }
    }, [apiClient.user, currentUser]);

    const handleEventColorChange = async (eventName, color) => {
        setEventColors({
            ...eventColors,
            [eventName]: color.hex, // Use hex value of the selected color
        });

        // Set the color
        await fetch('/api/v1/user/update', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                id: currentUser._id,
                eventColors: eventColors
            }),
        });
    };

    const toggleExpansion = () => {
        setIsExpanded(!isExpanded);
    };

    const ColorSelectors = Object.entries(eventColors).map(([eventName, color]) => {
        {/* If applicable, separate the words written in camelCase */ }
        let name = eventName.replace(/([A-Z])/g, " $1").trim();

        {/* Capitalize the first letter of each word */ }
        name = name.charAt(0).toUpperCase() + name.slice(1);

        {/* Add "Event Color" */ }
        name += " Event Color";

        return (
            <Grid item xs={'auto'} md={'auto'} sm={'auto'} key={eventName}>
                <Collapse in={isExpanded}>
                    <Paper elevation={2}>
                        <Box p={2}>
                            <Typography variant="subtitle1" gutterBottom>
                                {name}
                            </Typography>
                            <ChromePicker
                                color={color}
                                onChange={(color) => handleEventColorChange(eventName, color)}
                            />
                        </Box>
                    </Paper>
                </Collapse>
            </Grid>
        )
    });

    return (
        <Container className="select-none">
            <Box mt={4} mb={2}>
                <Typography variant="h4" gutterBottom>
                    Settings [WIP]
                </Typography>
                <Typography variant="subtitle1" gutterBottom>
                    This page is still a work in progress and may not be fully functional. This page might change in the future.
                </Typography>
            </Box>
            <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                    <Paper elevation={2}>
                        <Box p={2}>
                            <LanguageSelector />
                        </Box>
                    </Paper>
                </Grid>
                <Grid item xs={12} sm={12}>
                    <Paper elevation={2}>
                        <Box p={2} display="flex" alignItems="center">
                            <Typography variant="subtitle1" gutterBottom>
                                Event Colors
                            </Typography>
                            <IconButton onClick={toggleExpansion}>
                                {isExpanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                            </IconButton>
                        </Box>
                    </Paper>
                </Grid>
                {ColorSelectors}
            </Grid>
        </Container>
    );
};

export default Settings;
