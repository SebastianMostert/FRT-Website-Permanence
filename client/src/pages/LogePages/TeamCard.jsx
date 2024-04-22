/* eslint-disable react/prop-types */
import { useState, useEffect, useRef } from 'react';
import { Card, Badge } from 'react-bootstrap';

const MemberSection = ({ member, position }) => {
    return (
        <div style={{ display: 'inline-block', marginRight: '20px', flexShrink: 0 }}>
            <div className='font-thin'>{position}</div>
            {member ? (
                <>
                    <div className='font-semibold'>
                        {member.firstName.charAt(0)}. {member.lastName}
                    </div>
                    <div className='font-thin'>{member.IAM}</div>
                </>
            ) : (
                <>
                    <div className='font-semibold'>
                        N/A
                    </div>
                </>
            )}
        </div>
    );
};

const TimeSlot = ({ startTime, endTime }) => {
    return (
        <span style={{ marginLeft: '10px', fontWeight: 'lighter' }}>{startTime} - {endTime}</span>
    );
};

const StatusSquare = ({ status, alerted }) => {
    const squareSize = '40px'; // Adjust the size as needed

    let statusText;
    let statusVariant;
    let statusDescription;

    switch (status.toString()) {
        case "1":
            statusText = alerted ? '1c' : '1';
            statusVariant = alerted ? 'warning' : 'secondary';
            statusDescription = 'On the way back from incident';
            break;
        case "2":
            statusText = alerted ? '2c' : '2';
            statusVariant = alerted ? 'warning' : 'secondary';
            statusDescription = 'On call';
            break;
        case "3":
            statusText = '3';
            statusVariant = 'warning';
            statusDescription = 'On the way to incident';
            break;
        case "4":
            statusText = '4';
            statusVariant = 'warning';
            statusDescription = 'At the incident';
            break;
        case "5":
            statusText = '5';
            statusVariant = 'danger';
            statusDescription = 'Request to speak';
            break;
        case "6":
            statusText = '6';
            statusVariant = 'danger';
            statusDescription = 'Unavailable';
            break;
        default:
            statusText = '';
            statusVariant = 'light';
            statusDescription = '';
    }

    return (
        <div style={{ display: 'flex', alignItems: 'center', textAlign: 'center' }}>
            <Badge
                bg={statusVariant}
                style={{
                    width: squareSize,
                    height: squareSize,
                    marginRight: '10px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}
            >
                {statusText}
                <span className="sr-only">{statusDescription}</span>
            </Badge>
        </div>
    );
};

const Members = ({ members }) => {
    // Ensure that there are always three members
    const displayedMembers = members.slice(0, 3); // Take up to three members

    // Define the positions in the specified order
    const positions = ['Chef Agres', 'Equipier Bin.', 'Stagiaire Bin.'];

    // Create an array with the member or 'N/A' for each position
    const renderedMembers = positions.map(position => {
        const member = displayedMembers.find(member => member.position === position);
        return member ?
            <MemberSection key={member.id} member={member} position={position} />
            : <MemberSection key={position} member={null} position={position} />;
    });

    return (
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            {renderedMembers}
        </div>
    );
};

const Title = ({ title }) => {
    const titleSize = '25px';
    return (
        <div style={{ fontSize: titleSize, fontWeight: 'bold' }}>{title}</div>
    );
};

const LeftSide = ({ title, startTime, endTime, status, setLeftSideWidth, alerted }) => {
    const leftSideRef = useRef(null);

    useEffect(() => {
        if (leftSideRef.current) {
            const width = leftSideRef.current.offsetWidth;
            setLeftSideWidth(width);
        }
    }, [setLeftSideWidth]);

    return (
        <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', flexShrink: 0 }} ref={leftSideRef}>
            <StatusSquare status={status} alerted={alerted} />
            <Title title={title} />
            <TimeSlot startTime={startTime} endTime={endTime} />
        </div>
    );
};

const RightSide = ({ members, containerWidth, leftSideWidth }) => {
    const margin = 50; // Adjust as needed
    const minMemberSectionWidth = 3 * (130); // Width of each MemberSection (150px) + margin (20px)

    const hasEnoughSpace = containerWidth - leftSideWidth - margin > minMemberSectionWidth;

    if (!hasEnoughSpace) {
        return null; // Hide the right side if there isn't enough space
    }

    return (
        <div style={{ flexGrow: 1 }}>
            <Members members={members} />
        </div>
    );
};

const TeamCard = ({ team }) => {
    const { name, members, status, alerted, startDate, endDate } = team;
    const [leftSideWidth, setLeftSideWidth] = useState(0);
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

    // Calculate the total width of the LeftSide component and the desired margin
    const margin = 50; // Adjust as needed

    return (
        <Card>
            <Card.Body ref={cardBodyRef}> {/* Ref to get the width of the card body */}
                <div className='flex items-center align-middle' >
                    <LeftSide
                        title={name}
                        startTime={new Date(startDate).toLocaleTimeString('en-US', { hour12: false, timeStyle: 'short' })}
                        endTime={new Date(endDate).toLocaleTimeString('en-US', { hour12: false, timeStyle: 'short' })}
                        status={members.length < 2 ? 6 : status}
                        setLeftSideWidth={setLeftSideWidth}
                        alerted={alerted}
                    />
                    {/* Add some space between the left and right sides */}
                    <div style={{ marginLeft: `${margin}px` }} />
                    <RightSide
                        members={members}
                        containerWidth={containerWidth}
                        leftSideWidth={leftSideWidth}
                    />
                </div>
            </Card.Body>
        </Card>
    );
};

export default TeamCard;
