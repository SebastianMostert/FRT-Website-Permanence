/* eslint-disable react/prop-types */
import React from 'react';
import { Form, InputGroup } from 'react-bootstrap';

const useInputRefs = (length) => {
    return React.useMemo(
        () => Array.from({ length }, () => React.createRef()),
        [length]
    );
};

const MissionNumber = ({ missionNumber, handleMissionNumberChange }) => {
    const inputRefs = useInputRefs(10);

    const handleInputChange = (index, e) => {
        const { value } = e.target;
        if (value.length === 1 && index < 9) {
            inputRefs[index + 1].current.focus();
        }
        let newMissionNumber = '';
        for (let i = 0; i < 10; i++) {
            newMissionNumber += inputRefs[i].current.value || '';
        }
        handleMissionNumberChange(newMissionNumber);
    };

    const handleKeyDown = (index, e) => {
        if (e.key === 'Backspace' && index > 0) {
            inputRefs[index - 1].current.focus();
        }
    };

    return (
        <div className="d-inline-flex">
            <InputGroup>
                {Array.from({ length: 10 }, (_, index) => {
                    const placeholder = index <= 3 ? 'Y' : index <= 5 ? 'M' : index <= 7 ? 'D' : 'X';
                    const disabled = true;
                    if (index === 4 || index === 6 || index === 8) {
                        return (
                            <React.Fragment key={index}>
                                <InputGroup.Text className="text-center" key={index + 10}>-</InputGroup.Text>
                                <Form.Control
                                    key={index}
                                    disabled={disabled}
                                    ref={inputRefs[index]}
                                    type="text"
                                    placeholder={placeholder}
                                    maxLength="1"
                                    className="w-10 px-2 text-center"
                                    style={{ borderRadius: 0, cursor: disabled ? 'not-allowed' : 'pointer' }}
                                    value={missionNumber[index] || ''}
                                    onChange={(e) => handleInputChange(index, e)}
                                    onKeyDown={(e) => handleKeyDown(index, e)}
                                />
                            </React.Fragment>
                        )
                    }

                    return (
                        <Form.Control
                            key={index}
                            disabled={disabled}
                            ref={inputRefs[index]}
                            type="text"
                            placeholder={placeholder}
                            maxLength="1"
                            className="w-10 px-2 text-center"
                            style={{ borderRadius: 0, cursor: disabled ? 'not-allowed' : 'pointer' }}
                            value={missionNumber[index] || ''}
                            onChange={(e) => handleInputChange(index, e)}
                            onKeyDown={(e) => handleKeyDown(index, e)}
                            required
                        />
                    )
                })
                }
            </InputGroup>
        </div>
    );
};

export default MissionNumber;
