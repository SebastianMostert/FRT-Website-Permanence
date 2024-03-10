import { useSelector } from "react-redux";
import InputLabel from "../components/Inputs/InputLabel";
import InputField from "../components/Inputs/InputField";
import DropdownMenu from "../components/Inputs/DropdownMenu";

export default function Report() {
  const { loading } = useSelector((state) => state.user);

  const handleSubmit = async (e) => {
    console.log(e);
    // Add your logic to handle form submission (e.g., dispatching an action)
  };

  const handleChange = (e) => {
    console.log(e);
    // Add your logic to handle input changes if needed
  };

  return (
    <div className='max-w-lg mx-auto'>
      <h1 className='text-3xl font-semibold text-center my-7'>EMT Report</h1>
      <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
        {/* General Information */}
        <div>
          <h2 className='text-xl font-semibold mb-2'>General Information</h2>
          <div className="flex gap-4">
            <div className="flex-1">
              <InputLabel text="First Name" />
              <InputField
                type='text'
                id='firstName'
                placeholder='First Name'
                onChange={handleChange}
              />
            </div>
            <div className="flex-1">
              <InputLabel text="Last Name" />
              <InputField
                type='text'
                id='lastName'
                placeholder='Last Name'
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="flex gap-4">
            <div className="flex-1">
              <InputLabel text="Patient Age" />
              <InputField
                type='text'
                id='patientAge'
                placeholder='Patient Age'
                onChange={handleChange}
              />
            </div>
            <div className="flex-1">
              <div className="flex flex-col">
                <InputLabel text="Gender" />
                <DropdownMenu
                  label=''
                  selectedValue={{}}
                  onChange={handleChange}
                  options={[
                    { value: '', label: 'Select Gender' },
                    { label: 'Male', value: 'male' },
                    { label: 'Female', value: 'female' },
                  ]}
                  style={{ width: '150px' }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* SAMPLER */}
        <div>
          <h2 className='text-xl font-semibold my-4'>SAMPLER</h2>
          <InputField
            label='Symptoms'
            type='textarea'
            id='symptoms'
            placeholder='Describe symptoms...'
            onChange={handleChange}
          />
          <InputField
            label='Allergies'
            type='textarea'
            id='allergies'
            placeholder='List allergies...'
            onChange={handleChange}
          />
          <InputField
            label='Medicine (currently being taken)'
            type='textarea'
            id='medicine'
            placeholder='List medicines...'
            onChange={handleChange}
          />
          <InputField
            label='Last Oral Intake (liquid, food)'
            type='textarea'
            id='lastOralIntake'
            placeholder='Describe last oral intake...'
            onChange={handleChange}
          />
          <InputField
            label='Event (leading up to the incident)'
            type='textarea'
            id='event'
            placeholder='Describe the event...'
            onChange={handleChange}
          />
          <InputField
            label='Risk Factors'
            type='textarea'
            id='riskFactors'
            placeholder='List risk factors...'
            onChange={handleChange}
          />
        </div>

        {/* Submit Button */}
        <button className='bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80'>
          {loading ? 'Loading...' : 'Submit Report'}
        </button>
      </form>
    </div>
  );
}