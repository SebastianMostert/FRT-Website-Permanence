import { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { LoadingPage } from '../ErrorPages';
import { Card, Container, Badge } from 'react-bootstrap';
import StatusChanger from '../../components/StatusChanger';
import StatusSquare from '../../components/StatusSquare';
import { Timeline as MuiTimeline, TimelineItem, TimelineSeparator, TimelineDot, TimelineConnector, TimelineContent, TimelineOppositeContent } from '@mui/lab';
import { Typography, useMediaQuery, Box } from '@mui/material';
import { PhoneCallback, RingVolume, Place, DoneAll, CheckCircleOutline } from '@mui/icons-material';
import { FaWalkieTalkie } from "react-icons/fa6";
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { useWebSocket } from '../../contexts/WebSocketContext';

const SingleOperation = () => {
    const { t } = useTranslation();
    const socket = useWebSocket();

    const { missionNumber } = useParams();
    const [mission, setMission] = useState(null);
    const [team, setTeam] = useState(null);
    const [loading, setLoading] = useState(true);
    const [resolved, setResolved] = useState(false);

    const fetchData = async () => {
        try {
            const res = await fetch(`/api/v1/report/fetch/${missionNumber}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            const missionData = await res.json();
            if (!missionData) return window.location.href = '/operations';

            const res2 = await fetch(`/api/v1/team/fetch/${missionData.firstResponders.teamID}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            const teamData = await res2.json();

            if (!teamData) return window.location.href = '/operations';

            setTeam(teamData);
            setResolved(missionData.resolved);
            setMission(missionData.missionInfo);
        } catch (error) {
            // Redirect to /operations if error occurs
            window.location.href = '/operations';
        } finally {
            setLoading(false);
        }
    }


    useEffect(() => {
        fetchData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Fetch data on component mount and start polling
    useEffect(() => {
        if (socket?.readyState !== 1) return;

        socket.onmessage = (event) => {
            const data = JSON.parse(event.data);

            if (data.type === 'team') fetchData();
            if (data.type === 'report') fetchData();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [socket, socket?.readyState]);

    if (loading) return <LoadingPage />;

    const urgenceLevel = mission.urgenceLevel;

    const isResolved = resolved;

    return (
        <div className='select-none'>
            {isResolved && (
                <Box
                    sx={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        backgroundColor: 'rgba(0, 0, 0, 0.5)',
                        zIndex: 1,
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        color: 'white'
                    }}
                >
                    <CheckCircleOutline sx={{ fontSize: 80, marginRight: 2 }} />
                    <Typography variant="h4" component="div">
                        Mission Resolved
                    </Typography>
                </Box>
            )}
            <Container className='select-none p-2'>
                <Typography variant="h4" className="my-4 text-center">
                    Operation <strong>#{missionNumber}</strong> Details
                </Typography>
                <TeamCard team={team} />
                <Card className="mb-4">
                    <Card.Body className="text-center">
                        <Card.Title>Mission Information</Card.Title>
                        <Card.Text><strong>Location:</strong> {mission.location}</Card.Text>
                        <Card.Text>
                            <Badge bg="danger">U{urgenceLevel}</Badge> - {t(`emergency_level.${urgenceLevel}`)}
                        </Card.Text>
                        <Card.Text className="d-flex justify-content-center align-items-center">
                            <div style={{ flex: 1, textAlign: 'right', paddingRight: '10px' }}>
                                <strong>Ambulance Called:</strong> {mission.ambulanceCalled ? 'Yes' : 'No'}
                            </div>
                            <div className="vr" style={{ margin: '0 10px', width: '2px', backgroundColor: 'black' }}></div>
                            <div style={{ flex: 1, textAlign: 'left', paddingLeft: '10px' }}>
                                <strong>Sepas Contacted:</strong> {mission.SepasContacted ? 'Yes' : 'No'}
                            </div>
                        </Card.Text>
                        <Timeline mission={mission} />
                    </Card.Body>
                </Card>
            </Container>
        </div>
    );
};

const Timeline = ({ mission }) => {
    const times = [
        { label: 'Call Time', description: 'The time the call was dispatched', icon: <RingVolume />, time: mission.callTime },
        { label: 'Response Time', description: 'The time the team responded', icon: <PhoneCallback />, time: mission.responseTime },
        { label: 'On Site Time', description: 'The time the team arrived on site', icon: <Place />, time: mission.onSiteTime },
        { label: 'Finished Time', description: 'The time the mission was finished', icon: <DoneAll />, time: mission.finishedTime },
        { label: 'Free On Radio', description: 'The time the team was free on radio', icon: <FaWalkieTalkie size={24} />, time: mission.freeOnRadio },
    ];

    const isSmallScreen = useMediaQuery('(max-width:600px)');
    const position = isSmallScreen ? 'right' : 'alternate';

    return (
        <MuiTimeline position={position}>
            {times.map((timeObj, index) => (
                <TimelineItem key={index}>
                    <TimelineOppositeContent
                        sx={{ m: 'auto 0' }}
                        align="right"
                        variant="body2"
                        color="text.secondary"
                    >
                        {timeObj.time ? timeObj.time : 'N/A'}
                    </TimelineOppositeContent>
                    <TimelineSeparator>
                        <TimelineConnector />
                        <TimelineDot color={timeObj.time ? "primary" : "grey"}>
                            {timeObj.icon}
                        </TimelineDot>
                        <TimelineConnector />
                    </TimelineSeparator>
                    <TimelineContent sx={{ py: '12px', px: 2 }}>
                        <Typography variant="h6" component="span">
                            {timeObj.label}
                        </Typography>
                        <Typography>{timeObj.description}</Typography>
                    </TimelineContent>
                </TimelineItem>
            ))}
        </MuiTimeline >
    );
}

const TeamCard = ({ team }) => {
    const [showStatusChanger, setShowStatusChanger] = useState(false);
    const statusChangerRef = useRef(null);
    const assignedMembers = team.members;
    const status = team.status;

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (statusChangerRef.current && !statusChangerRef.current.contains(event.target)) {
                setShowStatusChanger(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [statusChangerRef]);

    return (
        <Card className="shadow-sm mb-3">
            <Card.Body>
                <div className="d-flex justify-content-between align-items-center">
                    <div className="d-flex align-items-center">
                        <div className="me-2" onClick={() => setShowStatusChanger(true)}>
                            <StatusSquare status={status} />
                        </div>
                        <h4 className="fw-bold mb-1">{team.name}</h4>
                    </div>
                    <div className="ms-3 d-none d-md-block">{assignedMembers.length} Members</div>
                    {showStatusChanger && (
                        <div ref={statusChangerRef} style={{ position: 'absolute', top: '100%', left: 0, zIndex: 9999 }}>
                            <StatusChanger currentStatus={status} close={() => setShowStatusChanger(false)} teamID={team._id} />
                        </div>
                    )}
                </div>
            </Card.Body>
        </Card>
    );
};

Timeline.propTypes = {
    mission: PropTypes.object.isRequired,
};

TeamCard.propTypes = {
    team: PropTypes.object.isRequired,
};

export default SingleOperation;
