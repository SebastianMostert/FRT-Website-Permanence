import React, { useState } from 'react';
import { Form, Button, Alert, Badge } from 'react-bootstrap';
import NFC from 'nfc-react-web';

export default function NFCSignIn() {
    const [nfcData, setNfcData] = useState('');
    const [error, setError] = useState('');

    // Function to handle NFC scan
    const handleNFCScan = async () => {
        try {
            const nfc = new NFC();
            await nfc.start();
            nfc.on('tag', (tag) => {
                setNfcData(tag.id);
                nfc.stop();
            });
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
