import { jsPDF } from 'jspdf'

export async function verifyClass(classStr, classes) {
    try {
        for (let i = 0; i < classes.length; i++) {
            const classObj = classes[i];
            const className = classObj.name;
            if (className === classStr) return { success: true, data: classObj }
        }

        return { success: false, data: null }
    } catch (error) {
        return { success: false, data: null }
    }
}

export async function getSelectMenuClass(t, classes) {
    try {
        const finalClasses = [];

        // Format them value, label
        for (let i = 0; i < classes.length; i++) {
            const _class = classes[i];
            const value = _class.name;
            const label = `${_class.name} - (${_class.longName})`;

            finalClasses.push({ value, label });
        }

        // Return them

        return finalClasses;
    } catch (error) {
        return [
            { value: '', label: t('input.class.select.label') },
        ];
    }
}

//#region Verification
export function isPasswordValid(password, t) {
    /**
     * At least 8 characters
     * At least 1 digit
     * At least 1 uppercase character
     * At least 1 lowercase character
     * At least 1 special character
     * 
     * No spaces
     */
    if (password.length < 8) return { success: false, message: t('input.password.error.length') };
    if (!/\d/.test(password)) return { success: false, message: t('input.password.error.digit') };
    if (!/[A-Z]/.test(password)) return { success: false, message: t('input.password.error.uppercase') };
    if (!/[a-z]/.test(password)) return { success: false, message: t('input.password.error.lowercase') };
    if (!/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password)) return { success: false, message: t('input.password.error.special') };
    if (/\s/.test(password)) return { success: false, message: t('input.password.error.space') };

    return { success: true, message: '' };
}

export async function isClassValid(classStr, t, classes) {
    const data = await verifyClass(classStr, classes);
    if (!data.success) return { success: false, message: t('input.class.error.exists') };
    return { success: true, message: '' };
}

export async function isIAMValid(IAM, t) {
    /**
     * Ensure that the IAM starts with 5 letters and end with 3 digits
     */
    if (!IAM.match(/^[a-zA-Z]{5}[0-9]{3}$/)) return { success: false, message: t('input.iam.error.valid') };
    return { success: true, message: '' };
}
//#endregion

export function isMobile() {
    return window.innerWidth <= 768; // Adjust the threshold as needed
}

export function isSmallMobile() {
    return window.innerWidth <= 768; // Adjust the threshold as needed
}

export function isTinyMobile() {
    return window.innerWidth <= 300; // Adjust the threshold as needed
}

export async function getMember(IAM) {
    let finalIAM = IAM.toLocaleLowerCase();

    try {
        const res = await fetch(`/api/v1/user/fetch/${finalIAM}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
        })

        const data = await res.json()
        const document = data._doc;
        if (!document) return { success: false, data: null }
        if (res.status == 200) return { success: true, data: document }
        return { success: false, data: null }
    } catch (error) {
        return { success: false, data: null }
    }
}

export async function getAllReports() {
    try {
        const res = await fetch("/api/v1/report/fetch-all", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
        });

        const data = await res.json()
        if (res.status == 200) return { success: true, data: data }
        return { success: false, data: null }
    } catch (error) {
        return { success: false, data: null }
    }
}

export async function updateReport(reportData) {
    const res = await fetch(`/api/v1/report/update/${reportData.missionNumber}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(reportData),
    });

    const data = await res.json();
    return { success: res.status == 200, data: data };
}

export function reportPDF(reportData) {
    // Create a new jsPDF instance
    const doc = new jsPDF();

    // Add content to the PDF
    doc.text("This is not fully functional yet", 10, 10);

    // Save the PDF
    doc.save(`report_${reportData.missionNumber}.pdf`);
}

export function reportCSV(reportData) {
    // Create the CSV content with "Not Ready Yet"
    const csv = "Not Ready Yet\n";

    // Create a Blob object for the CSV data
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });

    // Create a temporary URL for the Blob
    const url = URL.createObjectURL(blob);

    // Create a temporary link element
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `report_${reportData.missionNumber}.csv`);

    // Append the link to the body and trigger the download
    document.body.appendChild(link);
    link.click();

    // Clean up by removing the link and URL
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
}

/**
 * 
 * @param {string} date Format: 2024-06-22
 * @param {?string} startTime Format: 08:30
 * @param {?string} endTime Format: 09:00
 * @param {?object[]} events
 * @returns 
 */
