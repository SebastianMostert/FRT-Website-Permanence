import '../CSS/underDevelopment.css';

const UnderDevelopment = () => {
    return (
        <>
            <link href="https://fonts.googleapis.com/css?family=Noto+Sans:400,700" rel="stylesheet" />
            <div className="container">
                <div className="box">
                    <div className="animation">
                        <div className="one spin-one"></div>
                        <div className="two spin-two"></div>
                        <div className="three spin-one"></div>
                    </div>
                    <h1>Under construction</h1>
                    <p>We are working on this page. Please check back later.</p>
                </div>
            </div>
        </>
    );
};

export default UnderDevelopment;
