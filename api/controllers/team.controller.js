import WebSocket from 'ws';
import { wss } from '../index.js';
import Team from '../models/team.model.js';
import User from '../models/user.model.js';
import { errorHandler } from '../utils/error.js';
import Shift from '../models/shift.model.js';

// Set timezone to Central European Summer Time

const sendWSUpdate = () => {
    wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify({ type: 'team' }));
        }
    });
};

// Update User
export const createTeam = async (req, res, next) => {
    try {
        const nameBase = 'LLIS FRT';

        let number = '00';
        const teams = await Team.find();

        const numberOfTeams = teams?.length + 1;
        number = numberOfTeams.toString().padStart(2, '0');

        const team = new Team({
            name: `${nameBase} ${number}`,
            status: 6
        });
        team.save();

        sendWSUpdate();

        res.status(201).json({ message: 'Team created successfully', team });
    } catch (error) {
        console.error(error);
        next(errorHandler(500, 'An error occurred while updating team.'));
    }
};

// Update Members
export const updateTeamMembers = async (req, res, next) => {
    const body = req.body;
    const id = req.params.id;
    let status = 6;
    let members = body.members;

    try {
        // Fetch the user
        const team = await Team.findById(id);
        if (!team) {
            next(errorHandler(404, 'Team not found.'));
            return
        }
        if (members.length > 3) {
            next(errorHandler(400, 'Maximum of 3 members per team'));
            status = 6;
            members = [];
        }
        if (members.length < 2) {
            status = 6;
            members = [];
        }

        await Team.findByIdAndUpdate(id, {
            $set: {
                members,
                status
            },
        });

        const updatedTeam = await Team.findById(id);
        sendWSUpdate();

        res.status(200).json(updatedTeam);
    } catch (error) {
        console.error(error);
        next(errorHandler(500, 'An error occurred while updating team.'));
    }
};

// Update Status
export const updateTeamStatus = async (req, res, next) => {
    const body = req.body;
    const id = req.params.id;
    const status = body.status;

    try {
        if (status > 6) {
            next(errorHandler(400, 'Invalid status'));
            return;
        } else if (status < 1) {
            next(errorHandler(400, 'Invalid status'));
            return;
        }


        await Team.findByIdAndUpdate(id, {
            $set: {
                status
            }
        });

        const updatedTeam = await Team.findById(id);
        sendWSUpdate();

        res.status(200).json(updatedTeam);
    } catch (error) {
        console.error(error);
        next(errorHandler(500, 'An error occurred while updating team.'));
    }
};

// Alert
export const updateAlert = async (req, res, next) => {
    const body = req.body;
    const id = req.params.id;
    const alerted = body.alerted;

    try {
        await Team.findByIdAndUpdate(id, {
            $set: {
                alerted
            }
        });

        const updatedTeam = await Team.findById(id);
        sendWSUpdate();

        res.status(200).json(updatedTeam);
    } catch (error) {
        console.error(error);
        next(errorHandler(500, 'An error occurred while updating team.'));
    }
};

// Fetch Team
export const fetchTeam = async (req, res, next) => {
    const id = req.params.id;
    try {
        const team = await Team.findById(id);
        if (!team) {
            next(errorHandler(404, 'Team not found.'));
        }
        res.status(200).json(team);
    } catch (error) {
        console.error(error);
        next(errorHandler(500, 'An error occurred while fetching team.'));
    }
};

// Fetch Teams
export const fetchTeams = async (req, res, next) => {
    try {
        const teams = await Team.find();
        const currentDate = new Date();

        for (let i = 0; i < teams.length; i++) {
            const team = teams[i];

            // Get the previous shift and the next shift and the current shift
            const previousShift = await Shift.findOne({ teamID: team._id, startDate: { $lt: currentDate } }).sort({ startDate: -1 });
            const nextShift = await Shift.findOne({ teamID: team._id, startDate: { $gt: currentDate } }).sort({ startDate: 1 });
            const currentShift = await Shift.findOne({
                teamID: team._id,
                startDate: { $lte: currentDate }, // Start date is less than or equal to currentDate
                endDate: { $gt: currentDate }     // End date is greater than currentDate
            }).sort({ startDate: 1 });

            if (currentShift) {
                shiftTimeout(currentShift, team._id);
                team.startDate = currentShift.startDate;
                team.endDate = currentShift.endDate;
                team.members = currentShift.users;
                team.status = await getShiftStatus(currentShift, team.status);

                await team.save();
            } else if (previousShift && nextShift) {
                shiftTimeout({ endDate: nextShift.startDate }, -1);

                team.startDate = previousShift.endDate;
                team.endDate = nextShift.startDate;
                team.status = 6;
                team.alerted = false;
                team.members = [];

                await team.save();
            } else {
                const startDate = new Date().setHours(0, 0, 0, 0);
                const endDate = new Date().setHours(0, 0, 0, 0);

                team.startDate = startDate;
                team.endDate = endDate;
                team.status = 6;
                team.alerted = false;
                team.members = [];

                await team.save();
            }
        }

        res.status(200).json(teams);
    } catch (error) {
        console.error(error);
        next(errorHandler(500, 'An error occurred while fetching teams.'));
    }
};

// Delete Team
export const deleteUser = async (req, res, next) => {
    const id = req.params.id;
    try {
        await Team.findByIdAndDelete(id);
        res.status(200).json('Team has been deleted...');
    } catch (error) {
        console.error(error);
        next(errorHandler(500, 'An error occurred while deleting team.'));
    }
};

const timeouts = {};

const shiftTimeout = (currentShift, teamID) => {
    // Clear existing timeout for the team, if any
    if (timeouts[teamID]) {
        clearTimeout(timeouts[teamID]);
    }

    const currentDate = new Date();
    const timeRemaining = currentShift.endDate - currentDate;

    // Check if the current shift has already ended
    if (timeRemaining <= 0) {
        // Shift already ended, no need to set timeout
        return;
    }

    // Set a timeout to update the data after the current shift ends
    timeouts[teamID] = setTimeout(() => {
        // Callback to update the data
        sendWSUpdate();
    }, timeRemaining);
};

const getShiftStatus = async (shift, defaultStatus) => {
    let status = defaultStatus;
    // If there are less than 2 members in the team, set status to 6
    if (shift.users.length < 2) {
        status = 6;
    }

    // Check if each member has a key and a phone
    for (let i = 0; i < shift.users.length; i++) {
        const member = shift.users[i];

        const user = await User.findOne({ IAM: member.IAM });

        if (!user) {
            status = 6;
            break;
        }

        if (!user.hasKey || !user.hasPhone) {
            status = 6;
            break;
        }
    }

    return status;
}