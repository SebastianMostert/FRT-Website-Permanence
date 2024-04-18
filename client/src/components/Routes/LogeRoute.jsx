import { useSelector } from 'react-redux'
import { Outlet } from 'react-router-dom'
import { NotAuthorized } from '../../pages/index'
import { useEffect, useState } from 'react';
import { getRoles } from '../../utils';

export default function PrivateRoute() {
    const { currentUser } = useSelector(state => state.user)
    const [roles, setRoles] = useState([]);

    try {
        useEffect(() => {
            async function fetchData() {
                const roles = await getRoles(currentUser?.IAM);
                setRoles(roles);
            }

            fetchData();
        }, [currentUser?.IAM]);

        const isLoge = roles?.includes('loge');
        return isLoge ? <Outlet /> : <NotAuthorized />
    } catch (error) {
        return <NotAuthorized />
    }
}
