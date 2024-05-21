import { useEffect, useState } from "react"
import { LoadingPage } from "../../pages"
import { Box, Typography } from "@mui/material"
import { Accordion, Card } from "react-bootstrap"

const AuditLog = () => {
    const [origin, setOrigin] = useState('log-files')
    const [auditLog, setAuditLog] = useState({
        allLogs: [], // Done
        serverErrors: [], // Done
        clientErrors: [], // Done
        httpLogs: [], // Done
        actionLogs: [] // Done
    })
    const [loading, setLoading] = useState(true)
    const [searchQuery, setSearchQuery] = useState('');
    const [filterKey, setFilterKey] = useState('msg'); // Default filter key
    const [errMsg, setErrMsg] = useState('')

    useEffect(() => {
        // Create a post request to /audit/fetch
        const fetchData = async () => {
            setLoading(true)
            const response = await fetch('/api/v1/audit/fetch', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ origin })
            })

            const data = await response.json()

            if (response.status !== 200) {
                if (response.status == 404) {
                    setErrMsg("No logs found in the database")
                } else {
                    setErrMsg(data.message)
                }
            } else {
                setAuditLog({
                    // allLogs: data.allLogs, Sort the logs based on whether they contain the same keys
                    allLogs: data.allLogs.sort((a, b) => {
                        if (Object.keys(a).length === Object.keys(b).length) {
                            return 0
                        }
                        return Object.keys(a).length > Object.keys(b).length ? 1 : -1
                    }),
                    serverErrors: data.serverErrors,
                    clientErrors: data.clientErrors,
                    httpLogs: data.httpLogs,
                    actionLogs: data.actionLogs
                })
            }
            setLoading(false)
        }

        fetchData()
    }, [origin])

    // Filter logs based on search query and selected filter key
    const filteredLogs = auditLog.allLogs.filter(log => {
        const value = log[filterKey] || ''; // Handle cases where the key doesn't exist
        if (value === undefined) return false
        if (typeof value !== 'string') return value.toString().toLowerCase().includes(searchQuery.toLowerCase());
        return value.toLowerCase().includes(searchQuery.toLowerCase());
    });

    if (loading) return <LoadingPage />
    if (errMsg) return <p>{errMsg}</p>

    function formattedFilterKey(filterKey) {
        switch (filterKey) {
            case 'msg':
                return 'Message'
            case 'IP':
                return 'IP Address'
            case 'IAM':
                return 'IAM'
            case 'userId':
                return 'User ID'
            case 'endpoint':
                return 'Endpoint'
            case 'timestamp':
                return 'Timestamp'
            case 'errorCode':
                return 'Error Code'
            default:
                return filterKey
        }
    }

    function changeOrigin() {
        setOrigin(origin === 'log-files' ? 'database' : 'log-files')
    }

    /**
     * Now that we have the data, we can render it
     */
    return (
        <div className="select-none">
            <Typography variant="h4">Audit Log</Typography>
            {/* Origin selection */}
            <Box display="flex" alignItems="center" marginBottom={2}>
                <Typography variant="body1" marginRight={2}>
                    Select Origin:
                </Typography>
                <select
                    value={origin}
                    onChange={changeOrigin}
                    style={{
                        padding: "8px",
                        borderRadius: "4px",
                        border: "1px solid #ccc",
                        backgroundColor: "#fff",
                        cursor: "pointer",
                    }}
                >
                    <option value="log-files">Log Files</option>
                    <option value="database">Database</option>
                </select>
            </Box>
            {/* Search bar and filter */}
            <Box display="flex" alignItems="center" marginBottom={2}>
                <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={`Search by ${formattedFilterKey(filterKey)}...`}
                    style={{
                        padding: "8px",
                        borderRadius: "4px",
                        border: "1px solid #ccc",
                        marginRight: "8px",
                        flex: "1",
                    }}
                />
                <select
                    value={filterKey}
                    onChange={(e) => setFilterKey(e.target.value)}
                    style={{
                        padding: "8px",
                        borderRadius: "4px",
                        border: "1px solid #ccc",
                        backgroundColor: "#fff",
                        cursor: "pointer",
                    }}
                >
                    <option value="msg">Message</option>
                    <option value="IP">IP</option>
                    <option value="IAM">IAM</option>
                    <option value="userId">User ID</option>
                    <option value="endpoint">Endpoint</option>
                    <option value="timestamp">Timestamp</option>
                    <option value="errorCode">Error Code</option>
                </select>
            </Box>

            {/* If search query is empty, show all logs else show filtered logs */}
            {searchQuery === '' ? (
                <>
                    {/* Action Logs */}
                    <Accordion Accordion defaultActiveKey="1">
                        <Accordion.Item eventKey="0">
                            <Accordion.Header>Action Logs</Accordion.Header>
                            {/* The http logs contains an array of objects: { IP: ..., endpoint: ..., timestamp: ...  } */}
                            {auditLog.actionLogs.map((log, index) => {
                                const { IAM, IP, msg, timestamp, userID } = log;
                                // Display the information in a horizontal manner to safe space

                                return (
                                    <div key={index}>
                                        <Accordion.Body style={{ backgroundColor: index % 2 === 0 ? 'lightgray' : 'white' }}>
                                            {/* Display the information in a horizontal manner */}
                                            {/* If the index is even the box should be light-gray otherwise it should be white */}
                                            <Box display="flex" justifyContent="space-between">
                                                <Typography variant="h6">Message: {msg}</Typography>
                                                <Typography variant="h6">IP: {IP}</Typography>
                                                <Typography variant="h6">IAM: {IAM}</Typography>
                                                <Typography variant="h6">User ID: {userID}</Typography>
                                                <Typography variant="h6">{timestamp}</Typography>
                                            </Box>
                                        </Accordion.Body>
                                    </div>
                                )
                            })}
                        </Accordion.Item>
                    </Accordion>

                    {/* HTTP Logs */}
                    <Accordion defaultActiveKey="1">
                        <Accordion.Item eventKey="0">
                            <Accordion.Header>HTTP Logs</Accordion.Header>
                            {/* The http logs contains an array of objects: { IP: ..., endpoint: ..., timestamp: ...  } */}
                            {auditLog.httpLogs.map((log, index) => {
                                const { IP, endpoint, timestamp } = log;
                                // Display the information in a horizontal manner to safe space

                                return (
                                    <div key={index}>
                                        <Accordion.Body style={{ backgroundColor: index % 2 === 0 ? 'lightgray' : 'white' }}>
                                            {/* Display the information in a horizontal manner */}
                                            {/* If the index is even the box should be light-gray otherwise it should be white */}
                                            <Box display="flex" justifyContent="space-between">
                                                <Typography variant="h6">IP: {IP}</Typography>
                                                <Typography variant="h6">Endpoint: {endpoint}</Typography>
                                                <Typography variant="h6">{timestamp}</Typography>
                                            </Box>
                                        </Accordion.Body>
                                    </div>
                                )
                            })}
                        </Accordion.Item>
                    </Accordion>

                    {/* Server Errors Logs */}
                    <Accordion defaultActiveKey="1">
                        <Accordion.Item eventKey="0">
                            <Accordion.Header>Server Errors</Accordion.Header>
                            {/* The server errors contains an array of objects: { error: ..., timestamp: ...  } */}
                            {auditLog.serverErrors.map((log, index) => {
                                const { errorCode, msg, timestamp } = log;
                                // Display the information in a horizontal manner to safe space

                                return (
                                    <div key={index}>
                                        <Accordion.Body style={{ backgroundColor: index % 2 === 0 ? 'lightgray' : 'white' }}>
                                            {/* Display the information in a horizontal manner */}
                                            {/* If the index is even the box should be light-gray otherwise it should be white */}
                                            <Box display="flex" justifyContent="space-between">
                                                <Typography variant="h6">Error Code: {errorCode}</Typography>
                                                <Typography variant="h6">Message: {msg}</Typography>
                                                <Typography variant="h6">{timestamp}</Typography>
                                            </Box>
                                        </Accordion.Body>
                                    </div>
                                )
                            })}
                        </Accordion.Item>
                    </Accordion>

                    {/* Client Errors Logs */}
                    <Accordion defaultActiveKey="1">
                        <Accordion.Item eventKey="0">
                            <Accordion.Header>Client Errors</Accordion.Header>
                            {/* The client errors contains an array of objects: { error: ..., timestamp: ...  } */}
                            {auditLog.clientErrors.map((log, index) => {
                                const { errorCode, msg, timestamp } = log;
                                // Display the information in a horizontal manner to safe space

                                return (
                                    <div key={index}>
                                        <Accordion.Body style={{ backgroundColor: index % 2 === 0 ? 'lightgray' : 'white' }}>
                                            {/* Display the information in a horizontal manner */}
                                            {/* If the index is even the box should be light-gray otherwise it should be white */}
                                            <Box display="flex" justifyContent="space-between">
                                                <Typography variant="h6">Error Code: {errorCode}</Typography>
                                                <Typography variant="h6">Message: {msg}</Typography>
                                                <Typography variant="h6">{timestamp}</Typography>
                                            </Box>
                                        </Accordion.Body>
                                    </div>
                                )
                            })}
                        </Accordion.Item>
                    </Accordion>
                </>
            ) : (
                <Card>
                    <Card.Title>Filtered Logs</Card.Title>
                    {filteredLogs.map((log, index) => {
                        // Get the keys from the log object
                        // Get the keys and values from the log object
                        // Define the desired order
                        const desiredOrder = ['errorCode', 'msg', 'IP', 'IAM', 'userId', 'endpoint', 'timestamp'];

                        // Reorder the keys according to the desired order
                        const keys = desiredOrder.filter(key => Object.keys(log).includes(key));

                        return (
                            <div key={index}>
                                <Card.Body style={{ backgroundColor: index % 2 === 0 ? 'lightgray' : 'white' }}>
                                    {/* Display the information in a horizontal manner */}
                                    {/* If the index is even the box should be light-gray otherwise it should be white */}
                                    <Box display="flex" justifyContent="space-between">
                                        {/* Display the keys and values */}
                                        {keys.map((key, index) => {
                                            if (key == 'msg') {
                                                return (
                                                    <Typography key={index} variant="h6">Message: {JSON.stringify(log[key])}</Typography>
                                                )
                                            } else if (key == 'timestamp') {
                                                return (
                                                    <Typography key={index} variant="h6">{log[key]}</Typography>
                                                )
                                            } else if (key == 'errorCode') {
                                                return (
                                                    <Typography key={index} variant="h6">Error Code: {log[key]}</Typography>
                                                )
                                            } else if (key == 'endpoint') {
                                                return (
                                                    <Typography key={index} variant="h6">Endpoint: {log[key]}</Typography>
                                                )
                                            } else return (
                                                <Typography key={index} variant="h6">{key}: {log[key]}</Typography>
                                            )
                                        })}
                                    </Box>
                                </Card.Body>
                            </div>
                        )
                    })}
                </Card>
            )}

        </div >
    )
}

export default AuditLog