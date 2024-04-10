import PuffLoader from "react-spinners/ClockLoader";

const LoadingPage = () => {
    const containerStyle = {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        backgroundColor: '#222', // Dark background
        animation: 'fadeIn 1s ease-in-out', // Apply fade-in animation
        position: 'relative',
    };

    const contentStyle = {
        textAlign: 'center',
        color: '#fff', // White text color
        animation: 'textScale 1s infinite alternate',
    };

    const backgroundStyle = {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        background: 'radial-gradient(circle, #333, #222)',
        opacity: 0.8,
        zIndex: -1,
        animation: 'rotate 10s linear infinite',
    };

    return (
        <div id="oopss">
            <div style={containerStyle}>
                <div style={backgroundStyle}></div>
                <div style={contentStyle}>
                    <PuffLoader loading={true} size={100} color="#fff" />
                </div>
            </div>
        </div>
    );
};

export default LoadingPage;
