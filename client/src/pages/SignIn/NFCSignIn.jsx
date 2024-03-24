import React, { useState } from 'react';
import { Form, Button, Alert, Badge } from 'react-bootstrap';

export default function NFCSignIn() {
    const [nfcData, setNfcData] = useState('');
    const [error, setError] = useState('');

    // Function to handle NFC scan
    const handleNFCScan = async () => {
        try {
            if ('NFC' in window) {
                const nfc = window.NFC;

                await nfc.requestPermission();
                console.log("NFC permission granted.");

                nfc.watch((message) => {
                    console.log("NFC tag detected!");
                    console.log("Message:", message);

                    setNfcData(message.data);
                    nfc.stop();
                });

                console.log("NFC watching for tags...");
            } else {
                throw new Error("Web NFC not supported.");
            }
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div>
            <h1 className="mb-4">NFC Sign In <Badge bg="danger">Beta</Badge></h1>
            <Form>
                <Form.Group controlId="formNFCId">
                    <Form.Label>NFC Tag ID</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="NFC Tag ID"
                        value={nfcData}
                        readOnly
                    />
                </Form.Group>

                {error && <Alert variant="danger">{error}</Alert>}

                <Button
                    variant="primary"
                    type="button"
                    onClick={handleNFCScan}
                >
                    Scan NFC Tag
                </Button>
            </Form>
        </div>
    );
}
