/* eslint-disable react/prop-types */
import ReportForm from "../components/Report/ReportForm";
import NotFound from "./ErrorPages/Pages/404";
import { useParams } from 'react-router-dom';
import { useEffect, useState } from "react";

const Report = () => {
  const [isEditable, setIsEditable] = useState(false);
  let { missionNumber } = useParams();

  useEffect(() => {
    // Check if current day matches the day in the mission number
    const today = new Date();
    const missionDate = new Date(
      `${missionNumber[0]}${missionNumber[1]}${missionNumber[2]}${missionNumber[3]}-${missionNumber[4]}${missionNumber[5]}-${missionNumber[6]}${missionNumber[7]}`
    );

    if (
      missionNumber.length === 10 &&
      today.getFullYear() === missionDate.getFullYear() &&
      today.getMonth() === missionDate.getMonth() &&
      today.getDate() === missionDate.getDate()
    ) {
      setIsEditable(true);
    } else {
      setIsEditable(false);
    }
  }, [missionNumber]);

  // Ensure correct format 
  if (missionNumber.length !== 10) return <NotFound />
  if (!missionNumber.match(/^[0-9]+$/)) return <NotFound />

  return (
    <div className='max-w-4xl mx-auto'>
      <ReportForm _missionNumber={missionNumber} isEditable={isEditable} />
    </div>
  );
};

export default Report;