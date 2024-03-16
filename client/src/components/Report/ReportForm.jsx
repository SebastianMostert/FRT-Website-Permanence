import { useState } from 'react';
import { Container, Form, Button, Accordion } from 'react-bootstrap';
import FirstResponders from './FirstResponders';
import PatientInformation from './PatientInformation';
import ABCDESchema from './ABCDESchema';

const ReportForm = () => {
    const [missionNumber, setMissionNumber] = useState('');
    const [firstResponders, setFirstResponders] = useState([
        { name: 'Chef Agres', iam: '' },
        { name: 'Equipier Bin', iam: '' },
        { name: 'Stagiaire Bin', iam: '' },
    ]);

    const [patientInfo, setPatientInfo] = useState({
        age: '',
        gender: '',
        firstName: '',
        lastName: '',
        iam: '',
        otherInfo: '',
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

    const handleMissionNumberChange = (event) => {
        setMissionNumber(event.target.value);
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        // You can perform further actions here, like sending the data to an API
        console.log('Mission Number:', missionNumber);
        console.log('First Responders:', firstResponders);
        console.log('Patient Info:', patientInfo);
        console.log('(c) ABCDE Schema:', abcdeData);
    };

    return (
        <Container>
            <h2 className="mt-4 mb-3">First Responder Report</h2>
            <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                    <Form.Label>Mission Number</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Enter Mission Number (YYYYMMDDXX)"
                        value={missionNumber}
                        onChange={handleMissionNumberChange}
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

                <Button variant="primary" type="submit">
                    Submit
                </Button>
            </Form>
        </Container>
    );
};

export default ReportForm;
