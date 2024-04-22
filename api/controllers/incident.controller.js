import WebSocket from 'ws';
import { wss } from '../index.js';
import Incident from '../models/incident.model.js';
import Report from '../models/report.model.js';
import { errorHandler } from '../utils/error.js';
import Team from '../models/team.model.js';

const sendWSUpdate = (type, data) => {
    wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify({ type, data }));
        }
    });
};

// Create Incident
export const createIncident = async (req, res, next) => {
    try {
        let missionNumber;

        const {
            ambulanceCalled,
            incidentInfo,
            location,
            name,
            teamId
        } = req.body;

        // Fetch the team
        const team = await Team.findById(teamId);
        if (!team) {
            next(errorHandler(404, 'Team not found.'));
            return;
        }

        // Only allow it if the status is 1 or 2
        console.log(team.status)
        if (team.status.toString() != "1" && team.status.toString() != "2") {
            next(errorHandler(403, 'Team is not available to call an incident.'));
            return;
        }

        // Get the current date
        const currentDate = new Date();
        const year = currentDate.getFullYear().toString();
        let month = (currentDate.getMonth() + 1).toString(); // Adding 1 because months are zero-based
        let day = currentDate.getDate().toString();
        let missionNumberPrefix = year + month + day;

        // Get the number of incidents on that day
        // TODO: Fix
        const incidents = await Report.find({ missionNumber: { $regex: '^' + missionNumberPrefix } });
        const numberOfIncidents = incidents.length;

        // Create the mission number
        if (numberOfIncidents === 0) {
            missionNumber = missionNumberPrefix + '01';
        } else {
            missionNumber = missionNumberPrefix + (numberOfIncidents + 1).toString();
        }

        // Create the incident
        const incident = new Incident({
            ambulanceCalled,
            incidentInfo,
            location,
            name,
            teamId,
            missionNumber
        });
        await incident.save();

        const firstResponders = [];
        for (let i = 0; i < team.members.length; i++) {
            const member = team.members[i];
            firstResponders.push(member.IAM)
        }

        // Create a report
        const report = new Report({
            missionNumber,
            firstResponders
        });
        await report.save();

        // Update the team
        team.alerted = true;
        team.save();

        res.status(201).json({ message: 'Team created successfully', team });
    } catch (error) {
        console.error(error);
        next(errorHandler(500, 'An error occurred while updating team.'));
    }
};