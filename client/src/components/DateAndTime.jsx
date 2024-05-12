import { format } from "date-fns";
import { useState, useEffect } from "react";

const DateAndTime = () => {
    const [currentDateTime, setCurrentDateTime] = useState(format(new Date(), "MMM dd, yyyy 'at' HH:mm:ss.SSS"));
    const [isSmallScreen, setIsSmallScreen] = useState(window.innerWidth < 770);

    useEffect(() => {
        const handleResize = () => {
            setIsSmallScreen(window.innerWidth < 770);
        };

        window.addEventListener('resize', handleResize);

        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        const interval = setInterval(() => {
            const currentDate = new Date();
            const formattedDateTime = format(currentDate, "MMM dd, yyyy 'at' HH:mm:ss.SSS");
            setCurrentDateTime(formattedDateTime);
        }, 100);

        return () => clearInterval(interval);
    }, []);

    const bigScreen = <p className="text-3xl font-bold text-gray-800">
        {currentDateTime.slice(0, -4)}
        <span className="text-sm">{currentDateTime.slice(-4)}</span>
    </p>

    const smallScreen = <p className="text-3xl font-bold text-gray-800">
        {currentDateTime.slice(-12).slice(0, -4)}
        <span className="text-sm">{currentDateTime.slice(-4)}</span>
    </p>


    return (
        <div className="text-center">
            {isSmallScreen ? smallScreen : bigScreen}
        </div>
    );
}

export default DateAndTime;
