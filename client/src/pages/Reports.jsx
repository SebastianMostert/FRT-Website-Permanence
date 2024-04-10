import { useState, useEffect } from "react";
import { Form, Button, Col, Row, Container, InputGroup, FormControl, FloatingLabel } from "react-bootstrap";
import IncidentReportCard from "../components/Incidents/IncidentReportCard";
import { getAllReports, getMember, reportCSV, reportPDF, updateReport } from "../utils";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

const Reports = () => {
  const [reports, setReports] = useState([]);
  const [filteredReports, setFilteredReports] = useState([]);
  const [searchYear, setSearchYear] = useState("");
  const [searchMonth, setSearchMonth] = useState("");
  const [searchDay, setSearchDay] = useState("");
  const [searchNumber, setSearchNumber] = useState("");
  const [showArchived, setShowArchived] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(false); // State for refresh
  const { currentUser } = useSelector((state) => state.user);
  const navigateTo = useNavigate();
  const { t } = useTranslation();

  const roles = currentUser?.roles;
  const isAdmin = roles?.includes("admin");

  useEffect(() => {
    const fetchReports = async () => {
      const res = await getAllReports();
      const { success, data } = res;

      if (!success) return toast(t("toast.reports.fetch.error"));

      setReports(data);
    };

    fetchReports();
  }, [refreshTrigger, t]); // Trigger refresh when refreshTrigger changes

  // Function to refresh reports
  const refreshReports = () => {
    setRefreshTrigger((prev) => !prev);
  };

  const getReportUsers = async (report) => {
    const firstResponders = report.firstResponders;
    const users = [];

    for (let i = 0; i < firstResponders.length; i++) {
      const iam = firstResponders[i].iam;
      if (!iam) continue;
      const position = firstResponders[i].position;
      const res = await getMember(iam);
      if (res.success === false) {
        toast(res.message);
        return [];
      }

      let user = res.data;
      user.position = position;

      // Remove the password from the user object
      delete user.password;

      users.push(user);
    }

    return users;
  };

  const handleEditReport = (reportId) => {
    navigateTo(`/report/${reportId}`);
  };

  const handleExport = (reportData, exportType) => {
    if (exportType === 'pdf') {
      reportPDF(reportData);
    } else {
      reportCSV(reportData);
    }
  };

  const handleArchive = async (reportData) => {
    const newReportData = {
      ...reportData,
    }
    newReportData.archived = !reportData.archived;

    await updateReport(newReportData);
    refreshReports(); // Trigger refresh after (un)archive
  };

  useEffect(() => {
    const filterReports = async () => {
      const filtered = [];

      for (const report of reports) {
        const reportUsers = await getReportUsers(report);
        const currentUserIAM = currentUser?.IAM;
        const isAdminOrUserIncluded = isAdmin || reportUsers.some(user => user.IAM === currentUserIAM);

        const missionNumber = report.missionNumber.toString();
        const missionDate = missionNumber.substring(0, 8); // Get the first 8 characters for date
        const missionNumberPart = missionNumber.substring(8); // Get the last part of the mission number

        const searchYearNum = parseInt(searchYear);
        const searchMonthNum = parseInt(searchMonth);
        const searchDayNum = parseInt(searchDay);
        const searchNumberNum = parseInt(searchNumber);

        const missionYear = parseInt(missionDate.substring(0, 4));
        const missionMonth = parseInt(missionDate.substring(4, 6));
        const missionDay = parseInt(missionDate.substring(6, 8));

        const matchYear = isNaN(searchYearNum) || missionYear === searchYearNum;
        const matchMonth = isNaN(searchMonthNum) || missionMonth === searchMonthNum;
        const matchDay = isNaN(searchDayNum) || missionDay === searchDayNum;
        const matchNumber = isNaN(searchNumberNum) || parseInt(missionNumberPart) === searchNumberNum; // Compare as numbers

        if ((isAdminOrUserIncluded || showArchived) && matchYear && matchMonth && matchDay && matchNumber) {
          if (showArchived && report.archived) {
            filtered.push({
              ...report,
              users: reportUsers,
            });
          } else if (!showArchived && !report.archived) {
            filtered.push({
              ...report,
              users: reportUsers,
            });
          }
        }
      }

      // Sort the filtered reports from newest to oldest based on missionNumber date
      filtered.sort((a, b) => {
        const getDateFromMissionNumber = (missionNumber) => {
          const year = missionNumber.substring(0, 4);
          const month = missionNumber.substring(4, 6);
          const day = missionNumber.substring(6, 8);
          return new Date(`${year}-${month}-${day}`);
        };

        const dateA = getDateFromMissionNumber(a.missionNumber.toString());
        const dateB = getDateFromMissionNumber(b.missionNumber.toString());

        return dateB - dateA;
      });

      setFilteredReports(filtered);
    };

    filterReports();
  }, [reports, searchYear, searchMonth, searchDay, searchNumber, currentUser, isAdmin, showArchived, refreshTrigger]);

  const handleToggleArchived = () => {
    setShowArchived(!showArchived);
  };

  const handleCreateNewReport = () => {
    // Get the current date
    const currentDate = new Date();
    const year = currentDate.getFullYear().toString();
    let month = (currentDate.getMonth() + 1).toString(); // Adding 1 because months are zero-based
    let day = currentDate.getDate().toString();

    // Pad month and day with leading zero if needed
    if (month.length === 1) {
      month = '0' + month;
    }
    if (day.length === 1) {
      day = '0' + day;
    }

    const missionNumber = `${year}${month}${day}`;

    // Get the number of incidents on the current day
    const incidentsOnDay = reports.filter(report => report.missionNumber.toString().substring(0, 8) === missionNumber).length;

    // Calculate the last two digits for the mission number
    const lastTwoDigits = ('0' + (incidentsOnDay + 1)).slice(-2); // Add 1 to incidentsOnDay for the new report

    // Combine all parts to create the final mission number
    const finalMissionNumber = `${missionNumber}${lastTwoDigits}`;

    // Navigate to the create report page with the new mission number
    navigateTo(`/report/${finalMissionNumber}`);
  };

  return (
    <Container fluid>
      <Row>
        <Col md={4} lg={3}>
          <div className="mt-3 mb-3" style={{ border: "1px solid #ccc", padding: "10px", borderRadius: "8px", background: "#f9f9f9" }}>
            <h4 style={{ marginBottom: "15px" }}>{t('reports.search.title')}</h4>
            <Form>
              <InputGroup className="mb-3">
                <FloatingLabel label={t('reports.search.year')}>
                  <FormControl
                    type="text"
                    minLength={4}
                    maxLength={4}
                    value={searchYear}
                    onChange={(e) => setSearchYear(e.target.value)}
                  />
                </FloatingLabel>
                <FloatingLabel label={t('reports.search.month')}>
                  <FormControl
                    type="text"
                    minLength={2}
                    maxLength={2}
                    value={searchMonth}
                    onChange={(e) => setSearchMonth(e.target.value)}
                  />
                </FloatingLabel>
                <FloatingLabel label={t('reports.search.day')}>
                  <FormControl
                    type="text"
                    minLength={2}
                    maxLength={2}
                    value={searchDay}
                    onChange={(e) => setSearchDay(e.target.value)}
                  />
                </FloatingLabel>
              </InputGroup>
              <InputGroup className="mb-3">
                <FloatingLabel label={t('reports.search.incident_number')}>
                  <FormControl
                    type="text"
                    value={searchNumber}
                    onChange={(e) => setSearchNumber(e.target.value)}
                  />
                </FloatingLabel>
              </InputGroup>
              <Button variant={showArchived ? "outline-primary" : "primary"} onClick={handleToggleArchived} className="mt-3">
                {showArchived ? t('reports.button.show_archived') : t('reports.button.show_unarchived')}
              </Button>
              <Button variant="success" onClick={handleCreateNewReport} className="mt-3 ms-2">
                {t('reports.button.create')}
              </Button>
            </Form>
          </div>
        </Col>

        <Col md={8} lg={9}>
          <h1>{t('reports.title')}</h1>
          <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
            {filteredReports.map((report, index) => (
              <div key={index} className="col">
                <IncidentReportCard
                  report={report}
                  currentUser={currentUser}
                  onEdit={() => handleEditReport(report.missionNumber)}
                  onExport={handleExport}
                  onArchive={() => handleArchive(report)}
                />
              </div>
            ))}
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default Reports;
