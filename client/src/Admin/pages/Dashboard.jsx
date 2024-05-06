import { useEffect, useState } from "react";
import { useApiClient } from "../../ApiContext";
import { BarChart } from '@mui/x-charts/BarChart';

const Dashboard = () => {
    const [shifts, setShifts] = useState([]);
    const [availabilities, setAvailabilities] = useState([]);
    const [loading, setLoading] = useState(true);

    const apiClient = useApiClient();

    useEffect(() => {
        async function fetchData() {
            const shifts = await apiClient.shift.get();
            const availabilities = await apiClient.availability.get();
            setShifts(shifts);
            setAvailabilities(availabilities);
            setLoading(false);
        }

        fetchData(); // Calling the fetchData function
    }, [apiClient.availability, apiClient.shift]); // Dependency array for the useEffect hook

    // Shift:
    // {
    //     "_id": "6637eba8e96e5ae7ef7b383b",
    //     "startDate": "2024-05-15T06:00:00.000Z",
    //     "endDate": "2024-05-15T14:00:00.000Z",
    //     "title": "/",
    //     "users": [
    //         {
    //             "IAM": "stojo687",
    //             "firstName": "Johann",
    //             "lastName": "Stobart",
    //             "position": "Equipier Bin.",
    //             "_id": "6637eba8e96e5ae7ef7b383c"
    //         },
    //         {
    //             "IAM": "nilpo731",
    //             "firstName": "Pol",
    //             "lastName": "Nilles",
    //             "position": "Chef Agres",
    //             "_id": "6637eba8e96e5ae7ef7b383d"
    //         }
    //     ],
    //     "teamID": "662570fe3027e80537493d01",
    //     "__v": 0
    // }

    // Loop through all the shifts and group them by user
    const groupedShifts = shifts.reduce((acc, shift) => {
        shift.users.forEach((user) => {
            const name = `${user.firstName[0].toUpperCase()}. ${user.lastName}`;
            if (!acc[name]) {
                acc[name] = [];
            }
            // Get the total number of hours for each user
            const start = new Date(shift.startDate);
            const end = new Date(shift.endDate);

            const totalHours = (end - start) / (1000 * 60 * 60);

            acc[name].push({ ...shift, totalHours });
        });
        return acc;
    }, {});

    const groupedAvailabilities = availabilities.reduce((acc, availability) => {
        const name = availability.name;
        if (!acc[name]) {
            acc[name] = [];
        }

        // Get the total number of hours for each user
        const start = new Date(availability.startTime);
        const end = new Date(availability.endTime);

        const totalHours = (end - start) / (1000 * 60 * 60);

        acc[name].push({ ...availability, totalHours });
        return acc;
    }, {});

    if (loading) {
        return <div>Loading...</div>
    }


    const dataShifts = Object.keys(groupedShifts).map((key) => ({
        name: key,
        // Get the total number of hours for each user and round it to the nearest integer
        value: Math.round(groupedShifts[key].reduce((acc, shift) => acc + shift.totalHours, 0)),
    }))

    const dataAvailabilities = Object.keys(groupedAvailabilities).map((key) => ({
        name: key,
        // Get the total number of hours for each user and round it to the nearest integer
        value: Math.round(groupedAvailabilities[key].reduce((acc, availability) => acc + availability.totalHours, 0)),
    }))


    return (
        <div>This page will display the dashboard information</div>
    );
}
export default Dashboard