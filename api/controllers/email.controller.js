// sendEmailEmailVerification,
// sendEmailIPVerification,
// sendEmailPasswordReset,
// sendEmailShiftNotification,
// sendAnyEmail,
// sendSecurityEmailPasswordReset,

import User from "../models/user.model.js";
import { logServerError, logUserError } from "../utils/logger.js";
import sendEmail from '../utils/sendEmail.js';

/**
 * @description Sends an email to verify an email
 * 
 * ROUTE NOT PROTECTED
 */
export const sendEmailEmailVerification = async (req, res, next) => {
    const { code, time, email } = req.body;

    try {
        // Get the template html for the email
        const templatePath = path.join(__dirname, 'emails', 'verification', 'email.hbs');
        const templateContent = fs.readFileSync(templatePath, 'utf-8');

        const data = {
            time: time / 60,
            code: code
        };

        const template = handlebars.compile(templateContent);

        const html = template(data);

        sendEmail({
            to: email,
            subject: 'Email verification',
            html: html
        })
    } catch (error) {
        logServerError(error.message);
        next(errorHandler(500, 'An error occurred while sending email.'));
    }
};

/**
 * @description Sends an email to verify an IP
 *  TODO
 * ROUTE NOT PROTECTED
 */
export const sendEmailIPVerification = async (req, res, next) => {
    /**
     * Process:
     * The user attempts to login on a new ip
     * We send an email to the user to verify their ip
     * The user can click on the link in the email to verify their ip
     * The link is valid for 24 hours
     * The link contains a code
     * Once the user clicks on the link, the client receives the code
     * The code is used to verify the ip
     * The code is valid for 24 hours
     * The code must not be exposed to any third party at any time
     * This code must remain confidential
     */
    const { time, email } = req.body;

    try {
        // TODO
    } catch (error) {
        logServerError(error.message);
        next(errorHandler(500, 'An error occurred while sending email.'));
    }
}

/**
 * @description Sends an email to reset a password
 * 
 * ROUTE NOT PROTECTED
 */
export const sendEmailPasswordReset = async (req, res, next) => {
    const IP = req.ip;
    logHTTPRequest('/auth/forgot-password', IP);
    const { email, otp } = req.body;
    const timeInSeconds = 600;
    try {

        // Get the user with the correct email
        const user = await User.findOne({ email });

        if (!user) {
            logUserError({
                IP: req.ip,
                message: 'Password forgot failed: User not found',
                errorCode: 404,
            })
            return res.status(404).json({
                success: false,
                message: 'User not found',
            });
        }

        // Check if the user has a password
        if (user.twoFactorAuth) {
            const verified = validate2FaCode(user.twoFactorAuthSecret, otp);
            if (!verified) {
                logUserError({
                    IP,
                    message: 'Password forgot failed: Invalid two-factor authentication code',
                    errorCode: 401,
                    IAM: user.IAM,
                    userID: user._id,
                })
                return res.status(401).json({
                    success: false,
                    message: 'Invalid two-factor authentication code',
                });
            }
        }

        // Generate a reset token
        const resetToken = crypto.randomBytes(20).toString('hex');

        // Save the reset token to the database
        await ResetPassword.create({
            email,
            token: resetToken,
        });

        // Send the reset token to the user via email (You need to implement this)
        // Get the website url from the req object
        const websiteUrl = `${req.protocol}://${req.get('host')}`;
        const resetUrl = `${websiteUrl}/reset-password/${resetToken}`;

        // Get the template html for the email
        const templatePath = path.join(__dirname, 'emails', 'password-reset.hbs');
        const templateContent = fs.readFileSync(templatePath, 'utf-8');

        const data = {
            resetUrl,
            email,
            time: timeInSeconds / 60
        };

        const template = handlebars.compile(templateContent);
        const html = template(data);

        await sendEmail({
            to: email,
            subject: 'Password Reset Token',
            html
        });

        // Delete the reset token from the after 10 minutes
        setTimeout(async () => {
            await ResetPassword.deleteOne({ token: resetToken });
        }, 1000 * 60 * 10);

        res.status(200).json({
            success: true,
            message: 'Reset token sent to email',
        });
        logUserAction({
            IP: req.ip,
            message: 'Password reset token sent to email',
            IAM: user.IAM,
            userID: user._id,
        });
    } catch (error) {
        logServerError(error.message);
        res.status(500).json({
            success: false,
            message: 'Failed to send reset token',
        });
    }
}

