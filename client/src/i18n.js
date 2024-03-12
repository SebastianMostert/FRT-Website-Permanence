// i18n.js
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import enTranslation from './locales/en.json';
import deTranslation from './locales/de.json';

const resources = {
    en: { translation: enTranslation },
    de: { translation: deTranslation },
};

i18n
    .use(initReactI18next)
    .init({
        resources,
        lng: 'en', // default language
        interpolation: {
            escapeValue: false, // react already safely escapes interpolated values
        },
        fallbackLng: 'en',
    });

export default i18n;
