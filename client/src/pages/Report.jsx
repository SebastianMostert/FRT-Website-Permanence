/* eslint-disable react/prop-types */
import ReportForm from "../components/Report/ReportForm";
import { NotFoundPage } from "./index";
import { useParams } from 'react-router-dom';
import { useEffect, useState } from "react";

const Report = () => {
  const [isEditable, setIsEditable] = useState(false);
  let { missionNumber } = useParams();


  useEffect(() => {
    const extractMissionInfo = () => {
      const year = missionNumber.substring(0, 4);
      const month = missionNumber.substring(4, 6);
      const day = missionNumber.substring(6, 8);
      const incidentNumber = missionNumber.substring(8);

      return {
        year,
        month,
        day,
        incidentNumber,
      };
    };

    const missionInfo = extractMissionInfo();
    const isToday = new Date().toLocaleDateString() === `${missionInfo.day}/${missionInfo.month}/${missionInfo.year}`;

    if (missionNumber.length === 10 && isToday) setIsEditable(true);
    else setIsEditable(false);
  }, [missionNumber]);

  // Ensure correct format 
  if (missionNumber.length !== 10) return <NotFoundPage />
  if (!missionNumber.match(/^[0-9]+$/)) return <NotFoundPage />

  return (
    <div className='max-w-4xl mx-auto'>
      <ReportForm _missionNumber={missionNumber} isEditable={isEditable} setIsEditable={setIsEditable} />
    </div>
  );
};

export default Report;