/**
 * @description Sends an email to notify the user of a shift
 * 
 * ROUTE PROTECTED
 */
export const sendEmailShiftNotification = async (req, res, next) => {
    const { user, startDate, endDate, partners } = req.body;

    try {
        const { IAM, firstName, lastName, position } = user;

        const partnerInfo = {
            firstNames: [],
            lastNames: [],
            positions: [],
        };

        const partners = [];

        for (let i = 0; i < allUsers.length; i++) {
            const _user = allUsers[i];
            if (_user.IAM === IAM) continue;

            partnerInfo.firstNames.push(_user.firstName);
            partnerInfo.lastNames.push(_user.lastName);
            partnerInfo.positions.push(_user.position);
            partners.push(_user);
        }

        const res = await getMember(IAM);

        const data = res.data;
        const email = data.email;

        const formattedStartDate = formatDate(new Date(startDate));
        const startTimeStr = formatTime(new Date(startDate));
        const endTimeStr = formatTime(new Date(endDate));

        const partnersList = partners.map((user, index) => `<li>${user.firstName} ${user.lastName} - ${user.position}</li>`).join('');

        // Get the template html for the email
        const templatePath = path.join(__dirname, 'emails', 'shift-creation.hbs');
        const templateContent = fs.readFileSync(templatePath, 'utf-8');

        const data2 = {
            IAM,
            firstName,
            lastName,
            position,
            formattedStartDate,
            startTimeStr,
            endTimeStr,
            partnersList
        };

        const template = handlebars.compile(templateContent);
        const html = template(data2);

        await sendEmail({
            to: email,
            subject: 'Shift Creation',
            html
        });

        res.status(200).json({
            success: true,
            message: 'Email sent successfully',
        });
    } catch (error) {
        logServerError(error.message);
        res.status(500).json({
            success: false,
            message: 'Failed to send email',
        });
    }
}

/**
 * @description Sends any email
 * 
 * ROUTE PROTECTED
 */
export const sendAnyEmail = async (req, res, next) => {
    const { emailBody } = req.body;
    try {
        await sendEmail(emailBody);

        res.status(200).json({
            success: true,
            message: 'Email sent successfully',
        });
    } catch (error) {
        logServerError(error.message);
        res.status(500).json({
            success: false,
            message: 'Failed to send email',
        });
    }
}

// ## SECURITY EMAILS ##

/**
 * @description Sends an email to inform the user of a password reset
 * 
 * NOT A ROUTE JUST A FUNCTION
 */
export const sendSecurityEmailPasswordReset = async ({ email, user }) => {
    try {
        // Get the template html for the email
        const templatePath = path.join(__dirname, 'emails', 'security', 'password-reset.hbs');
        const templateContent = fs.readFileSync(templatePath, 'utf-8');

        const { IAM, firstName, lastName } = user;

        const helpEmail = 'lux.frt.llis@gmail.com';
        const helpSubject = encodeURIComponent('Password Security Issue');
        const helpBody = encodeURIComponent(`Hello,\n\nI am reaching out because it seems that my password has been changed without my authorization.\nCould you please assist me in resolving this issue?\nMy IAM is: ${IAM}\n\nThank you,\n${lastName} ${firstName}`);

        const contactHelpLink = `mailto:${helpEmail}?subject=${helpSubject}&body=${helpBody}`;

        const data = { contactHelpLink };

        const template = handlebars.compile(templateContent);
        const html = template(data);

        await sendEmail({
            to: email,
            subject: 'Password Reset',
            html
        });
    } catch (error) {
        logServerError(error.message);
    }
}