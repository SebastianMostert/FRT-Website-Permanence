import { useEffect, useState } from 'react';
import TeamCard from './TeamCard';
import { useWebSocket } from '../../contexts/WebSocketContext';
import DateAndTime from '../../components/DateAndTime';

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

            if (data.type === 'team') fetchData();
        }
    }, [socket, socket?.readyState]);

    return (
        <div className="current-situation select-none teams">
            <div className="m-4">
                <div className="flex justify-center mb-3">
                    <DateAndTime />
                </div>
                <div>
                    {teams.map((team) => (
                        <div key={team._id} className="mb-4">
                            <TeamCard team={team} />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default CurrentSituation;