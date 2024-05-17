import User from '../models/user.model.js';
import RemovedExams from '../models/RemovedExams.model.js';
import { UntisHelper } from 'llis-frt-webuntis';
import { errorHandler } from '../utils/error.js';
import { logServerError } from '../utils/logger.js';

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
                        const valid = await validateExam(exam, req.params.IAM);
                        if (valid) {
                            filteredExams.push(exam);
                        }
                    }
                }
            }

            res.status(200).json(filteredExams);
        } else {
            throw errorHandler(404, 'No class found for this user!');
        }
    } catch (error) {
        console.error(error)
        logServerError(error.message);
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

        classes.push({
            name: 'Teacher',
            longName: 'Teacher',
        })
        classes.push({
            name: 'Public',
            longName: 'Public',
        })
        classes.push({
            name: 'Loge',
            longName: 'Loge',
        })
        res.status(200).json(classes);
    } catch (error) {
        logServerError(error.message);
        next(error);
    }
};

export const removeTeacher = async (req, res, next) => {
    const { teacher, IAM } = req.body;

    try {
        const removedExams = await RemovedExams.findOne({ IAM });

        if (!removedExams) {
            const teachers = teacher || [];

            const newRemovedExams = new RemovedExams({
                IAM,
                teachers,
                subjects: [],
                exams: [],
            });
            await newRemovedExams.save();

            res.status(200).json(newRemovedExams);
        } else {
            const { teachers, subjects, exams } = removedExams;
            if (teachers.includes(teacher)) {
                throw errorHandler(400, 'Teacher already removed!');
            }
            teachers.push(teacher);
            await RemovedExams.findOneAndUpdate({ IAM }, { teachers, subjects, exams });

            res.status(200).json(removedExams);
        }
    } catch (error) {
        logServerError(error.message);
        next(error);
    }
};

export const removeSubject = async (req, res, next) => {
    const { subject, IAM } = req.body;

    try {
        const removedExams = await RemovedExams.findOne({ IAM });

        if (!removedExams) {
            const subjects = subject || [];

            const newRemovedExams = new RemovedExams({
                IAM,
                teachers: [],
                subjects,
                exams: [],
            });
            await newRemovedExams.save();

            res.status(200).json(newRemovedExams);
        } else {
            const { teachers, subjects, exams } = removedExams;
            if (subjects.includes(subject)) {
                throw errorHandler(400, 'Subject already removed!');
            }
            subjects.push(subject);
            await RemovedExams.findOneAndUpdate({ IAM }, { teachers, subjects, exams });

            res.status(200).json(removedExams);
        }
    } catch (error) {
        logServerError(error.message);
        next(error);
    }
};

export const removeExam = async (req, res, next) => {
    const { exam, IAM } = req.body;

    try {
        const removedExams = await RemovedExams.findOne({ IAM });

        if (!removedExams) {
            const exams = exam || [];

            const newRemovedExams = new RemovedExams({
                IAM,
                teachers: [],
                subjects: [],
                exams,
            });
            await newRemovedExams.save();

            res.status(200).json(newRemovedExams);
        } else {
            const { teachers, subjects, exams } = removedExams;
            if (exams.includes(exam)) {
                throw errorHandler(400, 'Exam already removed!');
            }
            exams.push(exam);
            await RemovedExams.findOneAndUpdate({ IAM }, { teachers, subjects, exams });

            res.status(200).json(removedExams);
        }
    } catch (error) {
        logServerError(error.message);
        next(error);
    }
};

/**
 * 
 * @param {*} exam 
 * @param {*} IAM 
 */
const validateExam = async (exam, IAM) => {
    const removedExams = await RemovedExams.findOne({ IAM });

    if (!exam) {
        throw errorHandler(400, 'No exam provided!');
    };

    if (removedExams) {
        const { teachers, subjects, exams } = removedExams;

        for (let i = 0; i < teachers?.length; i++) {
            const teacher = teachers[i];
            const examTeachers = exam.teachers;

            if (examTeachers.includes(teacher)) {
                return false;
            }
        }

        for (let i = 0; i < subjects?.length; i++) {
            const subject = subjects[i];

            if (subject === exam.subject) {
                return false;
            }
        }

        for (let i = 0; i < exams?.length; i++) {
            const { _endTime, _startTime, examDate } = exams[i];
            const { endTime, startTime, examDate: _examDate } = exam;

            if (_endTime == endTime && _startTime == startTime && _examDate == examDate) {
                return false;
            }
        }
    }

    return true;
}
