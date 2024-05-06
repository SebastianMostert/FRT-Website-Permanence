import { useSelector } from 'react-redux'
import { Navigate, Outlet } from 'react-router-dom'
import { LoadingPage, NotAuthorized } from '../../pages/index'
import { useEffect, useState } from 'react';
import { getRoles } from '../../utils';

export default function PrivateRoute() {
    const { currentUser } = useSelector(state => state.user)
    const [roles, setRoles] = useState([]);
    const [loading, setLoading] = useState(true);


    try {
        useEffect(() => {
            async function fetchData() {
                const roles = await getRoles(currentUser?.IAM);
                setRoles(roles);

                setLoading(false);
            }

            fetchData();
        }, [currentUser?.IAM]);

        const isAdmin = roles?.includes('admin');

        if (!currentUser) {
            return <Navigate to={`/sign-in?redirect=${window.location.pathname}`} />
        }

        if (loading) {
            return <LoadingPage />
        }
        return isAdmin ? <Outlet /> : <NotAuthorized />
    } catch (error) {
        return <NotAuthorized />
    }
}
