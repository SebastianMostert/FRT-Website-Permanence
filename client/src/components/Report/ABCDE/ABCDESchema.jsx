/* eslint-disable react/prop-types */
import SectionSubHeader from "../SectionSubHeader";
import AirwaySection from "./AirwaySection";
import BreathingSection from "./BreathingSection";
import BoolButton from "../../Inputs/BoolButton";
import { useState } from "react";
import CriticalBleedingSection from "./CriticalBleedingSection";
import CirculationSection from "./CirculationSection";

const ABCDESchema = ({ handleChange }) => {
    const [selectedOptions, setSelectedOptions] = useState({
        criticalBleedingStatus: false,
        airwayStatus: false,
        breathingStatus: false,
        circulationStatus: false,
        disabilityStatus: false,
        environmentStatus: false,
    });

    const updateSelectedOptions = (e) => {
        const { value, id } = e.target;

        setSelectedOptions((prevOptions) => ({
            ...prevOptions,
            [id]: value,
        }));

        handleChange(e);
    };

    return (
        <div className="grid grid-cols-3 gap-4">
            {/* Critical Bleeding */}
            <div className="col-span-3 bg-yellow-200 p-4">
                <SectionSubHeader text="Critical Bleeding" />
                <BoolButton
                    label="Problem?"
                    onChange={updateSelectedOptions}
                    id="criticalBleedingStatus"
                />
                <CriticalBleedingSection isSelected={selectedOptions.criticalBleedingStatus} handleChange={handleChange} />
            </div>

            {/* Airway */}
            <div className="col-span-3 bg-blue-200 p-4">
                <SectionSubHeader text="Airway" />
                <BoolButton label="Problem?" onChange={updateSelectedOptions} id="airwayStatus" />
                <AirwaySection isSelected={selectedOptions.airwayStatus} handleChange={handleChange} />
            </div>

            {/* Breathing */}
            <div className="col-span-3 bg-green-200 p-4">
                <SectionSubHeader text="Breathing" />
                <BoolButton label="Problem?" onChange={updateSelectedOptions} id="breathingStatus" />
                <BreathingSection isSelected={selectedOptions.breathingStatus} handleChange={handleChange} />
            </div>

            {/* Circulation */}
            {/* Uncomment and complete the Circulation section */}
            <div className="col-span-3 bg-purple-200 p-4">
                <SectionSubHeader text="Circulation" />
                <BoolButton label="Problem?" onChange={updateSelectedOptions} id="circulationStatus" />
                <CirculationSection isSelected={selectedOptions.circulationStatus} handleChange={handleChange} />
                {/* TODO: Add circulation section */}
            </div>

            {/* Disability */}
            {/* Uncomment and complete the Disability section */}
            <div className="col-span-3 bg-pink-200 p-4">
                <SectionSubHeader text="Disability" />
                <BoolButton label="Problem?" onChange={updateSelectedOptions} id="disabilityStatus" />
                {/* TODO: Add disability section */}
            </div>

            {/* Environment */}
            {/* Uncomment and complete the Environment section */}
            <div className="col-span-3 bg-orange-200 p-4">
                <SectionSubHeader text="Environment" />
                <BoolButton label="Problem?" onChange={updateSelectedOptions} id="environmentStatus" />
                {/* TODO: Add environment section */}
            </div>
        </div>
    );
};

export default ABCDESchema;
