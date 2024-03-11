/* eslint-disable react/prop-types */
import { useState } from "react";
import BoolButton from "../../Inputs/BoolButton";
import InputField from "../../Inputs/InputField";

const CriticalBleedingSection = ({ isSelected, handleChange }) => {
    const [tourniquetSelected, setTourniquetSelected] = useState(false);

    const handleTourniquetChange = (e) => {
        const newValue = e.target.value;

        setTourniquetSelected(newValue);
        handleChange(e);
    };

    return (
        <div style={{ display: isSelected ? "grid" : "none", gridTemplateColumns: "auto 1fr", gap: "10px", padding: "10px", background: "#f9ece8", borderRadius: "8px" }}>
            <div className="ml-4 flex items-center">
                <BoolButton
                    label="Tourniquet"
                    onChange={handleTourniquetChange}
                    id="criticalBleedingTourniquetEnabled"
                />
                {tourniquetSelected && (
                    <span className="ml-2">Time (minutes)</span>
                )}
            </div>
            {tourniquetSelected && (
                <InputField
                    label=""
                    type="number"
                    id="criticalBleedingTourniquetTime"
                    onChange={handleChange}
                    className="w-20 bg-white"
                />
            )}
            <BoolButton
                label="Manual Compression"
                id="criticalBleedingTourniquetManualCompression"
                onChange={handleChange}
            />
        </div>
    );
};

export default CriticalBleedingSection;
