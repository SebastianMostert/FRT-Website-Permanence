import { useTranslation } from 'react-i18next';

const ContactInfo = () => {
    const { t } = useTranslation();

    const contactDetails = [
        { label: `${t('contactLabel112')}`, value: '112' },
        { label: `${t('emailAddressLabel')}`, value: 'lux.frt.llis@gmail.com', link: 'mailto:lux.frt.llis@gmail.com' },
        { label: `${t('instagramLabel')}`, value: '@frt.llis', link: 'https://www.instagram.com/frt.llis/' },
    ];

    return (
        <div className="space-y-2">
            {contactDetails.map(({ label, value, link }) => (
                <div key={label}>
                    <span className="font-semibold">{label}:</span> {' '}
                    {link ? <a href={link} className="text-blue-500 hover:underline">{value}</a> : <span>{value}</span>}
                </div>
            ))}
        </div>
    );
};

export default ContactInfo;
