/* eslint-disable react/prop-types */
import React, { useEffect, useRef, useState } from 'react';
import StatusSquare from './StatusSquare';

const possibleStatus = [1, 2, 3, 4, 5, 6];
const StatusChanger = ({ currentStatus, close, teamID }) => {
    const [status, setStatus] = useState(currentStatus);

    const handleStatusChange = async (newStatus) => {
        setStatus(newStatus);
        await fetch(`/api/v1/team/update-status/${teamID}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ status: newStatus }),
        });

        close();
    };

    const BoxContainer = ({ children }) => {
        const containerRef = useRef(null);
        const [containerSize, setContainerSize] = useState({ width: 'auto', height: 'auto' });

        useEffect(() => {
            if (containerRef.current) {
                const containerRect = containerRef.current.getBoundingClientRect();
                const childrenRect = Array.from(containerRef.current.children).reduce((acc, child) => {
                    const childRect = child.getBoundingClientRect();
                    const size = Math.max(acc.width, childRect.width);
                    return {
                        width: size,
                        height: size,
                    };
                }, { width: 0, height: 0 });

                setContainerSize({
                    width: Math.max(containerRect.width, childrenRect.width),
                    height: Math.max(containerRect.height, childrenRect.height),
                });
            }
        }, [children]);

        // Splitting children into two rows
        const childrenArray = React.Children.toArray(children);
        const firstRowChildren = childrenArray.slice(0, 3);
        const secondRowChildren = childrenArray.slice(3);

        return (
            <div
                ref={containerRef}
                style={{
                    width: containerSize.width === 'auto' ? 'auto' : `${containerSize.width}px`,
                    height: containerSize.height === 'auto' ? 'auto' : `${containerSize.height}px`,
                    border: '2px solid #ccc',
                    borderRadius: '8px',
                    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                    backgroundColor: 'white',
                    boxSizing: 'border-box',
                    display: 'flex',
                    flexDirection: 'column',
                    padding: '4px',
                    justifyContent: 'space-around', // Add space between rows and container edges
                }}
            >
                <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
                    {firstRowChildren}
                </div>
                <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
                    {secondRowChildren}
                </div>
            </div>
        );
    };


    return (
        <BoxContainer>
            {possibleStatus.map((statusValue, index) => (
                <div key={index} onClick={() => handleStatusChange(statusValue)}>
                    <StatusSquare
                        status={statusValue}
                        isActive={status === statusValue}
                        style={{
                            width: '40px',
                            height: '40px',
                            margin: '5px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                    />
                </div>
            ))}
        </BoxContainer>
    );
};

export default StatusChanger;