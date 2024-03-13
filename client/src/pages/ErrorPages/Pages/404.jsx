/* eslint-disable react/no-deprecated */
/* eslint-disable no-undef */
import { useTranslation } from 'react-i18next';
import '../CSS/404.css'; // Import your CSS file

const NotFoundPage = () => {
    return (
        <NotFound />
    );
};

export default NotFoundPage;

export function NotFound() {
    const { t } = useTranslation();

    return (
        <div>
            <div id="oopss">
                <div id="error-text">
                    <img
                        src="https://cdn.rawgit.com/ahmedhosna95/upload/1731955f/sad404.svg"
                        alt={404}
                    />
                    <span>Error 404</span>
                    <p className="p-a">{t('404.description')}</p>
                    <p className="p-b"><a href="/">{t('404.home')}</a></p>
                </div>
            </div>
        </div>
    )
}