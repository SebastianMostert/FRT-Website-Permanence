import { useTranslation } from 'react-i18next';
/* eslint-disable react/prop-types */

const SubmitButton = ({ loading }) => {
    const { t } = useTranslation();

    return (
        <button className='bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80'>
            {loading ? `${t('button.loading')}` : `${t('button.submit')}` }
        </button>
    )
};

export default SubmitButton;