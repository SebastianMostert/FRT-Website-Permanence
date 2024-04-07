/* eslint-disable react/prop-types */
import { useEffect, useState } from 'react';
import { Container, Form, Button, Accordion, Placeholder } from 'react-bootstrap';
import FirstResponders from './FirstResponders';
import PatientInformation from './PatientInformation';
import ABCDESchema from './ABCDESchema';
import SamplerSchema from './SamplerSchema';
import MissionNumber from '../Inputs/MissionNumber';
import { updateReport } from '../../utils';
import { apiCreateReport, apiFetchReport } from '../../APICalls/apiCalls';

const defaultValues = {
    firstRespondersValues: [
        { position: 'Chef Agres', iam: '' },
        { position: 'Equipier Bin', iam: '' },
        { position: 'Stagiaire Bin', iam: '' },
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
            sauerStoffgabe: '',
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

const ReportForm = ({ _missionNumber, isEditable }) => {
    const [missionNumber, setMissionNumber] = useState(_missionNumber);
    const [firstResponders, setFirstResponders] = useState(defaultValues.firstRespondersValues);
    const [patientInfo, setPatientInfo] = useState(defaultValues.patientInfoValues);
    const [abcdeSchema, setAbcdeData] = useState(defaultValues.ABCDEValues);
    const [samplerSchema, setSamplerData] = useState(defaultValues.samplerValues);
    const [dataLoaded, setDataLoaded] = useState(false);
    const [isNewReport, setIsNewReport] = useState(false);

    const handleResponderChange = (index, event) => {
        const updatedResponders = [...firstResponders];
        updatedResponders[index].iam = event.target.value;
        setFirstResponders(updatedResponders);
    };

    const handlePatientChange = (event) => {
        const { name, value } = event.target;
        setPatientInfo({ ...patientInfo, [name]: value });
    };

    const handleABCDEChange = (field, subField, value) => {
        console.log(field, subField, value);
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
            await apiCreateReport(reportData);
            setIsNewReport(false);
        } else {
            // Send the data to the server
            await updateReport(reportData);
        }
    };

    const getReportData = async (missionNumber) => {
        let finalMissionNumber;
        // If the mission number is an array join it
        if (Array.isArray(missionNumber)) {
            finalMissionNumber = missionNumber.join('');
        } else {
            finalMissionNumber = missionNumber;
        }
        
        const data = await apiFetchReport(finalMissionNumber);
        return data;
    }

    useEffect(() => {
        if (missionNumber.length === 10 && !isNaN(parseInt(missionNumber))) {
            getReportData(missionNumber).then((data) => {
                // If there is not a report for this mission number, mark this report as new
                if (!data) {
                    setIsNewReport(true);
                } else {
                    setIsNewReport(false);
                }

                setFirstResponders(data?.firstResponders || defaultValues.firstRespondersValues);
                setPatientInfo(data?.patientInfo || defaultValues.patientInfoValues);
                setAbcdeData(data?.abcdeSchema || defaultValues.ABCDEValues);
                setSamplerData(data?.samplerSchema || defaultValues.samplerValues);
                setDataLoaded(true);
            });
        }
    }, [missionNumber]);

    if (!dataLoaded) {
        return (
            <Container>
                <h2 className="mt-4 mb-3">First Responder Report</h2>
                <Form onSubmit={handleSubmit}>
                    <Form.Group className="mb-3">
                        <Form.Label>Mission Number</Form.Label>
                        <Placeholder as={Form.Control} animation='wave' bg='secondary' />
                    </Form.Group>

                    <Accordion defaultActiveKey="0">
                        <Accordion.Item eventKey="0">
                            <Accordion.Header>First Responders Information</Accordion.Header>
                            <Accordion.Body>
                                <Placeholder as={Form.Control} animation='wave' bg='secondary' />
                            </Accordion.Body>
                        </Accordion.Item>
                    </Accordion>

                    <Accordion defaultActiveKey="1">
                        <Accordion.Item eventKey="1">
                            <Accordion.Header>Patient Information</Accordion.Header>
                            <Accordion.Body>
                                <Placeholder as={Form.Control} animation='wave' bg='secondary' />
                            </Accordion.Body>
                        </Accordion.Item>
                    </Accordion>

                    <Accordion defaultActiveKey="1">
                        <Accordion.Item eventKey="1">
                            <Accordion.Header>(c) ABCDE Schema</Accordion.Header>
                            <Accordion.Body>
                                <Placeholder as={Form.Control} animation='wave' bg='secondary' />
                            </Accordion.Body>
                        </Accordion.Item>
                    </Accordion>

                    <Accordion defaultActiveKey="1">
                        <Accordion.Item eventKey="1">
                            <Accordion.Header>SAMPLER Schema</Accordion.Header>
                            <Accordion.Body>
                                <Placeholder as={Form.Control} animation='wave' bg='secondary' />
                            </Accordion.Body>
                        </Accordion.Item>
                    </Accordion>

                    <Button variant="secondary" type="submit">
                        Submit
                    </Button>
                </Form>
            </Container>
        );
    }

    return (
        <Container>
            <h2 className="mt-4 mb-3">First Responder Report</h2>
            <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                    <Form.Label>Mission Number</Form.Label>
                    <MissionNumber
                        isEditable={isEditable}
                        missionNumber={missionNumber}
                        handleMissionNumberChange={handleMissionNumberChange}
                    />
                </Form.Group>

                <Accordion defaultActiveKey="0">
                    <Accordion.Item eventKey="0">
                        <Accordion.Header>First Responders Information</Accordion.Header>
                        <Accordion.Body>
                            <FirstResponders
                                isEditable={isEditable}
                                firstResponders={firstResponders}
                                handleResponderChange={handleResponderChange}
                            />
                        </Accordion.Body>
                    </Accordion.Item>
                </Accordion>

                <Accordion defaultActiveKey="1">
                    <Accordion.Item eventKey="1">
                        <Accordion.Header>Patient Information</Accordion.Header>
                        <Accordion.Body>
                            <PatientInformation
                                isEditable={isEditable}
                                patientInfo={patientInfo}
                                handlePatientChange={handlePatientChange}
                            />
                        </Accordion.Body>
                    </Accordion.Item>
                </Accordion>

                <Accordion defaultActiveKey="1">
                    <Accordion.Item eventKey="1">
                        <Accordion.Header>(c) ABCDE Schema</Accordion.Header>
                        <Accordion.Body>
                            <ABCDESchema
                                isEditable={isEditable}
                                abcdeData={abcdeSchema}
                                handleABCDEChange={handleABCDEChange}
                            />
                        </Accordion.Body>
                    </Accordion.Item>
                </Accordion>

                <Accordion defaultActiveKey="1">
                    <Accordion.Item eventKey="1">
                        <Accordion.Header>SAMPLER Schema</Accordion.Header>
                        <Accordion.Body>
                            <SamplerSchema
                                isEditable={isEditable}
                                samplerData={samplerSchema}
                                handleSamplerChange={handleSamplerChange}
                            />
                        </Accordion.Body>
                    </Accordion.Item>
                </Accordion>

                <Button variant="primary" type="submit">
                    Submit
                </Button>
            </Form>
        </Container>
    );
};

export default ReportForm;