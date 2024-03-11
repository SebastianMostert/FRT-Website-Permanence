/* eslint-disable react/prop-types */
import BoolButton from "../../Inputs/BoolButton";

const AirwaySection = ({ isSelected, handleChange }) => (
    <div style={{ display: isSelected ? "grid" : "none", gridTemplateColumns: "repeat(2, 1fr)", gap: "10px", padding: "10px", background: "#f4f7f9", borderRadius: "8px" }}>
        {/* Diagnostic */}
        <div>
            <BoolButton label="Frei" onChange={handleChange} id="airwayFrei" />
            <BoolButton label="Verlegt" onChange={handleChange} id="airwayVerlegt" />
            <BoolButton label="Trauma Halswirbelsäule" onChange={handleChange} id="airwayTraumaHWS" />
        </div>

        {/* Measures to be taken */}
        <div>
            <BoolButton label="Esmarch" onChange={handleChange} id="airwayEsmarch" />
            <BoolButton label="Guedl" onChange={handleChange} id="airwayGuedl" />
            <BoolButton label="Wendl" onChange={handleChange} id="airwayWendl" />

            <BoolButton label="Absaugen/manuelles Freiräumen" onChange={handleChange} id="airwayAbsaugen" />
            <BoolButton label="Stifneck/HWS Immobilisation" onChange={handleChange} id="airwayStifneck" />
        </div>
    </div>
);

export default AirwaySection;
