import User from '../models/user.model.js';
import { UntisHelper } from 'llis-frt-webuntis';
import { errorHandler } from '../utils/error.js';

export const test = (req, res) => {
    res.json({
        message: 'API is working!',
    });
};

// In your controller file (getExamsByUser.js or getExamsByUser.ts)
export const getExamsByUser = async (req, res, next) => {
    try {
        req.params.IAM = req.params.IAM.toLowerCase();

        if (!req.params.IAM) {
            throw errorHandler(400, 'No IAM provided!');
        }

        const validUser = await User.findOne({ IAM: req.params.IAM });

        if (!validUser) {
            throw errorHandler(404, 'No user with this IAM found!');
        }

        const studentClass = validUser.studentClass;

        if (studentClass && typeof studentClass === 'string') {
            // Get all exams
            const untisHelper = new UntisHelper({
                school: process.env.UNTIS_SCHOOL,
                username: process.env.UNTIS_USERNAME,
                secret: process.env.UNTIS_SECRET,
                baseUrl: process.env.UNTIS_BASE_URL,
            });

            await untisHelper.login();

            const exams = await untisHelper.allExams();
            const filteredExams = [];

            for (let i = 0; i < exams.length; i++) {
                const exam = exams[i];
                const examClasses = exam.studentClass;

                for (let i = 0; i < examClasses.length; i++) {
                    const examClass = examClasses[i];

                    if (examClass === studentClass) {
                        filteredExams.push(exam);
                    }
                }
            }

            res.json({
                message: 'Returning all exams with the user\'s class!',
                exams: filteredExams,
            });
        } else {
            throw errorHandler(404, 'No class found for this user!');
        }
    } catch (error) {
        console.log(error);
        next(error);
    }
};

export const getClasses = async (req, res, next) => {
    try {
        const untisHelper = new UntisHelper({
            school: process.env.UNTIS_SCHOOL,
            username: process.env.UNTIS_USERNAME,
            secret: process.env.UNTIS_SECRET,
            baseUrl: process.env.UNTIS_BASE_URL,
        });

        await untisHelper.login();
        const classes = await untisHelper.untis.getClasses();

        res.json({
            message: 'All available classes',
            classes,
        });
    } catch (error) {
        console.log(error);
        next(error);
    }
};
