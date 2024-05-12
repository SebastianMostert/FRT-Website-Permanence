/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import LoadingPage from "../../pages/ErrorPages/LoadingPage";
import { ChartsLegend, ChartsTooltip, LineChart, PieChart } from "@mui/x-charts";
import { useApiClient } from "../../contexts/ApiContext";
import { Tooltip } from "@mui/material";

/**
 * Availability:
{
  "_id": {
    "$oid": "661cd41bfd9a617037000000"
  },
  "IAM": "mosSe842",
  "startTime": {
    "$date": "2024-04-16T12:00:00.000Z"
  },
  "endTime": {
    "$date": "2024-04-16T16:00:00.000Z"
  },
  "confirmed": false,
  "__v": 0
}
 * Shift:
{
  "_id": {
    "$oid": "6637eba8e96e5ae7ef7b383b"
  },
  "startDate": {
    "$date": "2024-05-15T06:00:00.000Z"
  },
  "endDate": {
    "$date": "2024-05-15T14:00:00.000Z"
  },
  "title": "/",
  "users": [
    {
      "IAM": "stojo687",
      "firstName": "Johann",
      "lastName": "Stobart",
      "position": "Equipier Bin.",
      "_id": {
        "$oid": "6637eba8e96e5ae7ef7b383c"
      }
    },
    {
      "IAM": "nilpo731",
      "firstName": "Pol",
      "lastName": "Nilles",
      "position": "Chef Agres",
      "_id": {
        "$oid": "6637eba8e96e5ae7ef7b383d"
      }
    }
  ],
  "teamID": "662570fe3027e80537493d01",
  "__v": 0
}
 * User:
{
  "_id": {
    "$oid": "661c2e1bad02f80a0e0aff5f"
  },
  "firstName": "Pol",
  "lastName": "Nilles",
  "IAM": "nilpo731",
  "studentClass": "S5DE1",
  "password": "$2a$10$Gta5cRjzrJYZJ48N1ye9kuE1.7byuycVHlr5KQUNZWX6fGVdKaRXO",
  "training": [
    "SAP 1, First Aid Course"
  ],
  "experience": {
    "RTW": 300,
    "FR": 0
  },
  "operationalPosition": "Chef Agres",
  "administratifPosition": "None",
  "email": "nillespol@icloud.com",
  "verified": true,
  "emailVerified": false,
  "onBoarded": false,
  "twoFactorAuth": false,
  "twoFactorAuthSecret": "EFRSYLCCNBWFAVBILN2U6YJ6JVDFE5K5",
  "notifications": {
    "newsletterEmails": true,
    "securityEmails": true,
    "shiftEmails": true,
    "otherEmails": true
  },
  "roles": [
    "admin",
    "member"
  ],
  "createdAt": {
    "$date": "2024-04-14T19:27:23.252Z"
  },
  "updatedAt": {
    "$date": "2024-05-12T20:32:44.749Z"
  },
  "__v": 0,
  "hasPhone": true,
  "hasKey": true
}
 * Team:
{
  "_id": {
    "$oid": "662570fe3027e80537493d01"
  },
  "name": "LLIS FRT 01",
  "status": "6",
  "alerted": false,
  "startDate": {
    "$date": "2024-05-10T12:05:00.000Z"
  },
  "endDate": {
    "$date": "2024-05-13T06:00:00.000Z"
  },
  "members": [],
  "__v": 75
}
 */

const Dashboard = () => {
    const [loading, setLoading] = useState(true);
    const [shifts, setShifts] = useState([]);
    const [users, setUsers] = useState([]);
    const [teams, setTeams] = useState([]);
    const [availabilities, setAvailabilities] = useState([]);
    const [reports, setReports] = useState([]);

    const apiClient = useApiClient();

    useEffect(() => {
        const getData = async () => {
            setLoading(true);
            const shifts = await apiClient.shift.get();
            const users = await apiClient.user.get();
            const availabilities = await apiClient.availability.get();

            setShifts(shifts);
            setUsers(users);
            setAvailabilities(availabilities);
            setLoading(false);
        }

        getData();
    }, [apiClient.availability, apiClient.shift, apiClient.user]);

    return loading ? <div>Loading...</div> : (
        <div>This will later show data for: Shifts, Users, Availabilities, Reports, Teams, etc</div>
    )
}
export default Dashboard;