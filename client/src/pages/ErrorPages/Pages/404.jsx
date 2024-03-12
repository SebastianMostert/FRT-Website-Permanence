/* eslint-disable react/no-deprecated */
/* eslint-disable no-undef */
import '../CSS/404.css'; // Import your CSS file

const NotFoundPage = () => {
    return (
        <NotFound />
    );
};

export default NotFoundPage;

export function NotFound() {
    return (
        <div>
            <div id="oopss">
                <div id="error-text">
                    <img
                        src="https://cdn.rawgit.com/ahmedhosna95/upload/1731955f/sad404.svg"
                        alt={404}
                    />
                    <span>Error 404</span>
                    <p className="p-a">Page not found! Looks like the URL went on a vacation without leaving a forwarding address. Let&apos;s hope it&apos;s enjoying some sunny beaches and will be back soon!</p>
                    <p className="p-b"><a href="/">Take me back Home</a></p>
                </div>
            </div>
        </div>
    )
}