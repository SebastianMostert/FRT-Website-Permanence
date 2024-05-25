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
            <div onClick={() => setShowStatusChanger(!showStatusChanger)}>
                <StatusSquare status={status} alerted={alerted} />
            </div>
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

const RightSide = ({ members, containerWidth, leftSideWidth, middleSideWidth }) => {
    const hasEnoughSpace = containerWidth - leftSideWidth - middleSideWidth - (2 * MARGIN) > RIGHT_SIDE_WIDTH;

    if (!hasEnoughSpace) {
        return null; // Hide the right side if there isn't enough space
    }

    // Ensure that there are always three members
    const displayedMembers = members.slice(0, 3); // Take up to three members

    // Define the positions in the specified order
    const positions = ['Chef Agres', 'Equipier Bin.', 'Stagiaire Bin.'];

    // Create an array with the member or 'N/A' for each position
    const renderedMembers = positions.map(position => {
        const member = displayedMembers.find(member => member.position === position);
        return (
            <div key={position} style={{ display: 'inline-block', marginRight: '20px', flexShrink: 0 }}>
                <div className='font-thin'>{position}</div>
                {member ? (
                    <>
                        <div className='font-semibold'>
                            {member.firstName.charAt(0)}. {member.lastName}
                        </div>
                        <div className='font-thin'>{member.IAM}</div>
                    </>
                ) : (
                    <div className='font-semibold'>
                        N/A
                    </div>
                )}
            </div>
        )
    });

    return (
        <div style={{ flexGrow: 1, width: RIGHT_SIDE_WIDTH }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                {renderedMembers}
            </div>
        </div>
    );
};

const TeamCard = ({ team }) => {
    const { name, members, status, alerted, startDate, endDate, _id } = team;
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
        const fetchPromises = [];

        if (members.length < 2) setStatus(6);

        for (let i = 0; i < members.length; i++) {
            const member = members[i];

            // Push each fetch promise into the array
            fetchPromises.push(
                fetch(`/api/v1/user/fetch/${member.IAM}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                }).then(async (res) => {
                    const data = await res.json();
                    const user = data._doc;

                    // Check if user has phone and key
                    if (!user?.hasPhone || !user?.hasKey) {
                        throw new Error('User does not have phone or key');
                    }
                }).catch(() => {
                    // Handle errors if any
                    setStatus(6);
                })
            );
        }

        // Wait for all promises to resolve
        Promise.all(fetchPromises).then(() => {
            // Handle any actions after all fetches resolve successfully
        }).catch(error => {
            // Handle errors if any of the fetch requests fail
            console.error(error);
            setStatus(6);
        });
    }, [members, status]); // Add dependencies to useEffect

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
                        members={members}
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
