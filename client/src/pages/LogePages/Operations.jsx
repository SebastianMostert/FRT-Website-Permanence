/* eslint-disable react/prop-types */
import { useEffect, useRef, useState } from "react";
import { LoadingPage } from "../ErrorPages";
import { Container, Card, ListGroup, Modal, Form, Row, Col } from "react-bootstrap";
import { Button, Typography } from "@mui/material";
import StatusSquare from "../../components/StatusSquare";
import StatusChanger from "../../components/StatusChanger";
import { useTranslation } from "react-i18next";
import { Send } from "@mui/icons-material";

// TODO: Add a button to dispatch a team
// TODO: Add handling for the "ablauf eines einsatzes"

const Operations = () => {
  const [teams, setTeams] = useState([]);
  const [incidents, setIncidents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const teamResponse = await fetch("/api/v1/team/fetch", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
        });
        const teamData = await teamResponse.json();
        const activeTeams = teamData.filter((team) => team.active);
        setTeams(activeTeams);

        const incidentResponse = await fetch("/api/v1/report/fetch-all", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
        });
        const incidentData = await incidentResponse.json();
        setIncidents(incidentData);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <LoadingPage />;

  const handleCreateNewIncident = (teamId) => {
    const team = teams.find((team) => team._id === teamId);
    setSelectedTeam(team);
    setShowModal(true);
  };

  const filteredTeams = teams.filter((team) => team.status != 6 && !team.alerted);
  const filteredIncidents = incidents.filter((incident) => !incident.resolved && !incident.archived);

  const teamsToShow = (
    filteredIncidents.length === 0 ? (
      <Card.Text>No active incidents.</Card.Text>
    ) : (
      <ListGroup variant="flush">
        {filteredIncidents.map((incident) => {
          const team = teams.find((team) => team._id === incident.firstResponders.teamID);

          return (
            <IncidentCard
              key={incident._id}
              incident={incident}
              team={team}
            />
          )
        })}
      </ListGroup>
    )
  );

  const incidentsToShow = (
    filteredTeams.length === 0 ? (
      <Card.Text>No available teams.</Card.Text>
    ) : (
      <ListGroup variant="flush">
        {filteredTeams.map(
          (team) => <TeamCard key={team._id} team={team} onDispatch={handleCreateNewIncident} />
        )}
      </ListGroup>
    )
  );

  return (
    <Container className="mt-4 select-none">
      <Typography variant="h4" component="h1" gutterBottom>
        Operations
      </Typography>
      <Row>
        <Col xs={12} className="mb-4">
          <Card className="mb-4">
            <Card.Header>Active Incidents</Card.Header>
            <Card.Body>
              {teamsToShow}
            </Card.Body>
          </Card>
        </Col>
        <Col xs={12} className="mb-4">
          <Card className="mb-4">
            <Card.Header>Available Teams</Card.Header>
            <Card.Body>
              {incidentsToShow}
            </Card.Body>
          </Card>
        </Col>
      </Row>
      <NewIncidentModal show={showModal} handleClose={() => setShowModal(false)} team={selectedTeam} incidents={incidents} />
    </Container>
  );
};