export function validateDate(date, startTime, endTime, events) {
    console.log("Format YYYY-MM-DD: ", date);
    console.log("Format HH:MM: ", startTime);
    console.log("Format HH:MM: ", endTime);

    // Validate the inputs
    if (!date) {
        return {
            isValid: false,
            event: {
                extendedProps: {
                    type: 'invalid_props',
                },
            },
        };
    }

    // The times are optional, if they are provided, validate them
    if (startTime) {
        if (!startTime.match(/^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/)) {
            return {
                isValid: false,
                event: {
                    extendedProps: {
                        type: 'invalid_props',
                    },
                },
            };
        }
    }
    if (endTime) {
        if (!endTime.match(/^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/)) {
            return {
                isValid: false,
                event: {
                    extendedProps: {
                        type: 'invalid_props',
                    },
                },
            };
        }
    }

    // Get the current date
    const currentDate = new Date();

    // Calculate the deadline for entering availabilities for next week
    let nextWeekDeadline = new Date(currentDate);
    if (currentDate.getDay() <= 5) {
        nextWeekDeadline.setDate(currentDate.getDate() + (5 - currentDate.getDay())); // Friday of this week
    } else {
        nextWeekDeadline.setDate(currentDate.getDate() + (12 - currentDate.getDay())); // Friday of next week
    }
    nextWeekDeadline.setHours(14, 0, 0, 0); // Set the time to 2pm

    let overlappingEvent = null;

    // Check if the selected date is in the past
    if (new Date(date) < currentDate) {
        // Create a "fake" event for past dates
        overlappingEvent = {
            extendedProps: {
                type: 'past_date',
            },
        };
    } else {
        // Check if the selected date is a weekend
        const selectedDayOfWeek = new Date(date).getDay();
        if (selectedDayOfWeek === 0 || selectedDayOfWeek === 6) {
            // Create a "fake" event for weekends
            overlappingEvent = {
                extendedProps: {
                    type: 'weekend',
                },
            };
        } else {
            if (startTime && endTime) {
                const selectedStartTime = new Date(`${date}T${startTime}`).getTime();
                const selectedEndTime = new Date(`${date}T${endTime}`).getTime();

                // Check if start and end times are within working hours (08:00 - 18:00)
                const startHour = new Date(`${date}T${startTime}`).getHours();
                const startMinute = new Date(`${date}T${startTime}`).getMinutes();
                const endHour = new Date(`${date}T${endTime}`).getHours();
                const endMinute = new Date(`${date}T${endTime}`).getMinutes();

                if (
                    (startHour < 8 || (startHour === 8 && startMinute < 0)) ||
                    (endHour > 18 || (endHour === 18 && endMinute > 0))
                ) {
                    // Create a "fake" event for times outside working hours
                    overlappingEvent = {
                        extendedProps: {
                            type: 'outside_working_hours',
                        },
                    };
                } else if (events) {
                    // Iterate through each existing event
                    for (const event of events) {

                        // Convert existing event's start and end times to timestamps
                        const eventStartTime = new Date(event.start).getTime();
                        const eventEndTime = new Date(event.end).getTime();

                        // Check for overlap
                        if (
                            selectedStartTime < eventEndTime && // New event's start is before existing event's end
                            selectedEndTime > eventStartTime // New event's end is after existing event's start
                        ) {
                            // Return false if there is an overlap
                            overlappingEvent = event;
                            break;
                        }
                    }
                }
            }
        }
    }

    // Return an object with isValid and the overlapping event
    return {
        isValid: !overlappingEvent,
        event: overlappingEvent,
    };
}

export function formatDate(date) {
    const year = date.getFullYear();
    let month = date.getMonth() + 1;
    let day = date.getDate();

    // Add leading zeros if needed
    if (month < 10) {
        month = `0${month}`;
    }
    if (day < 10) {
        day = `0${day}`;
    }

    return `${year}-${month}-${day}`;
}

export async function getRoles(IAM) {
    // If the IAM is not provided, return an empty array
    if (!IAM) {
        return [];
    }
    // Fetch the roles for the given IAM
    const res = await fetch(`/api/v1/user/roles/${IAM}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
    })

    const roles = await res.json();
    if (!roles) {
        return [];
    }

    if (!roles.length) {
        return [];
    }

    if (roles.length == 0) {
        return [];
    }

    // Return the roles
    return roles;
}

export async function userExists(IAM) {
    try {
        const res = await fetch(`/api/v1/user/exists/${IAM}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
        })

        const data = await res.json();
        if (!res.ok) return false

        return data?.exists;
    } catch (error) {
        return false;
    }
}

export const getColors = async (IAM) => {
    const res = await fetch(`/api/v1/user/fetch/${IAM}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
    })
    const data = await res.json()
    const user = data._doc;

    const eventColors = user?.eventColors

    if (!eventColors) return colors.events;

    if (!Object.keys(eventColors).length) {
        return colors.events;
    }

    // Check if eventColors contain the same keys as colors.events
    if (!Object.keys(eventColors).every((key) => key in colors.events)) {
        return eventColors;
    }

    return eventColors;
}

export const isValidIAM = (IAM = '', t) => {
    // Check the length of the IAM it must be 8
    if (IAM.length != 8) {
        return { valid: false, message: t('input.iam.error.length') };
    }

    // Check that the first 5 characters are letters
    if (!/^[a-zA-Z]{5}/.test(IAM)) {
        return { valid: false, message: t('input.iam.error.letters') };
    }

    // Check that the last 3 characters are digits
    if (!/[0-9]{3}$/.test(IAM)) {
        return { valid: false, message: t('input.iam.error.digits') };
    }

    return { valid: true, message: '' };
}

const colors = {
    events: {
        exams: '#000000', // Black as default
        shifts: '#000000', // Black as default
        availability: '#000000', // Black as default
        expiredAvailability: '#000000', // Black as default
        overlap: '#000000', // Black as default
        myShifts: '#000000', // Black as default
    },
};
