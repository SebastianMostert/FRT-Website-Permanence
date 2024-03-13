import { useTranslation } from 'react-i18next';

const NotAuthorizedPage = () => {
    return (
        <NotAuthorized />
    );
};

export default NotAuthorizedPage;

export function NotAuthorized() {
    const { t } = useTranslation();

    return (
        <div id="oopss">
            <div className="flex items-center justify-center h-screen w-screen">
                <div className="text-center p-8 bg-white rounded shadow-md max-w-xl w-full">
                    <div className="text-6xl font-bold text-red-500 mb-4">
                        401
                    </div>
                    <div className="text-6xl font-bold text-red-500 mb-4">
                        {t('401.title')}
                    </div>

                    <div className="text-xl text-gray-700 mb-4">
                        {t('401.description')}
                    </div>

                    <div className="text-md text-gray-600 mb-8">
                        {t('401.explanation')}
                    </div>

                    <div>
                        <a
                            href="/"
                            className="py-2 px-4 text-white bg-blue-500 rounded hover:bg-blue-700 remove-link-decoration"
                        >
                            {t('401.home')}
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
}