import { useEffect, useState } from 'react';
import TeamCard from './TeamCard';
import { useWebSocket } from '../../contexts/WebSocketContext';
import { format } from 'date-fns';


const CurrentSituation = () => {
    const [teams, setTeams] = useState([]);
    const socket = useWebSocket();

    // Function to fetch data from the API
    const fetchData = async () => {
        try {
            // Make a post request to the API
            const res = await fetch('/api/v1/team/fetch', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            // Get the data from the response
            const teams = await res.json();

            // Set the data in the state
            setTeams(teams);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    // Fetch data on component mount and start polling
    useEffect(() => {
        if (socket?.readyState !== 1) return;

        socket.onmessage = (event) => {
            const data = JSON.parse(event.data);

            console.log(data.type);
            if (data.type === 'team') {
                console.log('Updating data');
                fetchData();
            }
        }
    }, [socket, socket?.readyState]);

    return (
        <div className="current-situation select-none teams">
            <div className="m-4">
                <DateAndTime />
                <div>
                    {teams.map((team) => (
                        <div key={team.id}>
                            <TeamCard team={team} />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

const DateAndTime = () => {
    const initialFormatedDate = format(new Date(), "MMM dd, yyyy");
    const initialFormatedTime = format(new Date(), "HH:mm:ss.SSS");
    const initialFormatedDateTime = `${initialFormatedDate} at ${initialFormatedTime}`;
    const [currentDateTime, setCurrentDateTime] = useState(initialFormatedDateTime);

    useEffect(() => {
        const interval = setInterval(() => {
            const currentDate = new Date();
            const formatedDate = format(currentDate, "MMM dd, yyyy");
            const formattedTime = format(currentDate, "HH:mm:ss.SSS");

            const formattedDateTime = `${formatedDate} at ${formattedTime}`;
            setCurrentDateTime(formattedDateTime);
        }, 100);

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="text-center mb-4">
            <p className="text-3xl font-bold text-gray-800">
                {currentDateTime.slice(0, -4)}
                <span className="text-xs relative">{currentDateTime.slice(-4)}</span>
            </p>
        </div>
    );
};

export default CurrentSituation;