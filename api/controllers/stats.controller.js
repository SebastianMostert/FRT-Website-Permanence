import User from "../models/user.model.js";
import Report from "../models/report.model.js";

export const fetchUserCount = async (req, res, next) => {
    const { roles } = req.body;

    try {
        // Get all the users where the role is in the roles array
        const users = await User.find();
        let count = 0;

        // Loop through each user and check if their role is in the roles array
        users.forEach(user => {
            const userRoles = user.roles;

            // The userRoles must contain all the roles in the roles array but may contain more roles
            if (roles.every(role => userRoles.includes(role))) {
                count++;
            }
        });


        res.status(200).json({ count });
    } catch (error) {
        logServerError(error.message);
        next(errorHandler(500, 'An error occurred while fetching user.'));
    }
}

export const fetchCasesCount = async (req, res, next) => {
    try {
        const reports = await Report.find();
        res.status(200).json({ count: reports.length });
    } catch (error) {
        logServerError(error.message);
        next(error);
    }
}