/* eslint-disable react/prop-types */
import Containers from "./Containers"

const Stock = () => {
    return (
        <div className="select-none" onContextMenu={(e) => e.preventDefault()}>
            <Containers />
        </div>
    );
};

export default Stock;