const NewIncidentModal = ({ show, handleClose, team, incidents }) => {
  const { t } = useTranslation();
  const [location, setLocation] = useState("");
  const [missionInfo, setMissionInfo] = useState("");
  const [urgenceLevel, setUrgenceLevel] = useState(4);
  const [missionID, setMissionID] = useState("");

  // Get the mission ID
  useEffect(() => {
    const getMissionID = () => {
      // Each incident has a unique mission ID which is generated as follows:
      /**
       * Mission ID: YYYYMMDDXX
       * Where:
       * - YYYYMMDD is the date of the incident
       * - XX is a two-digit number that increases by 1 for each incident on that day
       */

      // So to create a new mission ID for today's incident, we first need to get the incidents for today
      const todayIdPrefix = new Date().toISOString().slice(0, 10).replace(/-/g, "");
      const numberOfIncidentsToday = incidents.filter((incident) => {
        const currentIdStr = `${incident.missionNumber}`;
        const currentIdPrefix = currentIdStr.slice(0, 8);

        return currentIdPrefix === todayIdPrefix;
      }).length;

      // Now create the suffix
      const suffix = String(numberOfIncidentsToday + 1).padStart(2, '0');

      // Now create the mission ID
      const newMissionIDStr = `${todayIdPrefix}${suffix}`;

      // Now as a number
      const newMissionID = parseInt(newMissionIDStr);

      setMissionID(newMissionID);
    };

    if (!missionID) getMissionID();
  }, [incidents, missionID]);

  const handleCreateIncident = () => {
    if (location === "" || missionInfo === "") return;

    const dispatchMessage = `U${urgenceLevel} / ${location} **${team.name}*${missionID}*${missionInfo}`;
    // Here you would send the new incident data to the server
    alert(dispatchMessage);
    onHide();
  };

  // Calculate the number of rows based on the length of the mission information text
  const rows = missionInfo.split("\n").length;

  const onHide = () => {
    setLocation("");
    setMissionInfo("");
    setUrgenceLevel(4);
    setMissionID("");
    handleClose();
  };

  return (
    <Modal show={show} onHide={onHide} centered className="select-none">
      <Modal.Header closeButton>
        <Modal.Title>Create New Incident</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form validated>
          <Form.Group className="mb-3" controlId="formLocation">
            <Form.Label>Mission Number</Form.Label>
            <NonSelectableTextInput value={missionID} />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formLocation">
            <Form.Label>Mission Information</Form.Label>
            <Form.Control
              type="text"
              as={"textarea"}
              rows={rows}
              placeholder="Enter mission information"
              value={missionInfo}
              onChange={(e) => setMissionInfo(e.target.value)}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formLocation">
            <Form.Label>Location</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formUrgenceLevel">
            <Form.Label>Urgence Level</Form.Label>
            <Form.Select
              value={urgenceLevel}
              onChange={(e) => setUrgenceLevel(Number(e.target.value))}
              required
            >
              <option value={4}>U4 - {t('emergency_level.4')}</option>
              <option value={3}>U3 - {t('emergency_level.3')}</option>
              <option value={2}>U2 - {t('emergency_level.2')}</option>
              <option value={1}>U1 - {t('emergency_level.1')}</option>
            </Form.Select>
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Close
        </Button>
        <Button variant="primary" onClick={handleCreateIncident}>
          Create Incident
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

const NonSelectableTextInput = ({ value }) => {
  // TODO: Fix
  const preventSelection = (e) => {
    e.preventDefault();
  };

  return (
    <Form.Control
      type="text"
      value={value}
      disabled
      onMouseDown={preventSelection}
      onSelect={preventSelection}
      style={{ userSelect: 'none', MozUserSelect: 'none', WebkitUserSelect: 'none', msUserSelect: 'none' }}
    />
  );
};

const IncidentCard = ({ incident, team }) => {
  const { t } = useTranslation();

  const emergencyLevel = incident.missionInfo.urgenceLevel;
  const formattedEmergencyLevel = `U${emergencyLevel}`;

  const formattedEmergencyStr = (level) => {
    switch (level) {
      case 4:
        return t(`emergency_level.4`);
      case 3:
        return t(`emergency_level.3`);
      case 2:
        return t(`emergency_level.2`);
      case 1:
        return t(`emergency_level.1`);
    }
  };

  const getEmergencyColor = (level) => {
    switch (level) {
      case 4:
        return "primary";
      case 3:
        return "success";
      case 2:
        return "warning";
      case 1:
        return "danger";
    }
  };

  return (
    <ListGroup.Item className="border-0 p-4 rounded-3 shadow-sm mb-3" variant={getEmergencyColor(emergencyLevel)} onClick={() => window.location.href = `/operations/${incident.missionNumber}`}>
      <div>
        <div className="mb-3">
          <h4 className="fw-bold mb-2">Mission #{incident.missionNumber}</h4>
          <p className="mb-0">Location: {incident.missionInfo.location}</p>
          <p className="mb-0">{formattedEmergencyLevel} - {formattedEmergencyStr(emergencyLevel)}</p>
        </div>
        {/* Display team information */}
        <hr />
        <TeamCard team={team} />
      </div>
    </ListGroup.Item>
  );
};

const TeamCard = ({ team, onDispatch }) => {
  const [showStatusChanger, setShowStatusChanger] = useState(false);
  const statusChangerRef = useRef(null);
  const assignedMembers = team.members;
  const status = team.status;

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (statusChangerRef.current && !statusChangerRef.current.contains(event.target)) {
        setShowStatusChanger(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [statusChangerRef]);

  return (
    <ListGroup.Item className="border-0 p-4 rounded-3 shadow-sm mb-3 align-items-center">
      <div>
        <div className="d-flex justify-content-between align-items-center">
          <div className="d-flex align-items-center">
            <div className="me-2" onClick={() => setShowStatusChanger(true)}><StatusSquare status={status} /></div>
            <h4 className="fw-bold mb-1">{team.name}</h4>
          </div>
          <div className="d-flex align-items-center">
            <div className="ms-3 d-none d-md-block">{assignedMembers.length} Members</div>
            {onDispatch && (
              <Button variant="contained" className="ms-3" onClick={() => onDispatch(team._id)}>
                <Send />
              </Button>
            )}
          </div>
          {showStatusChanger && (
            <div ref={statusChangerRef} style={{ position: 'absolute', top: '100%', left: 0, zIndex: 9999 }}>
              <StatusChanger currentStatus={status} close={() => setShowStatusChanger(false)} teamID={team._id} />
            </div>
          )}
        </div>
      </div>
    </ListGroup.Item>
  );
};

export default Operations;
