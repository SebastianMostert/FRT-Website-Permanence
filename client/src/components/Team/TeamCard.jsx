/* eslint-disable react/prop-types */
import { useState, useEffect, useRef } from 'react';
import { Card } from 'react-bootstrap';
import StatusSquare from '../../components/StatusSquare';
import StatusChanger from '../../components/StatusChanger';

// Define the fixed sizes for left, middle, and right sides
const LEFT_SIDE_WIDTH = 400; // Fixed width for LeftSide
const RIGHT_SIDE_WIDTH = 400; // Fixed width for RightSide
const MIDDLE_SIDE_WIDTH = 89; // Fixed width for MiddleSide
const MARGIN = 50; // Margin between sides
const TIME_MARGIN = -100; // Margin between time slots
const TITLE_SIZE = 25; // Font size for title

const LeftSide = ({ title, status, setLeftSideWidth, alerted, teamID }) => {
    const [showStatusChanger, setShowStatusChanger] = useState(false);
    const leftSideRef = useRef(null);
    const statusChangerRef = useRef(null);

    useEffect(() => {
        if (leftSideRef.current) {
            const width = leftSideRef.current.offsetWidth;
            setLeftSideWidth(width);
        }
    }, [setLeftSideWidth]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                statusChangerRef.current &&
                !statusChangerRef.current.contains(event.target) &&
                !leftSideRef.current.contains(event.target)
            ) {
                setShowStatusChanger(false);
            }
        };

        if (showStatusChanger) {
            document.addEventListener('mousedown', handleClickOutside);
        } else {
            document.removeEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [showStatusChanger]);

    return (
        <div
            style={{ position: 'relative', display: 'flex', flexDirection: 'row', alignItems: 'center', flexShrink: 0, width: LEFT_SIDE_WIDTH }}
            ref={leftSideRef}
        >
            {/* Render the StatusSquare */}
            <StatusSquare status={status} alerted={alerted} onClick={() => setShowStatusChanger(!showStatusChanger)} size={40} />

            {/* Render the Title */}
            <div style={{ fontSize: TITLE_SIZE, fontWeight: 'bold', whiteSpace: 'normal', wordWrap: 'break-word' }}>{title}</div>
            {/* Render the StatusChanger component as an overlay */}
            {showStatusChanger && (
                <div style={{ position: 'absolute', top: '100%', left: 0, zIndex: 9999 }} ref={statusChangerRef}>
                    <StatusChanger currentStatus={status} close={() => setShowStatusChanger(false)} teamID={teamID} />
                </div>
            )}
        </div>
    );
};

const RightSide = ({ team, containerWidth, leftSideWidth, middleSideWidth }) => {
    const hasEnoughSpace = containerWidth - leftSideWidth - middleSideWidth - (2 * MARGIN) > RIGHT_SIDE_WIDTH;
    const members = team.members;

    if (!hasEnoughSpace) return null; // Hide the right side if there isn't enough space

    // Define the positions in the specified order
    const positions = team.memberPositions;
    const renderedRows = [];
    const length = Math.max(Math.ceil(positions.length / 3) * 3, positions.length);

    // Define constant width and height for member divs
    const memberWidth = 90;
    const memberHeight = 70;

    // Define positions per row
    const positionsPerRow = 3;

    // Group members into rows of 3
    for (let i = 0; i < length; i += positionsPerRow) {
        const rowMembers = [];

        for (let j = 0; j < positionsPerRow; j++) {
            const positionIndex = i + j;
            const position = positions[positionIndex];
            const member = members.find(member => member.position === position);

            rowMembers.push(
                <div key={positionIndex} style={{ display: 'inline-block', marginRight: '20px', flexShrink: 0, width: memberWidth, height: memberHeight }}>
                    {position && (
                        <>
                            <div className='font-thin' style={{ marginBottom: '5px' }}>{position}</div>
                            {member ? (
                                <div>
                                    <div className='font-semibold'>
                                        {member.firstName.charAt(0)}. {member.lastName}
                                    </div>
                                    <div className='font-thin'>{member.IAM}</div>
                                </div>
                            ) : (
                                <div className='font-semibold'>
                                    N/A
                                </div>
                            )}
                        </>
                    )}
                </div>
            );
        }

        renderedRows.push(
            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                {rowMembers}
            </div>
        );
    }

    return (
        <div style={{ flexGrow: 1, width: RIGHT_SIDE_WIDTH }}>
            {renderedRows}
        </div>
    );
};

const TeamCard = ({ team }) => {
    const { name, status, alerted, startDate, endDate, _id } = team;
    const [leftSideWidth, setLeftSideWidth] = useState(LEFT_SIDE_WIDTH);
    const [_status, setStatus] = useState(status);
    const [containerWidth, setContainerWidth] = useState(0);

    const cardBodyRef = useRef(null);

    useEffect(() => {
        const handleResize = () => {
            if (cardBodyRef.current) {
                setContainerWidth(cardBodyRef.current.offsetWidth);
            }
        };

        window.addEventListener('resize', handleResize);
        handleResize(); // Call once to set initial value

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    useEffect(() => {
        setStatus(status);
    }, [status]); // Add dependencies to useEffect


    return (
        <Card>
            <Card.Body ref={cardBodyRef}> {/* Ref to get the width of the card body */}
                <div className='flex items-center align-middle' style={{ flexWrap: 'wrap' }}>
                    <LeftSide
                        title={name}
                        status={_status}
                        setLeftSideWidth={setLeftSideWidth}
                        alerted={alerted}
                        teamID={_id}
                    />
                    {/* Add some space between the sides */}
                    <div style={{ marginLeft: `${TIME_MARGIN}px` }} />
                    <div style={{ textAlign: 'center', width: MIDDLE_SIDE_WIDTH }}>
                        <div style={{ fontWeight: 'lighter' }}>{new Date(startDate).toLocaleTimeString('en-US', { hour12: false, timeStyle: 'short' })} - {new Date(endDate).toLocaleTimeString('en-US', { hour12: false, timeStyle: 'short' })}</div>
                    </div>
                    {/* Add some space between the sides */}
                    <div style={{ marginLeft: `${MARGIN}px` }} />
                    <RightSide
                        team={team}
                        containerWidth={containerWidth}
                        leftSideWidth={leftSideWidth}
                        middleSideWidth={MIDDLE_SIDE_WIDTH}
                    />
                </div>
            </Card.Body>
        </Card>
    );
};

export default TeamCard;