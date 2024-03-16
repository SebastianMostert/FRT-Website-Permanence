import { useSelector } from "react-redux";
import ReportForm from "../components/Report/ReportForm";
import NotAuthorized from "./ErrorPages/Pages/401";
import config from '../../config'
import UnderDevelopment from "./ErrorPages/Pages/UnderDevelopment";

export default function Report() {
  const { currentUser } = useSelector((state) => state.user)

  if (!currentUser?.IAM) {
    return <NotAuthorized />
  }
  const isDevelopment = config.REACT_APP_DEVELOPMENT;
  console.log(isDevelopment);
  if (!isDevelopment) {
    return <UnderDevelopment />
  }

  return (
    <div className='max-w-4xl mx-auto'>
      <ReportForm />
    </div>
  );
}