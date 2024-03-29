import { jsPDF } from 'jspdf'

export async function getClasses() {
    try {
        const res = await fetch(`/api/v1/exam/classes`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
        })

        return { success: true, data: await res.json() }
    } catch (error) {
        return { success: false, data: null }
    }
}

export async function verifyClass(classStr) {
    try {
        const data = await getClasses();

        if (!data.success) return { success: false, data: null }

        const classes = data.data.classes;

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

export async function getSelectMenuClass() {
    try {
        const finalClasses = [];

        // Get all classes
        const res = await getClasses();
        if (!res.success) return [
            { value: '', label: 'Select Class' },
        ];
        const data = res.data;

        const classes = data.classes;

        // Format them value, label
        for (let i = 0; i < classes.length; i++) {
            const _class = classes[i];
            const value = _class.name;
            const label = `${_class.longName} - (${_class.name})`;

            finalClasses.push({ value, label });
        }

        // Return them

        return finalClasses;
    } catch (error) {
        return [
            { value: '', label: 'Select Class' },
        ];
    }
}

export function getSelectMenuTraining() {
    return [
        { value: 'SAP 1', label: 'SAP 1' },
        { value: 'SAP 2', label: 'SAP 2' },
        { value: 'FIS 1', label: 'FIS 1' },
        { value: 'FIS 2', label: 'FIS 2' },
        { value: 'FIS 3', label: 'FIS 3' },
    ]
}

//#region Verification
export function isPasswordValid(password) {
    /**
     * At least 8 characters
     * At least 1 digit
     * At least 1 uppercase character
     * At least 1 lowercase character
     * At least 1 special character
     * 
     * No spaces
     */
    if (password.length < 8) return { success: false, message: 'Password must be at least 8 characters long!' };
    if (!/\d/.test(password)) return { success: false, message: 'Password must contain at least 1 digit!' };
    if (!/[A-Z]/.test(password)) return { success: false, message: 'Password must contain at least 1 uppercase character!' };
    if (!/[a-z]/.test(password)) return { success: false, message: 'Password must contain at least 1 lowercase character!' };
    if (!/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password)) return { success: false, message: 'Password must contain at least 1 special character!' };
    if (/\s/.test(password)) return { success: false, message: 'Password cannot contain spaces!' };

    return { success: true, message: '' };
}

export async function isClassValid(classStr) {
    const data = await verifyClass(classStr);
    if (!data.success) return { success: false, message: 'This class does not exist!' };
    return { success: true, message: '' };
}

export async function isIAMValid(IAM) {
    /**
     * Ensure that the IAM starts with 5 letters and end with 3 digits
     */
    if (!IAM.match(/^[a-zA-Z]{5}[0-9]{3}$/)) return { success: false, message: 'Invalid IAM! The IAM must follow the format: 5 letters followed by 3 digits' };
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
    console.log(reportData.archived)
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