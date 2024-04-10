/* eslint-disable react/prop-types */
import { Button } from 'react-bootstrap';

const IncreaseDecreaseButton = ({ prevAmount, amountToAdd, onChange, disabled }) => {

    const updateAmount = (amountToAdd) => {
        const newAmount = parseInt(prevAmount || 0) + amountToAdd;
        if (newAmount < 0) {
            return;
        }
        onChange(newAmount);
    };

    const handleButtonClick = (amountToAdd) => {
        updateAmount(amountToAdd);
    };


    return (
        <Button
            variant="outline-secondary"
            onClick={() => handleButtonClick(amountToAdd)}
            disabled={disabled}
            style={{ cursor: disabled ? 'not-allowed' : 'pointer' }}
        >
            {amountToAdd > 0 ? '+' : '-'}
        </Button>
    );
};

export default IncreaseDecreaseButton;
