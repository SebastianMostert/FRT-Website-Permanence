import { useSelector } from "react-redux";
import ReportForm from "../components/Report/ReportForm";
import NotAuthorized from "./ErrorPages/Pages/401";
import config from '../../config'


export default function Report() {
  const { currentUser } = useSelector((state) => state.user)

  if (!currentUser?.IAM) {
    return <NotAuthorized />
  }
  return (
    <div className='max-w-4xl mx-auto'>
      <ReportForm />
    </div>
  );
}