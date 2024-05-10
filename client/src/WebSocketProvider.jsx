/* eslint-disable react/prop-types */
// WebSocketProvider.js
import { useEffect, useState } from 'react';
import WebSocketContext from './contexts/WebSocketContext';

const WebSocketProvider = ({ children }) => {
    const [socket, setSocket] = useState(null);
    // Get the domain from the URL

    useEffect(() => {
        const domain = window.location.hostname;
        const protocol = window.location.protocol === 'https:' ? 'wss' : 'ws';
        let hasPort = false;
        if (domain === 'localhost') {
            hasPort = true;
        }

        const port = 3000;
        const newSocket = new WebSocket(`${protocol}://${domain}${hasPort ? `:${port}` : ''}`); // Replace with your WebSocket server URL

        // Event listeners and message handling here
        setSocket(newSocket);

        return () => {
            newSocket.close();
        };
    }, []);

    return (
        <WebSocketContext.Provider value={socket}>
            {children}
        </WebSocketContext.Provider>
    );
};

export default WebSocketProvider;
