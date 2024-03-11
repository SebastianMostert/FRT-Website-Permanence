/* eslint-disable react/prop-types */
import BoolButton from "../../Inputs/BoolButton";
import InputLabel from "../../Inputs/InputLabel";

// TODO
const CirculationSection = ({ isSelected, handleChange }) => {
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
            {/* Abdomen, Becken, Oberschenkel Section */}
            <div style={{ gridColumn: "span 2", border: "1px solid #ccc", padding: "10px", borderRadius: "8px" }}>
                <h2>Abdomen, Becken, Oberschenkel</h2>
                <table style={{ width: "100%" }}>
                    <tbody>
                        <tr>
                            <td>Abdomen</td>
                            <td>
                                <BoolButton
                                    label="Weich"
                                    onChange={handleChange}
                                    id="circulationAbdomenWeich"
                                />
                                <BoolButton
                                    label="Hart"
                                    onChange={handleChange}
                                    id="circulationAbdomenHart"
                                />
                            </td>
                        </tr>
                        <tr>
                            <td>Becken</td>
                            <td>
                                <BoolButton
                                    label="Stabil"
                                    onChange={handleChange}
                                    id="circulationBeckenStabil"
                                />
                                <BoolButton
                                    label="Instabil"
                                    onChange={handleChange}
                                    id="circulationBeckenInstabil"
                                />
                            </td>
                        </tr>
                        <tr>
                            <td>Oberschenkel</td>
                            <td>
                                <BoolButton
                                    label="Stabil"
                                    onChange={handleChange}
                                    id="circulationOberschenkelStabil"
                                />
                                <BoolButton
                                    label="Instabil"
                                    onChange={handleChange}
                                    id="circulationOberschenkelInstabil"
                                />
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

            {/* Puls Section */}
            <div style={{ border: "1px solid #ccc", padding: "10px", borderRadius: "8px" }}>
                <InputLabel text="Puls" />
                <BoolButton
                    label="Regelmäßig"
                    onChange={handleChange}
                    id="circulationRegelmaessig"
                />
                <BoolButton
                    label="Unregelmäßig"
                    onChange={handleChange}
                    id="circulationUnregelmaessig"
                />
                <BoolButton
                    label="Gut tastbar"
                    onChange={handleChange}
                    id="circulationGutTastbar"
                />
                <BoolButton
                    label="Schwach tastbar"
                    onChange={handleChange}
                    id="circulationSchwachTastbar"
                />
            </div>

            {/* Measures to be Taken Section */}
            <div>
                <BoolButton
                    label="Flachlagerung"
                    onChange={handleChange}
                    id="circulationFlachlagerung"
                />
                <BoolButton
                    label="Schocklagerung"
                    onChange={handleChange}
                    id="circulationSchocklagerung"
                />
                <BoolButton
                    label="Stabile Seitenlage"
                    onChange={handleChange}
                    id="circulationStabileSeitenlage"
                />
                <BoolButton
                    label="(Druck-)Verband/Blutstillung"
                    onChange={handleChange}
                    id="circulationDruckVerband"
                />
            </div>
        </div>
    );
};

export default CirculationSection;
