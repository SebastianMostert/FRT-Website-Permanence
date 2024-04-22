import WebSocket from 'ws';
import { wss } from '../index.js';
import Team from '../models/team.model.js';
import { errorHandler } from '../utils/error.js';

const sendWSUpdate = (type, data) => {
    wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify({ type, data }));
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

        sendWSUpdate('updateTeams', team);

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
            status = 6;
            members = [];
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
        sendWSUpdate('updateTeams', updatedTeam);

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
        sendWSUpdate('updateTeams', updatedTeam);

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
        sendWSUpdate('updateTeams', updatedTeam);

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
        await User.findByIdAndDelete(id);
        res.status(200).json('Team has been deleted...');
    } catch (error) {
        console.error(error);
        next(errorHandler(500, 'An error occurred while deleting team.'));
    }
};