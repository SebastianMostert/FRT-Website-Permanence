/* eslint-disable react/prop-types */
import { useEffect, useState } from 'react';
import { Container, Form, Button, Accordion } from 'react-bootstrap';
import FirstResponders from './FirstResponders';
import PatientInformation from './PatientInformation';
import ABCDESchema from './ABCDESchema';
import SamplerSchema from './SamplerSchema';
import MissionNumber from '../Inputs/MissionNumber';
import { updateReport } from '../../utils';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import MissionInformation from './MissionInformation';
import { LoadingPage } from '../../pages';

const defaultValues = {
    firstRespondersValues: {},
    patientInfoValues: {
        age: '',
        gender: '',
        firstName: '',
        lastName: '',
        IAM: '',
        matricule: '',
    },
    ABCDEValues: {
        criticalBleeding: {
            problem: false,
            tourniquet: false,
            tourniquetTime: '',
            manualCompression: false,
        },
        airway: {
            problem: false,
            airway: '',
            cervicalSpineTrauma: false,
            esmarch: false,
            guedel: false,
            wendl: false,
            absaugen: false,
            stiffneck: false,
        },
        breathing: {
            breathingSpeed: '',
            auskultationSeitengleich: false,
            thorax: '',
            sauerStoffgabe: false,
            sauerstoffgabeLiters: '',
            brille: false,
            maske: false,
            beatmungsbeutel: false,
            assistierteBeatmung: false,
            hyperventilationsmaske: false,
            oberkörperhochlagerung: false,
        },
        circulation: {
            problem: false,
            pulsRegelmäßig: '',
            pulsTastbar: '',
            bpm: '',
            sys: '',
            dia: '',
            abdomen: '',
            becken: '',
            oberschenkel: '',
            ecgImage: '',
            spO2: '',
        },
        disability: {
            problem: false,
            dmsExtremitäten: false,
            durchblutung: false,
            motorik: false,
            sensorik: false,
            avpu: "",
            bewegungRight: "",
            bewegungLeft: "",
            pupillenRight: "",
            fastProblem: false,
            arms: false,
            time: false,
            speech: false,
            face: false,
            fastDetails: "",
            pupillenRightLicht: false,
            pupillenLeftLicht: false,
            temperature: "",
            bloodSugar: '',
        },
        exposureEnvironment: {
            problem: false,
            wärmeerhalt: false,
            schmerzskala: 0,
            weitereVerletzungen: '',
            wundversorgung: false,
            extremitätenschienung: false,
            bodycheck: false,
            bodyDiagramLetters: [],
        },
    },
    samplerValues: {
        symptoms: {
            text: '',
            erhoben: false,
        },
        allergies: {
            text: '',
            erhoben: false,
        },
        medications: {
            text: '',
            medicineHasImage: false,
            medicineListImage: '',
            erhoben: false,
        },
        pastMedicalHistory: {
            text: '',
            erhoben: false,
        },
        lastOralIntake: {
            type: '',
            time: '',
            erhoben: false,
            details: ''
        },
        events: {
            text: '',
            erhoben: false,
        },
        riskFactors: {
            text: '',
            erhoben: false,
        },
    },
    missionInfo: {
        quickReport: '',
        location: '',
        valuablesGivenTo: '',
        SepasContacted: false,
        ambulanceCalled: false,
        urgenceLevel: 4,
        callTime: '',
        responseTime: '',
        onSiteTime: '',
        finishedTime: '',
        freeOnRadio: '',
    },
    archived: false,
}

