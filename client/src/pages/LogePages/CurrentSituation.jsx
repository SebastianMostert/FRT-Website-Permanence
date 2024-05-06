import { useEffect, useState } from 'react';
import TeamCard from './TeamCard';

const CurrentSituation = () => {
    const [teams, setTeams] = useState([]);

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

    // Fetch data on component mount and start polling
    useEffect(() => {
        // On mount fetch data
        fetchData();

        // Establish WebSocket connection when the component mounts
        const ws = new WebSocket(`wss://${window.location.hostname}:3000`);// Adjust the URL based on your WebSocket server configuration

        // Listen for 'updateTeams' event from the server
        ws.onmessage = (event) => {
            const { type, data } = JSON.parse(event.data);

            if (type !== 'updateTeams') {
                return;
            }

            const updatedTeam = data;

            const allTeams = [];
            allTeams.push(updatedTeam);
            allTeams.push(...teams);
            
            setTeams(allTeams);
        }

        // Clean up function to close the WebSocket connection when the component unmounts
        return () => {
            ws.close();
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div className="current-situation select-none teams">
            <h1>Work In Progress</h1>
            <div className="m-4">
                {teams.map((team) => (
                    <div key={team.id} className="col">
                        <TeamCard team={team} />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default CurrentSituation;
