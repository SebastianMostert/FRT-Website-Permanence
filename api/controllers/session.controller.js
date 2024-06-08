import Session from "../models/session.model.js";
import User from "../models/user.model.js";
import { logHTTPRequest, logServerError, logUserAction, logUserError } from "../utils/logger.js";

// Fetch all sessions based on a user
export const fetchSessions = async (req, res, next) => {
    const { userID } = req.params;
    const ip = req.ip;
    logHTTPRequest(`/session/fetch/${userID}`, ip);

    try {
        // Fetch the sessions based on the user ID
        const sessions = await Session.find({ userId: userID });

        // Fetch the user based on the user ID
        const user = await User.findById(userID);

        // Check if there are no sessions
        if (!sessions) {
            logUserError({
                message: 'No sessions found',
                errorCode: 404,
                IP: ip,
            });
            return res.status(404).json({ error: 'No sessions found' });
        }

        res.status(201).json({ sessions });
        const message = 'Sessions fetched successfully';
        logUserAction({
            IP: ip,
            IAM: user.IAM,
            userID,
            message,
        });
    } catch (error) {
        logServerError(error.message);
        res.status(500).json({ error });
        next(error);
    }
};

// Delete a session
export const deleteSession = async (req, res, next) => {
    const ip = req.ip;
    const { id } = req.params;
    logHTTPRequest(`/session/delete/${id}`, ip);

    try {
        await Session.findByIdAndDelete(id);

        const message = 'Session deleted successfully';
        logUserAction({
            IP: ip,
            message,
        });
        res.status(201).json({ message });
    } catch (error) {
        logServerError(error.message);
        res.status(500).json({ error });
        next(error);
    }
}