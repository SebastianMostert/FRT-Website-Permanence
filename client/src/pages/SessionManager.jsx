/* eslint-disable react/prop-types */
import { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useDispatch, useSelector } from 'react-redux';

import { Container, Row, Col, Card } from 'react-bootstrap';
import { CardContent, Typography, CardActions, Button, Box } from '@mui/material';
import { Computer, PhoneAndroid, TabletAndroid } from '@mui/icons-material';
import { useApiClient } from '../contexts/ApiContext';
import { signOut } from '../redux/user/userSlice';

const SessionManager = () => {
    const [sessions, setSessions] = useState([]);

    const { currentUser } = useSelector((state) => state.user);
    const userId = currentUser._id; // Replace with actual user IDconst { currentUser } = useSelector((state) => state.user);
    const dispatch = useDispatch();
    const apiClient = useApiClient();

    // Function to validate token
    const validateToken = async () => {
        await apiClient.auth.validate().catch((error) => {
            console.error(error);
            handleSignOut();
        })
    };

    const handleSignOut = async () => {
        try {
            await apiClient.auth.signout();
            dispatch(signOut());

            // Get the current 
            // Go to home page
            window.location.href = `/sign-in?redirect=${window.location.pathname}`;
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        fetchSessions();
    }, []);

    const fetchSessions = async () => {
        try {
            const response = await axios.post(`/api/v1/session/fetch/${userId}`);
            setSessions(response.data.sessions);
        } catch (error) {
            toast.error('Failed to fetch sessions');
        }
    };

    const handleLogout = async (sessionId) => {
        try {
            await axios.delete(`/api/v1/session/delete/${sessionId}`);
            setSessions(sessions.filter(session => session._id !== sessionId));
            toast.success('Session terminated successfully');

            validateToken();
        } catch (error) {
            toast.error('Failed to terminate session');
        }
    };


    return (
        <Container className="mt-4">
            <h1 className="mb-4">Manage Your Sessions</h1>
            <Row>
                {sessions.map(session => <SessionCard key={session._id} session={session} onLogout={handleLogout} />)}
            </Row>
        </Container>
    );
};

const SessionCard = ({ session, onLogout }) => {
    const { deviceInfo } = session;
    const { os, os_version, browser, is_mobile, is_tablet } = deviceInfo;
    const deviceStr = `${os} ${os_version}, ${browser}`;
    const icon = is_mobile ? <PhoneAndroid /> : is_tablet ? <TabletAndroid /> : <Computer />;

    // Style for the card content
    const iconStyle = {
        width: '60px', // Increase the size of the icon circle
        height: '60px',
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f0f0f0',
        marginRight: '16px'
    };

    const contentStyle = {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-start', // Align items to the start to keep the icon on the left
        textAlign: 'left',
    };

    const textContainerStyle = {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start' // Align text to the left
    };

    return (
        <Col md={6} lg={4} key={session._id} className="mb-4">
            <Card>
                <CardContent style={contentStyle}>
                    <Box style={iconStyle}>
                        {icon}
                    </Box>
                    <Box style={textContainerStyle}>
                        <Typography variant="h6" component="div">
                            {deviceStr}
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                            {session.location[0].city}, {session.location[0].country}
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                            Last Active: {new Date(session.lastActive).toLocaleString()}
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                            Expires at: {new Date(session.expiresAt).toLocaleString()}
                        </Typography>
                    </Box>
                </CardContent>
                <CardActions>
                    <Box style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
                        <Button variant="contained" color="error" onClick={() => onLogout(session._id)}>
                            Logout
                        </Button>
                    </Box>
                </CardActions>
            </Card>
        </Col>
    );
};

export default SessionManager;