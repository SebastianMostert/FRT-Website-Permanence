import { useSelector } from "react-redux";
import ReportForm from "../components/Report/ReportForm";
import { NotAuthorized } from "./ErrorPages/Pages/401";

export default function Report() {
  const { currentUser, loading } = useSelector((state) => state.user)

  const handleChange = (e) => {
    console.log('Here');
    console.log(e.target.id + ': ' + e.target.value);
  }

  if (!currentUser?.IAM) {
    return <NotAuthorized />
  }

  return (
    <div className='max-w-4xl mx-auto'>
      <ReportForm handleChange={handleChange} loading={loading} />
    </div>
  );
}