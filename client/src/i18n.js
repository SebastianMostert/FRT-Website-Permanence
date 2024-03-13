// i18n.js
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import enTranslation from './locales/en.json';
import deTranslation from './locales/de.json';
import frTranslation from './locales/fr.json';
import luTranslation from './locales/lu.json';

const resources = {
    en: { translation: enTranslation },
    de: { translation: deTranslation },
    fr: { translation: frTranslation },
    lu: { translation: luTranslation },
};

i18n
    .use(initReactI18next)
    .init({
        resources,
        lng: sessionStorage.getItem('selectedLanguage') || 'en', // default language
        interpolation: {
            escapeValue: false, // react already safely escapes interpolated values
        },
    });

export default i18n;
