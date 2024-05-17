import { Form, InputGroup } from 'react-bootstrap'
import PropTypes from "prop-types";
import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import OpenEye from '../Icons/OpenEye';
import ClosedEye from '../Icons/ClosedEye';

const PasswordInput = ({ handleChange, label }) => {
    const [showPassword, setShowPassword] = useState(false);
    const { t } = useTranslation();

    const handleShowPassword = () => {
        setShowPassword((prevShowPassword) => !prevShowPassword);
    };

    const size = 30;
    const buffer = 2.2;
    const iconSize = 24.8; // Max of size - buffer

    return (
        <div className='select-none'>
            <Form.Group controlId='password'>
                <Form.Label>{label}</Form.Label>
                <InputGroup className='mb-3'>
                    <Form.Control
                        type={showPassword ? 'text' : 'password'}
                        placeholder={t('sign_in.password')}
                        className={`bg-slate-100 p-3 rounded-lg ${showPassword ? 'text-black' : ''}`}
                        onChange={handleChange}
                    />
                    <InputGroup.Text>
                        <div onClick={handleShowPassword} style={{
                            width: size,
                            height: size,
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            cursor: 'pointer',
                        }}>
                            {showPassword ? <OpenEye size={iconSize} /> : <ClosedEye size={iconSize + buffer} />}
                        </div>
                    </InputGroup.Text>
                </InputGroup>
            </Form.Group>
        </div>
    )
}

export default PasswordInput

PasswordInput.propTypes = {
    handleChange: PropTypes.func.isRequired,
    label: PropTypes.string
}