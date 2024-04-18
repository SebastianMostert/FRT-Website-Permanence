import { useSelector } from 'react-redux'
import { Navigate, Outlet } from 'react-router-dom'
import { NotAuthorized } from '../../pages/ErrorPages/Pages/401'
import { useEffect, useState } from 'react'
import { getRoles } from '../../utils'

export default function MemberRoute() {
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

    if (!currentUser) {
      return <Navigate to='/sign-in' />
    }

    const isMemberOrAdmin = roles?.includes('member') || roles?.includes('admin');
    return isMemberOrAdmin ? <Outlet /> : <NotAuthorized />
  } catch (error) {
    return <NotAuthorized />
  }
}
