const NotAuthorizedPage = () => {
    return (
        <NotAuthorized />
    );
};

export default NotAuthorizedPage;

export function NotAuthorized() {
    return (
        <div id="oopss">
            <div className="flex items-center justify-center h-screen w-screen">
                <div className="text-center p-8 bg-white rounded shadow-md max-w-xl w-full">
                    <div className="text-6xl font-bold text-red-500 mb-4">
                        401
                    </div>
                    <div className="text-6xl font-bold text-red-500 mb-4">
                        ACCESS DENIED
                    </div>

                    <div className="text-xl text-gray-700 mb-4">
                        Oops, You don&apos;t have permission to access this page.
                    </div>

                    <div className="text-md text-gray-600 mb-8">
                        This may be due to missing credentials or insufficient permissions. Please contact the site administrator for assistance.
                    </div>

                    <div>
                        <a
                            href="/"
                            className="py-2 px-4 text-white bg-blue-500 rounded hover:bg-blue-700 remove-link-decoration"
                        >
                            Go to homepage
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
}