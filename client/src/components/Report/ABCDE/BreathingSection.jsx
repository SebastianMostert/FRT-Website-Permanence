/* eslint-disable react/prop-types */
import { useState } from "react";
import BoolButton from "../../Inputs/BoolButton";
import InputField from "../../Inputs/InputField";
import InputLabel from "../../Inputs/InputLabel";

const BreathingSection = ({ isSelected, handleChange }) => {
  const [oxygeneSelected, setOxygeneSelected] = useState(false);

  const handleOxygeneSelected = (e) => {
    const newValue = e.target.value;
    setOxygeneSelected(newValue);
    handleChange(e);
  };

  const breathingSpeedOptions = [
    { value: "apnoe", label: "Apnoe (keine)" },
    { value: "bradypnoe", label: "Bradypnoe (langsam)" },
    { value: "eupnoe", label: "Eupnoe (normal)" },
    { value: "tachypnoe", label: "Tachypnoe (schnell)" },
  ];

  return (
    <div
      style={{
        display: isSelected ? "grid" : "none",
        gridTemplateColumns: "repeat(2, 1fr)",
        gap: "10px",
        padding: "10px",
        background: "#f4f7f9",
        borderRadius: "8px",
      }}
    >
      {/* Diagnostic Section */}
      <div>
        <div style={{ border: "1px solid #ccc", padding: "10px", borderRadius: "8px" }}>
          <InputLabel text="Breathing Speed" />
          {breathingSpeedOptions.map((option) => (
            <BoolButton
              key={`breathingSpeed${option.value}`}
              label={option.label}
              onChange={handleChange}
              id={`breathingSpeed${option.value}`}
            />
          ))}
        </div>
        <BoolButton
          label="Auskultation Seitengleich?"
          onChange={handleChange}
          id="breathingAuskultation"
        />
      </div>

      {/* Measures to be Taken Section */}
      <div>
        <BoolButton
          label="Sauerstoffgabe"
          onChange={handleOxygeneSelected}
          id="breathingOxygeneEnabled"
        />

        {oxygeneSelected && (
          <>
            <InputField
              label=""
              type="number"
              id="breathingLiters"
              onChange={handleChange}
              className="w-20 bg-white"
            />
            <span className="ml-2">l/min</span>
          </>
        )}

        <div>
          {/* Other Measures to be Taken */}
          {["Brille", "Maske", "Beatmungsbeutel", "assistierte/kontrollierte Beatmung", "Hyperventilationsmaske", "Oberkörperhochlagerung"].map((option) => (
            <BoolButton
              key={`breathing${option}`}
              label={option}
              onChange={handleChange}
              id={`breathing${option}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default BreathingSection;
