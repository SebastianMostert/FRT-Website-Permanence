import { useSelector } from "react-redux";
import ReportForm from "../components/Report/ReportForm";

export default function Report() {
  const { loading } = useSelector((state) => state.user);

  const handleChange = (e) => {
    console.log('Here');
    console.log(e.target.id + ': ' + e.target.value);
  }

  return (
    <div className='max-w-4xl mx-auto'>
      <ReportForm handleChange={handleChange} loading={loading} />
    </div>
  );
}