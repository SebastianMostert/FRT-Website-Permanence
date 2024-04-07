// In this file we declare all the types used in the api calls 
export type EmailBody = {
    to: string;
    subject: string;
    text: string;
}

export type ShiftObject = {
    IAM: string;
    firstName: string;
    lastName: string;
    position: string;
    selected: boolean;
    availabilityId: string;
    operationalPosition: string;
    startDate: Date;
    endDate: Date;
}

export type AvailabilityObject = {
    IAM: string;
    startTime: Date;
    endTime: Date;
}

export type ReportObject = {
    missionNumber: number;
    firstResponders: object[];
    patientInfo: {
        age: number;
        gender: string;
        firstName: string;
        lastName: string;
        IAM: string;
        otherInfo: string;
    };
    abcdeSchema: object;
    samplerSchema: object;
    archived: boolean;
}

export type UserObject = {
    _id: string;
    IAM: string;
    firstName: string;
    lastName: string;
    email: string;
    studentClass: string;
}

export type PromiseResponse = {
    success: boolean;
    json: JSON;
}

export enum CacheKeys {
    REPORTS = 'reports',
    AVAILABILITIES = 'availabilities',
    SHIFTS = 'shifts',
    EXAMS = 'exams'
}