const ContactInfo = () => {
    const contactDetails = [
        { label: 'In case of an emergency, call', value: '112' },
        { label: 'Email Address', value: 'lux.frt.llis@gmail.com', link: 'mailto:lux.frt.llis@gmail.com' },
        { label: 'Follow us on Instagram', value: '@frt.llis', link: 'https://www.instagram.com/frt.llis/' },
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
