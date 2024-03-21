import { useEffect, useState } from "react";
import { Form, FormControl } from "react-bootstrap";
import IncidentReportCard from "../components/Incidents/IncidentReportCard";
import { getMember } from "../utils";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";

const Reports = () => {
  const [reports, setReports] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const { currentUser } = useSelector((state) => state.user);
  const roles = currentUser?.roles;
  const isAdmin = roles?.includes("admin");

  useEffect(() => {
    const fetchReports = async () => {
      const response = await fetch("/api/v1/report/fetch-all", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();
      setReports(data);
    };

    fetchReports();
  }, []);

  const getReportUsers = async (report) => {
    const firstResponders = report.firstResponders;
    const users = [];

    for (let i = 0; i < firstResponders.length; i++) {
      const iam = firstResponders[i].iam;
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
    console.log(`Edit report ${reportId}`);
  };

  const handleDeleteReport = (reportId) => {
    console.log(`Delete report ${reportId}`);
  };

  const handleExportPDF = (reportId) => {
    console.log(`Export PDF report ${reportId}`);
  };

  const handleArchive = (event) => {
    console.log(`Archive report ${event.target.value}`);
  };

  useEffect(() => {
    const filterReports = async () => {
      const filtered = [];

      for (const report of reports) {
        const reportUsers = await getReportUsers(report);
        const currentUserIAM = currentUser?.IAM;
        const isAdminOrUserIncluded = isAdmin || reportUsers.some(user => user.IAM === currentUserIAM);

        if (isAdminOrUserIncluded && report.missionNumber.toString().includes(searchTerm.toLowerCase())) {
          filtered.push({
            ...report,
            users: reportUsers,
          });
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
  }, [reports, searchTerm, currentUser, isAdmin]);

  const [filteredReports, setFilteredReports] = useState([]);

  return (
    <div>
      <h1>Reports</h1>
      <div className="mb-3">
        <Form>
          <FormControl
            type="text"
            placeholder="Search by mission number..."
            className="mr-sm-2"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </Form>
      </div>
      <div className="row row-cols-1 row-cols-md-3 g-4">
        {filteredReports.map((report, index) => (
          <div key={index} className="col">
            <IncidentReportCard
              missionNumber={report.missionNumber.toString()}
              users={report.users}
              currentUser={currentUser}
              onEdit={() => handleEditReport(report.id)}
              onDelete={() => handleDeleteReport(report.id)}
              onExportPDF={() => handleExportPDF(report.id)}
              onArchive={() => handleArchive(report.id)}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Reports;
