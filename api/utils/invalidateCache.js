import WebSocket from "ws";
import { wss } from "../index.js";

/**
 * Sends updated reports to clients if WebSocket connection is open.
 *
 * @param {'reports_updated' | 'availabilities_updated' | 'shifts_updated' | 'exams_updated' } type - The type of report to send.
 * @return {void} 
 */
export function sendReportsUpdated(type) {
    const message = JSON.stringify({ type });
    if (wss && wss.clients) {
        wss.clients.forEach(client => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(message);
            }
        });
    }
}
