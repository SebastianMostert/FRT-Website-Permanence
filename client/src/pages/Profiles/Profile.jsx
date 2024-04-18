/* eslint-disable react-hooks/exhaustive-deps */
import { useSelector } from 'react-redux';
import { useState, useEffect } from 'react';
import { getRoles } from '../../utils';
import { MemberProfile, PublicProfile } from './index';
import { NotAuthorized } from '../index';

export default function Profile() {
    const [roles, setRoles] = useState(false);
    const { currentUser } = useSelector((state) => state.user)

    useEffect(() => {
        try {
            const fetchData = async () => {
                const roles = await getRoles(currentUser?.IAM);
                setRoles(roles);
            }

            fetchData();
        } catch (error) {
            console.error(error);
        }
    }, []);


    if (!currentUser?.IAM || !roles) {
        return <NotAuthorized />
    }

    const isMember = roles.includes('member') || roles.includes('admin');
    const isLoge = roles.includes('loge');
    const isPublic = roles.includes('public');

    if (isMember) {
        return <MemberProfile />
    }
    if (isLoge) {
        return <PublicProfile />
    }
    if (isPublic) {
        return <PublicProfile />
    }
}