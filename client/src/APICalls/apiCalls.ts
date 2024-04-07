// This file contains all the api calls necessary to make the react app work
import { AvailabilityObject, CacheKeys, EmailBody, PromiseResponse, ReportObject, ShiftObject, UserObject } from "./apiCallTypes";
import { QueryClient, useMutation, useQuery } from 'react-query';
import { useQueryClient } from 'react-query';
import socket from "../websocket-client"
import React, { useEffect } from "react";
import { isClassValid } from "../utils";

const queryClient = new QueryClient();

//#region Updating API Calls
export async function apiUpdateReport(reportData: ReportObject): Promise<JSON> {
    const res = await fetch(`/api/v1/report/update/${reportData.missionNumber}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(reportData),
    });
    const json = await res.json();
    return json;
}
export async function apiUpdateUser(user: UserObject): Promise<JSON> {
    const res = await fetch(`/api/v1/user/update/${user._id}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(user),
    });
    const json = await res.json();
    return json;
}
//#endregion

//#region Creating API Calls
export async function apiCreateShift(shifts: ShiftObject[]): Promise<JSON> {
    const res = await fetch('/api/v1/shift/create', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            shifts
        }),
    });

    const json = await res.json();
    return json;
}
export async function apiCreateAvailability(availability: AvailabilityObject): Promise<JSON> {
    const res = await fetch('/api/v1/availability/create', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(availability),
    });
    const json = await res.json();
    return json;
}
export async function apiCreateReport(reportData: ReportObject): Promise<JSON> {
    const res = await fetch('/api/v1/report/create', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(reportData),
    });
    const json = await res.json();
    return json;
}
//#endregion

//#region Deleting API Calls
export async function apiDeleteAvailability(IAM: string, id: string): Promise<JSON> {
    const res = await fetch('/api/v1/availability/delete', {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ IAM, id }),
    });

    const json = await res.json();
    return json;
}
export async function apiDeleteShift(id: string): Promise<Response> {
    const res = await fetch(`/api/v1/shift/delete/${id}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
    });
    return res;
}
export async function apiDeleteUser(id: string): Promise<JSON> {
    const res = await fetch(`/api/v1/user/update/${id}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
    });
    const json = await res.json();
    return json;
}
//#endregion

export async function apiNotifyUser(emailBody: EmailBody): Promise<PromiseResponse> {
    const res = await fetch('/api/v1/user/notify', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            emailBody
        }),
    });

    const json = await res.json();

    return { success: false, json };
}
export async function apiSignOut(): Promise<PromiseResponse> {
    const res = await fetch('/api/v1/auth/signout', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
    });
    const json = await res.json();

    return { success: res.ok, json };
}
export async function apiValidate(): Promise<PromiseResponse> {
    const res = await fetch('/api/v1/auth/validate', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
    });
    const json = await res.json();

    return { success: res.ok, json };
}
export async function apiSignUp(user: UserObject): Promise<PromiseResponse> {
    const res = await fetch('/api/v1/auth/signup', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(user),
    });
    const json = await res.json();

    return { success: res.ok, json };
}
export async function apiSignIn(user: UserObject): Promise<PromiseResponse> {
    const res = await fetch('/api/v1/auth/signin', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(user),
    });
    const json = await res.json();

    return { success: res.ok, json };
}

