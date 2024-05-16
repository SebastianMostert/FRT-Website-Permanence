import WebSocket from 'ws';
import { wss } from '../index.js';
import Incident from '../models/incident.model.js';
import Report from '../models/report.model.js';
import { errorHandler } from '../utils/error.js';
import Team from '../models/team.model.js';
import { logServerError } from '../utils/logger.js';

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
        let missionNumber = await getMissionNumber();

        const {
            ambulanceCalled,
            incidentInfo,
            location,
            teamId,
            urgenceLevel
        } = req.body;

        // Fetch the team
        const team = await Team.findById(teamId);
        if (!team) {
            next(errorHandler(404, 'Team not found.'));
            return;
        }

        // Only allow it if the status is 1 or 2
        if (team.status.toString() != "1" && team.status.toString() != "2") {
            next(errorHandler(403, 'Team is not available to call an incident.'));
            return;
        }

        // Create the incident
        const incident = new Incident({
            ambulanceCalled,
            incidentInfo,
            location,
            teamId,
            missionNumber,
            urgenceLevel
        });
        await incident.save();

        const firstResponders = [];
        for (let i = 0; i < team.members.length; i++) {
            const { IAM, position } = team.members[i];
            firstResponders.push({ position, IAM });
        }

        // Create a report
        const report = new Report({
            missionNumber,
            firstResponders,
            archived: false,
            missionInfo: {
                quickReport: incident.incidentInfo,
                location: incident.location,
                ambulanceCalled: incident.ambulanceCalled,
                urgenceLevel: incident.urgenceLevel
            }
        });
        await report.save();

        // Update the team
        team.alerted = true;
        team.save();

        res.status(201).json(team);
    } catch (error) {
        logServerError(error);
        next(errorHandler(500, 'An error occurred while updating team.'));
    }
};

// Fetch Incident
export const fetchIncident = async (req, res, next) => {
    const id = req.params.id;

    try {
        const incident = await Incident.findById(id);
        if (!incident) {
            next(errorHandler(404, 'Incident not found.'));
        }
        res.status(200).json(incident);
    } catch (error) {
        logServerError(error);
        next(errorHandler(500, 'An error occurred while updating team.'));
    }
};

// Fetch all Incidents
export const fetchAllIncidents = async (req, res, next) => {
    try {
        const incidents = await Incident.find();
        res.status(200).json(incidents);
    } catch (error) {
        logServerError(error);
        next(errorHandler(500, 'An error occurred while fetching incidents.'));
    }
}

async function getMissionNumber() {
    let missionNumber;
    // YYYYMMDD
    // Always has to be 2 characters
    const currentYear = new Date().getFullYear().toString();
    let currentMonth = (new Date().getMonth() + 1).toString();
    if (currentMonth.length === 1) {
        currentMonth = '0' + currentMonth;
    }
    let currentDay = new Date().getDate().toString();
    if (currentDay.length === 1) {
        currentDay = '0' + currentDay;
    }

    const prefix = currentYear + currentMonth + currentDay;

    const incidents = await Incident.find();

    // Now get the number of incidents on that day
    let numberOfIncidents = 0;

    for (let i = 0; i < incidents.length; i++) {
        const incident = incidents[i];
        const missionNumber_ = incident.missionNumber.toString();
        const subStr = missionNumber_.substring(0, 8);
        if (missionNumber_.substring(0, 8) === prefix) {
            numberOfIncidents++;
        }
    }

    if (numberOfIncidents === 0) {
        missionNumber = prefix + '01';
    } else {
        let numberOfIncidents_ = (numberOfIncidents + 1).toString();
        if (numberOfIncidents_.length === 1) {
            numberOfIncidents_ = '0' + (numberOfIncidents + 1).toString();
        }
        missionNumber = prefix + numberOfIncidents_;
    }
    
    // Return the mission number as a number
    return parseInt(missionNumber);
}