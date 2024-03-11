/* eslint-disable react/prop-types */
const SubmitButton = ({ loading }) => {
    return (
        <button className='bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80'>
            {loading ? 'Loading...' : 'Submit Report'}
        </button>
    )
};

export default SubmitButton;