//#region Fetching API Calls
export async function apiFetchReport(missionNumber: string): Promise<JSON> {
    const res = await fetch(`/api/v1/report/fetch/${missionNumber}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
    });
    const json = await res.json();
    return json;
}
export async function apiFetchExam(IAM: string): Promise<JSON> {
    console.log('API CALL');
    const res = await fetch(`/api/v1/exam/user/${IAM}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
    });

    const json = await res.json();
    console.log(json);
    return json;

}
export async function apiFetchAvailabilityByIAM(IAM: string): Promise<JSON> {
    const res = await fetch(`/api/v1/availability/get/${IAM}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
    });
    const json = await res.json();
    return json;
}
export async function apiFetchUser(IAM: string): Promise<JSON> {
    const res = await fetch(`/api/v1/user/fetch/${IAM}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
    });

    const json = await res.json();
    return json;
}
export async function apiFetchAvailability(id: string): Promise<JSON> {
    const res = await fetch(`/api/v1/availability/get-by-id/${id}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
    });

    const json = await res.json();
    return json;
};
export async function apiFetchClasses(): Promise<JSON> {
    const res = await fetch('/api/v1/exam/classes', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
    });

    const json = await res.json();
    return json;
};
async function apiFetchShifts(): Promise<JSON> {
    console.log('API CALL');
    const res = await fetch('/api/v1/shift/fetch', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
    });
    const json = await res.json();
    console.log(json);
    return json;
}
async function apiFetchAvailabilities(): Promise<JSON> {
    const res = await fetch('/api/v1/availability/all', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
    });
    const json = await res.json();
    return json;
}
async function apiFetchAllReports(): Promise<JSON> {
    const res = await fetch('/api/v1/report/fetch-all', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
    });
    const json = await res.json();
    return json;
}
//#endregion

//#region React Query Hooks
export function useInitialDataFetch(user: UserObject | undefined) {
    useEffect(() => {
        const fetchData = async () => {
            // Fetch all necessary data and cache it
            if (user != undefined) {
                const { IAM, studentClass } = user;

                try {
                    console.log('MUST BE API CALL')
                    await queryClient.prefetchQuery([CacheKeys.EXAMS, IAM], {
                        queryFn: () => fetchExamsAndValidate(IAM, studentClass),
                        staleTime: 1000 * 60 * 5, // 5 minutes 
                    });
                } catch (err) {
                    console.log(err);
                }

            }
            await queryClient.prefetchQuery(CacheKeys.AVAILABILITIES, apiFetchAvailabilities);
            await queryClient.prefetchQuery(CacheKeys.SHIFTS, apiFetchShifts);
            await queryClient.prefetchQuery(CacheKeys.REPORTS, apiFetchAllReports);
        };

        fetchData();
    }, []);
}
export function useFetchAllReports() {
    return useQuery<JSON>(CacheKeys.REPORTS, async () => {
        const data = await apiFetchAllReports();
        return data;
    }, {
        // Set cache time to a reasonable value (in milliseconds)
        staleTime: 1000 * 60 * 5, // 5 minutes
    });
}
export function useFetchAvailabilities() {
    // TODO: Use it
    return useQuery<JSON>(CacheKeys.AVAILABILITIES, async () => {
        const data = await apiFetchAvailabilities();
        return data;
    }, {
        // Set cache time to a reasonable value (in milliseconds)
        staleTime: 1000 * 60 * 5, // 5 minutes
    });
}
export function useFetchShifts() {
    return useQuery<JSON>(CacheKeys.SHIFTS, async () => {
        // Check if the shifts data is already in the cache
        const cachedData = queryClient.getQueryData(CacheKeys.SHIFTS);
        if (cachedData) {
            return cachedData as JSON; // Return cached data if available
        }

        // If data is not cached, fetch it from the API
        const data = await apiFetchShifts();
        return data;
    }, {
        // Set cache time to a reasonable value (in milliseconds)
        staleTime: 1000 * 60 * 5, // 5 minutes
    });
}
export function useFetchExam(IAM: string, classStr: string) {
    // TODO: Use it
    return useQuery<JSON>([CacheKeys.EXAMS, IAM], async () => {
        // Ensusre user has valid class:
        const data = await fetchExamsAndValidate(IAM, classStr);

        return data;
    }, {
        // Set cache time to a reasonable value (in milliseconds)
        staleTime: 1000 * 60 * 60 * 1, // 1 hour (this is update very rarely)
    });
}

async function fetchExamsAndValidate(IAM: string, classStr: string): Promise<JSON> {
    const isValid = await isClassValid(classStr);

    if (!isValid.success) throw new Error(isValid.message);

    // Check if the exams data is already in the cache
    const cachedData = queryClient.getQueryData([CacheKeys.EXAMS, IAM]);
    if (cachedData) {
        return cachedData as JSON; // Return cached data if available
    }

    // If data is not cached, fetch it from the API
    const data = await apiFetchExam(IAM);
    return data;
}
//#endregion

//#region Websockets

// Listen for websocket messages1
export function useWebSocketMessages() {
    const queryClient = useQueryClient();

    React.useEffect(() => {
        const handleSocketMessage = (event: MessageEvent) => {
            const data = JSON.parse(event.data);

            const type = data.type;
            const cacheKey = type.replace('_updated', '');

            switch (cacheKey) {
                case CacheKeys.REPORTS: queryClient.invalidateQueries(CacheKeys.REPORTS);
                    break;

                case CacheKeys.AVAILABILITIES: queryClient.invalidateQueries(CacheKeys.AVAILABILITIES);
                    break;

                case CacheKeys.SHIFTS: queryClient.invalidateQueries(CacheKeys.SHIFTS);
                    break;

                case CacheKeys.EXAMS: queryClient.invalidateQueries(CacheKeys.EXAMS);
                    break;

                default:
                    break;
            }
        };

        socket.addEventListener('message', handleSocketMessage);

        return () => {
            socket.removeEventListener('message', handleSocketMessage);
        };
    }, [queryClient]);

    return null;
}

//#endregion