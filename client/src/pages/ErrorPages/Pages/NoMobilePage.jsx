const NoMobilePage = () => {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="max-w-md px-6 py-8 bg-white shadow-lg rounded-lg">
                <div className="text-center">
                    <h2 className="text-3xl font-bold text-gray-800 mb-2">Desktop or iPad Required</h2>
                    <p className="text-gray-600 mb-4">Please use a larger screen device to access this page.</p>
                    <img
                        className="w-40 mx-auto mb-4"
                        src="https://cdn-icons-png.flaticon.com/512/12363/12363914.png"
                        alt="Laptop icon"
                    />
                </div>
                <p className="text-center text-gray-600">We apologize for any inconvenience.</p>
            </div>
        </div>
    );
};

export default NoMobilePage;
