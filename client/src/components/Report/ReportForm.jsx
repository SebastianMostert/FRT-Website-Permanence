/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */

import ABCDESchema from "./ABCDE/ABCDESchema";
import CollapsibleSection from "./CollapsibleSection";

const ReportForm = ({ handleChange }) => {

    return (
        <>
            <h1 className="text-3xl font-semibold text-center my-7">First Responder Report [WIP]</h1>
            <CollapsibleSection title="(c) ABCDE Schema">
                <ABCDESchema handleChange={handleChange} />
            </CollapsibleSection>

            {/* Add other CollapsibleSections or components here if needed */}
        </>
    );
};

export default ReportForm;

/*
Boolbtn = Button with Yes or No option / Radio Button

CIRCULATION       | Yes/No  | -------------------------------------------------------------- | ---------------------------------------------------------- |
*                 | >>>>>>  | Puls (regelmäßig, unregelmäßig, gut tastbar, schwach tastbar)  | Flachlagerung (Boolbtn)                                    |
*                 | >>>>>>  | Abdomen (weich, hart)                                          | Schocklagerung (Boolbtn)                                   |
*                 | >>>>>>  | Becken (stabil, instabil)                                      | Stabile Seitenlage (Boolbtn)                               |
*                 | >>>>>>  | Oberschenkel (stabil, instabil)                                | (Druck-)Verband/Blutstillung (Boolbtn)                     |
DISABILITY        | Yes/No  | -------------------------------------------------------------- | ---------------------------------------------------------- |
*                 | >>>>>>  | Wach (Boolbtn)                                                 |                                                            |
*                 | >>>>>>  | Ansprechbar (Boolbtn)                                          |                                                            |
*                 | >>>>>>  | Schmerzreiz (Boolbtn)                                          |                                                            |
*                 | >>>>>>  | Bewusstlos (Boolbtn)                                           |                                                            |
*                 | >>>>>>  | Bewegung (Buttons below select what applies for rechts/links)  |                                                            |
*                 | >>>>>>  | >>>>>> Normal (Select if applies Rechts / Links)               |                                                            |
*                 | >>>>>>  | >>>>>> Eingeschränkt (Select if applies Rechts / Links)        |                                                            |
*                 | >>>>>>  | >>>>>> Fehlt  (Select if applies Rechts / Links)               |                                                            |
*                 | >>>>>>  | DMS Extremitäten Problem (Boolbtn)                             |                                                            |
*                 | >>>>>>  | >>>>>> Durchblutung (Boolbtn)                                  |                                                            |
*                 | >>>>>>  | >>>>>> Motorik (Boolbtn)                                       |                                                            |
*                 | >>>>>>  | >>>>>> Sensorik (Boolbtn)                                      |                                                            |
*                 | >>>>>>  | Fast Probleme (Boolbtn)                                        |                                                            |
*                 | >>>>>>  | >>>>>> (Only show if yes) Face (Boolbtn)                       |                                                            |
*                 | >>>>>>  | >>>>>> (Only show if yes) Arms (Boolbtn)                       |                                                            |
*                 | >>>>>>  | >>>>>> (Only show if yes) Speech (Boolbtn)                     |                                                            |
*                 | >>>>>>  | >>>>>> (Only show if yes) Time (Boolbtn)                       |                                                            |
*                 | >>>>>>  | Pupillen (Buttons below select what applies for rechts/links)  |                                                            |
*                 | >>>>>>  | >>>>>> eng (Select if applies Rechts / Links)                  |                                                            |
*                 | >>>>>>  | >>>>>> normal (Select if applies Rechts / Links)               |                                                            |
*                 | >>>>>>  | >>>>>> weit  (Select if applies Rechts / Links)                |                                                            |
*                 | >>>>>>  | >>>>>> entrundet  (Select if applies Rechts / Links)           |                                                            |
*                 | >>>>>>  | >>>>>> lichtreaktiv  (Select if applies Rechts / Links)        |                                                            |
ENVIRONMENT       | Yes/No  | -------------------------------------------------------------- | ---------------------------------------------------------- |
*                 | >>>>>>  | Schmerzskala: (0 - 10)                                         | Wärmeerhalt (Boolbtn)                                      |
*                 | >>>>>>  | Other: (Text Field)                                            | Wundversorgung (Boolbtn)                                   |
*                 | >>>>>>  |                                                                | Extremitätenschienung (Boolbtn)                            |
 */