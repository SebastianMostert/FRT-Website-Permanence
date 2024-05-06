import { useSelector } from 'react-redux'
import { Navigate, Outlet } from 'react-router-dom'
import { NotAuthorized } from '../../pages/ErrorPages/Pages/401'
import { useEffect, useState } from 'react'
import { getRoles } from '../../utils'
import { LoadingPage } from '../../pages'

export default function MemberRoute() {
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

    if (!currentUser) {
      return <Navigate to={`/sign-in?redirect=${window.location.pathname}`} />
    }

    if (loading) {
      return <LoadingPage />
    }

    const isMemberOrAdmin = roles?.includes('member') || roles?.includes('admin');
    return isMemberOrAdmin ? <Outlet /> : <NotAuthorized />
  } catch (error) {
    return <NotAuthorized />
  }
}
