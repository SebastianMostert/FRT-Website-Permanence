/* eslint-disable react/prop-types */
import { Badge } from 'react-bootstrap';

const squareSize = '40px';

const styleDefault = {
    width: squareSize,
    height: squareSize,
    marginRight: '10px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
}

const StatusSquare = ({ status, alerted, style = styleDefault }) => {// Adjust the size as needed

    let statusText;
    let statusVariant;
    let statusDescription;

    switch (status.toString()) {
        case "1":
            statusText = alerted ? '1c' : '1';
            statusVariant = alerted ? 'warning' : 'secondary';
            statusDescription = 'On the way back from incident';
            break;
        case "2":
            statusText = alerted ? '2c' : '2';
            statusVariant = alerted ? 'warning' : 'secondary';
            statusDescription = 'On call';
            break;
        case "3":
            statusText = '3';
            statusVariant = 'warning';
            statusDescription = 'On the way to incident';
            break;
        case "4":
            statusText = '4';
            statusVariant = 'warning';
            statusDescription = 'At the incident';
            break;
        case "5":
            statusText = '5';
            statusVariant = 'danger';
            statusDescription = 'Request to speak';
            break;
        case "6":
            statusText = '6';
            statusVariant = 'danger';
            statusDescription = 'Unavailable';
            break;
        default:
            statusText = '';
            statusVariant = 'light';
            statusDescription = '';
    }

    return (
        <div style={{ display: 'flex', alignItems: 'center', textAlign: 'center' }}>
            <Badge
                bg={statusVariant}
                style={style}
            >
                {statusText}
                <span className="sr-only">{statusDescription}</span>
            </Badge>
        </div>
    );
}

export default StatusSquare