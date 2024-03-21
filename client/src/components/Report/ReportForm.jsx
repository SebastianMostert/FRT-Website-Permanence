import { useState } from 'react';
import { Container, Form, Button, Accordion } from 'react-bootstrap';
import FirstResponders from './FirstResponders';
import PatientInformation from './PatientInformation';
import ABCDESchema from './ABCDESchema';
import SamplerSchema from './SamplerSchema';
import jsPDF from 'jspdf';
import MissionNumber from '../Inputs/MissionNumber';

const ReportForm = () => {
    const [missionNumber, setMissionNumber] = useState('');
    const [firstResponders, setFirstResponders] = useState([
        { position: 'Chef Agres', iam: '' },
        { position: 'Equipier Bin', iam: '' },
        { position: 'Stagiaire Bin', iam: '' },
    ]);
    const [patientInfo, setPatientInfo] = useState({
        age: '',
        gender: '',
        firstName: '',
        lastName: '',
        iam: '',
        matricule: '',
    });
    const [abcdeData, setAbcdeData] = useState({
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
            bloodSugar: '',
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
            pupillenRightLicht: false,
            pupillenLeftLicht: false,
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
    });
    const [samplerData, setSamplerData] = useState({
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
    });

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
            ...abcdeData,
            [field]: {
                ...abcdeData[field],
                [subField]: value,
            },
        });
    };

    const handleSamplerChange = (field, subField, value) => {
        setSamplerData({
            ...samplerData,
            [field]: {
                ...samplerData[field],
                [subField]: value,
            },
        });
    };

    const handleMissionNumberChange = (newMissionNumber) => {
        setMissionNumber(newMissionNumber.split(''));
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        // Gather all the data
        const reportData = {
            missionNumber,
            firstResponders,
            patientInfo,
            abcdeData,
            samplerData,
        };

        console.log(reportData);
    };

    return (
        <Container>
            <h2 className="mt-4 mb-3">First Responder Report</h2>
            <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                    <Form.Label>Mission Number</Form.Label>
                    <MissionNumber
                        missionNumber={missionNumber}
                        handleMissionNumberChange={handleMissionNumberChange}
                    />
                </Form.Group>

                <Accordion defaultActiveKey="0">
                    <Accordion.Item eventKey="0">
                        <Accordion.Header>First Responders Information</Accordion.Header>
                        <Accordion.Body>
                            <FirstResponders
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
                                abcdeData={abcdeData}
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
                                samplerData={samplerData}
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