const ReportForm = ({ _missionNumber, isEditable, setIsEditable }) => {
    const [missionNumber, setMissionNumber] = useState(_missionNumber);
    const [firstResponders, setFirstResponders] = useState(defaultValues.firstRespondersValues);
    const [patientInfo, setPatientInfo] = useState(defaultValues.patientInfoValues);
    const [abcdeSchema, setAbcdeData] = useState(defaultValues.ABCDEValues);
    const [samplerSchema, setSamplerData] = useState(defaultValues.samplerValues);
    const [missionInfo, setMissionInfo] = useState(defaultValues.missionInfo);
    const [dataLoaded, setDataLoaded] = useState(false);
    const [isNewReport, setIsNewReport] = useState(false);
    const [loading, setLoading] = useState(true);

    const [validated, setValidated] = useState(false);

    const { t } = useTranslation();

    const handlePatientChange = (event) => {
        const { name, value } = event.target;
        setPatientInfo({ ...patientInfo, [name]: value });
    };

    const handleABCDEChange = (field, subField, value) => {
        setAbcdeData({
            ...abcdeSchema,
            [field]: {
                ...abcdeSchema[field],
                [subField]: value,
            },
        });
    };

    const handleSamplerChange = (field, subField, value) => {
        setSamplerData({
            ...samplerSchema,
            [field]: {
                ...samplerSchema[field],
                [subField]: value,
            },
        });
    };

    const handleMissionInfoChange = (event) => {
        const { name, value } = event.target;
        setMissionInfo({ ...missionInfo, [name]: value });
    };

    const handleMissionNumberChange = (newMissionNumber) => {
        setMissionNumber(newMissionNumber.split(''));
    };

    const handleSubmit = async (event) => {
        const form = event.currentTarget;
        if (form.checkValidity() === false) {
            event.preventDefault();
            event.stopPropagation();

            toast.error(`${t('toast.report.create.error.invalid')}`);
        } else {
            event.preventDefault();

            // Gather all the data
            let finalMissionNumber;
            // If the mission number is an array join it
            if (Array.isArray(missionNumber)) {
                finalMissionNumber = missionNumber.join('');
            } else {
                finalMissionNumber = missionNumber;
            }

            const reportData = {
                missionNumber: finalMissionNumber,
                firstResponders,
                patientInfo,
                abcdeSchema,
                samplerSchema,
                missionInfo,
            };

            if (isNewReport) {
                try {
                    // Send the data to the server
                    const res = await fetch(`/api/v1/report/create`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(reportData),
                    });

                    const success = res.status < 300;

                    if (!success) toast.error(`${t('toast.report.create.error')}`);
                    else {
                        toast.success(`${t('toast.report.create.success')}`);
                        setIsNewReport(false);
                    }

                } catch (err) {
                    toast.error(`${t('toast.report.create.error')}`);
                    console.error(err);
                }

            } else {
                // Send the data to the server
                const { success } = await updateReport(reportData);

                if (!success) toast.error(`${t('toast.report.update.error')}`);
                else toast.success(`${t('toast.report.update.success')}`);
            }
        }

        setValidated(true);
    };

    const getReportData = async (missionNumber) => {
        let finalMissionNumber;
        // If the mission number is an array join it
        if (Array.isArray(missionNumber)) {
            finalMissionNumber = missionNumber.join('');
        } else {
            finalMissionNumber = missionNumber;
        }

        const res = await fetch(`/api/v1/report/fetch/${finalMissionNumber}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        const data = await res.json();
        return data;
    }

    useEffect(() => {
        if (missionNumber.length === 10 && !isNaN(parseInt(missionNumber))) {
            getReportData(missionNumber).then((data) => {
                // If there is not a report for this mission number, mark this report as new
                if (!data) {
                    setIsNewReport(true);
                } else {
                    if (data?.archived) setIsEditable(false);
                    setIsNewReport(false);
                }

                setFirstResponders(data?.firstResponders || defaultValues.firstRespondersValues);
                setPatientInfo(data?.patientInfo || defaultValues.patientInfoValues);
                setAbcdeData(data?.abcdeSchema || defaultValues.ABCDEValues);
                setSamplerData(data?.samplerSchema || defaultValues.samplerValues);
                setMissionInfo(data?.missionInfo || defaultValues.missionInfo);
                setDataLoaded(true);
                setLoading(false);
            });
        }
    }, [missionNumber, setIsEditable]);

    useEffect(() => {
        const extractMissionInfo = () => {
            const year = missionNumber.substring(0, 4);
            const month = missionNumber.substring(4, 6);
            const day = missionNumber.substring(6, 8);
            const incidentNumber = missionNumber.substring(8);

            return {
                year,
                month,
                day,
                incidentNumber,
            };
        };

        const extractedMissionInfo = extractMissionInfo();

        // Check if the incident is from today
        const isToday = new Date().toLocaleDateString() === `${extractedMissionInfo.day}/${extractedMissionInfo.month}/${extractedMissionInfo.year}`;

        if (missionNumber.length === 10) {
            if (isToday) {
                setIsEditable(true);
            } else {
                console.warn('The incident is not from today');
                setIsEditable(false);
            }
        } else {
            console.warn('Invalid mission number');
            setIsEditable(false);
        }
    })
    if (!dataLoaded) return <LoadingPage />

    const reportFormSubcomponents = {
        firstResponders: {
            body: (
                <FirstResponders
                    isEditable={isEditable}
                    firstResponders={firstResponders}
                    setFirstResponders={setFirstResponders}
                />
            ),
            header: t('report.first_responders.title'),
            key: 'firstResponders',
        },
        patientInfo: {
            body: (
                <PatientInformation
                    isEditable={isEditable}
                    patientInfo={patientInfo}
                    handlePatientChange={handlePatientChange}
                />
            ),
            header: t('report.patient.title'),
            key: 'patientInfo',
        },
        abcdeSchema: {
            body: (
                <ABCDESchema
                    isEditable={isEditable}
                    abcdeData={abcdeSchema}
                    handleABCDEChange={handleABCDEChange}
                />
            ),
            header: t('report.abcde.title'),
            key: 'abcdeSchema',
        },
        samplerSchema: {
            body: (
                <SamplerSchema
                    isEditable={isEditable}
                    samplerData={samplerSchema}
                    handleSamplerChange={handleSamplerChange}
                />
            ),
            header: t('report.sampler.title'),
            key: 'samplerSchema',
        },
        missionInformation: {
            body: (
                <MissionInformation
                    isEditable={isEditable}
                    missionInfo={missionInfo}
                    handleMissionInfoChange={handleMissionInfoChange}
                />
            ),
            header: t('report.mission_information.title'),
            key: 'missionInformation',
        },
    };

    const CustomAccordion = ({ body, header, key }) => {
        return (
            <Accordion defaultActiveKey="0" key={key}>
                <Accordion.Item eventKey="0">
                    <Accordion.Header>{header}</Accordion.Header>
                    <Accordion.Body>
                        {body}
                    </Accordion.Body>
                </Accordion.Item>
            </Accordion>
        );
    }

    if (loading) return <LoadingPage />

    return (
        <Container className='select-none'>
            <h2 className="mt-4 mb-3">{t('report.title')}</h2>
            <Form onSubmit={handleSubmit} noValidate validated={validated}>
                <Form.Group className="mb-3">
                    <Form.Label>{t('report.mission_number')}</Form.Label>
                    <MissionNumber
                        missionNumber={missionNumber}
                        handleMissionNumberChange={handleMissionNumberChange}
                    />
                </Form.Group>

                {Object.keys(reportFormSubcomponents).map((key) => {
                    return CustomAccordion(reportFormSubcomponents[key]);
                })}

                <Button variant="success" type="submit" className='w-full mt-2 mb-5' disabled={!isEditable} >
                    {t('button.submit')}
                </Button>
            </Form>
        </Container >
    );
};

export default ReportForm;
