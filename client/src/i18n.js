// i18n.js
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import allTranslations from './locales/translations';

i18n
    .use(initReactI18next)
    .init({
        resources: allTranslations,
        lng: sessionStorage.getItem('selectedLanguage') || 'en', // default language
        interpolation: {
            escapeValue: false, // react already safely escapes interpolated values
        },
    });

export default i18n;
