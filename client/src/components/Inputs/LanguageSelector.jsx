import { useTranslation } from 'react-i18next';

const LanguageSelector = () => {
    const { i18n, t } = useTranslation();

    const languageChangeHandler = (event) => {
        const selectedLanguage = event.target.value;

        // Save the selected language to session storage
        sessionStorage.setItem('selectedLanguage', selectedLanguage);

        // Change the language
        i18n.changeLanguage(selectedLanguage);
    };

    return (
        <div>
            <div>
                <select
                    id="languageSelector"
                    onChange={languageChangeHandler}
                    value={i18n.language}
                >
                    <option value="en">{t("language.english")}</option>
                    <option value="fr">{t("language.french")}</option>
                    <option value="de">{t("language.german")}</option>
                    <option value="lu">{t("language.luxembourgish")}</option>
                </select>
            </div>
        </div>
    )
}

export default LanguageSelector