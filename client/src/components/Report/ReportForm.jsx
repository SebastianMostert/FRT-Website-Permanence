/* eslint-disable react/prop-types */
import { useEffect, useState } from 'react';
import { Container, Form, Button, Accordion, Placeholder } from 'react-bootstrap';
import FirstResponders from './FirstResponders';
import PatientInformation from './PatientInformation';
import ABCDESchema from './ABCDESchema';
import SamplerSchema from './SamplerSchema';
import MissionNumber from '../Inputs/MissionNumber';
import { updateReport } from '../../utils';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';

const defaultValues = {
    firstRespondersValues: [
        { position: 'Chef Agres', iam: '' },
        { position: 'Equipier Bin.', iam: '' },
        { position: 'Stagiaire Bin.', iam: '' },
    ],
    patientInfoValues: {
        age: '',
        gender: '',
        firstName: '',
        lastName: '',
        iam: '',
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
    }
}

const ReportForm = ({ _missionNumber, isEditable, setIsEditable }) => {
    const [missionNumber, setMissionNumber] = useState(_missionNumber);
    const [firstResponders, setFirstResponders] = useState(defaultValues.firstRespondersValues);
    const [patientInfo, setPatientInfo] = useState(defaultValues.patientInfoValues);
    const [abcdeSchema, setAbcdeData] = useState(defaultValues.ABCDEValues);
    const [samplerSchema, setSamplerData] = useState(defaultValues.samplerValues);
    const [dataLoaded, setDataLoaded] = useState(false);
    const [isNewReport, setIsNewReport] = useState(false);

    const [validated, setValidated] = useState(false);

    const { t } = useTranslation();

    const handleResponderChange = (updatedResponders) => {

        setFirstResponders(updatedResponders);
    };

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
                setDataLoaded(true);
            });
        }
    }, [missionNumber, setIsEditable]);

    if (!dataLoaded) {
        return (
            <Container>
                <h2 className="mt-4 mb-3">{t('report.title')}</h2>
                <Form onSubmit={handleSubmit}>
                    <Form.Group className="mb-3">
                        <Form.Label>{t('report.mission_number')}</Form.Label>
                        <Placeholder as={Form.Control} animation='wave' bg='secondary' />
                    </Form.Group>

                    <Accordion defaultActiveKey="0">
                        <Accordion.Item eventKey="0">
                            <Accordion.Header>{t('report.first_responders.title')}</Accordion.Header>
                            <Accordion.Body>
                                <Placeholder as={Form.Control} animation='wave' bg='secondary' />
                            </Accordion.Body>
                        </Accordion.Item>
                    </Accordion>

                    <Accordion defaultActiveKey="1">
                        <Accordion.Item eventKey="1">
                            <Accordion.Header>{t('report.patient.title')}</Accordion.Header>
                            <Accordion.Body>
                                <Placeholder as={Form.Control} animation='wave' bg='secondary' />
                            </Accordion.Body>
                        </Accordion.Item>
                    </Accordion>

                    <Accordion defaultActiveKey="1">
                        <Accordion.Item eventKey="1">
                            <Accordion.Header>{t('report.abcde.title')}</Accordion.Header>
                            <Accordion.Body>
                                <Placeholder as={Form.Control} animation='wave' bg='secondary' />
                            </Accordion.Body>
                        </Accordion.Item>
                    </Accordion>

                    <Accordion defaultActiveKey="1">
                        <Accordion.Item eventKey="1">
                            <Accordion.Header>{t('report.sampler.title')}</Accordion.Header>
                            <Accordion.Body>
                                <Placeholder as={Form.Control} animation='wave' bg='secondary' />
                            </Accordion.Body>
                        </Accordion.Item>
                    </Accordion>

                    <Button variant="secondary" type="submit">
                        {t('button.submit')}
                    </Button>
                </Form>
            </Container>
        );
    }

    const reportFormSubcomponents = {
        firstResponders: {
            body: (
                <FirstResponders
                    isEditable={isEditable}
                    firstResponders={firstResponders}
                    handleResponderChange={handleResponderChange}
                />
            ),
            header: t('report.first_responders.title'),
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
        },
    };

    const CustomAccordion = ({ body, header }) => {
        return (
            <Accordion defaultActiveKey="0">
                <Accordion.Item eventKey="0">
                    <Accordion.Header>{header}</Accordion.Header>
                    <Accordion.Body>
                        {body}
                    </Accordion.Body>
                </Accordion.Item>
            </Accordion>
        );
    }

    return (
        <Container>
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