import nodemailer from 'nodemailer';

const sendEmail = async (emailBody) => {
    const emailUser = process.env.EMAIL_USER;
    const emailPassword = process.env.EMAIL_PASSWORD;

    let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: emailUser,
            pass: emailPassword
        }
    });

    // Send email using transporter
    let info = await transporter.sendMail(emailBody);

    return info;
};

export default sendEmail;